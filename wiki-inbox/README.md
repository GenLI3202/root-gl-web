# Wiki inbox

Drop raw notes here and the daily **Update BESS Wiki** workflow will distill them
into the living glossary at `src/content/posts/bess-wiki.md`.

## How it works

1. During the week, you ask BESS questions in an ongoing chat session.
2. You (or an export step) paste the relevant Q&A into a Markdown file in this
   folder — any name, e.g. `2026-06-15-frequency-response.md`. Rough notes are
   fine; the agent rewrites them into proper glossary entries.
3. Once a day the workflow reads every `*.md` here (except this `README.md`),
   merges it into the wiki following the maintenance contract at the top of the
   wiki file, bumps `updatedDate`, appends a changelog line, commits, and lets
   Vercel redeploy.
4. Processed notes are moved to `wiki-inbox/processed/` so they aren't ingested
   twice — keep them as an audit trail or delete them.

## Setup

The workflow stays inert until you add:

- Repository **secret** `ANTHROPIC_API_KEY` — your Anthropic API key.
- Repository **variable** `ANTHROPIC_MODEL` — the model id to use.

Trigger a manual run from the Actions tab (**Run workflow**) to test before
relying on the daily schedule.

## Swapping the source

The inbox is just the default, most self-contained source. To pull notes from
elsewhere (a Google Drive doc, a database, an exported chat transcript), change
how `scripts/update-wiki.mjs` gathers `notes` — the rest of the pipeline is
unchanged.
