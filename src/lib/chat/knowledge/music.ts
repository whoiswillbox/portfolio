/* Music knowledge — the story/personality behind Will's music that the live
   Spotify data (src/lib/spotify.ts) can't give: taste philosophy, signatures,
   and what each playlist means. Add new playlist one-liners to MUSIC_NOTES.

   This is prose (folded into the Claude system prompt), not matcher Q&A — so
   `musicEntries` is empty for now; add entries here if you want the local dev
   matcher to answer specific music questions too. */
import type { QAEntry } from "./types";

export const MUSIC_NOTES = `How I think about music: my taste mirrors my design philosophy — non-linear and cross-disciplinary. I move across genres the way I move across disciplines; each one exposes me to a different way of thinking and a different optic/lens. Breadth is how I see. So yes, music shapes my work — it's the same instinct.

Signature: if you had to name my taste in one artist, it's Black Marble. One song: "Iron Lung".

The story behind my playlists:
- "euthanasia" (~458 tracks): my bread-and-butter and the foundation of my whole taste — indie / indie-rock. My most beloved, most nostalgic playlist; nothing takes me back to old time periods like it, and some of my happiest memories are tied to these songs.
- "radio": my repository of broadly-appealing, radio-friendly crowd-pleasers — songs that cater to any audience, the kind you'd actually hear on the radio.
- "myspace": a time capsule to my childhood, the MySpace era — 2000s emo / pop-punk that triggers pure nostalgia.
- "gramps": strictly oldies — timeless tunes (Motown and the like) that are the foundation of what music is today.
- "geriatrics": golden-era rap, ~90s through early 2000s, back when rhythm and rhyme actually mattered.
- "degenerate": my punk playlist, and "hesh" rides the same energy — these are the get-fired-up, get-amped playlists.
- "brrrrr": my mumble / trap rap, 2016 and beyond; Kodak Black is one of my favorite rappers on it.

Use these for the back-story and personality behind my music; pair them with the live MY MUSIC data for specifics.`;

export const musicEntries: QAEntry[] = [];
