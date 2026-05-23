# Reconciliation Flow Handoff

## Purpose

This document is the stitching contract for future sessions working on the reconciliation agent POC. It captures the current implemented flow, UI structure, animation intent, data model, design rules, and remaining decisions.

Use this document first when resuming work. The conversation context that produced the design should not be required.

## Current Build

- App type: Vite, React, Framer Motion, lucide-react.
- Main UI and flow state: `src/main.jsx`.
- Styling and motion: `src/styles.css`.
- Design tokens and POC rules: `DESIGN.md`.
- Bank logo assets: `src/assets/chase.png`, `src/assets/wells-fargo.png`, `src/assets/bank-of-america.png`.
- Local run command: `npm run dev -- --host 127.0.0.1`.
- Build verification: `npm run build`.

## Product Shape

The shell has three persistent zones:

1. Left navigation: compact sessions and workspace list.
2. Center workspace: active task surface and user decisions.
3. Right observability rail: run context, input inventory, current work, and event timeline.

The center workspace must not become a log viewer. Agent status can appear in the center only when it helps the user understand the active task. The right rail remains the durable audit stream.

## Design North Star

The UI should feel smooth, linear, and agent-assisted. The user should understand what is happening without being forced to read dense explanations.

Preserve these principles:

- Progressive disclosure: row summary first, detail only on expansion or pop-up.
- Stable context: bank rows persist from comparison through exception review and final summary.
- Clear ownership: Reconciliation Agent compares, Exception Agent reviews records, Summary and Reports Agent summarizes.
- Compact hierarchy: counts and state before paragraphs, short labels, restrained color.
- Visible work: animations show process, not decoration.
- Low cognitive load: one primary action per phase, details close to the thing they explain.

## Implemented Linear Flow

1. Session ready
   - Property is already selected.
   - Cycle is shown under the property, currently mocked as `May 2026`.
   - Associated banks are shown in compact statement tiles.
   - Observability rail starts with a session-ready event.

2. Statement collection
   - User uploads each required bank statement.
   - User may mark a bank as not used before starting.
   - Uploads create user events in the rail.
   - `Start Reconcile from Yardi` enables only when every included bank is resolved.

3. Yardi import and Parsing Agent
   - Clicking `Start Reconcile from Yardi` locks inputs.
   - System events mock Yardi browser automation and ledger import.
   - Parsing Agent normalizes statement-ledger pairs.
   - Artifact save event records normalized files locally.

4. Automatic Reconciliation Agent handoff
   - No user CTA.
   - After parsing finishes, `runState` changes to `reconciling`.
   - The center changes from statement tiles to vertical comparison rows.

5. Reconciliation Agent comparison
   - Each bank becomes one vertical row.
   - Each row has:
     - Left compact card: bank statement.
     - Center bridge: comparison animation.
     - Right compact card: Yardi ledger.
     - One live one-liner above the pair explaining what the agent is doing.
   - Rows run in parallel.
   - The center bridge uses animated dots and match lines, not a generic scan around the bank statement.

6. Exception Agent summary
   - After comparison, the same rows remain and expand into summary mode.
   - Each row summary shows:
     - Approved records count.
     - Exceptions count.
     - Net difference.
     - Match confidence.
     - `Open review`.
   - This summary is owned by the Exception Agent, not the Summary and Reports Agent.

7. Record review pop-up
   - `Open review` opens a large focused pop-up for one bank.
   - Left column: approved records.
   - Right column: exceptions.
   - Records are compact by default.
   - Hover reveals quick actions:
     - Comment.
     - Move to the other column.
   - Clicking a record expands it inline.
   - Inline expansion shows:
     - Agent reason.
     - Evidence chips.
     - Comment thread.
     - Feedback composer.
     - Quiet guidance marker after feedback is submitted.
   - User comments are treated as feedback to the agent. The UI assumes reusable guidance is inferred and stored in agent memory.
   - Records do not move automatically. The user explicitly moves them.
   - Selection mode is per column. It appears only after the user clicks `Select`.
   - Bulk mode supports only `Move selected`.

8. Final Yardi update
   - After review, user clicks `Send approved to Yardi and flag exceptions`.
   - The app stays in the same workspace.
   - A final-stage status band appears beneath the property header.
   - The UI does not show a real browser or Playwright DOM.
   - Progress copy shows system work such as:
     - Verifying target records in Yardi.
     - Posting approved records.
     - Flagging exceptions.
     - Preparing report package.

