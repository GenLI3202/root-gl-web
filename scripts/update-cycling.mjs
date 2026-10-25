// Daily Strava sync for the Hobbies → Cycling page.
//
// Pulls every ride from the Strava API and writes two files:
//   src/data/cycling.json            one record per ride (date, km, elevation, moving seconds),
//                                    read at build time for the stats and charts
//   public/data/cycling-routes.json  simplified GPS tracks of outdoor rides, fetched by the
//                                    route map in the browser
// No names, descriptions, or place names are written, and activities set to "Only You" are
// skipped. Routes lose the first and last TRIM_METERS of every ride, and the optional
// STRAVA_PRIVACY_ZONE removes everything near a point (your home). A commit of changed
// files is enough to redeploy.
// Invoked by .github/workflows/cycling-update.yml, or locally with `npm run update:cycling`.
//
// Required env:
//   STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET — from https://www.strava.com/settings/api
//   STRAVA_REFRESH_TOKEN — from `npm run authorize:strava` (scope activity:read or
//                          activity:read_all; the token shown on the API settings page
//                          has scope "read" only and cannot list activities)
// Optional env:
//   STRAVA_TOKEN_OUT     — file that receives the new refresh token when Strava replaces it
//   STRAVA_PRIVACY_ZONE  — "lat,lon,radiusMeters"; no route point or line within that
//                          radius of the point is written (repository secret in CI)

import fs from "node:fs";
import path from "node:path";
import { decodePolyline, encodePolyline } from "../src/utils/polyline.mjs";

const TOKEN_URL = "https://www.strava.com/oauth/token";
const ACTIVITIES_URL = "https://www.strava.com/api/v3/athlete/activities";
const PER_PAGE = 200;
// Human-powered riding, indoor sessions included. E-bike rides are left out.
const RIDE_TYPES = new Set(["Ride", "GravelRide", "MountainBikeRide", "VirtualRide"]);
// Shorter recordings are accidental starts and GPS glitches
const MIN_METERS = 1000;
const OUT_PATH = path.join(process.cwd(), "src/data/cycling.json");
const ROUTES_PATH = path.join(process.cwd(), "public/data/cycling-routes.json");
// Outdoor riding only: virtual rides draw game worlds, trainer rides have no track
const ROUTE_TYPES = new Set(["Ride", "GravelRide", "MountainBikeRide"]);
const TRIM_METERS = 500;
const SIMPLIFY_METERS = 15;
const EARTH_RADIUS = 6_371_000;
const METERS_PER_DEGREE = (EARTH_RADIUS * Math.PI) / 180;

const {
  STRAVA_CLIENT_ID,
  STRAVA_CLIENT_SECRET,
  STRAVA_REFRESH_TOKEN,
  STRAVA_TOKEN_OUT,
  STRAVA_PRIVACY_ZONE,
} = process.env;
if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET || !STRAVA_REFRESH_TOKEN) {
  console.error(
    "STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET and STRAVA_REFRESH_TOKEN must be set. " +
      "Add them as repository secrets (see docs/strava-sync.md)."
  );
  process.exit(1);
}

async function getAccessToken() {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: STRAVA_REFRESH_TOKEN,
    }),
  });
  if (!res.ok) throw new Error(`token refresh: HTTP ${res.status} ${await res.text()}`);
  const data = await res.json();

  // Strava invalidates the old refresh token as soon as it hands out a different one
  if (data.refresh_token && data.refresh_token !== STRAVA_REFRESH_TOKEN) {
    console.log(`::add-mask::${data.refresh_token}`);
    if (STRAVA_TOKEN_OUT) {
      fs.writeFileSync(STRAVA_TOKEN_OUT, data.refresh_token, { mode: 0o600 });
      console.log("Strava issued a new refresh token; saved it for the workflow to store.");
    } else {
      console.warn(
        "::warning::Strava issued a new refresh token and the old one is now invalid. " +
          "Run `npm run authorize:strava` again and update STRAVA_REFRESH_TOKEN."
      );
    }
  }
  return data.access_token;
}

async function fetchActivities(accessToken) {
  const activities = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${ACTIVITIES_URL}?per_page=${PER_PAGE}&page=${page}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      const hint =
        res.status === 401
          ? " (the refresh token needs scope activity:read or activity:read_all)"
          : "";
      throw new Error(`activities page ${page}: HTTP ${res.status}${hint} ${await res.text()}`);
    }
    const batch = await res.json();
    activities.push(...batch);
    if (batch.length < PER_PAGE) return activities;
  }
}

/** Strava activity → compact ride record, or null when it does not count */
function toRide(activity) {
  if (!RIDE_TYPES.has(activity.sport_type ?? activity.type)) return null;
  if (activity.private) return null;
  if ((activity.distance ?? 0) < MIN_METERS) return null;
  return {
    // start_date_local is wall-clock time at the start, stamped with a misleading "Z"
    start: activity.start_date_local,
    d: activity.start_date_local.slice(0, 10),
    km: Math.round(activity.distance / 100) / 10,
    m: Math.round(activity.total_elevation_gain ?? 0),
    s: activity.moving_time ?? 0,
  };
}

