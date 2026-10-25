// One-time Strava authorization: turns your API app into a refresh token that can read
// activities. The token on https://www.strava.com/settings/api has scope "read" only.
//
//   1. STRAVA_CLIENT_ID=… npm run authorize:strava
//      Prints a URL. Open it, approve, and copy the address the browser ends up on
//      (http://localhost/?state=&code=…). The page itself fails to load; that is expected.
//   2. STRAVA_CLIENT_ID=… STRAVA_CLIENT_SECRET=… npm run authorize:strava -- "<that address>"
//      Exchanges the code and prints the refresh token to store as STRAVA_REFRESH_TOKEN.
//
// Scope defaults to activity:read: activities visible to Everyone or Followers, with the
// privacy zones set in Strava applied to the tracks. --scope=activity:read_all also returns
// activities set to "Only You" and unmasked tracks; the sync skips the former but would
// publish the latter, so use it only together with STRAVA_PRIVACY_ZONE.

const AUTHORIZE_URL = "https://www.strava.com/oauth/authorize";
const TOKEN_URL = "https://www.strava.com/oauth/token";
const REDIRECT_URI = "http://localhost";

const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } = process.env;
const args = process.argv.slice(2);
const scope = args.find((a) => a.startsWith("--scope="))?.slice("--scope=".length) ?? "activity:read";
const redirected = args.find((a) => !a.startsWith("--"));

if (!STRAVA_CLIENT_ID) {
  console.error("Set STRAVA_CLIENT_ID (the Client ID on https://www.strava.com/settings/api).");
  process.exit(1);
}

if (!redirected) {
  const url = new URL(AUTHORIZE_URL);
  url.search = new URLSearchParams({
    client_id: STRAVA_CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    approval_prompt: "force",
    scope,
  }).toString();
  console.log(`Open this URL and approve access:\n\n${url}\n`);
  console.log('Then run this command again with the address you land on as the argument.');
  process.exit(0);
}

if (!STRAVA_CLIENT_SECRET) {
  console.error("Set STRAVA_CLIENT_SECRET (shown on the API settings page) for the exchange.");
  process.exit(1);
}

const params = new URL(redirected.includes("://") ? redirected : `${REDIRECT_URI}/?${redirected}`)
  .searchParams;
const code = params.get("code");
const granted = params.get("scope") ?? "";
if (!code) {
  console.error("No code= found in the address. Copy the full address from the browser bar.");
  process.exit(1);
}
if (!granted.includes("activity:read")) {
  console.error(
    `Granted scope is "${granted}". Tick the box that lets the app view your activities ` +
      "on the approval page and start over."
  );
  process.exit(1);
}

const res = await fetch(TOKEN_URL, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    client_id: STRAVA_CLIENT_ID,
    client_secret: STRAVA_CLIENT_SECRET,
    code,
    grant_type: "authorization_code",
  }),
});
if (!res.ok) {
  console.error(`Token exchange failed: HTTP ${res.status} ${await res.text()}`);
  process.exit(1);
}
const data = await res.json();
console.log(`Scope granted: ${granted}`);
console.log(`Athlete: ${data.athlete?.firstname ?? ""} ${data.athlete?.lastname ?? ""}`.trimEnd());
console.log(`\nSTRAVA_REFRESH_TOKEN:\n${data.refresh_token}\n`);
console.log("Store it as a repository secret. Do not paste it into chat or commit it.");