9. Summary and Reports Agent
   - Starts automatically after Yardi update completes.
   - Final holistic summary appears at the top of the center workspace, beneath the property header.
   - It leads with session standing, not metrics:
     - Example: `May reconciliation is ready for controller review`.
   - Then it shows compact metrics:
     - Banks reconciled.
     - Approved records sent.
     - Exceptions flagged.
     - Automation issues.
   - Mock artifact cards are shown:
     - Reconciliation summary PDF.
     - Exception report CSV.
     - Yardi update log.

## Agent Ownership

Parsing Agent:

- Normalizes bank statements and Yardi ledgers.
- Saves normalized artifacts.
- Hands off automatically.

Reconciliation Agent:

- Compares each statement with its Yardi ledger.
- Owns the paired bank-ledger comparison rows and live comparison one-liners.
- Produces approved and exception buckets for each bank.

Exception Agent:

- Owns per-bank review summaries.
- Owns approved records and exception records.
- Owns record reasoning, evidence, inline feedback, and manual move behavior.

System/Yardi automation:

- Owns final update progress after user approval.
- Represents deterministic Playwright-style work as status only.
- Does not expose browser UI in the POC.

Summary and Reports Agent:

- Owns only the final holistic session summary.
- Owns mocked final artifacts.
- Does not own per-bank approved/exception summaries.

## State Machine

Current `runState` values:

```js
"draft"
"running"
"reconciling"
"review"
"updating-yardi"
"complete"
```

State meanings:

- `draft`: user is uploading statements or marking banks not used.
- `running`: Yardi import, Parsing Agent, normalization, artifact save.
- `reconciling`: Reconciliation Agent comparison rows are active.
- `review`: Exception Agent summaries and record review are available.
- `updating-yardi`: final status band runs in place after user submission.
- `complete`: final summary and artifacts are shown.

Current bank stages:

```js
"waiting"
"statement-ready"
"ledger-importing"
"ledger-imported"
"parsing"
"normalizing"
"normalized"
"comparing"
"scanning"
"review"
"complete"
"excluded"
```

`scanning` is retained for compatibility but the intended Reconciliation Agent visual is comparison, not a scan animation around one card.

## Data Contracts

Banks are mocked in `src/main.jsx` with:

- `id`
- `name`
- `shortName`
- `brandClass`
- `logo`
- `account`
- `statement`
- `ledger`
- `transactions`
- `inflow`
- `outflow`
- `balance`
- `confidence`
- `type`

Reconciliation records are mocked under `reconciliationSeed`:

```js
{
  [bankId]: {
    statementTotal: string,
    ledgerTotal: string,
    netDifference: string,
    matchRate: string,
    approved: RecordItem[],
    exceptions: RecordItem[]
  }
}
```

Record item shape:

```js
{
  id: string,
  title: string,
  date: string,
  amount: string,
  meta: string,
  confidence: string,
  reason: string,
  evidence: string[],
  comments: CommentItem[],
  guidanceCaptured?: boolean
}
```

Comment item shape:

```js
{
  author: string,
  copy: string,
  at: "now"
}
```

Events remain:

```js
{
  id: string,
  type: "user" | "system" | "agent",
  title: string,
  copy: string,
  at: "now"
}
```

## Key Components

`App`

- Owns all flow state.
- Drives the timed mock automation.
- Owns record movement and comment updates.

`ProcessStatus`

- Shows the center top status area beneath the property header.
- Renders Reconciliation Agent, Exception Agent, final Yardi update, or final Summary and Reports Agent content depending on `runState`.

`BankBoard`

- Renders statement tiles during `draft` and `running`.
- Switches to comparison rows during `reconciling`, `review`, `updating-yardi`, and `complete`.

`ComparisonBankRow`

- Represents one bank vertically.
- Contains bank statement card, comparison bridge, Yardi ledger card, live one-liner, and optional summary expansion.

`ComparisonBridge`

- Shows the comparison animation in the center of each row.
- Changes to a compact result badge after comparison.

`ReviewModal`

- Large focused pop-up for one bank.
- Contains approved and exception columns.

`RecordColumn`

