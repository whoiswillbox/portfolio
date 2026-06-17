# Spotify "Now Playing" setup

The Music page (`/extracurriculars/music`) shows what Will is currently
listening to via `/api/spotify/now-playing`. It needs three env vars. Without
them the card shows a graceful "Spotify isn't connected yet" placeholder.

```
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_REFRESH_TOKEN=...
```

## One-time setup

1. **Create an app** at https://developer.spotify.com/dashboard
   - Note the **Client ID** and **Client Secret**.
   - Add a Redirect URI: `http://127.0.0.1:3000/callback` (any URL works for the
     one-time grab; it just has to match below).

2. **Authorize** (gets a `code`). Open this URL in a browser, replacing
   `CLIENT_ID`, and approve:

   ```
   https://accounts.spotify.com/authorize?client_id=CLIENT_ID&response_type=code&redirect_uri=http://127.0.0.1:3000/callback&scope=user-read-currently-playing%20user-read-recently-played
   ```

   After approving you'll be redirected to
   `http://127.0.0.1:3000/callback?code=XXXX` — copy the `code`.

3. **Exchange the code for a refresh token** (run in a terminal, fill in the
   placeholders):

   ```bash
   curl -X POST https://accounts.spotify.com/api/token \
     -H "Authorization: Basic $(printf '%s:%s' CLIENT_ID CLIENT_SECRET | base64)" \
     -d grant_type=authorization_code \
     -d code=CODE_FROM_STEP_2 \
     -d redirect_uri=http://127.0.0.1:3000/callback
   ```

   The JSON response includes `refresh_token` — that's `SPOTIFY_REFRESH_TOKEN`.
   It's long-lived; you only do this once.

4. **Set the three env vars** in Vercel (Production) and, if you want it working
   locally, in `.env.local`. Redeploy.

The route never caches and the client polls every 30s, so the card reflects
live playback. Falls back to the most recently played track when nothing is on.
