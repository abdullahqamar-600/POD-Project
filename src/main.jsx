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
  FileSpreadsheet,
  Home,
  Inbox,
  Loader2,
  Lock,
  MessageCircle,
  MoreHorizontal,
  PanelRightClose,
  PanelRightOpen,
  Pencil,
  PlayCircle,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  Workflow,
  X
} from "lucide-react";
import "./styles.css";
import bankOfAmericaLogo from "../company logos/bank-of-america-logo 1.png";
import chaseLogo from "../company logos/Chase-National-Bank-Logo 1.png";
import wellsFargoLogo from "../company logos/Wells_Fargo_Bank.svg 1.png";

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

const propertySeed = [
  {
    id: "meridian",
    code: "MER-1849",
    name: "The Meridian",
    address: "1849 Westlake Ave",
    market: "Seattle",
    type: "Multifamily",
    units: 214,
    owner: "Westlake Holdings",
    accountant: "A. Patel",
    ledgerSource: "Yardi",
    period: "May 2026",
    closeStatus: "Ready",
    openItems: 5,
    exceptions: 2,
    tieOut: "Balanced",
    lastReconciled: "Apr 30, 2026",
    banks: [
      { id: "chase-operating", name: "Chase", type: "Operating", account: "4419", gl: "1000-OP" },
      { id: "wells-reserve", name: "Wells Fargo", type: "Reserve", account: "8821", gl: "1020-RS" },
      { id: "boa-deposits", name: "BofA", type: "Deposits", account: "1187", gl: "1030-SD" }
    ]
  },
  {
    id: "oakline",
    code: "OAK-0022",
    name: "Oakline Lofts",
    address: "22 North Canal",
    market: "Portland",
    type: "Mixed-use",
    units: 88,
    owner: "Oakline Partners",
    accountant: "M. Chen",
    ledgerSource: "Yardi",
    period: "May 2026",
    closeStatus: "Parsing",
    openItems: 3,
    exceptions: 1,
    tieOut: "Pending",
    lastReconciled: "Apr 30, 2026",
    banks: [
      { id: "chase-operating", name: "Chase", type: "Operating", account: "6120", gl: "1000-OP" },
      { id: "wells-reserve", name: "Wells Fargo", type: "Reserve", account: "2104", gl: "1020-RS" }
    ]
  },
  {
    id: "harbor",
    code: "HBR-0710",
    name: "Harbor Court",
    address: "710 Bay Street",
    market: "San Diego",
    type: "Commercial",
    units: 132,
    owner: "Harbor Court LP",
    accountant: "J. Rivera",
    ledgerSource: "Manual",
    period: "May 2026",
    closeStatus: "Needs setup",
    openItems: 8,
    exceptions: 4,
    tieOut: "Needs review",
    lastReconciled: "Mar 31, 2026",
    banks: [
      { id: "chase-operating", name: "Chase", type: "Operating", account: "3320", gl: "1000-OP" },
      { id: "wells-reserve", name: "Wells Fargo", type: "Reserve", account: "4481", gl: "1020-RS" },
      { id: "boa-deposits", name: "BofA", type: "Deposits", account: "1190", gl: "1030-SD" },
      { id: "chase-tax", name: "Chase", type: "Tax escrow", account: "8801", gl: "1040-TX" }
    ]
  },
  {
    id: "northstar",
    code: "NOR-0880",
    name: "Northstar Plaza",
    address: "880 Glacier Road",
    market: "Denver",
    type: "Retail",
    units: 64,
    owner: "Northstar REIT",
    accountant: "S. Malik",
    ledgerSource: "Yardi",
    period: "May 2026",
    closeStatus: "Ready",
    openItems: 1,
    exceptions: 0,
    tieOut: "Balanced",
    lastReconciled: "Apr 30, 2026",
    banks: [
      { id: "chase-operating", name: "Chase", type: "Operating", account: "9091", gl: "1000-OP" },
      { id: "boa-deposits", name: "BofA", type: "Deposits", account: "4502", gl: "1030-SD" }
    ]
  }
];

const cycleOptions = ["April 2026", "May 2026", "June 2026", "July 2026"];

function getViewFromLocation() {
  if (typeof window === "undefined") return "dashboard";
  const hash = window.location.hash.replace("#", "");
  if (hash === "dashboard" || hash === "") return "dashboard";
  if (hash === "workspace") return "workspace";
  if (hash === "properties") return "properties";
  return "dashboard";
}

