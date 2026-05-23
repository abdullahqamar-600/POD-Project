import {
  Activity,
  AlertTriangle,
  ArrowRightLeft,
  BadgeCheck,
  Building2,
  CalendarDays,
  ChevronRight,
  CheckCircle2,
  CircleDot,
  Download,
  FileText,
  History,
  Home,
  Inbox,
  Loader2,
  Lock,
  MessageCircle,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Upload,
  Workflow,
  X
} from "lucide-react";

const colorTokens = [
  ["Canvas", "--canvas-light", "App background"],
  ["Panel", "--surface", "Persistent chrome"],
  ["Soft", "--surface-soft", "Inset surface"],
  ["Ink", "--ink", "Primary text"],
  ["Muted", "--muted", "Secondary text"],
  ["Primary", "--primary", "Agent action"],
  ["System", "--system", "Automation"],
  ["Success", "--success", "Complete"],
  ["Warning", "--warning", "Needs review"],
  ["Danger", "--danger", "Error"]
];

const typographyTokens = [
  ["Workspace title", "The Meridian", "28px, 500"],
  ["Section title", "Reconciliation workspace", "15px, 500"],
  ["Body copy", "Prepare bank statements, import Yardi ledgers, then hand off.", "13px, 400"],
  ["Caption", "Schema confidence 98%", "11px, 500"],
  ["Button", "Start reconcile", "13px, 300"]
];

const spacingTokens = [
  ["8", "Compact controls"],
  ["10", "Control radius"],
  ["12", "Medium spacing"],
  ["16", "Large elements"],
  ["24", "Section rhythm"],
  ["30", "Canvas inset"]
];

const radiusTokens = [
  ["8", "--radius-sm"],
  ["12", "--radius-md"],
  ["20", "--radius-lg"],
  ["999", "--radius-pill"]
];

const statusSamples = [
  ["Not started", "draft", "Not started"],
  ["Parsing", "parsing", "Parsing"],
  ["Reconciling", "reconciling", "Reconciling"],
  ["Needs review", "needs-review", "Needs review"],
  ["Updating", "updating", "Updating"],
  ["Ready for handoff", "ready-for-handoff", "Ready for handoff"],
  ["Complete", "complete", "Complete"]
];

const stageSamples = [
  ["waiting", "Missing"],
  ["statement-ready", "Uploaded"],
  ["ledger-importing", "Importing"],
  ["parsing", "Parsing"],
  ["normalizing", "Normalizing"],
  ["comparing", "Comparing"],
  ["review", "Review"],
  ["complete", "Complete"]
];

