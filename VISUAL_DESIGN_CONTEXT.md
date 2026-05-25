# Visual Design Context

This document captures the current visual and interaction direction for the reconciliation product UI. It should be used as the working design context before changing the workspace, run trace, associated banks, review overlay, or left navigation.

## Product Posture

The product should feel like a quiet operational fintech tool for property accounting teams. The interface should be calm, precise, and confidence-building. AI should feel present through status, progress, and useful next actions, not through spectacle or repeated "AI summary" surfaces.

Primary design goals:

- Reduce cognitive load during reconciliation.
- Keep bank-level actions close to their bank context.
- Make agent activity visible without making the interface feel busy.
- Preserve a clear division between work, status, and review.
- Use motion only to clarify progress or state changes.

## Layout Ownership

The app has three primary zones:

- Left navigation: session navigation and compact session state.
- Center workspace: the active reconciliation work, bank statement upload, bank pair workspaces, and bank-level review actions.
- Right run trace: agent status, background work, and final Yardi handoff readiness.

Do not duplicate the same concept across all zones. The center should not carry a floating run summary when the right rail already owns run-level status. The center should show the work and bank-level review entry points. The right rail should show what the system is doing and what is ready to hand off.

## Summary And Review Ownership

"Summary" should be used carefully. The previous design had summary content in three places, which diluted hierarchy.

Current ownership:

- Bank workspace: owns the bank-specific review trigger.
- Right rail: owns run-level handoff status and the final Yardi action.
- Review overlay: owns detailed approved and exception ledger review.
- Complete state: may show final posted output or report-level summary after handoff is finished.

Preferred copy:

- `Review bank`
- `Ready for review`
- `Yardi handoff ready`
- `Post approved records`
- `Run complete`
- `Posted`

Avoid copy such as:

- `Generated summary`
- `Summary ready` in multiple zones
- Generic AI artifact language in primary CTAs

## Associated Banks

The section heading is `Associated Banks`.

The section includes the subtext:

`At least one statement is required to start reconciliation.`

Bank logo, bank name, and file object should live in a compact card. Empty bank tiles show a tooltip at the bottom on hover or keyboard focus:

`Upload bank statement`

The tooltip should use a white surface and sit outside the document/file container, so it does not read as an overlay on the document artwork.

Upload behavior:

- The upload button is a small circular icon placed on the bottom-right corner of the file object.
- Hover state applies to the upload icon only, not the whole file SVG.
- Upload animation starts only after clicking the upload icon.
- Intake agent work starts with the upload action, while the statement is being uploaded and read.
- Upload loading resolves into a white-background green check mark, without a green circle behind the check.
- Shimmer or scanning animation does not run during initial upload.

Scanning behavior:

- Do not run a second statement scan after the user clicks `Upload ledger` or `Fetch Yardi ledger`.
- Ledger import and reconciliation can use run-trace states and workspace flow paths instead of re-scanning the file art.
- The shimmer is clipped inside the file SVG.
- The shimmer should be diagonal, subtle, and product-grade.
- The full file SVG should not elevate, shift, or act like a hoverable button.

## Reconciliation Workspaces

The reconciliation area has one unified heading:

`Reconciliation workspaces`

Each uploaded bank statement creates one bank workspace, such as `Chase`, `Wells Fargo`, or `BofA`. The individual workspace should not repeat the phrase `Reconciliation workspace` as a subheading.

Workspace principles:

- Each workspace sits in a light visual container so banks are easy to scan.
- Use consistent section headings with an icon.
- Keep file cards clean and low-information.
- Show only the minimum useful state on the file pair: source, ledger, match signal, and exception count.
- In review state, call the bank action `Review bank`.
- In review state, use `Ready for review`, not `Complete`.
- Reserve `Complete` or `Posted` for post-handoff states.

Flow path design:

- Paths use rounded corners.
- Flow animation should be a single subtle gradient passing through the path.
- The gradient should loop once per cycle and avoid drawing too much attention.
- Remove paths that connect downward to summary if the summary action is moved to the top-right of the card.

## Agent Presentation

Agent visuals have two different treatments:

