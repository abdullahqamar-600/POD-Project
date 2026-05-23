import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRightLeft,
  BadgeCheck,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CheckCircle2,
  CircleDot,
  ClipboardCheck,
  Download,
  FileText,
  History,
  Home,
  Inbox,
  Loader2,
  Lock,
  MessageCircle,
  MoreHorizontal,
  PanelRightClose,
  PanelRightOpen,
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
import "./styles.css";
import DesignSystemGallery from "./DesignSystemGallery.jsx";
import bankOfAmericaLogo from "./assets/bank-of-america.png";
import chaseLogo from "./assets/chase.png";
import wellsFargoLogo from "./assets/wells-fargo.png";

const banks = [
  {
    id: "chase",
    name: "Chase Operating",
    shortName: "Chase",
    mark: "C",
    brandClass: "chase",
    logo: chaseLogo,
    account: "Account 4419",
    statement: "chase-operating-may-2026.pdf",
    ledger: "yardi-chase-operating-may.csv",
    transactions: 142,
    inflow: "$284,920.14",
    outflow: "$231,504.92",
    balance: "$986,421.08",
    confidence: "98%",
    type: "Operating"
  },
  {
    id: "wells",
    name: "Wells Fargo Reserve",
    shortName: "Wells Fargo",
    mark: "WF",
    brandClass: "wells",
    logo: wellsFargoLogo,
    account: "Account 8821",
    statement: "wf-reserve-may-2026.pdf",
    ledger: "yardi-wf-reserve-may.csv",
    transactions: 37,
    inflow: "$42,200.00",
    outflow: "$15,948.44",
    balance: "$318,905.63",
    confidence: "96%",
    type: "Reserve"
  },
  {
    id: "boa",
    name: "Bank of America Deposits",
    shortName: "BofA",
    mark: "B",
    brandClass: "boa",
    logo: bankOfAmericaLogo,
    account: "Account 1187",
    statement: "boa-security-deposits-may.pdf",
    ledger: "yardi-boa-deposits-may.csv",
    transactions: 58,
    inflow: "$61,833.20",
    outflow: "$18,104.10",
    balance: "$140,772.42",
    confidence: "94%",
    type: "Deposits"
  }
];

const reconciliationSeed = {
  chase: {
    statementTotal: "$516,425.06",
    ledgerTotal: "$516,382.56",
    netDifference: "$42.50",
    matchRate: "96%",
    approved: [
      {
        id: "ch-ap-1",
        title: "Rent batch deposit",
        date: "May 3",
        amount: "$18,425.00",
        meta: "ACH credit APPFOLIO PMTS 940112",
        confidence: "High",
        reason: "Amount equals AR batch 7832. Bank posting is one business day after the deposit date.",
        evidence: ["Amount match", "Deposit #19244", "Post month May 2026"],
        comments: []
      },
      {
        id: "ch-ap-2",
        title: "Metro Plumbing check",
        date: "May 8",
        amount: "-$2,318.44",
        meta: "Check #104872",
        confidence: "High",
        reason: "Exact check number and amount match the posted AP payment.",
        evidence: ["Check #104872", "Invoice MP-5581", "Vendor match"],
        comments: []
      },
      {
        id: "ch-ap-3",
        title: "Owner distribution ACH",
        date: "May 14",
        amount: "-$12,000.00",
        meta: "ACH owner draw batch",
        confidence: "Medium",
        reason: "ACH total matches the approved owner distribution batch with the same effective date.",
        evidence: ["Batch #4412", "Owner module", "Effective date match"],
        comments: []
      }
    ],
    exceptions: [
      {
        id: "ch-ex-1",
        title: "Analysis service charge",
        date: "May 31",
        amount: "-$42.50",
        meta: "Bank fee not found in books",
        confidence: "Medium",
        reason: "Bank-initiated fee has no current-period GL entry.",
        evidence: ["Statement line present", "No matching cash GL entry", "Likely bank fees expense"],
        comments: [
          {
            author: "Exception Agent",
            copy: "Suggested action: create a bank-fee adjustment before close.",
            at: "now"
          }
        ]
      },
      {
        id: "ch-ex-2",
        title: "ACH trace format mismatch",
        date: "May 22",
        amount: "$4,880.00",
        meta: "Trace 22490177",
        confidence: "Low",
        reason: "Amount matches a ledger receipt, but the ACH trace format differs from prior Chase imports.",
        evidence: ["Amount match", "Trace mismatch", "Tenant receipt #663118"],
        comments: []
      }
    ]
  },
  wells: {
    statementTotal: "$58,148.44",
    ledgerTotal: "$58,148.44",
    netDifference: "$0.00",
    matchRate: "98%",
    approved: [
      {
        id: "wf-ap-1",
        title: "Reserve transfer in",
        date: "May 6",
        amount: "$30,000.00",
        meta: "Wire from operating",
        confidence: "High",
        reason: "Wire amount and counterparty match the reserve transfer entry.",
        evidence: ["Transfer memo", "Cash GL match", "Bank account match"],
        comments: []
      },
      {
        id: "wf-ap-2",
        title: "Roof reserve invoice",
        date: "May 16",
        amount: "-$8,948.44",
        meta: "EFT RIVERSTONE ROOFING",
        confidence: "High",
        reason: "Vendor, amount, and EFT date match the posted payable.",
        evidence: ["Vendor match", "Invoice RR-7781", "EFT #88042"],
        comments: []
      }
    ],
    exceptions: [
      {
        id: "wf-ex-1",
        title: "Deposit date cutoff",
        date: "Jun 1",
        amount: "$7,880.00",
        meta: "May books, June bank",
        confidence: "Medium",
        reason: "Ledger deposit is posted to May, but bank posting landed on June 1.",
        evidence: ["Deposit date May 31", "Bank date Jun 1", "Timing item"],
        comments: []
      }
    ]
  },
  boa: {
    statementTotal: "$79,937.30",
    ledgerTotal: "$78,687.30",
    netDifference: "$1,250.00",
    matchRate: "93%",
    approved: [
      {
        id: "bo-ap-1",
        title: "Security deposit batch",
        date: "May 4",
        amount: "$9,600.00",
        meta: "Tenant deposit batch #519",
        confidence: "High",
        reason: "Bank deposit equals the security deposit batch total across four units.",
        evidence: ["Batch #519", "Trust ledger match", "Amount match"],
        comments: []
      },
      {
        id: "bo-ap-2",
        title: "Refund check cleared",
        date: "May 19",
        amount: "-$1,825.00",
        meta: "Check #22091",
        confidence: "High",
        reason: "Check number, amount, and resident name match the ledger refund.",
        evidence: ["Check #22091", "Resident match", "Clear date match"],
        comments: []
      },
      {
        id: "bo-ap-3",
        title: "Interest income",
        date: "May 31",
        amount: "$33.20",
        meta: "Monthly interest",
        confidence: "Medium",
        reason: "Interest line matches the recurring bank interest rule for deposit accounts.",
        evidence: ["Recurring rule", "Amount within tolerance", "Cash GL match"],
        comments: []
      }
    ],
    exceptions: [
      {
        id: "bo-ex-1",
        title: "NSF tenant payment",
        date: "May 12",
        amount: "-$1,250.00",
        meta: "Return item check 8812",
        confidence: "Medium",
        reason: "Bank reversal matches a tenant receipt, but the ledger has not posted an NSF reversal.",
        evidence: ["Check #8812", "Receipt #662901", "No reversal entry"],
        comments: []
      },
      {
        id: "bo-ex-2",
        title: "Duplicate receipt risk",
        date: "May 24",
        amount: "$2,400.00",
        meta: "Two ledger receipts share one bank reference",
        confidence: "Low",
        reason: "Two tenant receipts have the same bank reference and could duplicate one deposit.",
        evidence: ["Reference 843900", "Two receipt IDs", "Same amount"],
        comments: []
      }
    ]
  }
};

