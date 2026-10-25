# Strava sync

The Hobbies → Cycling page reads `src/data/cycling.json`. A GitHub Action refreshes that file
from Strava once a day and commits it, which triggers a Vercel deploy.

```
Strava API → scripts/update-cycling.mjs → src/data/cycling.json → src/utils/cycling.ts → charts
             (.github/workflows/cycling-update.yml, daily 04:43 UTC)
```

## What is stored

One record per ride: local date, km, climbing in m, moving seconds. No names, descriptions,
locations or routes. Skipped: activities set to "Only You", sport types other than Ride,
GravelRide, MountainBikeRide and VirtualRide, and recordings under 1 km.

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

   The second command prints a refresh token. `--scope=activity:read` skips activities set to
   "Only You" at the source; the default is `activity:read_all`.
3. Add repository secrets (Settings → Secrets and variables → Actions):
   `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STRAVA_REFRESH_TOKEN`.
4. Optional but recommended: `STRAVA_SECRETS_PAT`, a fine-grained personal access token with
   "Secrets: read and write" on this repository. Strava may replace the refresh token on any
   refresh and then invalidates the old one. With the PAT the workflow stores the new token
   itself; without it the job fails with a message and step 2 has to be repeated.
5. Run the workflow once from the Actions tab ("Update cycling data" → Run workflow).

Local run: `STRAVA_CLIENT_ID=… STRAVA_CLIENT_SECRET=… STRAVA_REFRESH_TOKEN=… npm run update:cycling`.

## Page

| Piece | File |
|-------|------|
| Page, stat tiles, tooltip script, table | `src/components/HobbyCycling.astro` |
| Year-over-year running distance | `src/components/CyclingYearLines.astro` |
| Riding-day calendar | `src/components/CyclingCalendar.astro` |
| Rides per year by length | `src/components/CyclingRideMix.astro` |
| Legend for the length colours | `src/components/CyclingKey.astro` |
| Aggregation and formatting | `src/utils/cycling.ts` |
| Length colour ramp (`--ride-1` … `--ride-4`) | `src/styles/global.css` |

Charts are static SVG built at deploy time. The line chart and the length bars have a tooltip;
the calendar cells do too. Everything is also in the table under the charts. "Today" on the page
is the date of the latest ride in the data. Ride-length buckets (< 30, 30–60, 60–100, 100+ km)
are defined in `LENGTH_BUCKET_MAX` and `BUCKET_LABELS` in `src/utils/cycling.ts`.
