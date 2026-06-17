/* Music knowledge — the story/personality behind Will's music that the live
   Spotify data (src/lib/spotify.ts) can't give: taste philosophy, signatures,
   and what each playlist means. Add new playlist one-liners to MUSIC_NOTES.

   This is prose (folded into the Claude system prompt), not matcher Q&A — so
   `musicEntries` is empty for now; add entries here if you want the local dev
   matcher to answer specific music questions too. */
import type { QAEntry } from "./types";

export const MUSIC_NOTES = `How I think about music: my taste mirrors my design philosophy — non-linear and cross-disciplinary. I move across genres the way I move across disciplines; each one exposes me to a different way of thinking and a different optic/lens. Breadth is how I see. So yes, music shapes my work — it's the same instinct.

Signature: if you had to name my taste in one artist, it's Black Marble. One song: "Iron Lung".

Making music: I tried making EDM back in 2016 and failed miserably 😅. I was inspired by the SoundCloud EDM era where people would take normal songs and add drops to them.

Best live shows: Flume in 2016 and Black Marble in 2022 are my favorites I've seen.

How I discover music: through people, videos/films, or just browsing.

Music while working: I can't work without it — music is always on while I design and code.

Artists I put people onto: BRONCHO, Black Marble, Current Joys, and The Drums are the ones I usually show people.

Guilty pleasure: "Girls Just Want to Have Fun" by Cyndi Lauper. 😄

The story behind my playlists:
- "euthanasia" (~458 tracks): my bread-and-butter and the foundation of my whole taste — indie / indie-rock. My most beloved, most nostalgic playlist; nothing takes me back to old time periods like it, and some of my happiest memories are tied to these songs.
- "radio": my repository of broadly-appealing, radio-friendly crowd-pleasers — songs that cater to any audience, the kind you'd actually hear on the radio.
- "myspace": a time capsule to my childhood, the MySpace era — 2000s emo / pop-punk that triggers pure nostalgia.
- "hot topic": early-2000s punk — the stuff I associate with the whole Hot Topic aesthetic.
- "gramps": strictly oldies — timeless tunes (Motown and the like) that are the foundation of what music is today.
- "geriatrics": golden-era rap, ~90s through early 2000s, back when rhythm and rhyme actually mattered.
- "degenerate": my punk playlist, and "hesh" rides the same energy — these are the get-fired-up, get-amped playlists.
- "brrrrr": my mumble / trap rap, 2016 and beyond; Kodak Black is one of my favorite rappers on it.
- "multi-modal": my EDM playlist.
- "joey b": songs that remind me of my dad — the ones he played when I was a kid. Listening to it brings back him and our memories together.
- "left foot forward": music from skate and surf edits (the name is the regular stance on a skateboard/surfboard). I grew up skating and surfing, so this playlist fires me up to skate and surf — and it's nostalgic, taking me back to specific surf/skate videos I've watched.
- "2014": the year I graduated high school — these songs take me back to senior year, my best year: my closest friend group and the best memories.
- "peepers": a playlist dedicated to Lil Peep (RIP). His music got me through some really tough times emotionally — his voice and message are so powerful, almost like Blink-182 and rap combined.
- "rasta pasta": all my reggae — nothing but chill, happy vibes.
- "lysergic acid diethylamide": my classic rock — music I grew up listening to. The name (LSD) nods to the drug era when a lot of these bands blew up, so it felt fitting.
- "breakfast jack w/ cheese": where I started consolidating my SoundCloud-era EDM — Flume, ODESZA, Louis the Child, that kind of thing. Takes me back to 2016 when that's all I listened to.
- "neutral": rock oldies — post-punk / 80s alternative like Joy Division, The Smiths, The Cure, The Psychedelic Furs. Music that'll never get old and can be listened to at any point in time.

Use these for the back-story and personality behind my music; pair them with the live MY MUSIC data for specifics.`;

export const musicEntries: QAEntry[] = [];