/** "lat,lon,radius" → { lat, lon, radius }, or null when unset */
function parseZone(value) {
  if (!value) return null;
  const [lat, lon, radius] = value.split(",").map(Number);
  if (![lat, lon, radius].every(Number.isFinite) || radius <= 0) {
    console.error('STRAVA_PRIVACY_ZONE must look like "48.1371,11.5754,1500" (lat,lon,meters).');
    process.exit(1);
  }
  return { lat, lon, radius };
}

const zone = parseZone(STRAVA_PRIVACY_ZONE);

function distance([lat1, lon1], [lat2, lon2]) {
  const rad = Math.PI / 180;
  const a =
    Math.sin(((lat2 - lat1) * rad) / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(((lon2 - lon1) * rad) / 2) ** 2;
  return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(a));
}

/** Distance from point p to segment a–b, all in planar meters */
function planarSegmentDistance(p, a, b) {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const lengthSquared = dx * dx + dy * dy;
  const t = lengthSquared ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / lengthSquared)) : 0;
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}

/** Drop the first and last `meters` of a track */
function trimEnds(points, meters) {
  let start = 0;
  for (let walked = 0; start < points.length - 1 && walked < meters; start++) {
    walked += distance(points[start], points[start + 1]);
  }
  let end = points.length - 1;
  for (let walked = 0; end > start && walked < meters; end--) {
    walked += distance(points[end], points[end - 1]);
  }
  return points.slice(start, end + 1);
}

/** Cut a track wherever it enters the privacy zone, including straight chords across it */
function outsideZone(points) {
  if (!zone) return [points];
  const center = [zone.lat, zone.lon];
  const local = ([lat, lon]) => [
    (lon - zone.lon) * Math.cos((zone.lat * Math.PI) / 180) * METERS_PER_DEGREE,
    (lat - zone.lat) * METERS_PER_DEGREE,
  ];
  const segments = [];
  let current = [];
  for (const point of points) {
    const inside = distance(point, center) <= zone.radius;
    const crosses =
      current.length > 0 &&
      planarSegmentDistance([0, 0], local(current[current.length - 1]), local(point)) <= zone.radius;
    if (inside || crosses) {
      if (current.length) segments.push(current);
      current = [];
    }
    if (!inside) current.push(point);
  }
  if (current.length) segments.push(current);
  return segments;
}

/** Douglas–Peucker with the tolerance in meters */
function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const lat0 = (points[0][0] * Math.PI) / 180;
  const xy = points.map(([lat, lon]) => [lon * Math.cos(lat0) * METERS_PER_DEGREE, lat * METERS_PER_DEGREE]);
  const last = points.length - 1;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[last] = 1;
  const stack = [[0, last]];
  while (stack.length) {
    const [from, to] = stack.pop();
    let far = 0;
    let farIndex = -1;
    for (let i = from + 1; i < to; i++) {
      const d = planarSegmentDistance(xy[i], xy[from], xy[to]);
      if (d > far) [far, farIndex] = [d, i];
    }
    if (far > tolerance) {
      keep[farIndex] = 1;
      stack.push([from, farIndex], [farIndex, to]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

/** Outdoor ride → route record with encoded track pieces, or null when nothing is left */
function toRoute(activity, ride) {
  if (!ROUTE_TYPES.has(activity.sport_type ?? activity.type) || activity.trainer) return null;
  const encoded = activity.map?.summary_polyline;
  if (!encoded) return null;
  const pieces = outsideZone(trimEnds(decodePolyline(encoded), TRIM_METERS))
    .map((piece) => simplify(piece, SIMPLIFY_METERS))
    .filter((piece) => piece.length >= 2);
  if (!pieces.length) return null;
  return { d: ride.d, km: ride.km, p: pieces.map((piece) => encodePolyline(piece)) };
}

/** One record per line keeps the daily diff down to the new rides */
function toJson(key, records) {
  const lines = records.map((r) => `    ${JSON.stringify(r)}`).join(",\n");
  return `{\n  "${key}": [${records.length ? `\n${lines}\n  ` : ""}]\n}\n`;
}

function writeIfChanged(file, json) {
  const before = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
  if (json === before) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, json);
  return true;
}

const previous = fs.existsSync(OUT_PATH) ? fs.readFileSync(OUT_PATH, "utf8") : null;
const previousCount = previous ? JSON.parse(previous).rides?.length ?? 0 : 0;

const accessToken = await getAccessToken();
const activities = await fetchActivities(accessToken);
const entries = activities
  .map((activity) => ({ activity, ride: toRide(activity) }))
  .filter((entry) => entry.ride)
  .sort((a, b) => a.ride.start.localeCompare(b.ride.start));
const rides = entries.map(({ ride: { d, km, m, s } }) => ({ d, km, m, s }));
const routes = entries.map(({ activity, ride }) => toRoute(activity, ride)).filter(Boolean);

// An empty answer for an athlete who had rides means the call went wrong, not that rides vanished
if (rides.length === 0 && previousCount > 0) {
  console.error("Strava returned no rides; keeping the existing data.");
  process.exit(1);
}

const ridesChanged = writeIfChanged(OUT_PATH, toJson("rides", rides));
const routesChanged = writeIfChanged(ROUTES_PATH, toJson("routes", routes));
if (!ridesChanged && !routesChanged) {
  console.log("Cycling data unchanged.");
} else {
  const km = rides.reduce((sum, r) => sum + r.km, 0);
  console.log(
    `Wrote ${rides.length} rides (${Math.round(km)} km total) and ${routes.length} routes ` +
      `from ${activities.length} activities.`
  );
}