const sessionsSeed = [
  {
    id: "ses-1",
    property: "The Meridian",
    cycle: "May 2026",
    status: "Draft",
    detail: "3 banks need statements"
  },
  {
    id: "ses-2",
    property: "Oakline Lofts",
    cycle: "May 2026",
    status: "Parsing",
    detail: "2 pairs normalizing"
  },
  {
    id: "ses-3",
    property: "Harbor Court",
    cycle: "April 2026",
    status: "Needs input",
    detail: "Ledger missing"
  },
  {
    id: "ses-4",
    property: "Northstar Plaza",
    cycle: "April 2026",
    status: "Ready for handoff",
    detail: "Picked up by agent"
  }
];

const properties = [
  {
    id: "meridian",
    name: "The Meridian",
    address: "1849 Westlake Ave",
    banks: 3,
    units: 214
  },
  {
    id: "oakline",
    name: "Oakline Lofts",
    address: "22 North Canal",
    banks: 2,
    units: 88
  },
  {
    id: "harbor",
    name: "Harbor Court",
    address: "710 Bay Street",
    banks: 4,
    units: 132
  }
];

const automationSteps = [
  {
    key: "yardi-queued",
    type: "system",
    title: "Yardi import requested",
    copy: "Browser automation queued",
    duration: 900
  },
  {
    key: "yardi-login",
    type: "system",
    title: "Yardi session running",
    copy: "Opening property ledger search",
    duration: 1100
  },
  {
    key: "ledgers-found",
    type: "system",
    title: "Ledgers imported",
    copy: "One ledger mapped to each statement",
    duration: 1100
  },
  {
    key: "parsing-started",
    type: "agent",
    title: "Parsing Agent started",
    copy: "Understanding statement-ledger pairs in parallel",
    duration: 1000
  },
  {
    key: "normalizing-chase",
    type: "agent",
    bankId: "chase",
    title: "Understanding Chase Operating",
    copy: "Normalizing statement and ledger fields",
    duration: 1300
  },
  {
    key: "normalizing-wells",
    type: "agent",
    bankId: "wells",
    title: "Understanding Wells Fargo Reserve",
    copy: "Resolving dates, deposits, and withdrawals",
    duration: 1300
  },
  {
    key: "normalizing-boa",
    type: "agent",
    bankId: "boa",
    title: "Understanding Bank of America Deposits",
    copy: "Structuring transaction history",
    duration: 1300
  },
  {
    key: "artifacts-saved",
    type: "system",
    title: "Artifact history saved",
    copy: "Normalized files stored locally",
    duration: 900
  },
  {
    key: "handoff",
    type: "agent",
    title: "Reconciliation Agent picked up inputs",
    copy: "Preparing statement-ledger comparisons",
    duration: 800
  }
];

const yardiUpdateSteps = [
  "Verifying target records in Yardi",
  "Posting approved records",
  "Flagging exceptions",
  "Preparing report package"
];

