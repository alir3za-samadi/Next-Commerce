# Session start — NextCommerce

This file is a launcher **and a contract**. `opencode.json` injects it into every
new session in this folder.
Personal rules live in the global `~/.config/opencode/AGENTS.md`.
Project rules live in `AGENTS.md` and in the `next-commerce` skill.

## The three docs, and how to treat them

| File | What it is | How to treat it |
| --- | --- | --- |
| `docs/LEARNING_PROGRESS.md` | **Live truth.** Phase table, done list, checkpoints I still owe, learning log. | Read it first and completely. **Append, never rewrite.** Update it at the end of every session. On any conflict, it wins. |
| `docs/Next_Commerce_Plan.md` | **Stable roadmap.** Pages map, folder structure, phases, definition of done. It is not a status file. | Read only §3, §4, the current phase in §5, and §8. Never edit it unless I ask. If the code drifts from it, report it; do not silently repair either side. |
| `docs/SESSION_PROMPT.md` | This file. Read order and behavior. | Change only when the process changes. Never put status here. |

Rules that follow from this:

- The plan says what we *intend* to build. The progress file says what is *true today*. Do not mix them.
- Do not invent history. Nothing enters the done list or the learning log without a real change or a passed checkpoint.
- Dates in the log are the real date of the day.
- "Implemented" is not "learned". Only a checkpoint moves the learning column.

## Read, in this order

1. `docs/LEARNING_PROGRESS.md` — status first, so the rest is read with the right context.
2. `docs/Next_Commerce_Plan.md` — only the parts listed above.
3. The real code, to check what the docs claim: `src/app`, `src/features`, `src/server`, `next.config.ts`.
4. The `next-commerce` skill (project playbook).

## First message

- 5–10 lines: which phase, what is ready, what is missing, one concrete next step.
- One question for me.
- **No code before I confirm.**

## While we work

- Loop: explain the idea → small lab → write the code → checkpoint.
- Details: skill `next-commerce` → `references/session-protocol.md`.

## End of session

- Update `docs/LEARNING_PROGRESS.md` — continue it, never rewrite it.
- Change `docs/Next_Commerce_Plan.md` only when I ask.
- Last message: which files changed, which doc recorded what, and the next step.
