// Daily BESS wiki maintainer.
//
// Reads raw session notes from wiki-inbox/, asks Claude to distill them into
// the living glossary at src/content/posts/bess-wiki.md following the
// maintenance contract embedded in that file, writes the result back, and
// archives the processed notes. Invoked by .github/workflows/bess-wiki-update.yml.
//
// Required env:
//   ANTHROPIC_API_KEY  — repository secret
//   ANTHROPIC_MODEL    — repository variable (set to the latest Claude Opus model)

import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";

const ROOT = process.cwd();
const WIKI_PATH = path.join(ROOT, "src/content/posts/bess-wiki.md");
const INBOX_DIR = path.join(ROOT, "wiki-inbox");
const PROCESSED_DIR = path.join(INBOX_DIR, "processed");

const MODEL = process.env.ANTHROPIC_MODEL;
if (!MODEL) {
  console.error(
    "ANTHROPIC_MODEL is not set. Add it as a repository variable (recommended: the latest Claude Opus model)."
  );
  process.exit(1);
}
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY is not set. Add it as a repository secret.");
  process.exit(1);
}

// Collect inbox notes (everything except the README and the processed archive).
const inboxFiles = fs.existsSync(INBOX_DIR)
  ? fs
      .readdirSync(INBOX_DIR)
      .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
  : [];

if (inboxFiles.length === 0) {
  console.log("No inbox notes to process. Nothing to do.");
  process.exit(0);
}

const notes = inboxFiles
  .map((f) => `--- ${f} ---\n${fs.readFileSync(path.join(INBOX_DIR, f), "utf8")}`)
  .join("\n\n");

const currentWiki = fs.readFileSync(WIKI_PATH, "utf8");
const today = new Date().toISOString().slice(0, 10);

const system = `You maintain a living Markdown glossary of BESS (battery energy storage) concepts.
Follow the AGENT MAINTENANCE CONTRACT embedded in the file's HTML comment exactly.

Rules:
- Integrate the new session notes into the wiki: add new term entries and refine existing ones where the notes clarify or correct them.
- Each term is a "### Term (Acronym)" heading under the correct "## Category" section, kept alphabetical within the section. Add a new "## Category" (and a Contents entry) if a note doesn't fit an existing one.
- Definitions are 1-4 sentences: plain language first, then the precise/technical nuance, with units where relevant.
- Never delete or contradict a human-written entry; refine in place instead.
- Set the frontmatter "updatedDate" to ${today} and update the "Last refreshed" line to the same date.
- Prepend one dated line (${today}) to the Changelog describing what changed.
- Preserve the frontmatter, the maintenance-contract HTML comment, the Contents list, and the overall structure.

Output ONLY the complete updated Markdown file content, starting with the "---" frontmatter. No code fences, no commentary.`;

const user = `CURRENT WIKI FILE:

${currentWiki}

========

NEW SESSION NOTES TO INTEGRATE (raw Q&A captured from my chat sessions):

${notes}`;

const client = new Anthropic();
const stream = client.messages.stream({
  model: MODEL,
  max_tokens: 64000,
  thinking: { type: "adaptive" },
  system,
  messages: [{ role: "user", content: user }],
});
const message = await stream.finalMessage();

const updated = message.content
  .filter((b) => b.type === "text")
  .map((b) => b.text)
  .join("")
  .trim();

if (!updated.startsWith("---")) {
  console.error(
    "Model output did not look like a Markdown file (missing frontmatter). Aborting without changes."
  );
  process.exit(1);
}

fs.writeFileSync(WIKI_PATH, updated + "\n");

// Archive processed notes so they aren't re-ingested next run.
fs.mkdirSync(PROCESSED_DIR, { recursive: true });
for (const f of inboxFiles) {
  fs.renameSync(path.join(INBOX_DIR, f), path.join(PROCESSED_DIR, `${today}-${f}`));
}

console.log(`Updated wiki from ${inboxFiles.length} note file(s).`);