function App() {
  const [selectedSession, setSelectedSession] = useState("ses-1");
  const [sessions, setSessions] = useState(sessionsSeed);
  const [activeView, setActiveView] = useState("workspace");
  const [railOpen, setRailOpen] = useState(true);
  const [manageOpen, setManageOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(properties[0]);
  const [cycle] = useState("May 2026");
  const [uploaded, setUploaded] = useState({});
  const [excluded, setExcluded] = useState({});
  const [events, setEvents] = useState([
    {
      id: "welcome",
      type: "system",
      title: "Session ready",
      copy: "Upload each associated bank statement",
      at: "now"
    }
  ]);
  const [runState, setRunState] = useState("draft");
  const [activeStep, setActiveStep] = useState(null);
  const [bankStage, setBankStage] = useState(
    Object.fromEntries(banks.map((bank) => [bank.id, "waiting"]))
  );
  const [comparisonProgress, setComparisonProgress] = useState(
    Object.fromEntries(banks.map((bank) => [bank.id, 0]))
  );
  const [rowExpanded, setRowExpanded] = useState({});
  const [recordsByBank, setRecordsByBank] = useState(createRecordState);
  const [reviewBankId, setReviewBankId] = useState(null);
  const [yardiProgress, setYardiProgress] = useState(0);
  const [yardiStepIndex, setYardiStepIndex] = useState(0);

  const includedBanks = banks.filter((bank) => !excluded[bank.id]);
  const unresolvedBanks = includedBanks.filter((bank) => !uploaded[bank.id]);
  const canStart =
    runState === "draft" && includedBanks.length > 0 && unresolvedBanks.length === 0;
  const reviewBank = banks.find((bank) => bank.id === reviewBankId);
  const runTotals = getRunTotals(recordsByBank);

  useEffect(() => {
    if (runState !== "running") return;

    let cancelled = false;
    let timer;

    const run = async () => {
      for (const step of automationSteps) {
        if (cancelled) return;
        setActiveStep(step);
        setEvents((current) => [
          ...current,
          {
            id: `${step.key}-${Date.now()}`,
            type: step.type,
            title: step.title,
            copy: step.copy,
            at: "now"
          }
        ]);

        if (step.key === "yardi-queued") {
          setSessions((current) =>
            current.map((session) =>
              session.id === selectedSession
                ? { ...session, status: "Importing", detail: "Yardi automation queued" }
                : session
            )
          );
          setBankStage((current) => updateAllIncluded(current, excluded, "ledger-importing"));
        }

        if (step.key === "ledgers-found") {
          setBankStage((current) => updateAllIncluded(current, excluded, "ledger-imported"));
        }

        if (step.key === "parsing-started") {
          setSessions((current) =>
            current.map((session) =>
              session.id === selectedSession
                ? { ...session, status: "Parsing", detail: "3 pairs normalizing" }
                : session
            )
          );
          setBankStage((current) => updateAllIncluded(current, excluded, "parsing"));
        }

        if (step.bankId) {
          setBankStage((current) => ({ ...current, [step.bankId]: "normalizing" }));
        }

        if (step.key === "artifacts-saved") {
          setBankStage((current) => updateAllIncluded(current, excluded, "normalized"));
        }

        if (step.key === "handoff") {
          setRunState("reconciling");
          setSessions((current) =>
            current.map((session) =>
              session.id === selectedSession
                ? { ...session, status: "Reconciling", detail: "Scanning normalized inputs" }
                : session
            )
          );
          setBankStage((current) => updateAllIncluded(current, excluded, "scanning"));
        }

        await new Promise((resolve) => {
          timer = window.setTimeout(resolve, step.duration);
        });
      }
    };

    run();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [excluded, runState, selectedSession]);

  useEffect(() => {
    if (runState !== "reconciling") return;

    setComparisonProgress(Object.fromEntries(banks.map((bank) => [bank.id, 0])));
    setBankStage((current) => updateAllIncluded(current, excluded, "comparing"));
    setActiveStep({
      key: "comparison",
      type: "agent",
      title: "Reconciliation Agent comparing ledgers",
      copy: "Matching statements with Yardi records in parallel"
    });
    setEvents((current) => [
      ...current,
      {
        id: `compare-${Date.now()}`,
        type: "agent",
        title: "Reconciliation Agent started",
        copy: "Parallel statement-ledger comparison running",
        at: "now"
      }
    ]);

    const progressTimer = window.setInterval(() => {
      setComparisonProgress((current) =>
        banks.reduce(
          (next, bank, index) => ({
            ...next,
            [bank.id]: excluded[bank.id]
              ? 0
              : Math.min(96, (current[bank.id] || 0) + 7 + index)
          }),
          {}
        )
      );
    }, 420);

    const finishTimer = window.setTimeout(() => {
      const totals = getRunTotals(recordsByBank);
      const includedAtFinish = banks.filter((bank) => !excluded[bank.id]);
      setComparisonProgress(Object.fromEntries(banks.map((bank) => [bank.id, 100])));
      setRunState("review");
      setRowExpanded(Object.fromEntries(includedAtFinish.map((bank) => [bank.id, true])));
      setBankStage((current) => updateAllIncluded(current, excluded, "review"));
      setSessions((current) =>
        current.map((session) =>
          session.id === selectedSession
            ? {
                ...session,
                status: "Needs review",
                detail: `${totals.exceptions} exceptions prepared`
              }
            : session
        )
      );
      setActiveStep({
        key: "exception-agent",
        type: "agent",
        title: "Exception Agent prepared summaries",
        copy: "Approved records and exceptions are ready for review"
      });
      setEvents((current) => [
        ...current,
        {
          id: `exception-agent-${Date.now()}`,
          type: "agent",
          title: "Exception Agent opened review",
          copy: `${totals.approved} approved records, ${totals.exceptions} exceptions`,
          at: "now"
        }
      ]);
    }, 5400);

    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(finishTimer);
    };
  }, [excluded, recordsByBank, runState, selectedSession]);

  useEffect(() => {
    if (runState !== "updating-yardi") return;

    setYardiProgress(0);
    setYardiStepIndex(0);
    setActiveStep({
      key: "yardi-update",
      type: "system",
      title: "Yardi update running",
      copy: yardiUpdateSteps[0]
    });
    setEvents((current) => [
      ...current,
      {
        id: `yardi-update-${Date.now()}`,
        type: "system",
        title: "Yardi automation started",
        copy: "Approved records and exceptions are being updated",
        at: "now"
      }
    ]);

    const progressTimer = window.setInterval(() => {
      setYardiProgress((current) => {
        const next = Math.min(96, current + 8);
        setYardiStepIndex(Math.min(yardiUpdateSteps.length - 1, Math.floor(next / 26)));
        setActiveStep({
          key: "yardi-update",
          type: "system",
          title: "Yardi update running",
          copy: yardiUpdateSteps[Math.min(yardiUpdateSteps.length - 1, Math.floor(next / 26))]
        });
        return next;
      });
    }, 460);

    const finishTimer = window.setTimeout(() => {
      const totals = getRunTotals(recordsByBank);
      setYardiProgress(100);
      setYardiStepIndex(yardiUpdateSteps.length - 1);
      setRunState("complete");
      setBankStage((current) => updateAllIncluded(current, excluded, "complete"));
      setSessions((current) =>
        current.map((session) =>
          session.id === selectedSession
            ? {
                ...session,
                status: "Complete",
                detail: `${totals.exceptions} exceptions flagged`
              }
            : session
        )
      );
      setActiveStep({
        key: "summary-agent",
        type: "agent",
        title: "Summary and Reports Agent finished",
        copy: "Final summary and report artifacts are ready"
      });
      setEvents((current) => [
        ...current,
        {
          id: `summary-${Date.now()}`,
          type: "agent",
          title: "Summary and Reports Agent finished",
          copy: "Session standing and artifacts are ready",
          at: "now"
        }
      ]);
    }, 5600);

    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(finishTimer);
    };
  }, [excluded, recordsByBank, runState, selectedSession]);

  function startRun() {
    if (!canStart) return;
    setRunState("running");
    setEvents((current) => [
      ...current,
      {
        id: `start-${Date.now()}`,
        type: "user",
        title: "Start Reconcile from Yardi",
        copy: "Inputs locked for this session",
        at: "now"
      }
    ]);
  }

  function uploadStatement(bankId) {
    if (runState !== "draft") return;
    setUploaded((current) => ({ ...current, [bankId]: true }));
    setBankStage((current) => ({ ...current, [bankId]: "statement-ready" }));
    const bank = banks.find((item) => item.id === bankId);
    setEvents((current) => [
      ...current,
      {
        id: `upload-${bankId}-${Date.now()}`,
        type: "user",
        title: "Statement uploaded",
        copy: bank.name,
        at: "now"
      }
    ]);
  }

  function markNotUsed(bankId) {
    if (runState !== "draft") return;
    setExcluded((current) => ({ ...current, [bankId]: !current[bankId] }));
    setUploaded((current) => {
      const next = { ...current };
      delete next[bankId];
      return next;
    });
    setBankStage((current) => ({ ...current, [bankId]: "excluded" }));
    const bank = banks.find((item) => item.id === bankId);
    setEvents((current) => [
      ...current,
      {
        id: `exclude-${bankId}-${Date.now()}`,
        type: "system",
        title: "Bank marked not used",
        copy: bank.name,
        at: "now"
      }
    ]);
  }

  function toggleRow(bankId) {
    if (!["review", "updating-yardi", "complete"].includes(runState)) return;
    setRowExpanded((current) => ({ ...current, [bankId]: !current[bankId] }));
  }

  function openReview(bankId) {
    if (!["review", "complete"].includes(runState)) return;
    setReviewBankId(bankId);
  }

  function moveRecord(bankId, fromList, recordId) {
    setRecordsByBank((current) => {
      const toList = fromList === "approved" ? "exceptions" : "approved";
      const source = current[bankId][fromList];
      const record = source.find((item) => item.id === recordId);
      if (!record) return current;

      return {
        ...current,
        [bankId]: {
          ...current[bankId],
          [fromList]: source.filter((item) => item.id !== recordId),
          [toList]: [
            {
              ...record,
              comments: [
                ...record.comments,
                {
                  author: "You",
                  copy:
                    toList === "approved"
                      ? "Moved to approved after reviewer feedback."
                      : "Moved to exceptions for follow-up.",
                  at: "now"
                }
              ]
            },
            ...current[bankId][toList]
          ]
        }
      };
    });
  }

  function moveSelectedRecords(bankId, fromList, recordIds) {
    if (recordIds.length === 0) return;
    const toList = fromList === "approved" ? "exceptions" : "approved";
    setRecordsByBank((current) => {
      const selected = current[bankId][fromList].filter((record) => recordIds.includes(record.id));
      return {
        ...current,
        [bankId]: {
          ...current[bankId],
          [fromList]: current[bankId][fromList].filter((record) => !recordIds.includes(record.id)),
          [toList]: [
            ...selected.map((record) => ({
              ...record,
              comments: [
                ...record.comments,
                {
                  author: "You",
                  copy:
                    toList === "approved"
                      ? "Moved to approved in bulk review."
                      : "Moved to exceptions in bulk review.",
                  at: "now"
                }
              ]
            })),
            ...current[bankId][toList]
          ]
        }
      };
    });
  }

  function addRecordComment(bankId, listKey, recordId, comment) {
    const cleanComment = comment.trim();
    if (!cleanComment) return;
    setRecordsByBank((current) => ({
      ...current,
      [bankId]: {
        ...current[bankId],
        [listKey]: current[bankId][listKey].map((record) =>
          record.id === recordId
            ? {
                ...record,
                guidanceCaptured: true,
                comments: [
                  ...record.comments,
                  {
                    author: "You",
                    copy: cleanComment,
                    at: "now"
                  }
                ]
              }
            : record
        )
      }
    }));
  }

  function startYardiUpdate() {
    if (runState !== "review") return;
    setReviewBankId(null);
    setRunState("updating-yardi");
    setSessions((current) =>
      current.map((session) =>
        session.id === selectedSession
          ? { ...session, status: "Updating", detail: "Posting to Yardi" }
          : session
      )
    );
    setEvents((current) => [
      ...current,
      {
        id: `submit-yardi-${Date.now()}`,
        type: "user",
        title: "Approved Yardi update",
        copy: "Approved records will be sent and exceptions flagged",
        at: "now"
      }
    ]);
  }

  function createSession() {
    const id = `ses-${sessions.length + 1}`;
    const next = {
      id,
      property: selectedProperty.name,
      cycle,
      status: "Draft",
      detail: "New workspace"
    };
    setSessions((current) => [next, ...current]);
    setSelectedSession(id);
    setActiveView("workspace");
    setUploaded({});
    setExcluded({});
    setRowExpanded({});
    setRecordsByBank(createRecordState());
    setComparisonProgress(Object.fromEntries(banks.map((bank) => [bank.id, 0])));
    setReviewBankId(null);
    setYardiProgress(0);
    setYardiStepIndex(0);
    setEvents([
      {
        id: "new-session",
        type: "system",
        title: "New session created",
        copy: "Reconciliation workspace opened",
        at: "now"
      }
    ]);
    setRunState("draft");
    setBankStage(Object.fromEntries(banks.map((bank) => [bank.id, "waiting"])));
    setActiveStep(null);
  }

  return (
    <div className="app-shell">
      <Sidebar
        sessions={sessions}
        selectedSession={selectedSession}
        setSelectedSession={setSelectedSession}
        onNewSession={createSession}
        activeView={activeView}
        setActiveView={setActiveView}
      />
      <main className={`workspace ${activeView === "design-system" ? "design-system-workspace" : ""}`}>
        <TopBar
          selectedProperty={selectedProperty}
          runState={runState}
          railOpen={railOpen}
          setRailOpen={setRailOpen}
          activeView={activeView}
        />
        {activeView === "workspace" ? (
          <section className="session-canvas">
            <div className="session-header">
              <div>
                <p className="eyebrow">Reconciliation workspace</p>
                <h1>{selectedProperty.name}</h1>
                <p className="subtle">Prepare bank statements, import Yardi ledgers, then hand off to the Reconciliation Agent.</p>
                <div className="cycle-line">
                  <CalendarDays size={14} />
                  <span>{cycle}</span>
                </div>
              </div>
              <div className="header-actions">
                <button className="soft-button" onClick={() => setManageOpen(true)}>
                  <Settings size={16} />
                  Manage properties
                </button>
                <button
                  className={`primary-button ${runState !== "draft" ? "is-running" : ""}`}
                  disabled={!canStart}
                  onClick={startRun}
                >
                  {runState === "draft" ? (
                    <Sparkles size={16} />
                  ) : runState === "complete" ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <Loader2 size={16} className="spin" />
                  )}
                  {runState === "draft"
                    ? "Start Reconcile from Yardi"
                    : runState === "running"
                      ? "Importing and parsing"
                      : runState === "reconciling"
                        ? "Reconciling"
                        : runState === "review"
                          ? "Review ready"
                          : runState === "updating-yardi"
                            ? "Updating Yardi"
                            : "Complete"}
                </button>
              </div>
            </div>

            <ProcessStatus
              runState={runState}
              runTotals={runTotals}
              yardiProgress={yardiProgress}
              yardiStepIndex={yardiStepIndex}
            />

            <BankBoard
              uploaded={uploaded}
              excluded={excluded}
              bankStage={bankStage}
              activeStep={activeStep}
              runState={runState}
              recordsByBank={recordsByBank}
              comparisonProgress={comparisonProgress}
              rowExpanded={rowExpanded}
              onUpload={uploadStatement}
              onExclude={markNotUsed}
              onToggleRow={toggleRow}
              onOpenReview={openReview}
            />

            {runState === "review" && (
              <ReviewSubmitBar runTotals={runTotals} onSubmit={startYardiUpdate} />
            )}
          </section>
        ) : (
          <DesignSystemGallery banks={banks} recordsByBank={recordsByBank} runTotals={runTotals} />
        )}
      </main>

      <ObservabilityRail
        open={railOpen}
        events={events}
        runState={runState}
        runTotals={runTotals}
        activeStep={activeStep}
        yardiProgress={yardiProgress}
        yardiStepIndex={yardiStepIndex}
      />

      <ReviewModal
        bank={reviewBank}
        records={reviewBank ? recordsByBank[reviewBank.id] : null}
        open={Boolean(reviewBank)}
        onClose={() => setReviewBankId(null)}
        onMove={moveRecord}
        onMoveSelected={moveSelectedRecords}
        onComment={addRecordComment}
      />

      <PropertyDrawer
        open={manageOpen}
        setOpen={setManageOpen}
        properties={properties}
        selectedProperty={selectedProperty}
        setSelectedProperty={setSelectedProperty}
      />
    </div>
  );
}

