// Entry program for the make.fun bounty gta6-meme-x-01, Post a GTA 6 meme on X.
// The judged work is the X post itself. This program has one job: hand the
// grader a copy of POST.json, the file at the repository root that names
// the post, by placing it in the output directory the grader provides.
// It reads nothing else, touches no network, and uses no clock or random
// source, so two runs on the same repository produce the same output.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const repoDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const postFile = join(repoDir, "POST.json");

if (!existsSync(postFile)) {
  console.error(`missing POST.json in repository directory ${repoDir}`);
  process.exit(1);
}

// Refuse a malformed post file here instead of letting the gate find it:
// POST.json must be one JSON object whose only key, url, names an X post.
let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(postFile, "utf8"));
} catch {
  console.error("POST.json is not valid JSON");
  process.exit(1);
}
const keys =
  parsed !== null && typeof parsed === "object" ? Object.keys(parsed) : [];
const url =
  keys.length === 1 && keys[0] === "url"
    ? (parsed as { url: unknown }).url
    : undefined;
if (typeof url !== "string" || !/^https:\/\/x\.com\/[^/]+\/status\/\d+$/.test(url)) {
  console.error("POST.json must have the form {\"url\": \"https://x.com/<handle>/status/<id>\"}");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(postFile, join(outDir, "POST.json"));
