// gta6-clipper-01 entry (Node 22, standard library only).
//
// This program copies VIDEO.json from the repository root to /output/VIDEO.json,
// where the gate reads it. That is all it has to do. The entry is the video
// itself: the clip was cut from a GTA 6 livestream in the recorded agent
// session (a biker ambush turns into a shootout, then a full-speed motorbike
// chase), uploaded to YouTube as a public Short with the bounty's line and the
// entrant's play code in its description, VIDEO.json names the video, and the
// house reads the video's views from YouTube. Nothing this program writes
// about the video is scored.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand
// in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// A YouTube Shorts / watch / youtu.be address, with an 11-character video id.
const YOUTUBE_URL = /^https:\/\/(www\.|m\.)?(youtube\.com\/(shorts\/|watch\?v=)|youtu\.be\/)[A-Za-z0-9_-]{11}([?&#].*)?$/;

const videoPath = join(BOT_DIR, 'VIDEO.json');
let parsed;
try {
  parsed = JSON.parse(readFileSync(videoPath, 'utf8'));
} catch (err) {
  console.error(`VIDEO.json could not be read from ${BOT_DIR}: ${err.message}`);
  process.exit(1);
}
if (typeof parsed !== 'object' || parsed === null || typeof parsed.url !== 'string' || !YOUTUBE_URL.test(parsed.url)) {
  console.error(`VIDEO.json must name a YouTube video address, got: ${JSON.stringify(parsed?.url)}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(videoPath, join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${err.message}`);
  process.exit(1);
}