function updateAllIncluded(current, excluded, stage) {
  return banks.reduce(
    (acc, bank) => ({
      ...acc,
      [bank.id]: excluded[bank.id] ? "excluded" : stage
    }),
    current
  );
}

function createRecordState() {
  return JSON.parse(JSON.stringify(reconciliationSeed));
}

function getRunTotals(recordsByBank) {
  return banks.reduce(
    (totals, bank) => {
      const records = recordsByBank[bank.id];
      return {
        banks: totals.banks + 1,
        approved: totals.approved + records.approved.length,
        exceptions: totals.exceptions + records.exceptions.length
      };
    },
    { banks: 0, approved: 0, exceptions: 0 }
  );
}

function getAgentRailItems({ runState, activeStep, runTotals, yardiProgress, yardiStepIndex }) {
  const totalRecords = runTotals.approved + runTotals.exceptions;
  const matchRate = totalRecords ? Math.round((runTotals.approved / totalRecords) * 100) : 0;
  const intakeComplete = ["reconciling", "review", "updating-yardi", "complete"].includes(runState);
  const reconciliationComplete = ["review", "updating-yardi", "complete"].includes(runState);
  const exceptionComplete = ["updating-yardi", "complete"].includes(runState);
  const postingComplete = runState === "complete";

  const intakeStatus = runState === "running" ? "active" : intakeComplete ? "complete" : "idle";
  const reconciliationStatus =
    runState === "reconciling" ? "active" : reconciliationComplete ? "complete" : "idle";
  const exceptionStatus = runState === "review" ? "active" : exceptionComplete ? "complete" : "idle";
  const postingStatus = runState === "updating-yardi" ? "active" : postingComplete ? "complete" : "idle";

  const intakeTimeline = [
    { title: "Yardi ledgers found", copy: "Ledger files paired with uploaded statements" },
    { title: "Statement fields normalized", copy: "Dates, deposits, withdrawals, and balances aligned" },
    { title: "Source artifacts saved", copy: "Clean inputs stored in artifact history" },
    { title: "Handoff prepared", copy: "Normalized artifacts sent to reconciliation" }
  ];
  const intakeVisibleCount =
    {
      "yardi-queued": 1,
      "yardi-login": 1,
      "ledgers-found": 1,
      "parsing-started": 2,
      "normalizing-chase": 2,
      "normalizing-wells": 2,
      "normalizing-boa": 2,
      "artifacts-saved": 3,
      handoff: 4
    }[activeStep?.key] || 1;

  const reconciliationTimeline = [
    { title: "Comparison spans opened", copy: "Statement rows matched against Yardi ledger rows" },
    { title: "Variance checks completed", copy: "Amounts, dates, and references scored in parallel" },
    { title: "Buckets generated", copy: "Approved records and exceptions separated for review" }
  ];

  const exceptionTimeline = [
    { title: "Review summary assembled", copy: "Approved records and exceptions grouped by bank" },
    { title: "Agent reasoning attached", copy: "Evidence chips and match rationale stored per record" },
    { title: "Reviewer guidance captured", copy: "Corrections remain attached to the session output" }
  ];

  const postingTimeline = yardiUpdateSteps.map((step) => ({
    title: step,
    copy:
      step === "Preparing report package"
        ? "Report artifacts and update log are generated"
        : "Approved records and exception flags are applied"
  }));

  return [
    {
      id: "intake",
      name: "Intake Agent",
      role: "Imports ledgers and normalizes statements",
      status: intakeStatus,
      latest:
        intakeStatus === "active"
          ? activeStep?.copy || "Reading statement-ledger pairs"
          : intakeStatus === "complete"
            ? "Normalized artifacts passed to Reconciliation Agent."
            : "Waiting for statement uploads.",
      output: "Normalized artifacts generated and passed to Reconciliation Agent.",
      timeline: timelineForStatus(intakeStatus, intakeTimeline, intakeVisibleCount),
      metrics: [
        { label: "Duration", value: "6.4s" },
        { label: "Input pairs", value: runTotals.banks },
        { label: "Parse issues", value: "0" },
        { label: "Schema confidence", value: "98%" }
      ]
    },
    {
      id: "reconciliation",
      name: "Reconciliation Agent",
      role: "Matches statement rows to Yardi records",
      status: reconciliationStatus,
      latest:
        reconciliationStatus === "active"
          ? activeStep?.copy || "Matching statements with Yardi records"
          : reconciliationStatus === "complete"
            ? "Match buckets passed to Exception Agent."
            : "Waiting for normalized artifacts.",
      output: "Approved and exception buckets generated for Exception Agent review.",
      timeline: timelineForStatus(reconciliationStatus, reconciliationTimeline, 2),
      metrics: [
        { label: "Duration", value: "5.4s" },
        { label: "Records checked", value: totalRecords },
        { label: "Match rate", value: `${matchRate}%` },
        { label: "Exceptions", value: runTotals.exceptions }
      ]
    },
    {
      id: "exceptions",
      name: "Exception Agent",
      role: "Explains exceptions and captures guidance",
      status: exceptionStatus,
      latest:
        exceptionStatus === "active"
          ? activeStep?.copy || "Waiting for reviewer decision"
          : exceptionStatus === "complete"
            ? "Reviewed package passed to Posting Agent."
            : "Waiting for comparison results.",
      output: "Review package prepared and passed to Posting Agent for Yardi update.",
      timeline: timelineForStatus(exceptionStatus, exceptionTimeline, 2),
      metrics: [
        { label: "Duration", value: "0.8s" },
        { label: "Records reviewed", value: totalRecords },
        { label: "Guidance captured", value: "1 note" },
        { label: "Corrections", value: "1 move" }
      ]
    },
    {
      id: "posting",
      name: "Posting Agent",
      role: "Applies Yardi updates and builds reports",
      status: postingStatus,
      latest:
        postingStatus === "active"
          ? activeStep?.copy || yardiUpdateSteps[yardiStepIndex]
          : postingStatus === "complete"
            ? "Yardi updates and report artifacts are ready."
            : "Waiting for reviewed output.",
      output: "Yardi updates, exception flags, and report artifacts generated.",
      timeline: timelineForStatus(postingStatus, postingTimeline, Math.max(1, yardiStepIndex + 1)),
      metrics: [
        { label: "Duration", value: "5.6s" },
        { label: "Posted records", value: runTotals.approved },
        { label: "Flagged exceptions", value: runTotals.exceptions },
        { label: "Post failures", value: "0" }
      ],
      progress: yardiProgress
    }
  ];
}

