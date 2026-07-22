import { useState, useEffect, useMemo } from "react";
import {
  PlusCircle,
  Search,
  Filter,
  Landmark,
  Sparkles,
  Edit2,
  Trash2,
  CheckCircle,
  RefreshCw,
  ArrowUpDown,
  MessageSquare,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import { Transaction } from "./types";
import {
  getTodayDateString,
  updateTransactionStatuses,
  calculateAnalytics,
  formatCurrency,
  formatDateFriendly,
} from "./utils";
import { Analytics } from "./components/Analytics";
import { TransactionFormModal } from "./components/TransactionFormModal";
import { ReminderModal } from "./components/ReminderModal";
import { EmptyState } from "./components/EmptyState";
import { ToastContainer, ToastItem } from "./components/Toast";
import { useLanguage, Language } from "./LanguageContext";

export default function App() {
  const { language, setLanguage, t, isRtl } = useLanguage();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid" | "overdue">("all");
  const [relationshipFilter, setRelationshipFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "lent" | "borrowed">("all");
  const [sortBy, setSortBy] = useState<"lendingDate" | "amount" | "borrowerName">("lendingDate");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Theme preference state
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("wasool_theme");
    if (saved === "dark" || saved === "light") {
      return saved;
    }
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    return "dark"; // Default to dark mode
  });

  // Sync theme to document element class
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("wasool_theme", theme);
  }, [theme]);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);

  // Delete confirmation state
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  // Toasts state
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Toast Helper
  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // 1. Initial Load & Overdue Update
  useEffect(() => {
    const saved = localStorage.getItem("wasool_transactions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Automatically check dates and update statuses of pending items to overdue
        const updated = updateTransactionStatuses(parsed);
        setTransactions(updated);
        localStorage.setItem("wasool_transactions", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to parse transactions", e);
      }
    }
  }, []);

  // 2. State Sync Helper
  const saveTransactions = (newTransactions: Transaction[]) => {
    // Keep overdue status computed on save too
    const updated = updateTransactionStatuses(newTransactions);
    setTransactions(updated);
    localStorage.setItem("wasool_transactions", JSON.stringify(updated));
  };

  // 3. CRUD Operations
  const handleAddOrEdit = (formData: {
    borrowerName: string;
    relationship: string;
    amount: number;
    lendingDate: string;
    dueDate: string;
    purpose: string;
    additionalNotes: string;
    type: "lent" | "borrowed";
  }) => {
    if (transactionToEdit) {
      // Edit mode
      const updatedList = transactions.map((t) => {
        if (t.id === transactionToEdit.id) {
          return {
            ...t,
            ...formData,
          };
        }
        return t;
      });
      saveTransactions(updatedList);
      const isLent = formData.type === "lent";
      addToast(
        isLent
          ? t("toastUpdateLent", { name: formData.borrowerName })
          : t("toastUpdateBorrowed", { name: formData.borrowerName }),
        "success"
      );
      setTransactionToEdit(null);
    } else {
      // Add mode
      const newTransaction: Transaction = {
        id: "tx_" + Date.now().toString(),
        ...formData,
        status: "pending", // default pending, recomputed on save
        createdAt: new Date().toISOString(),
      };
      saveTransactions([newTransaction, ...transactions]);
      const isLent = formData.type === "lent";
      addToast(
        isLent
          ? t("toastAddLent", { amount: formatCurrency(formData.amount), name: formData.borrowerName })
          : t("toastAddBorrowed", { amount: formatCurrency(formData.amount), name: formData.borrowerName }),
        "success"
      );
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    const target = transactions.find((t) => t.id === id);
    const updatedList = transactions.filter((t) => t.id !== id);
    saveTransactions(updatedList);
    addToast(t("toastDeleted"), "success");
    setTransactionToDelete(null);
  };

  const handleTogglePaid = (id: string) => {
    const updatedList = transactions.map((t) => {
      if (t.id === id) {
        const newStatus = t.status === "paid" ? "pending" : "paid";
        return { ...t, status: newStatus as any };
      }
      return t;
    });
    saveTransactions(updatedList);

    const updatedTx = updatedList.find((t) => t.id === id);
    if (updatedTx) {
      const isLent = (updatedTx.type || "lent") === "lent";
      if (updatedTx.status === "paid") {
        addToast(
          isLent
            ? t("toastRecovered", { amount: formatCurrency(updatedTx.amount), name: updatedTx.borrowerName })
            : t("toastRepaid", { amount: formatCurrency(updatedTx.amount), name: updatedTx.borrowerName }),
          "success"
        );
      } else {
        addToast(
          isLent
            ? t("toastReopenedLent", { amount: formatCurrency(updatedTx.amount), name: updatedTx.borrowerName })
            : t("toastReopenedBorrowed", { amount: formatCurrency(updatedTx.amount), name: updatedTx.borrowerName }),
          "info"
        );
      }
    }
  };

  // Get dynamic unique relationships for the filter dropdown
  const uniqueRelationships = useMemo(() => {
    const set = new Set(transactions.map((t) => t.relationship));
    return Array.from(set);
  }, [transactions]);

  // 4. Analytics Summary Calculation
  const analyticsSummary = useMemo(() => {
    return calculateAnalytics(transactions);
  }, [transactions]);

  // 5. Filter and Sort logic
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.borrowerName.toLowerCase().includes(q) ||
          t.relationship.toLowerCase().includes(q) ||
          t.purpose.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }

    // Relationship filter
    if (relationshipFilter !== "all") {
      result = result.filter((t) => t.relationship === relationshipFilter);
    }

    // Type filter
    if (typeFilter !== "all") {
      result = result.filter((t) => {
        const tType = t.type || "lent";
        return tType === typeFilter;
      });
    }

    // Sort
    result.sort((a, b) => {
      let fieldA: any = a[sortBy];
      let fieldB: any = b[sortBy];

      if (typeof fieldA === "string") {
        fieldA = fieldA.toLowerCase();
        fieldB = fieldB.toLowerCase();
      }

      if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, searchTerm, statusFilter, relationshipFilter, typeFilter, sortBy, sortOrder]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc"); // default new sort to desc
    }
  };

  return (
    <div
      id="wasool-app"
      className="min-h-screen bg-zinc-50/70 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 selection:bg-indigo-100 selection:text-indigo-900 pb-12 transition-colors duration-300"
    >
      {/* Dynamic Toasts Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Main Header / Navigation */}
      <header
        id="app-header"
        className="sticky top-0 z-30 w-full border-b border-zinc-100 dark:border-zinc-900 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              id="brand-logo"
              className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 dark:shadow-none shrink-0 animate-fade-in"
            >
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h1
                id="brand-name"
                className="text-md font-bold text-zinc-900 dark:text-zinc-50 font-sans tracking-tight flex items-center gap-1.5"
              >
                Wasool AI
              </h1>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium leading-none">
                {t("brandDesc")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="relative">
              <select
                id="lang-selector"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="block ps-7 pe-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[11px] bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none font-semibold shadow-xs"
              >
                <option value="en">🇬🇧 En</option>
                <option value="ur">🇵🇰 اردو</option>
              </select>
              <div className="absolute inset-y-0 start-0 ps-2 flex items-center pointer-events-none">
                <Globe className="w-3 h-3 text-zinc-400" />
              </div>
            </div>

            {/* Theme Switcher Toggle */}
            <button
              id="theme-toggle"
              onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
              className="p-1.5 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all shadow-xs"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-indigo-500" />
              )}
            </button>

            {/* Add New Debt Button */}
            <button
              id="btn-add-debt"
              onClick={() => {
                setTransactionToEdit(null);
                setIsFormOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t("addNewDebt")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="app-main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 space-y-5">
        {/* Top Hero Pitch / Greeting */}
        <section
          id="hero-banner"
          className="p-4 md:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="space-y-1.5 max-w-2xl">
            <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-50 font-sans tracking-tight flex items-center gap-2">
              {t("heroTitle")}{" "}
              <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 animate-pulse" />
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {t("heroDesc")}
            </p>
          </div>
          <div className="shrink-0 flex gap-2">
            <div className="p-2 bg-zinc-50 dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800 rounded-xl flex items-center gap-1.5">
              <span className="text-lg">🤝</span>
              <div className="text-start">
                <p className="text-[9px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  {t("tonePresets")}
                </p>
                <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-100 leading-tight">
                  {t("tonePresetsDesc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Section */}
        {transactions.length > 0 && (
          <section id="analytics-section">
            <Analytics summary={analyticsSummary} />
          </section>
        )}

        {/* Filter and Table Container */}
        {transactions.length === 0 ? (
          <EmptyState
            onAddFirst={() => {
              setTransactionToEdit(null);
              setIsFormOpen(true);
            }}
          />
        ) : (
          <div id="debts-directory" className="space-y-3.5">
            {/* Control Bar: Search & Filter Panel */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-2.5 p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-xl shadow-xs">
              {/* Search input */}
              <div className="relative w-full lg:max-w-xs rounded-lg shadow-xs">
                <div className="absolute inset-y-0 start-0 ps-2.5 flex items-center pointer-events-none">
                  <Search className="h-3.5 w-3.5 text-zinc-400" />
                </div>
                <input
                  id="search-input"
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full ps-8 pe-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-all"
                />
              </div>

              {/* Filtering Controls */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                {/* Status Filter */}
                <div className="flex items-center gap-1">
                  <Filter className="w-3 h-3 text-zinc-400 shrink-0" />
                  <select
                    id="filter-status"
                    value={statusFilter}
                    onChange={(e: any) => setStatusFilter(e.target.value)}
                    className="block px-2 py-1 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[11px] bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                  >
                    <option value="all">{t("allStatuses")}</option>
                    <option value="pending">{t("statusPending")}</option>
                    <option value="overdue">{t("statusOverdue")}</option>
                    <option value="paid">{t("statusPaid")}</option>
                  </select>
                </div>

                {/* Relationship Filter */}
                <select
                  id="filter-relationship"
                  value={relationshipFilter}
                  onChange={(e) => setRelationshipFilter(e.target.value)}
                  className="block px-2 py-1 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[11px] bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  <option value="all">{t("allRelationships")}</option>
                  {uniqueRelationships.map((rel) => (
                    <option key={rel} value={rel}>
                      {t(`rel_${rel.replace("/", "")}` as any) || rel}
                    </option>
                  ))}
                </select>

                {/* Transaction Type Filter */}
                <select
                  id="filter-type"
                  value={typeFilter}
                  onChange={(e: any) => setTypeFilter(e.target.value)}
                  className="block px-2 py-1 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[11px] bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  <option value="all">{t("allTypes")}</option>
                  <option value="lent">{t("typeLent")}</option>
                  <option value="borrowed">{t("typeBorrowed")}</option>
                </select>

                <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block"></div>

                {/* Sorting Controls */}
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider hidden sm:block">
                    {t("sortBy")}
                  </span>
                  <button
                    id="sort-btn-date"
                    onClick={() => toggleSort("lendingDate")}
                    className={`inline-flex items-center gap-1 px-2 py-1 border rounded-lg text-[11px] transition-all ${
                      sortBy === "lendingDate"
                        ? "border-indigo-500 bg-indigo-50/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                        : "border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    <span>{t("sortDate")}</span>
                    <ArrowUpDown className="w-2.5 h-2.5" />
                  </button>

                  <button
                    id="sort-btn-amount"
                    onClick={() => toggleSort("amount")}
                    className={`inline-flex items-center gap-1 px-2 py-1 border rounded-lg text-[11px] transition-all ${
                      sortBy === "amount"
                        ? "border-indigo-500 bg-indigo-50/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                        : "border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    <span>{t("sortAmount")}</span>
                    <ArrowUpDown className="w-2.5 h-2.5" />
                  </button>

                  <button
                    id="sort-btn-name"
                    onClick={() => toggleSort("borrowerName")}
                    className={`inline-flex items-center gap-1 px-2 py-1 border rounded-lg text-[11px] transition-all ${
                      sortBy === "borrowerName"
                        ? "border-indigo-500 bg-indigo-50/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                        : "border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    <span>{t("sortName")}</span>
                    <ArrowUpDown className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid list of debts */}
            {filteredAndSortedTransactions.length === 0 ? (
              <div
                id="no-search-results"
                className="text-center p-12 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-xs"
              >
                <Search className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {t("searchEmptyTitle")}
                </h4>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  {t("searchEmptyDesc")}
                </p>
                <button
                  id="btn-reset-filters"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setRelationshipFilter("all");
                    setTypeFilter("all");
                  }}
                  className="mt-4 px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl text-zinc-600 hover:bg-zinc-50 transition-all dark:text-zinc-350 dark:hover:bg-zinc-850"
                >
                  {language === "ur" ? "فلٹرز صاف کریں" : "Clear Filters"}
                </button>
              </div>
            ) : (
              <div id="transactions-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredAndSortedTransactions.map((tx) => {
                  const isTxOverdue = tx.status === "overdue";
                  const isTxPaid = tx.status === "paid";
                  const isLent = (tx.type || "lent") === "lent";

                  const statusStyles = {
                    paid: isLent
                      ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900/60"
                      : "bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/60 dark:border-blue-900/60",
                    overdue: "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/60 dark:border-rose-900/60",
                    pending: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/60 dark:border-amber-900/60",
                  };

                  const currentStyle = statusStyles[tx.status] || statusStyles.pending;

                  return (
                    <div
                      key={tx.id}
                      id={`tx-card-${tx.id}`}
                      className={`p-4 rounded-2xl bg-white dark:bg-zinc-900 border ${
                        isTxOverdue
                          ? "border-rose-200/50 dark:border-rose-950 ring-1 ring-rose-500/10"
                          : isLent
                          ? "border-emerald-100/70 dark:border-emerald-800/20"
                          : "border-blue-100/70 dark:border-blue-800/20"
                      } shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.01] transition-all duration-300 ease-out flex flex-col justify-between`}
                    >
                      {/* Top Row: Borrower Info */}
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border shrink-0 ${
                                isLent
                                  ? "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-900 dark:text-emerald-300"
                                  : "bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-300"
                              }`}
                            >
                              {tx.borrowerName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-1">
                                <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 font-sans tracking-tight">
                                  {tx.borrowerName}
                                </h3>
                                {/* Type Badge */}
                                {isLent ? (
                                  <span className="text-[8px] font-extrabold tracking-wider uppercase px-1 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/30 dark:border-emerald-900/30">
                                    {t("typeLent")}
                                  </span>
                                ) : (
                                  <span className="text-[8px] font-extrabold tracking-wider uppercase px-1 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/30 dark:border-blue-900/30">
                                    {t("typeBorrowed")}
                                  </span>
                                )}
                              </div>
                              <p className="text-[9px] font-medium text-zinc-400 flex items-center gap-1 mt-0.5">
                                <span>{t(`rel_${tx.relationship.replace("/", "")}` as any) || tx.relationship}</span>
                                {tx.purpose && (
                                  <>
                                    <span>•</span>
                                    <span className="truncate max-w-[80px]" title={tx.purpose}>
                                      {tx.purpose}
                                    </span>
                                  </>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentStyle} shrink-0 flex items-center gap-0.5 font-sans`}
                          >
                            {tx.status === "paid" ? (
                              <>
                                <span>🟢</span>
                                <span>{isLent ? t("badgeRecovered") : t("badgeRepaid")}</span>
                              </>
                            ) : tx.status === "overdue" ? (
                              <>
                                <span>🔴</span>
                                <span>{t("badgeOverdue")}</span>
                              </>
                            ) : (
                              <>
                                <span>🟡</span>
                                <span>{t("badgePending")}</span>
                              </>
                            )}
                          </span>
                        </div>

                        {/* Middle: Amount & Dates */}
                        <div className="mt-4 space-y-2.5">
                          <div className="flex items-baseline justify-between">
                            <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider">
                              {isLent ? t("cardAmountLent") : t("cardAmountBorrowed")}
                            </span>
                            <span
                              className={`text-lg md:text-xl font-bold tracking-tight font-sans ${
                                isTxPaid
                                  ? "text-zinc-400 line-through dark:text-zinc-600"
                                  : isLent
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-blue-600 dark:text-blue-400"
                              }`}
                            >
                              {formatCurrency(tx.amount)}
                            </span>
                          </div>

                          <div className="h-px bg-zinc-100 dark:bg-zinc-800/80"></div>

                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div>
                              <span className="block text-[9px] font-semibold text-zinc-400 uppercase tracking-wider mb-0.5 text-start">
                                {isLent ? t("cardLentDate") : t("cardBorrowedDate")}
                              </span>
                              <span className="font-semibold text-zinc-700 dark:text-zinc-300 block text-start">
                                {formatDateFriendly(tx.lendingDate)}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[9px] font-semibold text-zinc-400 uppercase tracking-wider mb-0.5 text-end">
                                {t("cardDueDate")}
                              </span>
                              <span
                                className={`font-semibold block text-end ${
                                  isTxOverdue ? "text-rose-600 dark:text-rose-400" : "text-zinc-700 dark:text-zinc-300"
                                }`}
                              >
                                {tx.dueDate ? formatDateFriendly(tx.dueDate) : t("noDueDate")}
                              </span>
                            </div>
                          </div>

                          {/* Notes */}
                          {tx.additionalNotes && (
                            <div className="mt-1.5 text-[9.5px] bg-zinc-50/50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850 p-2 rounded-lg text-zinc-500 dark:text-zinc-400 leading-relaxed italic text-start">
                              "{tx.additionalNotes}"
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bottom row: Interactive Actions */}
                      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-850/80 flex items-center justify-between gap-2.5 flex-wrap sm:flex-nowrap">
                        {/* Quick toggle paid status button */}
                        <button
                          id={`btn-toggle-paid-${tx.id}`}
                          onClick={() => handleTogglePaid(tx.id)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg transition-colors ${
                            isTxPaid
                              ? isLent
                                ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                : "bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                              : "border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-950"
                          }`}
                          title={
                            isTxPaid
                              ? isLent
                                ? "Mark as unrecovered"
                                : "Mark as unpaid"
                              : isLent
                              ? "Mark as recovered"
                              : "Mark as repaid"
                          }
                        >
                          <CheckCircle
                            className={`w-3 h-3 ${
                              isTxPaid ? (isLent ? "text-emerald-500" : "text-blue-500") : ""
                            }`}
                          />
                          <span>
                            {isTxPaid
                              ? isLent
                                ? t("badgeRecovered")
                                : t("badgeRepaid")
                              : isLent
                              ? t("btnMarkRecovered")
                              : t("btnMarkRepaid")}
                          </span>
                        </button>

                        <div className="flex items-center gap-1 ms-auto">
                          {/* Edit button */}
                          <button
                            id={`btn-edit-${tx.id}`}
                            onClick={() => {
                              setTransactionToEdit(tx);
                              setIsFormOpen(true);
                            }}
                            className="p-1.5 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors"
                            title={isLent ? t("tooltipEditLent") : t("tooltipEditBorrowed")}
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>

                          {/* Delete button */}
                          <button
                            id={`btn-delete-${tx.id}`}
                            onClick={() => setTransactionToDelete(tx)}
                            className="p-1.5 border border-rose-100 dark:border-rose-950/50 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                            title={t("tooltipDelete")}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>

                          {/* AI reminder button */}
                          {!isTxPaid && isLent && (
                            <button
                              id={`btn-remind-${tx.id}`}
                              onClick={() => {
                                setActiveTransaction(tx);
                                setIsReminderOpen(true);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[10px] rounded-lg shadow-xs transition-colors shrink-0"
                              title={t("tooltipRemind")}
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>{t("tooltipRemind")}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer
        id="app-footer"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center border-t border-zinc-100 dark:border-zinc-900 pt-6"
      >
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          {language === "ur"
            ? "وصول اے آئی — صحت مند مالیات اور خوشگوار سماجی تعلقات کو برقرار رکھنے کے لیے بنایا گیا ہے۔"
            : "Wasool AI — Created to maintain healthy finance and preserve happy social relationships."}
        </p>
      </footer>

      {/* Modals & Popups */}

      {/* Add / Edit Transaction Form Modal */}
      <TransactionFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setTransactionToEdit(null);
        }}
        onSubmit={handleAddOrEdit}
        transactionToEdit={transactionToEdit}
      />

      {/* AI Reminder Draft Modal */}
      <ReminderModal
        isOpen={isReminderOpen}
        onClose={() => {
          setIsReminderOpen(false);
          setActiveTransaction(null);
        }}
        transaction={activeTransaction}
        addToast={addToast}
      />

      {/* Delete Confirmation Modal */}
      {transactionToDelete && (
        <div
          id="delete-confirm-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div
            id="delete-confirm-card"
            className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-fade-in text-center space-y-5"
          >
            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/20 rounded-full flex items-center justify-center text-rose-500 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-md font-bold text-zinc-900 dark:text-zinc-50">{t("deleteTitle")}</h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
                {t("deleteWarning", { name: transactionToDelete.borrowerName })}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                id="btn-delete-cancel"
                onClick={() => setTransactionToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors"
              >
                {language === "ur" ? "منسوخ کریں" : "Keep Entry"}
              </button>
              <button
                id="btn-delete-confirm"
                onClick={() => handleDelete(transactionToDelete.id)}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                {t("btnDelete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
