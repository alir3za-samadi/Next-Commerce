# Session Protocol

Personal rules (language, learning loop, answer style) live in the global
`~/.config/opencode/AGENTS.md`. This file adds only what is specific to
NextCommerce.

## Answering style

- Persian, short, headed, bulleted. Do not restate what the docs already say.
- Every markdown file and code comment: **simple English**, short sentences.
- Two or more valid ways: list them briefly, recommend one, let the user choose.
- After code changes: files touched + `pnpm lint` / `pnpm build` result.
- No `any`, no floats for money, no temp files left in the project.

## Phase loop

```
Explain the idea → lab outside src/ → write the code → checkpoint
```

- The user reads every line of the code he ships. Explain why each line exists,
  and mention the background behavior it depends on.
- Labs are throwaway; they must not pollute `src/`.
- The checkpoint asks the user to explain the concept in his own words, or to
  demonstrate it in the browser.
- Until it passes: status = "implemented", **not** "learned".

## End-of-session doc update (mandatory)

### `docs/Next_Commerce_Plan.md`
- Stable. Change **only** when explicitly asked (new phase, route change, ticking
  the Definition of Done).
- If the implementation drifts from the plan, report it first; never silently
  "fix" the plan.
- It holds no code. Samples belong in `src/` or in this skill's references.

### `docs/LEARNING_PROGRESS.md`
- **Continue, never rewrite.** Keep the section order and the current headings.
- Must stay accurate:
  1. `## Current status` — one clear paragraph: phase, what is ready, what is next.
  2. Phase table 0–8 — two columns: implementation + learning/checkpoint.
  3. `## Prior knowledge` — keep the current text.
  4. `## What has been done in the project` — append one line per task.
  5. `## Learning review I still owe` — open questions, exercises, done criteria.
  6. `## Next steps after the review` — keep current.
  7. `## Things not done yet` — shrink as work lands.
  8. `## Learning log` — append on "I learned X": topic, **real date**, proof.
- After a learning entry: update the phase table and the not-done list to match.
- Use the real date of the day (not a guess, not the doc's last date).

## Final message of a session

- What changed (files).
- Which doc recorded what.
- The next concrete step.

## Conflict resolution

- `LEARNING_PROGRESS.md` > `Next_Commerce_Plan.md` > `SESSION_PROMPT.md` > code > this skill.
- If the skill is stale after a roadmap change, update the skill in the same session.