- Column-local selection mode.
- Bulk action is only `Move selected`.

`RecordItem`

- Compact record row.
- Hover quick actions.
- Inline expansion for reason, evidence, comments, feedback, and guidance marker.

`ReviewSubmitBar`

- Final review CTA.
- Appears only in `review`.

`ObservabilityRail`

- Persistent right rail.
- Continues to own context, inventory, current work, and timeline.

## Visual And Motion Rules

Comparison rows:

- Stack vertically.
- Use two compact cards, bank left and ledger right.
- Keep details out of the row until summary expansion or pop-up.
- One live sentence above each row is enough.
- Center bridge should communicate comparison with traveling dots and line work.

Exception review:

- Main row summary should show counts and outcomes, not records.
- Detailed records belong in the pop-up.
- Record reasoning belongs inline under the selected record, not in a side inspector.
- Feedback guidance should be quiet: icon/short marker, not a persistent paragraph.

Final update:

- Do not navigate to a dedicated Yardi update screen.
- Use an attention-grabbing but compact final-stage band.
- Keep bank rows visible below for continuity.

Motion:

- Use 150-250ms for normal state changes.
- Use 300-500ms for expansion or modal movement.
- Motion should explain state, not decorate.
- Respect `prefers-reduced-motion`.

Color:

- System actions use system blue.
- Agent actions use primary violet.
- Success uses green/teal.
- Warnings and exceptions use restrained warning color.
- Avoid adding decorative color beyond state communication.

## Usability Heuristics

- Visibility of system status: every phase has a clear current state.
- Match between system and real world: Yardi work is described as practical accounting operations.
- User control: user manually moves records between approved and exception states.
- Recognition over recall: bank rows stay visible across phases.
- Error prevention: final Yardi update only happens after explicit user CTA.
- Aesthetic and minimalist design: summaries are compact, record detail is hidden by default.
- Progressive disclosure: row, expanded summary, pop-up, inline record detail.

## Current Endpoint

The implemented endpoint is `runState === "complete"`:

- Final holistic summary appears beneath the property header.
- Bank rows remain available below as evidence and drill-down context.
- Right rail shows Summary and Reports Agent completion.
- Mock artifact cards are visible.

## Future Stitching Contract

When adding the next real integration, decide:

- Which mocked data becomes API-backed first.
- Whether Yardi update needs a real dry verification pass before mutation.
- How agent memory is stored and audited after reviewer comments.
- Whether artifact cards should generate real PDF/CSV/log files.
- Whether property-specific bank lists replace the global mocked bank list.
- Whether review pop-up needs search, filters, or virtualization for high record counts.

Keep future work aligned with these boundaries:

- Center: active work and human decisions.
- Right rail: observability and audit.
- Pop-up: record-level review.
- Final summary: session standing and reports.

## Open Decisions

- Whether every associated bank is always required, or whether `not used this cycle` remains valid.
- Whether normalized artifact history becomes its own drawer, route, or session subview.
- Whether statement hover summaries should become clickable detail panels.
- How much real Playwright/Yardi progress should be exposed once automation is connected.
- Whether review records need pagination, filters, or virtualized scrolling for large ledgers.
- Whether inferred agent memory should be inspectable beyond the quiet guidance marker.

## QA Checklist

- `npm run build` passes.
- Uploading all required statements enables `Start Reconcile from Yardi`.
- Starting the run locks inputs.
- Parsing hands off automatically into Reconciliation Agent.
- Reconciliation Agent shows vertical bank rows with bank card, comparison bridge, and ledger card.
- Comparison rows run in parallel and do not show dense record data.
- Exception Agent expands the same rows with per-bank summaries.
- `Open review` opens the approved/exceptions pop-up.
- Clicking a record expands inline reasoning, evidence, comments, and feedback.
- Submitting feedback adds a comment and quiet guidance marker.
- Hover actions allow moving one record to the alternate column.
- Column selection mode appears only after `Select`.
- Bulk selection supports only `Move selected`.
- Moving records updates summary counts immediately.
- Final CTA starts in-place Yardi update status, not a new screen.
- Summary and Reports Agent final summary appears beneath the property header.
- Right rail remains the observability source and does not duplicate center content.
- UI has no all-caps headings or labels.
- Buttons and chips keep compact padding.
- Browser console has no runtime errors.
