/* One-time helper to get a Spotify refresh token for the Now Playing card.
   Usage:
     node scripts/spotify-token.mjs <CLIENT_ID> <CLIENT_SECRET>
   It opens the Spotify approval page, captures the redirect, exchanges the
   code, and prints SPOTIFY_REFRESH_TOKEN. Add http://127.0.0.1:8888/callback
   as a Redirect URI in your Spotify app first (Dashboard → Settings).      */

import http from "node:http";
import { spawn } from "node:child_process";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || process.argv[2];
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || process.argv[3];
const PORT = 8888;
const REDIRECT = `http://127.0.0.1:${PORT}/callback`;
const SCOPE = "user-read-currently-playing user-read-recently-played";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Usage: node scripts/spotify-token.mjs <CLIENT_ID> <CLIENT_SECRET>");
  process.exit(1);
}

const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT,
    scope: SCOPE,
  });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT);
  if (!url.pathname.startsWith("/callback")) {
    res.writeHead(404);
    res.end();
    return;
  }
  const code = url.searchParams.get("code");
  if (!code) {
    res.writeHead(400);
    res.end("No ?code in callback.");
    return;
  }
  try {
    const r = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT,
      }),
    });
    const data = await r.json();
    if (data.refresh_token) {
      res.writeHead(200, { "content-type": "text/html" });
      res.end("<h2>✅ Done — check your terminal for the refresh token. You can close this tab.</h2>");
      console.log("\n✅ Copy this into Vercel + .env.local:\n");
      console.log("SPOTIFY_REFRESH_TOKEN=" + data.refresh_token + "\n");
    } else {
      res.writeHead(500);
      res.end("Token exchange failed: " + JSON.stringify(data));
      console.error("Failed:", data);
    }
  } catch (e) {
    res.writeHead(500);
    res.end(String(e));
    console.error(e);
  } finally {
    setTimeout(() => server.close(() => process.exit(0)), 500);
  }
});

server.listen(PORT, () => {
  console.log("\nRedirect URI to register in your Spotify app:\n  " + REDIRECT);
  console.log("\nOpening the approval page (or paste this):\n  " + authUrl + "\n");
  spawn("open", [String(authUrl)]); // macOS
});