export default function DesignSystemGallery({ banks, recordsByBank, runTotals }) {
  const bank = banks[0];
  const records = recordsByBank[bank.id];
  const approvedRecord = records.approved[0];
  const exceptionRecord = records.exceptions[0];

  return (
    <section className="design-system-canvas" aria-label="Design system gallery">
      <header className="ds-hero">
        <div>
          <p className="eyebrow">Design system</p>
          <h1>Reconciliation product UI</h1>
          <p className="subtle">A single surface for foundations, components, states, and motion specimens.</p>
        </div>
        <div className="ds-hero-metrics">
          <MetricChipPreview label="Components" value="42" />
          <MetricChipPreview label="States" value="31" />
          <MetricChipPreview label="Motion patterns" value="6" />
        </div>
      </header>

      <div className="ds-shell">
        <aside className="ds-index" aria-label="Design system sections">
          <a href="#ds-foundations">Foundations</a>
          <a href="#ds-controls">Controls</a>
          <a href="#ds-status">Status</a>
          <a href="#ds-objects">Objects</a>
          <a href="#ds-layouts">Layouts</a>
          <a href="#ds-motion">Motion</a>
        </aside>

        <div className="ds-stack">
          <DesignSystemSection id="ds-foundations" eyebrow="01" title="Foundations">
            <div className="token-grid color-grid">
              {colorTokens.map(([label, token, role]) => (
                <div className="color-token" key={token}>
                  <span className="color-swatch" style={{ background: `var(${token})` }} />
                  <div>
                    <strong>{label}</strong>
                    <span>{token}</span>
                    <small>{role}</small>
                  </div>
                </div>
              ))}
            </div>

            <div className="ds-specimen-list">
              {typographyTokens.map(([name, sample, spec], index) => (
                <div className="ds-specimen-row" key={name}>
                  <div>
                    <strong>{name}</strong>
                    <span>{spec}</span>
                  </div>
                  <p className={`ds-type-sample ds-type-${index}`}>{sample}</p>
                </div>
              ))}
            </div>

            <div className="token-grid compact-token-grid">
              {spacingTokens.map(([size, label]) => (
                <div className="spacing-token" key={size}>
                  <span style={{ width: `${size}px` }} />
                  <strong>{size}px</strong>
                  <small>{label}</small>
                </div>
              ))}
              {radiusTokens.map(([size, token]) => (
                <div className="radius-token" key={token}>
                  <span style={{ borderRadius: `var(${token})` }} />
                  <strong>{size}px</strong>
                  <small>{token}</small>
                </div>
              ))}
            </div>
          </DesignSystemSection>

          <DesignSystemSection id="ds-controls" eyebrow="02" title="Controls">
            <div className="ds-component-matrix">
              <ComponentSpec label="Primary buttons">
                <button className="primary-button">
                  <Sparkles size={16} />
                  Start reconcile
                </button>
                <button className="primary-button is-running" disabled>
                  <Loader2 size={16} className="spin" />
                  Reconciling
                </button>
                <button className="primary-button" disabled>
                  <Lock size={16} />
                  Locked
                </button>
              </ComponentSpec>

              <ComponentSpec label="Secondary buttons">
                <button className="soft-button">
                  <Settings size={16} />
                  Manage
                </button>
                <button className="new-session">
                  <Plus size={16} />
                  New session
                </button>
                <button className="micro-button">
                  <Upload size={14} />
                  Upload
                </button>
                <button className="micro-button ghost">
                  <X size={14} />
                  Not used
                </button>
              </ComponentSpec>

              <ComponentSpec label="Icon buttons">
                <button className="icon-button" aria-label="More">
                  <MoreHorizontal size={17} />
                </button>
                <button className="icon-button ghost" aria-label="Refresh">
                  <RefreshCw size={16} />
                </button>
                <button className="icon-button ghost" aria-label="Comment">
                  <MessageCircle size={15} />
                </button>
                <button className="icon-button ghost" aria-label="Move">
                  <ArrowRightLeft size={15} />
                </button>
              </ComponentSpec>

              <ComponentSpec label="Inputs">
                <label className="search-box ds-search-specimen">
                  <Search size={15} />
                  <input value="Chase operating" readOnly aria-label="Search specimen" />
                </label>
                <input className="ds-input" value="May 2026" readOnly aria-label="Text field specimen" />
                <select className="ds-select" defaultValue="meridian" aria-label="Select specimen">
                  <option value="meridian">The Meridian</option>
                  <option value="oakline">Oakline Lofts</option>
                </select>
                <label className="ds-check">
                  <input type="checkbox" defaultChecked />
                  Included
                </label>
              </ComponentSpec>
            </div>
          </DesignSystemSection>

          <DesignSystemSection id="ds-status" eyebrow="03" title="Status vocabulary">
            <div className="ds-status-board">
              <div className="ds-status-group">
                <strong>Session states</strong>
                <div className="ds-chip-row">
                  {statusSamples.map(([label, className, copy]) => (
                    <span className="ds-status-pair" key={label}>
                      <span className={`status-dot ${className}`} />
                      <span className={`status-pill ${className}`}>{copy}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="ds-status-group">
                <strong>Bank stages</strong>
                <div className="ds-chip-row">
                  {stageSamples.map(([className, label]) => (
                    <span className={`stage-badge ${className}`} key={className}>
                      {["ledger-importing", "parsing", "normalizing", "comparing"].includes(className) && (
                        <Loader2 size={12} className="spin" />
                      )}
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="ds-status-group">
                <strong>Event glyphs</strong>
                <div className="ds-chip-row event-glyph-row">
                  <span className="event-glyph-example">
                    <Upload size={17} />
                    Upload
                  </span>
                  <span className="event-glyph-example system">
                    <Workflow size={17} />
                    Yardi
                  </span>
                  <span className="event-glyph-example agent">
                    <Sparkles size={17} />
                    Agent
                  </span>
                  <span className="event-glyph-example success">
                    <CheckCircle2 size={17} />
                    Done
                  </span>
                </div>
              </div>
            </div>

            <div className="ds-process-row">
              <div className="process-band comparing">
                <div>
                  <p className="eyebrow">Reconciliation Agent</p>
                  <h2>Comparing statements with Yardi ledgers</h2>
                  <span>Rows are running in parallel.</span>
                </div>
                <div className="agent-motion-chip">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="process-band review">
                <div>
                  <p className="eyebrow">Exception Agent</p>
                  <h2>Review summaries are ready</h2>
                  <span>Open a bank row to inspect records.</span>
                </div>
                <div className="mini-outcomes">
                  <MetricChipPreview label="Approved" value={runTotals.approved} />
                  <MetricChipPreview label="Exceptions" value={runTotals.exceptions} />
                </div>
              </div>
            </div>
          </DesignSystemSection>

          <DesignSystemSection id="ds-objects" eyebrow="04" title="Financial objects">
            <div className="ds-object-workbench">
              <div className="ds-workbench-toolbar">
                <div>
                  <p className="ds-object-label">Comparison object</p>
                  <h3>{bank.shortName} statement to Yardi ledger</h3>
                </div>
                <div className="ds-workbench-actions">
                  <span className="stage-badge review">Review</span>
                  <button className="micro-button" type="button">
                    <FileText size={14} />
                    Open review
                  </button>
                </div>
              </div>

              <div className="ds-object-flow">
                <FinancialSourceCard
                  type="Statement"
                  title={bank.shortName}
                  meta={bank.statement}
                  logo={bank.logo}
                  brandClass={bank.brandClass}
                  metrics={[
                    ["Lines", bank.transactions],
                    ["Total", records.statementTotal],
                    ["Schema", bank.confidence]
                  ]}
                />
                <MatchBridgeSpecimen exceptionCount={records.exceptions.length} />
                <FinancialSourceCard
                  type="Yardi ledger"
                  title={`${bank.type} ledger`}
                  meta={bank.ledger}
                  metrics={[
                    ["Records", records.approved.length + records.exceptions.length],
                    ["Total", records.ledgerTotal],
                    ["Match", records.matchRate]
                  ]}
                />
              </div>

              <div className="ds-object-bottom-grid">
                <ReviewSummarySpecimen records={records} />
                <RecordSpecimen record={exceptionRecord} />
              </div>
            </div>

            <div className="ds-supporting-objects">
              <button className="artifact-card" type="button">
                <Download size={15} />
                <div>
                  <strong>Exception report CSV</strong>
                  <span>Mock export</span>
                </div>
              </button>
              <button className="property-row selected" type="button">
                <div>
                  <strong>The Meridian</strong>
                  <span>1849 Westlake Ave</span>
                </div>
                <small>3 banks</small>
              </button>
            </div>
          </DesignSystemSection>

          <DesignSystemSection id="ds-layouts" eyebrow="05" title="Layout modules">
            <div className="ds-layout-grid">
              <div className="ds-mini-shell">
                <div className="brand-row">
                  <div className="brand-mark">R</div>
                  <span>Recon</span>
                  <button className="icon-button ghost" aria-label="Collapse sidebar">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                <button className="new-session">
                  <Plus size={16} />
                  New session
                </button>
                <nav className="nav-links" aria-label="Mini primary navigation">
                  <a href="#sessions" className="active">
                    <Inbox size={16} />
                    Sessions
                  </a>
                  <a href="#properties">
                    <Building2 size={16} />
                    Properties
                  </a>
                  <a href="#history">
                    <History size={16} />
                    Artifact history
                  </a>
                </nav>
                <div className="sidebar-section ds-session-nav-specimen">
                  <div className="section-label-row">
                    <div className="section-label">Running sessions</div>
                    <button
                      className="icon-button ghost sidebar-search-toggle active"
                      type="button"
                      aria-label="Search running sessions"
                    >
                      <Search size={15} />
                    </button>
                  </div>
                  <div className="session-search-box ds-session-search-specimen">
                    <Search size={15} />
                    <input value="The Meridian" readOnly aria-label="Search running sessions specimen" />
                    <button type="button" aria-label="Clear session search specimen">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="session-list ds-session-list-specimen">
                    <button className="session-item selected" type="button">
                      <strong>The Meridian</strong>
                      <span className="status-pill draft">Not started</span>
                    </button>
                    <button className="session-item" type="button">
                      <strong>Oakline Lofts</strong>
                      <span className="status-pill parsing">Parsing</span>
                    </button>
                    <button className="session-item" type="button">
                      <strong>Harbor Court</strong>
                      <span className="status-pill needs-input">Needs input</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="ds-module-stack">
                <div className="topbar ds-topbar-specimen">
                  <div className="breadcrumb">
                    <Home size={15} />
                    <span>Dashboard</span>
                    <span>The Meridian</span>
                  </div>
                  <span className="run-dot review">
                    <Activity size={14} />
                    Review
                  </span>
                </div>
                <div className="review-submit-bar">
                  <div>
                    <strong>Ready to update Yardi</strong>
                    <span>Approved records will be posted, exceptions will be flagged.</span>
                  </div>
                  <button className="primary-button">
                    <Send size={15} />
                    Send to Yardi
                  </button>
                </div>
                <div className="ds-dialog-specimen">
                  <div className="review-modal-header">
                    <div>
                      <p className="eyebrow">Exception Agent review</p>
                      <h2>{bank.name}</h2>
                      <span>Feedback stays attached to each record.</span>
                    </div>
                    <button className="icon-button" aria-label="Close specimen">
                      <X size={17} />
                    </button>
                  </div>
                  <div className="selection-bar">
                    <span>2 selected</span>
                    <button className="micro-button">Move selected</button>
                  </div>
                </div>
              </div>

              <div className="ds-rail-specimen">
                <div className="rail-header">
                  <div className="rail-tabs" role="tablist" aria-label="Rail specimen tabs">
                    <button className="active" type="button" role="tab" aria-selected="true">
                      <Activity size={14} />
                      Agent work
                    </button>
                    <button type="button" role="tab" aria-selected="false">
                      <Settings size={14} />
                      Settings
                    </button>
                  </div>
                </div>
                <div className="rail-body">
                  <section className="rail-section-group">
                    <div className="rail-section-heading">
                      <strong>Run state</strong>
                      <span>8 trace events</span>
                    </div>
                    <div className="agent-run-summary">
                      <span>Current span</span>
                      <strong>Reconciliation Agent</strong>
                      <small>Matching statements with Yardi records in parallel.</small>
                    </div>
                  </section>
                  <section className="rail-section-group">
                    <div className="rail-section-heading">
                      <strong>Agents</strong>
                      <span>1 of 4 done</span>
                    </div>
                    <div className="agent-rail-list">
                      <RailAgentSpecimen
                        status="complete"
                        name="Intake Agent"
                        role="Imports ledgers and normalizes statements"
                        summary="Normalized artifacts generated and passed to Reconciliation Agent."
                        expanded
                        steps={[
                          ["Yardi ledgers found", "Ledger files paired with uploaded statements"],
                          ["Statement fields normalized", "Dates, deposits, withdrawals, and balances aligned"],
                          ["Handoff prepared", "Normalized artifacts sent to reconciliation"]
                        ]}
                        metrics={[
                          ["Duration", "6.4s"],
                          ["Input pairs", "3"],
                          ["Parse issues", "0"],
                          ["Schema confidence", "98%"]
                        ]}
                      />
                      <RailAgentSpecimen
                        status="active"
                        name="Reconciliation Agent"
                        role="Matches statement rows to Yardi records"
                        summary="Matching statements with Yardi records in parallel."
                        expanded
                        steps={[
                          ["Comparison spans opened", "Statement rows matched against Yardi ledger rows"],
                          ["Variance checks running", "Amounts, dates, and references are being scored"]
                        ]}
                      />
                      <RailAgentSpecimen
                        status="idle"
                        name="Exception Agent"
                        role="Explains exceptions and captures guidance"
                        summary="Waiting for comparison results."
                      />
                      <RailAgentSpecimen
                        status="idle"
                        name="Posting Agent"
                        role="Applies Yardi updates and builds reports"
                        summary="Waiting for reviewed output."
                      />
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </DesignSystemSection>

          <DesignSystemSection id="ds-motion" eyebrow="06" title="Motion specimens">
            <div className="ds-motion-grid">
              <div className="ds-motion-specimen">
                <strong>Agent pulse</strong>
                <div className="agent-motion-chip">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="ds-motion-specimen">
                <strong>Comparison bridge</strong>
                <div className="comparison-bridge">
                  <div className="bridge-track">
                    <span className="bridge-pulse one" />
                    <span className="bridge-pulse two" />
                    <span className="bridge-pulse three" />
                  </div>
                  <div className="bridge-status">
                    <Loader2 size={13} className="spin" />
                    68%
                  </div>
                </div>
              </div>
              <div className="ds-motion-specimen">
                <strong>Complete bridge</strong>
                <div className="comparison-bridge complete">
                  <div className="bridge-track">
                    <span className="bridge-pulse one" />
                  </div>
                  <div className="bridge-status">
                    <CheckCircle2 size={13} />
                    2 exceptions
                  </div>
                </div>
              </div>
              <div className="ds-motion-specimen">
                <strong>Progress orbit</strong>
                <div className="progress-orbit ds-orbit-specimen" aria-label="68% complete">
                  <svg viewBox="0 0 44 44" role="img" aria-hidden="true">
                    <circle cx="22" cy="22" r="18" />
                    <circle cx="22" cy="22" r="18" style={{ "--progress": 68 }} />
                  </svg>
                  <strong>68%</strong>
                </div>
              </div>
              <div className="ds-motion-specimen ds-motion-wide">
                <strong>Loading skeleton</strong>
                <div className="ds-skeleton-stack" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="ds-motion-specimen ds-motion-wide">
                <strong>Review expansion</strong>
                <div className="record-item open">
                  <div className="record-row">
                    <button className="record-trigger">
                      <div>
                        <strong>{approvedRecord.title}</strong>
                        <span>{approvedRecord.meta}</span>
                      </div>
                      <div className="record-amount">
                        <strong>{approvedRecord.amount}</strong>
                        <span>{approvedRecord.date}</span>
                      </div>
                    </button>
                  </div>
                  <div className="record-detail">
                    <div className="record-detail-inner">
                      <div className="reason-block">
                        <span>Agent reason</span>
                        <p>{approvedRecord.reason}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DesignSystemSection>
        </div>
      </div>
    </section>
  );
}

function DesignSystemSection({ id, eyebrow, title, children }) {
  return (
    <section className="ds-section" id={id}>
      <div className="ds-section-heading">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ComponentSpec({ label, children }) {
  return (
    <div className="component-spec">
      <strong>{label}</strong>
      <div>{children}</div>
    </div>
  );
}

function MetricChipPreview({ label, value }) {
  return (
    <div className="metric-chip">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function ReviewSummarySpecimen({ records }) {
  return (
    <div className="ds-review-summary-specimen">
      <div className="ds-summary-strip">
        <div className="summary-stat approved">
          <BadgeCheck size={16} />
          <div>
            <strong>{records.approved.length}</strong>
            <span>Approved records</span>
          </div>
        </div>
        <div className="summary-stat exception">
          <AlertTriangle size={16} />
          <div>
            <strong>{records.exceptions.length}</strong>
            <span>Exceptions</span>
          </div>
        </div>
        <div className="summary-stat">
          <ArrowRightLeft size={16} />
          <div>
            <strong>{records.netDifference}</strong>
            <span>Net difference</span>
          </div>
        </div>
        <div className="summary-stat">
          <ShieldCheck size={16} />
          <div>
            <strong>{records.matchRate}</strong>
            <span>Match confidence</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FinancialSourceCard({ type, title, meta, logo, brandClass, metrics }) {
  return (
    <section className="financial-source">
      <div className="financial-source-top">
        {logo ? (
          <span className={`mini-bank-logo ${brandClass}`}>
            <img src={logo} alt="" />
          </span>
        ) : (
          <span className="ledger-mark">
            <Workflow size={16} />
          </span>
        )}
        <div>
          <span>{type}</span>
          <strong>{title}</strong>
        </div>
      </div>
      <p>{meta}</p>
      <div className="financial-source-metrics">
        {metrics.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function MatchBridgeSpecimen({ exceptionCount }) {
  return (
    <section className="match-bridge-specimen" aria-label={`${exceptionCount} exceptions found`}>
      <div className="match-rail" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="match-status">
        <CheckCircle2 size={14} />
        <strong>{exceptionCount}</strong>
        <span>Exceptions</span>
      </div>
      <small>Matched by amount, date, reference</small>
    </section>
  );
}

function RecordSpecimen({ record }) {
  return (
    <article className="ds-record-specimen">
      <div className="ds-record-head">
        <div>
          <strong>{record.title}</strong>
          <span>{record.meta}</span>
        </div>
        <div className="record-amount">
          <strong>{record.amount}</strong>
          <span>{record.date}</span>
        </div>
        <div className="record-actions">
          <button className="icon-button ghost" type="button" aria-label="Comment">
            <MessageCircle size={15} />
          </button>
          <button className="icon-button ghost" type="button" aria-label="Move">
            <ArrowRightLeft size={15} />
          </button>
        </div>
      </div>
      <div className="reason-block">
        <span>Agent reason</span>
        <p>{record.reason}</p>
      </div>
      <div className="evidence-list">
        {record.evidence.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="thread-item guidance">
        <CircleDot size={12} />
        <span>Guidance captured</span>
      </div>
    </article>
  );
}

function RailAgentSpecimen({ status, name, role, summary, expanded = false, steps = [], metrics = [] }) {
  const StatusIcon = status === "complete" ? CheckCircle2 : status === "active" ? Loader2 : CircleDot;
  const statusLabel = status === "complete" ? "Done" : status === "active" ? "Working" : "Idle";

  return (
    <section className={`agent-accordion ${status}`}>
      <button className="agent-accordion-button" type="button" aria-expanded={expanded}>
        <span className={`agent-state-mark ${status}`}>
          <StatusIcon size={14} className={status === "active" ? "spin" : ""} />
        </span>
        <span className="agent-heading">
          <strong>{name}</strong>
          <span>{role}</span>
        </span>
        <span className={`agent-status-pill ${status}`}>{statusLabel}</span>
        <ChevronRight size={14} className={`agent-accordion-chevron ${expanded ? "expanded" : ""}`} />
      </button>
      <p className="agent-latest">{summary}</p>
      {expanded && (
        <div className="agent-accordion-panel">
          <ol className="agent-step-list">
            {steps.map(([title, copy], index) => {
              const isCurrent = status === "active" && index === steps.length - 1;
              return (
                <li key={title} className={isCurrent ? "current" : "done"}>
                  <span>{isCurrent ? <Loader2 size={12} className="spin" /> : <CheckCircle2 size={12} />}</span>
                  <div>
                    <strong>{title}</strong>
                    <small>{copy}</small>
                  </div>
                </li>
              );
            })}
          </ol>
          {metrics.length > 0 && (
            <div className="agent-metrics-grid">
              {metrics.map(([label, value]) => (
                <div className="agent-metric" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          )}
          {status === "active" && (
            <div className="agent-live-note">
              <Activity size={13} />
              <span>Open span is still collecting signals</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
