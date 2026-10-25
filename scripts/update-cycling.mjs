// Daily Strava sync for the Hobbies → Cycling page.
//
// Pulls every ride from the Strava API and writes one compact record per ride to
// src/data/cycling.json (date, km, elevation, moving seconds). Only totals are written:
// no names, descriptions, locations, or routes, and activities set to "Only You" are
// skipped. The page builds its charts from this file at build time, so a commit of a
// changed file is enough to redeploy.
// Invoked by .github/workflows/cycling-update.yml, or locally with `npm run update:cycling`.
//
// Required env:
//   STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET — from https://www.strava.com/settings/api
//   STRAVA_REFRESH_TOKEN — from `npm run authorize:strava` (scope activity:read or
//                          activity:read_all; the token shown on the API settings page
//                          has scope "read" only and cannot list activities)
// Optional env:
//   STRAVA_TOKEN_OUT — file that receives the new refresh token when Strava replaces it

import fs from "node:fs";
import path from "node:path";

const TOKEN_URL = "https://www.strava.com/oauth/token";
const ACTIVITIES_URL = "https://www.strava.com/api/v3/athlete/activities";
const PER_PAGE = 200;
// Human-powered riding, indoor sessions included. E-bike rides are left out.
const RIDE_TYPES = new Set(["Ride", "GravelRide", "MountainBikeRide", "VirtualRide"]);
// Shorter recordings are accidental starts and GPS glitches
const MIN_METERS = 1000;
const OUT_PATH = path.join(process.cwd(), "src/data/cycling.json");

const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN, STRAVA_TOKEN_OUT } =
  process.env;
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

const previous = fs.existsSync(OUT_PATH) ? fs.readFileSync(OUT_PATH, "utf8") : null;
const previousCount = previous ? JSON.parse(previous).rides?.length ?? 0 : 0;

const accessToken = await getAccessToken();
const activities = await fetchActivities(accessToken);
const rides = activities
  .map(toRide)
  .filter(Boolean)
  .sort((a, b) => a.start.localeCompare(b.start))
  .map(({ d, km, m, s }) => ({ d, km, m, s }));

// An empty answer for an athlete who had rides means the call went wrong, not that rides vanished
if (rides.length === 0 && previousCount > 0) {
  console.error("Strava returned no rides; keeping the existing data.");
  process.exit(1);
}

// One ride per line keeps the daily diff down to the new rides
const json = `{\n  "rides": [\n${rides.map((r) => `    ${JSON.stringify(r)}`).join(",\n")}\n  ]\n}\n`;

if (json === previous) {
  console.log("Cycling data unchanged.");
} else {
  fs.writeFileSync(OUT_PATH, json);
  const km = rides.reduce((sum, r) => sum + r.km, 0);
  console.log(
    `Wrote ${path.relative(process.cwd(), OUT_PATH)}: ${rides.length} rides ` +
      `from ${activities.length} activities, ${Math.round(km)} km total.`
  );
}
