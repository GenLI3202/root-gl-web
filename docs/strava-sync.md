# Strava sync

The Hobbies → Cycling page reads two files. A GitHub Action refreshes them from Strava once a
day and commits them, which triggers a Vercel deploy.

```
Strava API → scripts/update-cycling.mjs ─┬→ src/data/cycling.json            → stats, charts, postcards
             (.github/workflows/         └→ public/data/cycling-routes.json  → route map, postcard sketches
              cycling-update.yml, daily 04:43 UTC)
```

## What is stored

`cycling.json`: one record per ride with local date, km, climbing in m and moving seconds.
`cycling-routes.json`: the track of each outdoor ride as an encoded polyline, simplified to
about 15 m. No names, descriptions or place names are written.

Skipped: activities set to "Only You", sport types other than Ride, GravelRide, MountainBikeRide
and VirtualRide, and recordings under 1 km. Trainer and virtual rides get no route.

### Route privacy

Tracks start and end at your front door, so three layers keep that out of the repository:

1. The authorization scope `activity:read` (the default of `npm run authorize:strava`) returns
   tracks with the privacy zones from Strava → Settings → Privacy Controls → Map Visibility already
   cut out. Set a zone around home there first.
2. The sync drops the first and last 500 m of every track.
3. Optional secret `STRAVA_PRIVACY_ZONE`, `"lat,lon,radiusMeters"` (for example `48.1371,11.5754,2000`),
   removes every point and every straight line within that radius of the point. The value stays in
   the secret, not in the repository.

The published routes are public; the map shows where you ride, just not where you live.

## One-time setup

1. On https://www.strava.com/settings/api note the **Client ID** and **Client Secret**. The
   app's Authorization Callback Domain must be `localhost`.
2. Authorize once with a scope that can read activities. The access and refresh tokens shown on
   the settings page have scope `read` only and cannot list activities.

   ```bash
   STRAVA_CLIENT_ID=… npm run authorize:strava
   # open the printed URL, approve, copy the address you land on (http://localhost/?code=…)
   STRAVA_CLIENT_ID=… STRAVA_CLIENT_SECRET=… npm run authorize:strava -- "<that address>"
   ```

   The second command prints a refresh token. The default scope is `activity:read`.
   `--scope=activity:read_all` also returns "Only You" activities and unmasked tracks; use it only
   together with `STRAVA_PRIVACY_ZONE`.
3. Add repository secrets (Settings → Secrets and variables → Actions):
   `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STRAVA_REFRESH_TOKEN`.
4. Recommended: `STRAVA_PRIVACY_ZONE` as described under "Route privacy".
5. Optional but recommended: `STRAVA_SECRETS_PAT`, a fine-grained personal access token with
   "Secrets: read and write" on this repository. Strava may replace the refresh token on any
   refresh and then invalidates the old one. With the PAT the workflow stores the new token
   itself; without it the job fails with a message and step 2 has to be repeated.
6. Run the workflow once from the Actions tab ("Update cycling data" → Run workflow).

Local run: `STRAVA_CLIENT_ID=… STRAVA_CLIENT_SECRET=… STRAVA_REFRESH_TOKEN=… npm run update:cycling`.

## Page

The page leads with a sentence, the route map and a few postcards. The charts and the table are
folded into "For the number nerds" and stay closed until opened. Delete that block in
`HobbyCycling.astro` to drop them.

| Piece | File |
|-------|------|
| Page, opening sentence, folded numbers, tooltip script | `src/components/HobbyCycling.astro` |
| Route map (Leaflet on OpenStreetMap tiles, year filter, handwritten labels) | `src/components/CyclingMap.astro` |
| Postcards with route sketches | `src/components/CyclingBigDays.astro` |
| Which rides become postcards and map labels, and the words on them | `src/data/cycling-highlights.ts` |
| Year-over-year line, calendar, length bars, legend | `CyclingYearLines.astro`, `CyclingCalendar.astro`, `CyclingRideMix.astro`, `CyclingKey.astro` |
| Aggregation, route sketches, formatting | `src/utils/cycling.ts` |
| Polyline codec shared by the sync and the map | `src/utils/polyline.mjs` |
| Length colour ramp (`--ride-1` … `--ride-4`) | `src/styles/global.css` |

A highlight is a date span. The rides inside it (at least `minKm` long, which leaves out short
rides from the front door) are drawn as the postcard sketch and as thicker lines with a label on
the map. Postcards show without a sketch until the first sync has written routes, and the map
section appears once `cycling-routes.json` has routes.

The map loads Leaflet and the routes when it scrolls into view. The reader can switch between five
styles and the choice is remembered in the browser:

| Style | Tiles |
|-------|-------|
| Paper (default) | OpenStreetMap standard tiles, muted and warmed with a CSS filter; inverted in the dark theme |
| Clean | Esri light or dark gray canvas with labels |
| Cycling | CyclOSM |
| Terrain | OpenTopoMap |
| Satellite | Esri World Imagery |

The sources are listed in `TILE_STYLES` in `CyclingMap.astro`; every style shows its attribution on the
map. All of them are free without a key and meant for light use, which a personal page is. CARTO's
basemaps now need an API key and are not used. If traffic grows, move to a hosted provider with its
own key. Tile requests send the visitor's IP address to the tile server.

"Today" on the page is the date of the latest ride in the data. Ride-length buckets
(< 30, 30–60, 60–100, 100+ km) are defined in `LENGTH_BUCKET_MAX` and `BUCKET_LABELS` in
`src/utils/cycling.ts`.