function hashForView(view) {
  if (view === "dashboard") return "#dashboard";
  if (view === "properties") return "#properties";
  return "#workspace";
}

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
    title: "Source artifacts saved",
    copy: "Normalized files stored for review",
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
  const [properties, setProperties] = useState(propertySeed);
  const [activeView, setActiveViewState] = useState(getViewFromLocation);
  const [railOpen, setRailOpen] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(propertySeed[0]);
  const [cycle, setCycle] = useState("May 2026");
  const [uploaded, setUploaded] = useState({});
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
  const [newSessionOpen, setNewSessionOpen] = useState(false);

  const uploadedBanks = banks.filter((bank) => uploaded[bank.id]);
  const runBanks = uploadedBanks.length > 0 ? uploadedBanks : banks;
  const canStart = runState === "draft" && uploadedBanks.length > 0;
  const reviewBank = banks.find((bank) => bank.id === reviewBankId);
  const runTotals = getRunTotals(recordsByBank, runBanks);

  function setActiveView(view) {
    setActiveViewState(view);
    if (typeof window === "undefined") return;
    const next = hashForView(view);
    const current = `${window.location.pathname}${window.location.hash}`;
    if (current !== next) {
      window.history.replaceState(null, "", next);
    }
  }

  useEffect(() => {
    const syncViewToHash = () => setActiveViewState(getViewFromLocation());
    window.addEventListener("hashchange", syncViewToHash);
    return () => window.removeEventListener("hashchange", syncViewToHash);
  }, []);

  useEffect(() => {
    if (runState !== "running") return;

    let cancelled = false;
    let timer;
    const activeBanks = getRunBanks(uploaded);
    const activeBankIds = new Set(activeBanks.map((bank) => bank.id));

    const run = async () => {
      for (const step of automationSteps) {
        if (cancelled) return;
        if (step.bankId && !activeBankIds.has(step.bankId)) continue;
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
          setBankStage((current) => updateRunBanks(current, activeBanks, "ledger-importing"));
        }

        if (step.key === "ledgers-found") {
          setBankStage((current) => updateRunBanks(current, activeBanks, "ledger-imported"));
        }

        if (step.key === "parsing-started") {
          setSessions((current) =>
            current.map((session) =>
              session.id === selectedSession
                ? { ...session, status: "Parsing", detail: `${activeBanks.length} pairs normalizing` }
                : session
            )
          );
          setBankStage((current) => updateRunBanks(current, activeBanks, "parsing"));
        }

        if (step.bankId && activeBankIds.has(step.bankId)) {
          setBankStage((current) => ({ ...current, [step.bankId]: "normalizing" }));
        }

        if (step.key === "artifacts-saved") {
          setBankStage((current) => updateRunBanks(current, activeBanks, "normalized"));
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
          setBankStage((current) => updateRunBanks(current, activeBanks, "scanning"));
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
  }, [runState, selectedSession, uploaded]);

  useEffect(() => {
    if (runState !== "reconciling") return;

    const activeBanks = getRunBanks(uploaded);
    setComparisonProgress(Object.fromEntries(banks.map((bank) => [bank.id, 0])));
    setBankStage((current) => updateRunBanks(current, activeBanks, "comparing"));
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
        activeBanks.reduce(
          (next, bank, index) => ({
            ...next,
            [bank.id]: Math.min(96, (current[bank.id] || 0) + 7 + index)
          }),
          current
        )
      );
    }, 420);

    const finishTimer = window.setTimeout(() => {
      const totals = getRunTotals(recordsByBank, activeBanks);
      setComparisonProgress((current) =>
        activeBanks.reduce((next, bank) => ({ ...next, [bank.id]: 100 }), current)
      );
      setRunState("review");
      setRowExpanded(Object.fromEntries(activeBanks.map((bank) => [bank.id, true])));
      setBankStage((current) => updateRunBanks(current, activeBanks, "review"));
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
  }, [recordsByBank, runState, selectedSession, uploaded]);

  useEffect(() => {
    if (runState !== "updating-yardi") return;

    const activeBanks = getRunBanks(uploaded);
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
      const totals = getRunTotals(recordsByBank, activeBanks);
      setYardiProgress(100);
      setYardiStepIndex(yardiUpdateSteps.length - 1);
      setRunState("complete");
      setBankStage((current) => updateRunBanks(current, activeBanks, "complete"));
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
  }, [recordsByBank, runState, selectedSession, uploaded]);

  function startRun() {
    if (!canStart) return;
    setRunState("running");
    setEvents((current) => [
      ...current,
      {
        id: `start-${Date.now()}`,
        type: "user",
        title: "Reconciliation started",
        copy: `${uploadedBanks.length} statement${uploadedBanks.length === 1 ? "" : "s"} locked for this session`,
        at: "now"
      }
    ]);
  }

  function startManualLedgerRun() {
    if (!canStart) return;
    const activeBanks = getRunBanks(uploaded);
    setRunState("reconciling");
    setBankStage((current) => updateRunBanks(current, activeBanks, "comparing"));
    setSessions((current) =>
      current.map((session) =>
        session.id === selectedSession
          ? { ...session, status: "Reconciling", detail: "Manual ledgers uploaded" }
          : session
      )
    );
    setEvents((current) => [
      ...current,
      {
        id: `manual-ledger-${Date.now()}`,
        type: "user",
        title: "Ledger uploaded",
        copy: `${activeBanks.length} ledger${activeBanks.length === 1 ? "" : "s"} added manually`,
        at: "now"
      }
    ]);
  }

  function uploadStatement(bankId) {
    if (runState !== "draft") return;
    const alreadyUploaded = Boolean(uploaded[bankId]);
    setUploaded((current) => ({ ...current, [bankId]: true }));
    setBankStage((current) => ({ ...current, [bankId]: "statement-ready" }));
    const bank = banks.find((item) => item.id === bankId);
    setEvents((current) => [
      ...current,
      {
        id: `upload-${bankId}-${Date.now()}`,
        type: "user",
        title: alreadyUploaded ? "Statement replaced" : "Statement uploaded",
        copy: bank.name,
        at: "now"
      }
    ]);
  }

  function removeStatement(bankId) {
    if (runState !== "draft") return;
    setUploaded((current) => {
      const next = { ...current };
      delete next[bankId];
      return next;
    });
    setBankStage((current) => ({ ...current, [bankId]: "waiting" }));
    const bank = banks.find((item) => item.id === bankId);
    setEvents((current) => [
      ...current,
      {
        id: `remove-${bankId}-${Date.now()}`,
        type: "user",
        title: "Statement removed",
        copy: `${bank.name} can be re-uploaded`,
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

  function openNewSessionPicker() {
    setActiveView("dashboard");
    setNewSessionOpen(true);
  }

  function openDashboardSession(session) {
    const property = properties.find((item) => item.name === session.property);
    setSelectedSession(session.id);
    if (property) setSelectedProperty(property);
    setCycle(session.cycle);
    setActiveView("workspace");
  }

  function createSession(propertyOverride) {
    const targetProperty = propertyOverride?.id ? propertyOverride : selectedProperty;
    const id = `ses-${sessions.length + 1}`;
    const next = {
      id,
      property: targetProperty.name,
      cycle,
      status: "Draft",
      detail: "New workspace"
    };
    setSessions((current) => [next, ...current]);
    setSelectedSession(id);
    setSelectedProperty(targetProperty);
    setNewSessionOpen(false);
    setActiveView("workspace");
    setUploaded({});
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

  function createProperty(property) {
    setProperties((current) => [property, ...current]);
    setSelectedProperty(property);
  }

  function updateProperty(property) {
    setProperties((current) => current.map((item) => (item.id === property.id ? property : item)));
    setSelectedProperty(property);
  }

  function deleteProperty(propertyId) {
    setProperties((current) => {
      const next = current.filter((property) => property.id !== propertyId);
      if (selectedProperty.id === propertyId && next.length > 0) {
        setSelectedProperty(next[0]);
      }
      return next;
    });
  }

  return (
    <div className="app-shell">
      <Sidebar
        sessions={sessions}
        selectedSession={selectedSession}
        onOpenSession={openDashboardSession}
        onNewSession={openNewSessionPicker}
        activeView={activeView}
        setActiveView={setActiveView}
      />
      <main
        className={`workspace ${activeView === "dashboard" ? "dashboard-workspace" : ""}`}
      >
        <TopBar
          selectedProperty={selectedProperty}
          runState={runState}
          railOpen={railOpen}
          setRailOpen={setRailOpen}
          activeView={activeView}
        />
        {activeView === "dashboard" ? (
          <DashboardScreen
            sessions={sessions}
            properties={properties}
            onOpenSession={openDashboardSession}
            onNewSession={openNewSessionPicker}
          />
        ) : activeView === "workspace" ? (
          <section className="session-canvas">
            <div className="session-header">
              <div>
                <p className="eyebrow">Reconciliation workspace</p>
                <h1>{selectedProperty.name}</h1>
                <p className="subtle">Prepare statements, then reconcile.</p>
                <label className="cycle-picker">
                  <CalendarDays size={14} />
                  <select value={cycle} onChange={(event) => setCycle(event.target.value)} aria-label="Reconciliation month">
                    {cycleOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <BankBoard
              uploaded={uploaded}
              bankStage={bankStage}
              activeStep={activeStep}
              runState={runState}
              recordsByBank={recordsByBank}
              comparisonProgress={comparisonProgress}
              rowExpanded={rowExpanded}
              canStart={canStart}
              onUpload={uploadStatement}
              onRemove={removeStatement}
              onStartRun={startRun}
              onManualLedgerRun={startManualLedgerRun}
              onToggleRow={toggleRow}
              onOpenReview={openReview}
            />

            <ProcessStatus
              runState={runState}
              cycle={cycle}
              runTotals={runTotals}
              yardiProgress={yardiProgress}
              yardiStepIndex={yardiStepIndex}
            />

            {runState === "review" && (
              <ReviewSubmitBar runTotals={runTotals} onSubmit={startYardiUpdate} />
            )}
          </section>
        ) : (
          <PropertiesScreen
            properties={properties}
            selectedProperty={selectedProperty}
            onSelectProperty={setSelectedProperty}
            onStartSession={createSession}
            onCreateProperty={createProperty}
            onUpdateProperty={updateProperty}
            onDeleteProperty={deleteProperty}
          />
        )}
      </main>

      {activeView === "workspace" && (
        <ObservabilityRail
          open={railOpen}
          events={events}
          runState={runState}
          runTotals={runTotals}
          activeStep={activeStep}
          yardiProgress={yardiProgress}
          yardiStepIndex={yardiStepIndex}
        />
      )}

      <ReviewModal
        bank={reviewBank}
        records={reviewBank ? recordsByBank[reviewBank.id] : null}
        open={Boolean(reviewBank)}
        onClose={() => setReviewBankId(null)}
        onMove={moveRecord}
        onMoveSelected={moveSelectedRecords}
        onComment={addRecordComment}
      />

      <NewSessionLauncher
        open={newSessionOpen}
        properties={properties}
        onClose={() => setNewSessionOpen(false)}
        onSelectProperty={createSession}
      />

    </div>
  );
}

function getRunBanks(uploaded) {
  const uploadedBanks = banks.filter((bank) => uploaded[bank.id]);
  return uploadedBanks.length > 0 ? uploadedBanks : banks;
}

function updateRunBanks(current, runBanks, stage) {
  return runBanks.reduce((acc, bank) => ({ ...acc, [bank.id]: stage }), current);
}

function getPropertyBankCount(property) {
  return Array.isArray(property?.banks) ? property.banks.length : Number(property?.banks || 0);
}

function formatBankNames(property) {
  if (!Array.isArray(property?.banks)) return "";
  return property.banks.map((bank) => `${bank.name} ${bank.type}`).join(", ");
}

function shortTieOutLabel(value) {
  if (value === "Balanced") return "OK";
  if (value === "Needs review") return "Check";
  if (value === "Pending") return "Wait";
  return value;
}

function getDashboardStats(sessions, properties) {
  const activeStatuses = new Set(["Importing", "Parsing", "Reconciling", "Updating"]);
  const reviewStatuses = new Set(["Needs review", "Ready for handoff"]);
  return {
    activeAgents: sessions.filter((session) => activeStatuses.has(session.status)).length + 1,
    runningSessions: sessions.filter((session) => activeStatuses.has(session.status)).length,
    reviewItems: properties.reduce((sum, property) => sum + property.exceptions, 0),
    stalledHandoffs: 0,
    matchRate: "94.2%",
    matchRateTrend: "1.8% vs last cycle",
    intakeActive: sessions.some((session) => ["Importing", "Parsing"].includes(session.status)),
    reconActive: sessions.some((session) => session.status === "Reconciling"),
    exceptionActive: sessions.some((session) => reviewStatuses.has(session.status)),
    summaryActive: sessions.some((session) => session.status === "Updating")
  };
}

function dashboardSessionSummaryMeta(property) {
  const openItems = property?.openItems ?? 0;
  const exceptions = property?.exceptions ?? 0;
  const banksCount = getPropertyBankCount(property);
  return `${openItems} ${openItems === 1 ? "open item" : "open items"} · ${exceptions} ${
    exceptions === 1 ? "exception" : "exceptions"
  } · ${banksCount} ${banksCount === 1 ? "bank" : "banks"}`;
}

function dashboardReviewHeadline(count) {
  if (count === 0) return "Close cycle is clear";
  return `${count} ${count === 1 ? "exception" : "exceptions"} need review`;
}

function dashboardStalledHandoffCopy(count) {
  return count === 0 ? "0 stalled" : `${count} stalled`;
}

function propertyToDraft(property) {
  return {
    name: property?.name || "",
    code: property?.code || "",
    address: property?.address || "",
    market: property?.market || "",
    type: property?.type || "",
    units: String(property?.units || ""),
    owner: property?.owner || "",
    accountant: property?.accountant || "",
    ledgerSource: property?.ledgerSource || "Yardi",
    period: property?.period || "May 2026",
    closeStatus: property?.closeStatus || "Ready",
    openItems: String(property?.openItems || 0),
    exceptions: String(property?.exceptions || 0),
    tieOut: property?.tieOut || "Balanced",
    lastReconciled: property?.lastReconciled || "Not reconciled",
    bankDraft: formatBankNames(property)
  };
}

function createEmptyPropertyDraft(index) {
  return {
    name: "",
    code: `NEW-${String(index).padStart(4, "0")}`,
    address: "",
    market: "",
    type: "Multifamily",
    units: "",
    owner: "",
    accountant: "",
    ledgerSource: "Yardi",
    period: "May 2026",
    closeStatus: "Needs setup",
    openItems: "0",
    exceptions: "0",
    tieOut: "Pending",
    lastReconciled: "Not reconciled",
    bankDraft: ""
  };
}

function propertyFromDraft(draft, existingId) {
  const name = draft.name.trim() || "Untitled property";
  return {
    id: existingId || `${slugify(name)}-${Date.now()}`,
    code: draft.code.trim() || slugify(name).toUpperCase(),
    name,
    address: draft.address.trim(),
    market: draft.market.trim(),
    type: draft.type.trim(),
    units: Number(draft.units) || 0,
    owner: draft.owner.trim(),
    accountant: draft.accountant.trim(),
    ledgerSource: draft.ledgerSource,
    period: draft.period,
    closeStatus: draft.closeStatus,
    openItems: Number(draft.openItems) || 0,
    exceptions: Number(draft.exceptions) || 0,
    tieOut: draft.tieOut,
    lastReconciled: draft.lastReconciled || "Not reconciled",
    banks: parseBankDraft(draft.bankDraft)
  };
}

function parseBankDraft(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item, index) => {
      const parts = item.split(/\s+/);
      const type = parts.length > 1 ? parts.slice(1).join(" ") : "Operating";
      return {
        id: `${slugify(item)}-${index}`,
        name: parts[0],
        type,
        account: "Pending",
        gl: "Unmapped"
      };
    });
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function createRecordState() {
  return JSON.parse(JSON.stringify(reconciliationSeed));
}

function getRunTotals(recordsByBank, sourceBanks = banks) {
  return sourceBanks.reduce(
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
    { title: "Source artifacts saved", copy: "Clean inputs stored for review" },
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
      name: "Intake",
      role: "Imports ledgers and normalizes statements",
      status: intakeStatus,
      latest:
        intakeStatus === "active"
          ? activeStep?.copy || "Reading statement-ledger pairs"
          : intakeStatus === "complete"
            ? "Normalized artifacts passed to Reconciliation."
            : "Waiting for statement uploads.",
      output: "Normalized artifacts generated and passed to Reconciliation.",
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
      name: "Reconciliation",
      role: "Matches statement rows to Yardi records",
      status: reconciliationStatus,
      latest:
        reconciliationStatus === "active"
          ? activeStep?.copy || "Matching statements with Yardi records"
          : reconciliationStatus === "complete"
            ? "Match buckets passed to Exception."
            : "Waiting for normalized artifacts.",
      output: "Approved and exception buckets generated for Exception review.",
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
      name: "Exception",
      role: "Explains exceptions and captures guidance",
      status: exceptionStatus,
      latest:
        exceptionStatus === "active"
          ? activeStep?.copy || "Waiting for reviewer decision"
          : exceptionStatus === "complete"
            ? "Reviewed package passed to Summary."
            : "Waiting for comparison results.",
      output: "Review package prepared and passed to Summary for Yardi update.",
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
      name: "Summary",
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
  onOpenSession,
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
        <a
          href="#dashboard"
          className={activeView === "dashboard" ? "active" : ""}
          onClick={() => setActiveView("dashboard")}
        >
          <Inbox size={16} />
          Dashboard
        </a>
        <a
          href="#properties"
          className={activeView === "properties" ? "active" : ""}
          onClick={() => setActiveView("properties")}
        >
          <Building2 size={16} />
          Properties
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
              className={`session-item ${activeView === "workspace" && session.id === selectedSession ? "selected" : ""}`}
              key={session.id}
              onClick={() => onOpenSession(session)}
            >
              <strong>{session.property}</strong>
              <StatusPill status={session.status} />
            </button>
          ))}
          {visibleSessions.length === 0 && <div className="session-empty">No sessions found</div>}
        </div>
      </div>
      <div className="sidebar-footer">
        <div className="credits-widget">
          <div className="credits-row">
            <span>Credits remaining</span>
            <strong>5.0k of 5.0k</strong>
          </div>
          <div className="credits-meter" aria-hidden="true">
            <span />
          </div>
        </div>
        <div className="user-profile-row">
          <div className="user-avatar" aria-hidden="true">AQ</div>
          <div className="user-profile-copy">
            <strong>Abdullah Qamar</strong>
            <span>Owner workspace</span>
          </div>
          <button className="icon-button ghost" type="button" aria-label="Account menu">
            <MoreHorizontal size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ selectedProperty, runState, railOpen, setRailOpen, activeView }) {
  const activeLabel =
    activeView === "dashboard"
      ? "Dashboard"
      : activeView === "properties"
        ? "Properties"
        : selectedProperty.name;
  const statusLabel =
    activeView === "dashboard"
      ? "Live ops"
      : activeView === "properties"
        ? "Portfolio"
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
            : "Complete";
  const statusClass =
    activeView === "dashboard"
      ? "dashboard"
      : activeView === "properties"
        ? "complete"
        : runState;

  return (
    <header className="topbar">
      <div className="breadcrumb">
        <Home size={15} />
        <span>Dashboard</span>
        {activeView !== "dashboard" && (
          <>
            <ChevronRight size={14} />
            <span>{activeLabel}</span>
          </>
        )}
      </div>
      <div className="topbar-actions">
        {activeView !== "dashboard" && (
          <span className={`run-dot ${statusClass}`}>
            <Activity size={14} />
            {statusLabel}
          </span>
        )}
        {activeView === "workspace" && (
          <button className="icon-button rail-toggle" onClick={() => setRailOpen(!railOpen)} aria-label="Toggle observability rail">
            {railOpen ? <PanelRightClose size={17} /> : <PanelRightOpen size={17} />}
          </button>
        )}
      </div>
    </header>
  );
}

function DashboardScreen({ sessions, properties, onNewSession }) {
  const [selectedInsightId, setSelectedInsightId] = useState(null);
  const sessionSignals = {
    "ses-1": {
      stage: "Review",
      summary: "Review package ready; exceptions grouped by bank.",
      confidence: "97%",
      confidenceTone: "high",
      ledger: "Yardi matched",
      approved: 8,
      exceptions: 5,
      banksDone: 3,
      latency: "9.4s",
      duration: "14m",
      automation: 94.8,
      totalTokens: "14.9k",
      totalLatency: "9.4s",
      readout: ["Chase and Wells Fargo matched cleanly.", "BofA variance is driving review risk."],
      tokenBars: [
        { label: "Parsing", value: "2.8k", percent: 32 },
        { label: "Reconciliation", value: "8.7k", percent: 100 },
        { label: "Exception", value: "3.4k", percent: 39 },
        { label: "Summary", value: "0", percent: 0 }
      ],
      latencyBars: [
        { label: "Parsing", value: "1.6s", percent: 38 },
        { label: "Reconciliation", value: "4.2s", percent: 100 },
        { label: "Exception", value: "1.1s", percent: 26 },
        { label: "Summary", value: "0.0s", percent: 0 }
      ],
      anomalySignals: ["BofA match rate 82% vs 94% avg last 3 cycles", "5 exceptions vs avg 2.1", "Reconciliation latency up 18% from April"],
      riskRows: [
        { agent: "Parsing", risk: "Low" },
        { agent: "Reconciliation", risk: "Medium" },
        { agent: "Exception", risk: "Medium" },
        { agent: "Summary", risk: "Idle" }
      ],
      feedbackSignals: [
        { label: "Approved as-is", value: "8" },
        { label: "Moved to exceptions", value: "1" },
        { label: "Moved to approved", value: "0" },
        { label: "Rules captured", value: "3" }
      ],
      eventTimeline: [
        { time: "09:02", type: "user", title: "Statements uploaded" },
        { time: "09:08", type: "agent", title: "Reconciliation completed" },
        { time: "09:10", type: "reviewer", title: "Exception feedback saved" },
        { time: "09:12", type: "system", title: "Summary waiting on Yardi" }
      ]
    },
    "ses-2": {
      stage: "Parsing",
      summary: "Statements are normalizing; ledger import is still running.",
      confidence: "91%",
      confidenceTone: "medium",
      ledger: "Import running",
      approved: 0,
      exceptions: 1,
      banksDone: 1,
      latency: "3.2s",
      duration: "5m",
      automation: 76,
      totalTokens: "6.2k",
      totalLatency: "3.2s",
      readout: ["Statement parser is stable.", "Yardi ledger import is the current wait point."],
      tokenBars: [
        { label: "Parsing", value: "3.1k", percent: 100 },
        { label: "Reconciliation", value: "2.2k", percent: 71 },
        { label: "Exception", value: "0.9k", percent: 29 },
        { label: "Summary", value: "0", percent: 0 }
      ],
      latencyBars: [
        { label: "Parsing", value: "1.9s", percent: 100 },
        { label: "Reconciliation", value: "1.0s", percent: 53 },
        { label: "Exception", value: "0.3s", percent: 16 },
        { label: "Summary", value: "0.0s", percent: 0 }
      ],
      anomalySignals: ["Parsing tokens 12% above rolling average", "One reserve statement produced low OCR confidence"],
      riskRows: [
        { agent: "Parsing", risk: "Medium" },
        { agent: "Reconciliation", risk: "Idle" },
        { agent: "Exception", risk: "Idle" },
        { agent: "Summary", risk: "Idle" }
      ],
      feedbackSignals: [
        { label: "Approved as-is", value: "0" },
        { label: "Moved to exceptions", value: "0" },
        { label: "Moved to approved", value: "0" },
        { label: "Rules captured", value: "0" }
      ],
      eventTimeline: [
        { time: "10:18", type: "user", title: "Two statements uploaded" },
        { time: "10:19", type: "agent", title: "Parsing started" },
        { time: "10:20", type: "system", title: "Yardi import running" }
      ]
    },
    "ses-3": {
      stage: "Needs input",
      summary: "Manual ledger is missing before matching can start.",
      confidence: "68%",
      confidenceTone: "low",
      ledger: "Ledger missing",
      approved: 0,
      exceptions: 4,
      banksDone: 0,
      latency: "0.9s",
      duration: "Paused",
      automation: 0,
      totalTokens: "1.1k",
      totalLatency: "0.9s",
      readout: ["The run stopped before reconciliation.", "Manual ledger upload is required."],
      tokenBars: [
        { label: "Parsing", value: "1.1k", percent: 100 },
        { label: "Reconciliation", value: "0", percent: 0 },
        { label: "Exception", value: "0", percent: 0 },
        { label: "Summary", value: "0", percent: 0 }
      ],
      latencyBars: [
        { label: "Parsing", value: "0.9s", percent: 100 },
        { label: "Reconciliation", value: "0.0s", percent: 0 },
        { label: "Exception", value: "0.0s", percent: 0 },
        { label: "Summary", value: "0.0s", percent: 0 }
      ],
      anomalySignals: ["Ledger missing for 4 banks", "Automation rate is 0% for this run"],
      riskRows: [
        { agent: "Parsing", risk: "Medium" },
        { agent: "Reconciliation", risk: "Idle" },
        { agent: "Exception", risk: "Idle" },
        { agent: "Summary", risk: "Idle" }
      ],
      feedbackSignals: [
        { label: "Approved as-is", value: "0" },
        { label: "Moved to exceptions", value: "0" },
        { label: "Moved to approved", value: "0" },
        { label: "Rules captured", value: "0" }
      ],
      eventTimeline: [
        { time: "15:04", type: "user", title: "Statement uploaded" },
        { time: "15:05", type: "system", title: "Manual ledger requested" }
      ]
    },
    "ses-4": {
      stage: "Complete",
      summary: "All records posted to Yardi; no open exceptions.",
      confidence: "98%",
      confidenceTone: "high",
      ledger: "Posted to Yardi",
      approved: 12,
      exceptions: 0,
      banksDone: 2,
      latency: "7.8s",
      duration: "11m",
      automation: 100,
      totalTokens: "12.2k",
      totalLatency: "7.8s",
      readout: ["Exact match rate stayed above baseline.", "Summary output was posted without reviewer override."],
      tokenBars: [
        { label: "Parsing", value: "2.1k", percent: 33 },
        { label: "Reconciliation", value: "6.4k", percent: 100 },
        { label: "Exception", value: "2.0k", percent: 31 },
        { label: "Summary", value: "1.7k", percent: 27 }
      ],
      latencyBars: [
        { label: "Parsing", value: "1.3s", percent: 31 },
        { label: "Reconciliation", value: "4.2s", percent: 100 },
        { label: "Exception", value: "0.9s", percent: 21 },
        { label: "Summary", value: "1.4s", percent: 33 }
      ],
      anomalySignals: ["No material anomaly detected", "Token use 8% below prior cycle"],
      riskRows: [
        { agent: "Parsing", risk: "Low" },
        { agent: "Reconciliation", risk: "Low" },
        { agent: "Exception", risk: "Low" },
        { agent: "Summary", risk: "Low" }
      ],
      feedbackSignals: [
        { label: "Approved as-is", value: "12" },
        { label: "Moved to exceptions", value: "0" },
        { label: "Moved to approved", value: "0" },
        { label: "Rules captured", value: "1" }
      ],
      eventTimeline: [
        { time: "08:41", type: "agent", title: "Reconciliation completed" },
        { time: "08:43", type: "system", title: "Yardi update completed" },
        { time: "08:44", type: "system", title: "Report package generated" }
      ]
    }
  };
  const dashboardRows = sessions.map((session) => {
    const property = properties.find((item) => item.name === session.property);
    const signal = sessionSignals[session.id] || sessionSignals["ses-1"];
    return {
      ...signal,
      id: session.id,
      property: session.property,
      cycle: session.cycle,
      status: session.status,
      accountant: property?.accountant || "Unassigned",
      bankCount: getPropertyBankCount(property)
    };
  });
  const selectedInsight = dashboardRows.find((row) => row.id === selectedInsightId);
  const banksDone = dashboardRows.reduce((sum, row) => sum + row.banksDone, 0);
  const banksTotal = dashboardRows.reduce((sum, row) => sum + row.bankCount, 0);
  const approvedTotal = dashboardRows.reduce((sum, row) => sum + row.approved, 0);
  const exceptionTotal = dashboardRows.reduce((sum, row) => sum + row.exceptions, 0);
  const automationRate = Math.round(
    dashboardRows.reduce((sum, row) => sum + row.automation, 0) / Math.max(dashboardRows.length, 1)
  );
  const pipelineAgents = [
    { name: "Parsing", latency: "1.9s", tokens: "2.3k" },
    { name: "Reconciliation", latency: "4.1s", tokens: "6.8k" },
    { name: "Exception", latency: "1.1s", tokens: "2.1k" },
    { name: "Summary", latency: "0.8s", tokens: "0.9k" }
  ];
  const sessionMetrics = [
    { label: "Banks reconciled", value: `${banksDone}/${banksTotal}`, meta: "Resolved across sessions" },
    { label: "Approved posted", value: String(approvedTotal), meta: "Sent to Yardi", tone: "good" },
    { label: "Exceptions", value: String(exceptionTotal), meta: "Need controller attention", tone: "attention" },
    { label: "Automation rate", value: `${automationRate}%`, meta: "Portfolio average" }
  ];

  return (
    <section className="dashboard-canvas" aria-label="Dashboard">
      <section className="dashboard-observability-strip" aria-label="AI observability">
        <section className="dashboard-metric-panel" aria-label="Portfolio metrics">
          <h2>Portfolio metrics</h2>
          <div className="session-metric-strip" aria-label="Portfolio session metrics">
            {sessionMetrics.map((metric) => (
              <DashboardMetricCell key={metric.label} metric={metric} />
            ))}
          </div>
        </section>

        <section className="dashboard-agent-panel" aria-label="Agent overview">
          <h2>Agent overview</h2>
          <div className="agent-pipeline-bar" aria-label="Average agent pipeline">
            {pipelineAgents.map((agent) => (
              <DashboardAgentChip key={agent.name} agent={agent} />
            ))}
          </div>
        </section>
      </section>

      <section className="dashboard-session-workspace" aria-label="Session overview">
        <div className="dashboard-workspace-head">
          <div>
            <h2>Session overview</h2>
            <p>Select a row to inspect token usage, latency, and anomalies.</p>
          </div>
          <button className="primary-button dashboard-new-session" type="button" onClick={onNewSession}>
            <Plus size={14} />
            New session
          </button>
        </div>

        <div className={`dashboard-workspace-grid ${selectedInsight ? "has-insight" : ""}`}>
          <div className="dashboard-session-list" aria-label="Reconciliation sessions">
            <div className="dashboard-session-columns" aria-hidden="true">
              <span>Session</span>
              <span>Summary</span>
              <span>Confidence</span>
              <span>Record exceptions</span>
              <span>Records posted</span>
              <span>Total time</span>
              <span />
            </div>
            <div className="dashboard-session-rows">
              {dashboardRows.map((row) => (
                <button
                  className={`dashboard-session-row ${selectedInsight?.id === row.id ? "selected" : ""}`}
                  key={row.id}
                  type="button"
                  aria-pressed={selectedInsight?.id === row.id}
                  onClick={() => setSelectedInsightId(row.id)}
                >
                  <span className="dashboard-session-name">
                    <strong>{row.property}</strong>
                    <small>{row.cycle} · {row.accountant}</small>
                  </span>
                  <span className="dashboard-session-summary">
                    <strong>{row.summary}</strong>
                    <small>{row.banksDone}/{row.bankCount} banks</small>
                  </span>
                  {row.stage === "Needs input" ? (
                    <span className="dashboard-confidence empty" aria-label="No confidence yet">-</span>
                  ) : (
                    <DashboardConfidenceBadge value={row.confidence} tone={row.confidenceTone} />
                  )}
                  <strong className="dashboard-session-number attention-text">{row.exceptions}</strong>
                  <strong className="dashboard-session-number">{row.approved}</strong>
                  <span className="dashboard-session-time">{row.duration}</span>
                  <span className="dashboard-session-action" aria-hidden="true">
                    <ChevronRight size={16} />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence initial={false}>
            {selectedInsight && (
              <DashboardInsightRail
                key={selectedInsight.id}
                insight={selectedInsight}
                onClose={() => setSelectedInsightId(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </section>
    </section>
  );
}

function DashboardAgentChip({ agent }) {
  return (
    <div className="dashboard-agent-chip">
      <strong>{agent.name}</strong>
      <dl>
        <div>
          <dt>Avg time</dt>
          <dd>{agent.latency}</dd>
        </div>
        <div>
          <dt>Tokens</dt>
          <dd>{agent.tokens}</dd>
        </div>
      </dl>
    </div>
  );
}

function DashboardMetricCell({ metric }) {
  return (
    <div className={`dashboard-metric-cell ${metric.tone || ""}`}>
      <span>{metric.label}</span>
      <strong>{metric.value}</strong>
      <small>{metric.meta}</small>
    </div>
  );
}

function DashboardConfidenceBadge({ value, tone }) {
  return <span className={`dashboard-confidence ${tone}`}>{value}</span>;
}

function DashboardInsightRail({ insight, onClose }) {
  return (
    <motion.aside
      className="dashboard-insight-rail"
      aria-label={`${insight.property} observability`}
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 18 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="dashboard-insight-head">
        <div>
          <span>Session insight</span>
          <strong>{insight.property}</strong>
          <p>{insight.summary}</p>
        </div>
        <button className="icon-button ghost" type="button" aria-label="Close session insight" onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <DashboardRailBlock title="Session readout" meta={insight.stage}>
        <div className="dashboard-readout-list">
          {insight.readout.map((item) => (
            <span key={item}>
              <CheckCircle2 size={13} />
              {item}
            </span>
          ))}
        </div>
      </DashboardRailBlock>

      <DashboardRailBlock title="Token usage" meta={`${insight.totalTokens} total`}>
        <div className="mini-bar-list">
          {insight.tokenBars.map((bar) => (
            <MiniDashboardBar key={bar.label} bar={bar} tone="token" />
          ))}
        </div>
      </DashboardRailBlock>

      <DashboardRailBlock title="Agent latency" meta={`${insight.totalLatency} total`}>
        <div className="mini-bar-list">
          {insight.latencyBars.map((bar) => (
            <MiniDashboardBar key={bar.label} bar={bar} tone="latency" />
          ))}
        </div>
      </DashboardRailBlock>

      <DashboardRailBlock title="Anomaly signals" meta={`${insight.anomalySignals.length} flags`}>
        <div className="dashboard-anomaly-list">
          {insight.anomalySignals.map((signal) => (
            <span key={signal}>
              <AlertTriangle size={13} />
              {signal}
            </span>
          ))}
        </div>
      </DashboardRailBlock>

      <DashboardRailBlock title="Confidence risk" meta="Agent certainty">
        <div className="dashboard-risk-list">
          {insight.riskRows.map((row) => (
            <div key={row.agent}>
              <span>{row.agent}</span>
              <strong className={row.risk.toLowerCase()}>{row.risk}</strong>
            </div>
          ))}
        </div>
      </DashboardRailBlock>

      <DashboardRailBlock title="Reviewer feedback" meta="This cycle">
        <div className="dashboard-feedback-grid">
          {insight.feedbackSignals.map((signal) => (
            <div key={signal.label}>
              <strong>{signal.value}</strong>
              <span>{signal.label}</span>
            </div>
          ))}
        </div>
      </DashboardRailBlock>

      <DashboardRailBlock title="Event timeline" meta="Audit stream">
        <ol className="dashboard-event-list">
          {insight.eventTimeline.map((event) => (
            <DashboardEventItem key={`${event.time}-${event.title}`} event={event} />
          ))}
        </ol>
      </DashboardRailBlock>
    </motion.aside>
  );
}

function DashboardRailBlock({ title, meta, children }) {
  return (
    <section className="dashboard-rail-block">
      <div className="dashboard-rail-block-head">
        <strong>{title}</strong>
        <span>{meta}</span>
      </div>
      {children}
    </section>
  );
}

function MiniDashboardBar({ bar, tone }) {
  return (
    <div className={`mini-dashboard-bar ${tone}`} style={{ "--bar-value": `${bar.percent}%` }}>
      <div>
        <span>{bar.label}</span>
        <strong>{bar.value}</strong>
      </div>
      <span className="mini-dashboard-track">
        <span />
      </span>
    </div>
  );
}

function DashboardEventItem({ event }) {
  return (
    <li className={event.type}>
      <span>{event.time}</span>
      <strong>{event.title}</strong>
    </li>
  );
}

function NewSessionLauncher({ open, properties, onClose, onSelectProperty }) {
  const [query, setQuery] = useState("");
  const visibleProperties = properties.filter((property) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return [property.name, property.code, property.address, property.market, property.owner, formatBankNames(property)]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });

  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="session-launcher-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="session-launcher"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Start a new reconciliation session"
          >
            <div className="session-launcher-head">
              <div>
                <p className="eyebrow">New session</p>
                <h2>Select a property</h2>
                <span>May 2026 reconciliation workspace</span>
              </div>
              <button className="icon-button" type="button" onClick={onClose} aria-label="Close new session">
                <X size={17} />
              </button>
            </div>
            <label className="session-launcher-search">
              <Search size={15} />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search properties"
                aria-label="Search properties for a new session"
              />
            </label>
            <div className="session-launcher-list">
              {visibleProperties.map((property) => (
                <button
                  className="session-launcher-property"
                  type="button"
                  key={property.id}
                  onClick={() => onSelectProperty(property)}
                >
                  <span>
                    <strong>{property.name}</strong>
                    <small>{property.code} · {property.address}</small>
                  </span>
                  <span className="session-launcher-meta">
                    <small>{getPropertyBankCount(property)} banks</small>
                    <strong>{property.tieOut}</strong>
                  </span>
                </button>
              ))}
              {visibleProperties.length === 0 && <div className="session-empty">No properties found</div>}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function PropertiesScreen({
  properties,
  selectedProperty,
  onSelectProperty,
  onStartSession,
  onCreateProperty,
  onUpdateProperty,
  onDeleteProperty
}) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("view");
  const [draft, setDraft] = useState(() => propertyToDraft(selectedProperty));
  const visibleProperties = properties.filter((property) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return [
      property.name,
      property.code,
      property.address,
      property.market,
      property.owner,
      property.closeStatus,
      property.ledgerSource,
      formatBankNames(property)
    ]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });

  useEffect(() => {
    if (mode === "create") return;
    setDraft(propertyToDraft(selectedProperty));
  }, [mode, selectedProperty]);

  function selectProperty(property) {
    onSelectProperty(property);
    setMode("view");
  }

  function startCreate() {
    setMode("create");
    setDraft(createEmptyPropertyDraft(properties.length + 1));
  }

  function startEdit() {
    setMode("edit");
    setDraft(propertyToDraft(selectedProperty));
  }

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function saveProperty(event) {
    event.preventDefault();
    const property = propertyFromDraft(draft, mode === "create" ? undefined : selectedProperty.id);
    if (mode === "create") {
      onCreateProperty(property);
    } else {
      onUpdateProperty(property);
    }
    setMode("view");
  }

  function removeSelectedProperty() {
    if (properties.length <= 1) return;
    onDeleteProperty(selectedProperty.id);
    setMode("view");
  }

  const editing = mode === "create" || mode === "edit";

  return (
    <section className="properties-canvas">
      <div className="properties-header">
        <div>
          <p className="eyebrow">Portfolio</p>
          <h1>Properties</h1>
          <p className="subtle">Bank coverage, ledger source, close status.</p>
        </div>
        <div className="properties-actions">
          <button className="soft-button" type="button" onClick={() => onStartSession(selectedProperty)}>
            <PlayCircle size={15} />
            Start session
          </button>
          <button className="primary-button" type="button" onClick={startCreate}>
            <Plus size={15} />
            New property
          </button>
        </div>
      </div>

      <div className="properties-workspace">
        <section className="property-table-region" aria-label="Property table">
          <div className="property-table-toolbar">
            <label className="property-search">
              <Search size={15} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search properties"
                aria-label="Search properties"
              />
            </label>
            <span>{visibleProperties.length} properties</span>
          </div>

          <div className="property-table-shell">
            <table className="property-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Banks</th>
                  <th>Ledger</th>
                  <th>Close</th>
                  <th>Open items</th>
                  <th>Tie-out</th>
                </tr>
              </thead>
              <tbody>
                {visibleProperties.map((property) => (
                  <tr
                    key={property.id}
                    className={property.id === selectedProperty.id ? "selected" : ""}
                    onClick={() => selectProperty(property)}
                  >
                    <td>
                      <div className="property-name-cell">
                        <strong>{property.name}</strong>
                        <span>{property.code} · {property.address}</span>
                      </div>
                    </td>
                    <td>
                      <div className="bank-chip-row">
                        {property.banks.slice(0, 2).map((bank) => (
                          <span key={bank.id}>{bank.type}</span>
                        ))}
                        {property.banks.length > 2 && <span>+{property.banks.length - 2}</span>}
                      </div>
                    </td>
                    <td>{property.ledgerSource}</td>
                    <td>
                      <span className="close-status">{property.closeStatus}</span>
                      <small>{property.period}</small>
                    </td>
                    <td>
                      <span className={property.openItems > 5 ? "risk-text" : ""}>
                        {property.openItems} open · {property.exceptions} exceptions
                      </span>
                    </td>
                    <td>
                      <span className={`tieout-state ${property.tieOut.toLowerCase().replaceAll(" ", "-")}`}>
                        {shortTieOutLabel(property.tieOut)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="property-inspector" aria-label="Selected property">
          {editing ? (
            <form className="property-form" onSubmit={saveProperty}>
              <div className="property-inspector-header">
                <div>
                  <p className="eyebrow">{mode === "create" ? "Create" : "Edit"}</p>
                  <h2>{mode === "create" ? "New property" : selectedProperty.name}</h2>
                </div>
                <button className="icon-button ghost" type="button" onClick={() => setMode("view")} aria-label="Cancel">
                  <X size={16} />
                </button>
              </div>
              <div className="property-form-grid">
                <label>
                  <span>Name</span>
                  <input value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} required />
                </label>
                <label>
                  <span>Code</span>
                  <input value={draft.code} onChange={(event) => updateDraft("code", event.target.value)} required />
                </label>
                <label className="wide">
                  <span>Address</span>
                  <input value={draft.address} onChange={(event) => updateDraft("address", event.target.value)} required />
                </label>
                <label>
                  <span>Market</span>
                  <input value={draft.market} onChange={(event) => updateDraft("market", event.target.value)} />
                </label>
                <label>
                  <span>Type</span>
                  <input value={draft.type} onChange={(event) => updateDraft("type", event.target.value)} />
                </label>
                <label>
                  <span>Units</span>
                  <input type="number" min="0" value={draft.units} onChange={(event) => updateDraft("units", event.target.value)} />
                </label>
                <label>
                  <span>Owner</span>
                  <input value={draft.owner} onChange={(event) => updateDraft("owner", event.target.value)} />
                </label>
                <label>
                  <span>Ledger</span>
                  <select value={draft.ledgerSource} onChange={(event) => updateDraft("ledgerSource", event.target.value)}>
                    <option>Yardi</option>
                    <option>Manual</option>
                    <option>Hybrid</option>
                  </select>
                </label>
                <label>
                  <span>Status</span>
                  <select value={draft.closeStatus} onChange={(event) => updateDraft("closeStatus", event.target.value)}>
                    <option>Ready</option>
                    <option>Parsing</option>
                    <option>Needs setup</option>
                    <option>Needs review</option>
                  </select>
                </label>
                <label>
                  <span>Period</span>
                  <select value={draft.period} onChange={(event) => updateDraft("period", event.target.value)}>
                    {cycleOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Tie-out</span>
                  <select value={draft.tieOut} onChange={(event) => updateDraft("tieOut", event.target.value)}>
                    <option>Balanced</option>
                    <option>Pending</option>
                    <option>Needs review</option>
                  </select>
                </label>
                <label>
                  <span>Open items</span>
                  <input type="number" min="0" value={draft.openItems} onChange={(event) => updateDraft("openItems", event.target.value)} />
                </label>
                <label>
                  <span>Exceptions</span>
                  <input type="number" min="0" value={draft.exceptions} onChange={(event) => updateDraft("exceptions", event.target.value)} />
                </label>
                <label className="wide">
                  <span>Banks</span>
                  <input
                    value={draft.bankDraft}
                    onChange={(event) => updateDraft("bankDraft", event.target.value)}
                    placeholder="Chase Operating, Wells Fargo Reserve"
                  />
                </label>
              </div>
              <button className="primary-button" type="submit">
                <Save size={15} />
                Save property
              </button>
            </form>
          ) : (
            <>
              <div className="property-inspector-header">
                <div>
                  <p className="eyebrow">Selected</p>
                  <h2>{selectedProperty.name}</h2>
                  <span>{selectedProperty.address}</span>
                </div>
                <div className="property-icon-actions">
                  <button className="icon-button" type="button" onClick={startEdit} aria-label="Edit property">
                    <Pencil size={16} />
                  </button>
                  <button
                    className="icon-button"
                    type="button"
                    onClick={removeSelectedProperty}
                    disabled={properties.length <= 1}
                    aria-label="Delete property"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <dl className="property-facts">
                <div>
                  <dt>Units</dt>
                  <dd>{selectedProperty.units}</dd>
                </div>
                <div>
                  <dt>Ledger</dt>
                  <dd>{selectedProperty.ledgerSource}</dd>
                </div>
                <div>
                  <dt>Open items</dt>
                  <dd>{selectedProperty.openItems}</dd>
                </div>
                <div>
                  <dt>Exceptions</dt>
                  <dd>{selectedProperty.exceptions}</dd>
                </div>
              </dl>

              <div className="property-bank-list">
                <div className="property-list-heading">
                  <strong>Associated banks</strong>
                  <span>{getPropertyBankCount(selectedProperty)} accounts</span>
                </div>
                {selectedProperty.banks.map((bank) => (
                  <div className="property-bank-row" key={bank.id}>
                    <div>
                      <strong>{bank.name}</strong>
                      <span>{bank.type}</span>
                    </div>
                    <span>{bank.account} · {bank.gl}</span>
                  </div>
                ))}
              </div>

              <button className="primary-button" type="button" onClick={() => onStartSession(selectedProperty)}>
                <PlayCircle size={15} />
                Start session
              </button>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}

function BankBoard({
  uploaded,
  bankStage,
  activeStep,
  runState,
  recordsByBank,
  comparisonProgress,
  rowExpanded,
  canStart,
  onUpload,
  onRemove,
  onStartRun,
  onManualLedgerRun,
  onToggleRow,
  onOpenReview
}) {
  const comparisonMode = ["reconciling", "review", "updating-yardi", "complete"].includes(runState);
  const uploadedBanks = banks.filter((bank) => uploaded[bank.id]);
  const readyCopy = `${uploadedBanks.length} statement${uploadedBanks.length === 1 ? "" : "s"} ready`;
  const headingHint =
    runState === "draft"
      ? "Upload statements"
      : "Statements stay visible";

  return (
    <section className="bank-board" aria-label="Associated property banks">
      <div className="board-heading">
        <div>
          <p className="eyebrow">Associated banks</p>
          <h2>Statement workspace</h2>
        </div>
        <span>{headingHint}</span>
      </div>
      <div className="bank-grid statement-list">
        {banks.map((bank) => (
          <BankTile
            key={bank.id}
            bank={bank}
            uploaded={uploaded[bank.id]}
            stage={bankStage[bank.id]}
            active={activeStep?.bankId === bank.id || bankStage[bank.id] === "scanning"}
            runState={runState}
            onUpload={() => onUpload(bank.id)}
            onRemove={() => onRemove(bank.id)}
          />
        ))}
      </div>

      {runState === "draft" && uploadedBanks.length > 0 && (
        <motion.div
          className="reconcile-start-panel"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="reconcile-ready-count">{readyCopy}</span>
          <div className="reconcile-actions">
            <button
              className="primary-button"
              type="button"
              disabled={!canStart}
              onClick={onStartRun}
              aria-label="Start reconciliation using Yardi import"
            >
              <Sparkles size={16} />
              Use Yardi
            </button>
            <button
              className="soft-button ledger-upload-action"
              type="button"
              disabled={!canStart}
              onClick={onManualLedgerRun}
              aria-label="Upload ledger for manual reconciliation"
            >
              <Upload size={16} />
              Upload ledger
            </button>
          </div>
        </motion.div>
      )}

      {comparisonMode && uploadedBanks.length > 0 && (
        <section className="reconciliation-thread" aria-label="Reconciliation results">
          <div className="board-heading compact">
            <div>
              <p className="eyebrow">Agent output</p>
              <h2>Reconciliation workspace</h2>
            </div>
            <span>Statement and Yardi ledger stay paired through review</span>
          </div>
          <div className="bank-grid comparison-list">
            {uploadedBanks.map((bank) => (
              <ComparisonBankRow
                key={bank.id}
                bank={bank}
                records={recordsByBank[bank.id]}
                progress={comparisonProgress[bank.id] || 0}
                stage={bankStage[bank.id]}
                runState={runState}
                expanded={rowExpanded[bank.id]}
                onToggle={() => onToggleRow(bank.id)}
                onOpenReview={() => onOpenReview(bank.id)}
              />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}

function BankTile({
  bank,
  uploaded,
  stage,
  active,
  runState,
  onUpload,
  onRemove
}) {
  const locked = runState !== "draft";
  const hasFile = Boolean(uploaded);
  const statusStage = hasFile ? stage : locked ? "not-included" : "waiting";
  const uploadActionLabel = hasFile ? (locked ? "Statement locked" : "Replace file") : "Upload statement";
  const UploadActionIcon = locked && hasFile ? Lock : hasFile ? RefreshCw : Upload;

  return (
    <motion.article
      layout
      className={`bank-tile ${active ? "active" : ""} ${hasFile ? "uploaded" : ""} ${!hasFile && locked ? "not-included" : ""}`}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {stage === "scanning" && <motion.div className="scan-line" layoutId={`scan-${bank.id}`} />}
      <div className="bank-main-line">
        <div className={`bank-logo ${bank.brandClass}`} aria-hidden="true">
          <img src={bank.logo} alt="" />
        </div>
        <div className="bank-identity">
          <strong>{bank.shortName}</strong>
          <span>{bank.type}</span>
        </div>
        <StageBadge stage={statusStage} />
        <div className="statement-actions">
          {locked && !hasFile ? (
            <span className="statement-static-note">Not part of this run</span>
          ) : (
            <button className="micro-button" disabled={locked} onClick={onUpload}>
              <UploadActionIcon size={14} />
              {uploadActionLabel}
            </button>
          )}
          {hasFile && !locked && (
            <button
              className="icon-button ghost statement-remove-button"
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${bank.shortName} statement`}
              title="Remove statement"
            >
              <X size={14} />
            </button>
          )}
          {hasFile && <SummaryHover bank={bank} kind="statement" />}
        </div>
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
  const headerTitle = isReviewReady ? `${bank.shortName} review packet` : `${bank.shortName} reconciliation`;
  const headerCopy = isReviewReady
    ? "Statement and ledger are paired. Exceptions are ready for review."
    : liveCopy;

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
        <div className="comparison-line-copy">
          <strong>{headerTitle}</strong>
          <span>{headerCopy}</span>
        </div>
        {isReviewReady && (
          <div className="comparison-outcomes" aria-label={`${approvedCount} approved records and ${exceptionCount} exceptions`}>
            <span className="comparison-outcome approved">
              <BadgeCheck size={13} />
              <strong>{approvedCount}</strong>
              approved
            </span>
            <span className="comparison-outcome exception">
              <AlertTriangle size={13} />
              <strong>{exceptionCount}</strong>
              exceptions
            </span>
          </div>
        )}
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
        <ComparisonBridge progress={progress} runState={runState} matchRate={records.matchRate} />
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
          <button className="row-expand-button" type="button" onClick={onToggle}>
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
                  <button className="soft-button open-review" type="button" onClick={onOpenReview} disabled={runState === "updating-yardi"}>
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
  const totalLabel = side === "statement" ? "Statement total" : "Ledger total";

  return (
    <div className={`comparison-card ${side}`}>
      <div className="comparison-card-head">
        {logo ? (
          <span className={`mini-bank-logo ${brandClass}`}>
            <img src={logo} alt="" />
          </span>
        ) : (
          <span className="ledger-mark">
            <FileSpreadsheet size={17} />
          </span>
        )}
        <div>
          <strong>{title}</strong>
          <span>{kicker}</span>
        </div>
      </div>
      <div className="comparison-card-total">
        <span>{totalLabel}</span>
        <strong>{total}</strong>
      </div>
      <div className="comparison-card-meta">
        <span className="comparison-card-file">
          <FileText size={12} />
          {meta}
        </span>
        <span>{count}</span>
      </div>
    </div>
  );
}

function ComparisonBridge({ progress, runState, matchRate }) {
  const complete = ["review", "updating-yardi", "complete"].includes(runState);
  const bridgeValue = complete ? matchRate : `${progress}%`;
  return (
    <div
      className={`comparison-bridge ${complete ? "complete" : "running"}`}
      style={{ "--bridge-progress": `${complete ? 100 : progress}%` }}
    >
      <div className="bridge-track" aria-hidden="true" />
      <span className="bridge-percent" aria-label={complete ? `${bridgeValue} match confidence` : `${bridgeValue} reconciled`}>
        {bridgeValue}
      </span>
    </div>
  );
}

function SummaryHover({ bank, kind }) {
  return (
    <span className="summary-trigger" tabIndex="0" aria-label={`${bank.shortName} parsed statement details`}>
      <CircleAlert size={13} />
      <span className="summary-popover" aria-hidden="true">
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

function StageBadge({ stage }) {
  const label =
    {
      waiting: "Missing",
      "statement-ready": "Uploaded",
      "not-included": "Not included",
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

function ProcessStatus({ runState, cycle, runTotals, yardiProgress, yardiStepIndex }) {
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
          <h2>{cycle} reconciliation is ready for controller review</h2>
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
                Run trace
              </button>
              <button
                type="button"
                role="tab"
                aria-selected="false"
                aria-disabled="true"
                className="disabled"
                disabled
                title="Settings are not configured yet"
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
                  <div className="agent-run-compact">
                    <div>
                      <strong>{focusAgent?.name || "Waiting"}</strong>
                      <span>{events.length} events</span>
                    </div>
                    <p>{focusAgent?.latest || "Upload a statement to start."}</p>
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

function DashboardStatusPill({ status }) {
  const label =
    {
      Draft: "Not started",
      "Needs input": "Needs input",
      "Needs review": "Review",
      "Ready for handoff": "Ready",
      Reconciling: "Reconciling",
      Importing: "Importing",
      Parsing: "Parsing",
      Updating: "Updating",
      Complete: "Complete"
    }[status] || status;

  return <span className={`status-pill ${status.toLowerCase().replaceAll(" ", "-")}`}>{label}</span>;
}

createRoot(document.getElementById("root")).render(<App />);