function timelineForStatus(status, timeline, activeCount) {
  if (status === "idle") return [];
  if (status === "active") return timeline.slice(0, Math.max(1, activeCount));
  return timeline;
}

function getComparisonCopy(bank, runState, progress, records) {
  if (runState === "complete") return `${bank.shortName} is included in the final report package`;
  if (runState === "updating-yardi") return `${bank.shortName} records are being posted and flagged in Yardi`;
  if (runState === "review") {
    return `${bank.shortName} summary ready: ${records.approved.length} approved, ${records.exceptions.length} exceptions`;
  }
  if (progress < 32) return `Comparing ${bank.shortName} statement totals with Yardi ledger totals`;
  if (progress < 68) return `Matching ${bank.shortName} amounts, dates, references, and post month`;
  return `Separating ${bank.shortName} approved records from exceptions`;
}

function Sidebar({
  sessions,
  selectedSession,
  setSelectedSession,
  onNewSession,
  activeView,
  setActiveView
}) {
  const [sessionSearchOpen, setSessionSearchOpen] = useState(false);
  const [sessionQuery, setSessionQuery] = useState("");
  const visibleSessions = sessions.filter((session) => {
    const query = sessionQuery.trim().toLowerCase();
    if (!query) return true;
    return [session.property, session.cycle, session.status, session.detail]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  function toggleSessionSearch() {
    setSessionSearchOpen((open) => {
      if (open) setSessionQuery("");
      return !open;
    });
  }

  return (
    <aside className="sidebar">
      <div className="brand-row">
        <div className="brand-mark">R</div>
        <span>Recon</span>
        <button className="icon-button ghost" aria-label="Collapse sidebar">
          <ChevronLeft size={16} />
        </button>
      </div>
      <button className="new-session" onClick={onNewSession}>
        <Plus size={16} />
        New session
      </button>
      <nav className="nav-links" aria-label="Primary">
        <button
          type="button"
          className={activeView === "workspace" ? "active" : ""}
          onClick={() => setActiveView("workspace")}
        >
          <Inbox size={16} />
          Sessions
        </button>
        <button
          type="button"
          className={activeView === "design-system" ? "active" : ""}
          onClick={() => setActiveView("design-system")}
        >
          <Sparkles size={16} />
          Design system
        </button>
        <a href="#properties">
          <Building2 size={16} />
          Properties
        </a>
        <a href="#history">
          <History size={16} />
          Artifact history
        </a>
      </nav>
      <div className="sidebar-section">
        <div className="section-label-row">
          <div className="section-label">Running sessions</div>
          <button
            className={`icon-button ghost sidebar-search-toggle ${sessionSearchOpen ? "active" : ""}`}
            type="button"
            aria-label={sessionSearchOpen ? "Hide session search" : "Search running sessions"}
            aria-expanded={sessionSearchOpen}
            onClick={toggleSessionSearch}
          >
            <Search size={15} />
          </button>
        </div>
        <AnimatePresence initial={false}>
          {sessionSearchOpen && (
            <motion.div
              className="session-search-box"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <Search size={15} />
              <input
                autoFocus
                value={sessionQuery}
                onChange={(event) => setSessionQuery(event.target.value)}
                placeholder="Search sessions"
                aria-label="Search running sessions"
              />
              {sessionQuery && (
                <button type="button" onClick={() => setSessionQuery("")} aria-label="Clear session search">
                  <X size={14} />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="session-list">
          {visibleSessions.map((session) => (
            <button
              className={`session-item ${session.id === selectedSession ? "selected" : ""}`}
              key={session.id}
              onClick={() => {
                setSelectedSession(session.id);
                setActiveView("workspace");
              }}
            >
              <strong>{session.property}</strong>
              <StatusPill status={session.status} />
            </button>
          ))}
          {visibleSessions.length === 0 && <div className="session-empty">No sessions found</div>}
        </div>
      </div>
      <div className="sidebar-footer">
        <div>
          <strong>Controls</strong>
          <span>Prototype mode</span>
        </div>
        <button className="icon-button" aria-label="More controls">
          <MoreHorizontal size={17} />
        </button>
      </div>
    </aside>
  );
}

function TopBar({ selectedProperty, runState, railOpen, setRailOpen, activeView }) {
  return (
    <header className="topbar">
      <div className="breadcrumb">
        <Home size={15} />
        <span>Dashboard</span>
        <ChevronRight size={14} />
        <span>{activeView === "design-system" ? "Design system" : selectedProperty.name}</span>
      </div>
      <div className="topbar-actions">
        <span className={`run-dot ${runState}`}>
          <Activity size={14} />
          {activeView === "design-system"
            ? "System map"
            : runState === "draft"
              ? "Draft"
              : runState === "running"
                ? "Running"
                : runState === "reconciling"
                  ? "Reconciling"
                  : runState === "review"
                    ? "Review"
                    : runState === "updating-yardi"
                      ? "Updating"
                      : "Complete"}
        </span>
        <button className="icon-button rail-toggle" onClick={() => setRailOpen(!railOpen)} aria-label="Toggle observability rail">
          {railOpen ? <PanelRightClose size={17} /> : <PanelRightOpen size={17} />}
        </button>
      </div>
    </header>
  );
}

function BankBoard({
  uploaded,
  excluded,
  bankStage,
  activeStep,
  runState,
  recordsByBank,
  comparisonProgress,
  rowExpanded,
  onUpload,
  onExclude,
  onToggleRow,
  onOpenReview
}) {
  const comparisonMode = ["reconciling", "review", "updating-yardi", "complete"].includes(runState);

  return (
    <section className="bank-board" aria-label="Associated property banks">
      <div className="board-heading">
        <div>
          <p className="eyebrow">Associated banks</p>
          <h2>{comparisonMode ? "Reconciliation workspace" : "Statement workspace"}</h2>
        </div>
        <span>
          {comparisonMode
            ? "Bank statement and Yardi ledger stay paired through review"
            : "All property banks must be resolved"}
        </span>
      </div>
      <div className={`bank-grid ${comparisonMode ? "comparison-list" : ""}`}>
        {banks.map((bank) => (
          <BankTile
            key={bank.id}
            bank={bank}
            uploaded={uploaded[bank.id]}
            excluded={excluded[bank.id]}
            stage={bankStage[bank.id]}
            active={activeStep?.bankId === bank.id || bankStage[bank.id] === "scanning"}
            runState={runState}
            records={recordsByBank[bank.id]}
            progress={comparisonProgress[bank.id] || 0}
            expanded={rowExpanded[bank.id]}
            onUpload={() => onUpload(bank.id)}
            onExclude={() => onExclude(bank.id)}
            onToggle={() => onToggleRow(bank.id)}
            onOpenReview={() => onOpenReview(bank.id)}
          />
        ))}
      </div>
    </section>
  );
}

function BankTile({
  bank,
  uploaded,
  excluded,
  stage,
  active,
  runState,
  records,
  progress,
  expanded,
  onUpload,
  onExclude,
  onToggle,
  onOpenReview
}) {
  const comparisonMode = ["reconciling", "review", "updating-yardi", "complete"].includes(runState);

  if (comparisonMode) {
    return (
      <ComparisonBankRow
        bank={bank}
        records={records}
        progress={progress}
        stage={stage}
        runState={runState}
        expanded={expanded}
        onToggle={onToggle}
        onOpenReview={onOpenReview}
      />
    );
  }

  const locked = runState !== "draft";
  const uploadActionLabel = excluded
    ? "Statement skipped"
    : uploaded || locked
      ? "Statement locked"
      : "Upload statement";
  const UploadActionIcon = excluded || uploaded || locked ? Lock : Upload;

  return (
    <motion.article
      layout
      className={`bank-tile ${active ? "active" : ""} ${excluded ? "excluded" : ""}`}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {stage === "scanning" && <motion.div className="scan-line" layoutId={`scan-${bank.id}`} />}
      <div className="bank-main-line">
        <div className={`bank-logo ${bank.brandClass}`} aria-hidden="true">
          <img src={bank.logo} alt="" />
        </div>
        <div>
          <strong>{bank.shortName}</strong>
          <span>{bank.type}</span>
        </div>
        <StageBadge stage={stage} excluded={excluded} />
        <button className="micro-button" disabled={locked || excluded || uploaded} onClick={onUpload}>
          <UploadActionIcon size={14} />
          {uploadActionLabel}
        </button>
        <button className="micro-button ghost" disabled={locked} onClick={onExclude}>
          {excluded ? <RefreshCw size={14} /> : <X size={14} />}
          {excluded ? "Include" : "Not used"}
        </button>
        {uploaded && <SummaryHover bank={bank} kind="statement" />}
      </div>
    </motion.article>
  );
}

function ComparisonBankRow({ bank, records, progress, stage, runState, expanded, onToggle, onOpenReview }) {
  const isReviewReady = ["review", "updating-yardi", "complete"].includes(runState);
  const isFinalizing = runState === "updating-yardi";
  const isComplete = runState === "complete";
  const approvedCount = records.approved.length;
  const exceptionCount = records.exceptions.length;
  const liveCopy = getComparisonCopy(bank, runState, progress, records);

  return (
    <motion.article
      layout
      className={`comparison-row ${isReviewReady ? "review-ready" : ""}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="comparison-line">
        <span className={`latest-glyph ${isFinalizing ? "system" : "agent"}`}>
          {isComplete ? <CheckCircle2 size={14} /> : isFinalizing ? <Workflow size={14} /> : <Sparkles size={14} />}
        </span>
        <span>{liveCopy}</span>
      </div>

      <div className="comparison-pair">
        <ComparisonCard
          side="statement"
          logo={bank.logo}
          brandClass={bank.brandClass}
          title={bank.shortName}
          kicker="Bank statement"
          meta={bank.statement}
          count={`${bank.transactions} lines`}
          total={records.statementTotal}
        />
        <ComparisonBridge progress={progress} runState={runState} exceptionCount={exceptionCount} />
        <ComparisonCard
          side="ledger"
          title={`${bank.type} ledger`}
          kicker="Yardi ledger"
          meta={bank.ledger}
          count={`${approvedCount + exceptionCount} records`}
          total={records.ledgerTotal}
        />
      </div>

      {isReviewReady && (
        <div className="row-review-shell">
          <button className="row-expand-button" onClick={onToggle}>
            <span>{expanded ? "Hide summary" : "Show summary"}</span>
            <ChevronRight size={15} className={expanded ? "rotated" : ""} />
          </button>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                className="bank-review-summary"
                initial={{ opacity: 0, gridTemplateRows: "0fr" }}
                animate={{ opacity: 1, gridTemplateRows: "1fr" }}
                exit={{ opacity: 0, gridTemplateRows: "0fr" }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="summary-inner">
                  <div className="summary-stat approved">
                    <BadgeCheck size={16} />
                    <div>
                      <strong>{approvedCount}</strong>
                      <span>Approved records</span>
                    </div>
                  </div>
                  <div className="summary-stat exception">
                    <AlertTriangle size={16} />
                    <div>
                      <strong>{exceptionCount}</strong>
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
                  <button className="soft-button open-review" onClick={onOpenReview} disabled={runState === "updating-yardi"}>
                    <FileText size={15} />
                    Open review
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.article>
  );
}

function ComparisonCard({ side, logo, brandClass, title, kicker, meta, count, total }) {
  return (
    <div className={`comparison-card ${side}`}>
      <div className="comparison-card-top">
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
          <span>{kicker}</span>
          <strong>{title}</strong>
        </div>
      </div>
      <div className="comparison-card-meta">
        <span>{meta}</span>
        <span>{count}</span>
        <strong>{total}</strong>
      </div>
    </div>
  );
}

function ComparisonBridge({ progress, runState, exceptionCount }) {
  const complete = ["review", "updating-yardi", "complete"].includes(runState);
  return (
    <div className={`comparison-bridge ${complete ? "complete" : ""}`}>
      <div className="bridge-track">
        <span className="bridge-pulse one" />
        <span className="bridge-pulse two" />
        <span className="bridge-pulse three" />
      </div>
      <div className="bridge-status">
        {complete ? (
          <>
            <CheckCircle2 size={13} />
            {exceptionCount > 0 ? `${exceptionCount} exceptions` : "Matched"}
          </>
        ) : (
          <>
            <Loader2 size={13} className="spin" />
            {progress}%
          </>
        )}
      </div>
    </div>
  );
}

function SummaryHover({ bank, kind }) {
  return (
    <span className="summary-trigger" tabIndex="0">
      <CircleAlert size={13} />
      <span className="summary-popover">
        <strong>{kind === "statement" ? "Parsed statement summary" : "Ledger summary"}</strong>
        <span>{bank.type}</span>
        <span>{bank.transactions} transactions</span>
        <span>Inflow {bank.inflow}</span>
        <span>Outflow {bank.outflow}</span>
        <span>Balance {bank.balance}</span>
        <span>Schema confidence {bank.confidence}</span>
      </span>
    </span>
  );
}

function StageBadge({ stage, excluded }) {
  if (excluded) return <span className="stage-badge muted">Skipped</span>;
  const label =
    {
      waiting: "Missing",
      "statement-ready": "Uploaded",
      "ledger-importing": "Importing",
      "ledger-imported": "Ledger ready",
      parsing: "Parsing",
      comparing: "Comparing",
      normalizing: "Normalizing",
      normalized: "Normalized",
      scanning: "Scanning",
      review: "Review",
      complete: "Complete"
    }[stage] || "Waiting";

  return (
    <span className={`stage-badge ${stage}`}>
      {["ledger-importing", "parsing", "normalizing", "scanning", "comparing"].includes(stage) && <Loader2 size={12} className="spin" />}
      {label}
    </span>
  );
}

function stageLabel(stage, uploaded, excluded) {
  if (excluded) return "Ledger not required";
  if (!uploaded) return "Ledger waits for statement";
  if (stage === "statement-ready") return "Yardi ledger pending";
  if (stage === "ledger-importing") return "Importing from Yardi";
  if (stage === "ledger-imported") return "Yardi ledger imported";
  if (stage === "parsing") return "Queued for Parsing Agent";
  if (stage === "comparing") return "Comparing statement and ledger";
  if (stage === "normalizing") return "Understanding ledger";
  if (stage === "normalized") return "Normalized artifact saved";
  if (stage === "scanning") return "Reconciling statements with ledgers";
  if (stage === "review") return "Review prepared";
  if (stage === "complete") return "Session complete";
  return "Yardi ledger pending";
}

function ProcessStatus({ runState, runTotals, yardiProgress, yardiStepIndex }) {
  if (!["reconciling", "review", "updating-yardi", "complete"].includes(runState)) return null;

  if (runState === "complete") {
    return (
      <motion.section
        className="final-summary"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="final-summary-copy">
          <p className="eyebrow">Summary and Reports Agent</p>
          <h2>May reconciliation is ready for controller review</h2>
          <p>Approved records were posted to Yardi and remaining exceptions were flagged for review.</p>
        </div>
        <div className="final-metrics">
          <MetricChip label="Banks reconciled" value={runTotals.banks} />
          <MetricChip label="Approved sent" value={runTotals.approved} />
          <MetricChip label="Exceptions flagged" value={runTotals.exceptions} />
          <MetricChip label="Automation issues" value="0" />
        </div>
        <div className="artifact-list">
          <ArtifactCard title="Reconciliation summary PDF" meta="Mock report" />
          <ArtifactCard title="Exception report CSV" meta="Mock export" />
          <ArtifactCard title="Yardi update log" meta="Mock audit log" />
        </div>
      </motion.section>
    );
  }

  if (runState === "updating-yardi") {
    return (
      <motion.section
        className="process-band finalizing"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      >
        <div>
          <p className="eyebrow">Final stage</p>
          <h2>Updating Yardi and preparing reports</h2>
          <span>{yardiUpdateSteps[yardiStepIndex]}</span>
        </div>
        <div className="progress-orbit" aria-label={`${yardiProgress}% complete`}>
          <svg viewBox="0 0 44 44" role="img" aria-hidden="true">
            <circle cx="22" cy="22" r="18" />
            <circle cx="22" cy="22" r="18" style={{ "--progress": yardiProgress }} />
          </svg>
          <strong>{yardiProgress}%</strong>
        </div>
      </motion.section>
    );
  }

  if (runState === "review") {
    return (
      <motion.section
        className="process-band review"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      >
        <div>
          <p className="eyebrow">Exception Agent</p>
          <h2>Review summaries are ready</h2>
          <span>Open a bank row to inspect approved records, exceptions, and agent reasoning.</span>
        </div>
        <div className="mini-outcomes">
          <MetricChip label="Approved" value={runTotals.approved} />
          <MetricChip label="Exceptions" value={runTotals.exceptions} />
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="process-band comparing"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <p className="eyebrow">Reconciliation Agent</p>
        <h2>Comparing statements with Yardi ledgers</h2>
        <span>Rows are running in parallel. Details appear when exceptions are ready for review.</span>
      </div>
      <div className="agent-motion-chip">
        <span />
        <span />
        <span />
      </div>
    </motion.section>
  );
}

function MetricChip({ label, value }) {
  return (
    <div className="metric-chip">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function ArtifactCard({ title, meta }) {
  return (
    <button className="artifact-card" type="button">
      <Download size={15} />
      <div>
        <strong>{title}</strong>
        <span>{meta}</span>
      </div>
    </button>
  );
}

function ReviewSubmitBar({ runTotals, onSubmit }) {
  return (
    <motion.section
      className="review-submit-bar"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <strong>Ready to update Yardi</strong>
        <span>
          {runTotals.approved} approved records will be posted, {runTotals.exceptions} exceptions will be flagged.
        </span>
      </div>
      <button className="primary-button" onClick={onSubmit}>
        <Send size={15} />
        Send approved to Yardi and flag exceptions
      </button>
    </motion.section>
  );
}

function ReviewModal({ bank, records, open, onClose, onMove, onMoveSelected, onComment }) {
  return (
    <AnimatePresence>
      {open && bank && records && (
        <>
          <motion.div
            className="review-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="review-modal"
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            aria-modal="true"
            role="dialog"
            aria-label={`${bank.name} reconciliation review`}
          >
            <div className="review-modal-header">
              <div>
                <p className="eyebrow">Exception Agent review</p>
                <h2>{bank.name}</h2>
                <span>Feedback updates agent memory silently and remains attached to each record.</span>
              </div>
              <button className="icon-button" onClick={onClose} aria-label="Close review">
                <X size={17} />
              </button>
            </div>
            <div className="review-columns">
              <RecordColumn
                bankId={bank.id}
                listKey="approved"
                title="Approved records"
                records={records.approved}
                onMove={onMove}
                onMoveSelected={onMoveSelected}
                onComment={onComment}
              />
              <RecordColumn
                bankId={bank.id}
                listKey="exceptions"
                title="Exceptions"
                records={records.exceptions}
                onMove={onMove}
                onMoveSelected={onMoveSelected}
                onComment={onComment}
              />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function RecordColumn({ bankId, listKey, title, records, onMove, onMoveSelected, onComment }) {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [openRecord, setOpenRecord] = useState(null);
  const selectedCount = selectedIds.length;
  const targetLabel = listKey === "approved" ? "exceptions" : "approved";

  useEffect(() => {
    setSelectionMode(false);
    setSelectedIds([]);
    setOpenRecord(null);
  }, [bankId, listKey]);

  function toggleSelected(recordId) {
    setSelectedIds((current) =>
      current.includes(recordId)
        ? current.filter((id) => id !== recordId)
        : [...current, recordId]
    );
  }

  function moveSelected() {
    onMoveSelected(bankId, listKey, selectedIds);
    setSelectedIds([]);
    setSelectionMode(false);
  }

  return (
    <section className={`record-column ${listKey}`}>
      <div className="record-column-header">
        <div>
          <strong>{title}</strong>
          <span>{records.length} records</span>
        </div>
        <button
          className="micro-button ghost"
          onClick={() => {
            setSelectionMode((current) => !current);
            setSelectedIds([]);
          }}
        >
          {selectionMode ? "Done" : "Select"}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {selectionMode && selectedCount > 0 && (
          <motion.div
            className="selection-bar"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
          >
            <span>{selectedCount} selected</span>
            <button className="micro-button" onClick={moveSelected}>
              Move selected
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="record-list">
        {records.map((record) => (
          <RecordItem
            key={record.id}
            bankId={bankId}
            listKey={listKey}
            record={record}
            targetLabel={targetLabel}
            selectionMode={selectionMode}
            selected={selectedIds.includes(record.id)}
            open={openRecord === record.id}
            onToggleSelected={() => toggleSelected(record.id)}
            onToggleOpen={() => setOpenRecord((current) => (current === record.id ? null : record.id))}
            onMove={() => onMove(bankId, listKey, record.id)}
            onComment={onComment}
          />
        ))}
      </div>
    </section>
  );
}

function RecordItem({
  bankId,
  listKey,
  record,
  targetLabel,
  selectionMode,
  selected,
  open,
  onToggleSelected,
  onToggleOpen,
  onMove,
  onComment
}) {
  const [draft, setDraft] = useState("");

  function submitComment(event) {
    event.preventDefault();
    onComment(bankId, listKey, record.id, draft);
    setDraft("");
  }

  return (
    <article className={`record-item ${open ? "open" : ""}`}>
      <div className="record-row">
        {selectionMode && (
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelected}
            aria-label={`Select ${record.title}`}
          />
        )}
        <button className="record-trigger" onClick={onToggleOpen}>
          <div>
            <strong>{record.title}</strong>
            <span>{record.meta}</span>
          </div>
          <div className="record-amount">
            <strong>{record.amount}</strong>
            <span>{record.date}</span>
          </div>
        </button>
        {!selectionMode && (
          <div className="record-actions">
            <button className="icon-button ghost" onClick={onToggleOpen} aria-label="Comment on record">
              <MessageCircle size={15} />
            </button>
            <button className="icon-button ghost" onClick={onMove} aria-label={`Move to ${targetLabel}`}>
              <ArrowRightLeft size={15} />
            </button>
          </div>
        )}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="record-detail"
            initial={{ opacity: 0, gridTemplateRows: "0fr" }}
            animate={{ opacity: 1, gridTemplateRows: "1fr" }}
            exit={{ opacity: 0, gridTemplateRows: "0fr" }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="record-detail-inner">
              <div className="reason-block">
                <span>Agent reason</span>
                <p>{record.reason}</p>
              </div>
              <div className="evidence-list">
                {record.evidence.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <div className="comment-thread">
                {record.comments.map((comment, index) => (
                  <div key={`${comment.author}-${index}`} className="thread-item">
                    <strong>{comment.author}</strong>
                    <span>{comment.copy}</span>
                  </div>
                ))}
                {record.guidanceCaptured && (
                  <div className="thread-item guidance" title="Guidance captured for future matches">
                    <CircleDot size={12} />
                    <span>Guidance captured</span>
                  </div>
                )}
              </div>
              <form className="comment-form" onSubmit={submitComment}>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Correct the agent reasoning or add review context"
                  rows="2"
                />
                <button className="micro-button" type="submit">
                  Add feedback
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

function ObservabilityRail({
  open,
  events,
  runState,
  runTotals,
  activeStep,
  yardiProgress,
  yardiStepIndex
}) {
  const [railTab, setRailTab] = useState("agent-work");
  const agents = getAgentRailItems({ runState, activeStep, runTotals, yardiProgress, yardiStepIndex });
  const activeAgent = agents.find((agent) => agent.status === "active");
  const focusAgent = activeAgent || [...agents].reverse().find((agent) => agent.status === "complete");
  const focusAgentId = focusAgent?.id || "";
  const completedAgentCount = agents.filter((agent) => agent.status === "complete").length;
  const [expandedAgentId, setExpandedAgentId] = useState(focusAgentId);

  useEffect(() => {
    setExpandedAgentId(focusAgentId);
  }, [focusAgentId]);

  return (
    <motion.aside
      layout
      className={`observability ${open ? "open" : "collapsed"}`}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {open && (
        <>
          <div className="rail-header">
            <div className="rail-tabs" role="tablist" aria-label="Observability rail">
              <button
                type="button"
                role="tab"
                aria-selected={railTab === "agent-work"}
                className={railTab === "agent-work" ? "active" : ""}
                onClick={() => setRailTab("agent-work")}
              >
                <Activity size={14} />
                Agent work
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={railTab === "settings"}
                className={railTab === "settings" ? "active" : ""}
                onClick={() => setRailTab("settings")}
              >
                <Settings size={14} />
                Settings
              </button>
            </div>
          </div>
          <div className="rail-body">
            {railTab === "agent-work" ? (
              <>
                <section className="rail-section-group">
                  <div className="rail-section-heading">
                    <strong>Run state</strong>
                    <span>{events.length} trace events</span>
                  </div>
                  <div className="agent-run-summary">
                    <span>Current span</span>
                    <strong>{focusAgent?.name || "Waiting for agent work"}</strong>
                    <small>{focusAgent?.latest || "The run will begin after the statements are ready."}</small>
                  </div>
                </section>
                <section className="rail-section-group">
                  <div className="rail-section-heading">
                    <strong>Agents</strong>
                    <span>{completedAgentCount} of {agents.length} done</span>
                  </div>
                  <div className="agent-rail-list">
                    {agents.map((agent) => (
                      <AgentRailAccordion
                        key={agent.id}
                        agent={agent}
                        expanded={expandedAgentId === agent.id}
                        onToggle={() =>
                          setExpandedAgentId((current) => (current === agent.id ? "" : agent.id))
                        }
                      />
                    ))}
                  </div>
                </section>
              </>
            ) : (
              <ObservabilitySettings />
            )}
          </div>
        </>
      )}
    </motion.aside>
  );
}

function AgentRailAccordion({ agent, expanded, onToggle }) {
  const StatusIcon =
    agent.status === "complete" ? CheckCircle2 : agent.status === "active" ? Loader2 : CircleDot;

  return (
    <section className={`agent-accordion ${agent.status}`}>
      <button
        className="agent-accordion-button"
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <span className={`agent-state-mark ${agent.status}`}>
          <StatusIcon size={14} className={agent.status === "active" ? "spin" : ""} />
        </span>
        <span className="agent-heading">
          <strong>{agent.name}</strong>
          <span>{agent.role}</span>
        </span>
        <span className={`agent-status-pill ${agent.status}`}>{agentStatusLabel(agent.status)}</span>
        <ChevronRight size={14} className={`agent-accordion-chevron ${expanded ? "expanded" : ""}`} />
      </button>
      <p className="agent-latest">{agent.status === "complete" ? agent.output : agent.latest}</p>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className="agent-accordion-panel"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {agent.timeline.length > 0 ? (
              <ol className="agent-step-list">
                {agent.timeline.map((step, index) => {
                  const isCurrent = agent.status === "active" && index === agent.timeline.length - 1;
                  return (
                    <li key={`${agent.id}-${step.title}`} className={isCurrent ? "current" : "done"}>
                      <span>{isCurrent ? <Loader2 size={12} className="spin" /> : <CheckCircle2 size={12} />}</span>
                      <div>
                        <strong>{step.title}</strong>
                        <small>{step.copy}</small>
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="agent-empty-note">No trace emitted yet.</p>
            )}

            {agent.status === "complete" && (
              <div className="agent-metrics-grid" aria-label={`${agent.name} completion metrics`}>
                {agent.metrics.map((metric) => (
                  <div className="agent-metric" key={`${agent.id}-${metric.label}`}>
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                  </div>
                ))}
              </div>
            )}

            {agent.status === "active" && (
              <div className="agent-live-note">
                <Activity size={13} />
                <span>
                  {agent.progress !== undefined
                    ? `${agent.progress}% complete`
                    : "Open span is still collecting signals"}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ObservabilitySettings() {
  return (
    <div className="rail-settings-panel">
      <section>
        <h3>Rail behavior</h3>
        <label className="settings-toggle-row">
          <input type="checkbox" defaultChecked />
          <span>
            <strong>Follow active agent</strong>
            <small>Open the agent that is currently working.</small>
          </span>
        </label>
        <label className="settings-toggle-row">
          <input type="checkbox" defaultChecked />
          <span>
            <strong>Show completion metrics</strong>
            <small>Reveal duration, throughput, and exception load after handoff.</small>
          </span>
        </label>
      </section>
      <section>
        <h3>Notifications</h3>
        <label className="settings-toggle-row">
          <input type="checkbox" />
          <span>
            <strong>Pause on exceptions</strong>
            <small>Ask before posting when exception load increases.</small>
          </span>
        </label>
      </section>
    </div>
  );
}

function agentStatusLabel(status) {
  if (status === "complete") return "Done";
  if (status === "active") return "Working";
  return "Idle";
}

function PropertyDrawer({ open, setOpen, properties, selectedProperty, setSelectedProperty }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="drawer-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="property-drawer"
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="drawer-header">
              <div>
                <p className="eyebrow">Mock properties</p>
                <h2>Properties</h2>
              </div>
              <button className="icon-button" onClick={() => setOpen(false)} aria-label="Close properties">
                <X size={17} />
              </button>
            </div>
            <button className="new-session">
              <Plus size={16} />
              Add property
            </button>
            <div className="property-list">
              {properties.map((property) => (
                <button
                  key={property.id}
                  className={`property-row ${property.id === selectedProperty.id ? "selected" : ""}`}
                  onClick={() => setSelectedProperty(property)}
                >
                  <div>
                    <strong>{property.name}</strong>
                    <span>{property.address}</span>
                  </div>
                  <small>{property.banks} banks</small>
                </button>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function StatusPill({ status }) {
  const label =
    {
      Draft: "Not started",
      "Needs input": "Needs input",
      "Needs review": "Needs review",
      "Ready for handoff": "Ready for handoff",
      Reconciling: "Reconciling",
      Importing: "Importing",
      Parsing: "Parsing",
      Updating: "Updating",
      Complete: "Complete"
    }[status] || status;

  return <span className={`status-pill ${status.toLowerCase().replaceAll(" ", "-")}`}>{label}</span>;
}

createRoot(document.getElementById("root")).render(<App />);