- Right run trace: gradient circular blobs with white icons.
- Everywhere else: plain agent icons only.

Do not use blob shadows or animated blobs in the center workspace, dashboard, property table, or bank cards. That makes the interface feel overloaded.

Agent state rules:

- Working agents get focus through color, shimmer, or motion.
- Idle agents move to grayscale.
- Completed agents can turn green in the run trace.
- During review, Exception and Summary can both be active, but Summary should remain its own agent row.
- Agent motion should communicate active work, not decoration.

Agent roles:

- Intake: statement upload, parsing, and normalization.
- Reconciliation: matching bank statement data with Yardi ledger data.
- Exception: preparing exceptions and review buckets.
- Summary: assembling review output and handoff context.

## Right Run Trace

The run trace is the user's system confidence surface. It should explain what happened, what is happening, and what is next.

Design rules:

- Use separators between agents.
- Do not use separators inside expanded agent steps.
- Do not show generic live-status pulse notes such as `Open span is still collecting signals` inside agent detail panels.
- Use relevant agent icons inside gradient blobs.
- Keep expanded steps visually quieter than the agent row.
- When one agent is working, the rest should reduce emphasis.
- Yardi handoff should appear as the final item in the agent sequence, directly after the Summary agent.
- It should not use a separate card container, tinted background, or green agent blob icon.

The final handoff area in review state should communicate:

- `Yardi handoff ready`
- Approved count
- Exceptions count
- Banks included
- Primary action: `Post approved to Yardi`

The handoff area should not compete with bank-level review actions. It is a run-level handoff control and should feel like the end of the trace, not a detached floating widget.

## Review Overlay

The review overlay is for comparing approved and exception ledger records. It should feel like one coherent workspace, not a modal made of stacked containers.

Structure:

- Header has no hard container, background block, or full-width separator.
- Top metrics use icons above labels, not pill-heavy styling.
- Approved and Exception panels have clear headings without end-to-end divider lines.
- Approved and Exception columns should be unframed workspace regions. Use repeated record rows as the only card-like surfaces.
- Ledger rows use proximity, spacing, and subtle surfaces instead of heavy borders.
- Expanded row content has no hard header separator.
- Expand/collapse behavior uses a clear chevron and reveals concise review context.

Selection behavior:

- Selection mode should be explicit.
- Use `Select records` and `Cancel` for mode entry and exit.
- Show a compact selection toolbar only when selection mode is active.
- The toolbar should explain the action and provide `Select all` and `Move selected`.

## Left Navigation

Left navigation typography should be consistent across Dashboard, Properties, and running sessions.

Session state icon scheme:

- Draft: `CircleDashed`
- Active work: `CircleDot`
- Needs input or failed: `CircleAlert`
- Needs review: `CircleDotDashed`
- Ready or complete: `CircleCheckBig`

Icon guidance:

- Use a compact 16px footprint.
- Tune stroke width so icons feel related to the rest of the nav.
- Do not use status pills for sessions.
- Do not use background containers behind session status icons.

## Typography, Spacing, And Motion

Typography should stay compact and operational:

- Prefer system or Inter-style UI type.
- Use 12px to 15px for most operational text.
- Reserve larger display text for page-level workspace headings.
- Avoid marketing-style hero composition in the product workspace.

Spacing should clarify proximity:

- Bank name, logo, and file object should feel like one unit.
- Section groups need enough vertical separation to scan.
- Related controls should be close to the object they affect.
- Avoid card-inside-card layering unless the nested element is a repeated record or a modal content group.

Motion should be restrained:

- Use motion to explain upload, scanning, agent work, path flow, and expansion.
- Prefer ease curves like `cubic-bezier(0.16, 1, 0.3, 1)`.
- Avoid constant motion in idle or ready states.
- Respect `prefers-reduced-motion`.

## Implementation References

Current implementation files:

- `src/main.jsx`
- `src/styles.css`

Existing broader design context:

- `DESIGN.md`

Older reconciliation handoff notes:

- `RECONCILIATION_FLOW_HANDOFF.md`

When these documents disagree, this file should be treated as the current visual design context for the reconciliation flow.
