import React from "react";
import { DollarSign, Landmark, CheckCircle2, AlertCircle, Clock, TrendingUp } from "lucide-react";
import { AnalyticsSummary } from "../types";
import { formatCurrency } from "../utils";
import { useLanguage } from "../LanguageContext";

interface AnalyticsProps {
  summary: AnalyticsSummary;
}

export const Analytics: React.FC<AnalyticsProps> = ({ summary }) => {
  const { t } = useLanguage();

  const cards = [
    {
      id: "card-total-lent",
      title: t("totalLent"),
      value: formatCurrency(summary.totalLent),
      icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
      bg: "bg-emerald-50/30 dark:bg-emerald-950/10",
      border: "border-emerald-100/60 dark:border-emerald-900/30",
      desc: t("totalLentDesc"),
    },
    {
      id: "card-total-recovered",
      title: t("totalRecovered"),
      value: formatCurrency(summary.totalRecovered),
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      bg: "bg-emerald-50/50 dark:bg-emerald-950/20",
      border: "border-emerald-100/80 dark:border-emerald-900/40",
      desc: t("totalRecoveredDesc"),
    },
    {
      id: "card-total-borrowed",
      title: t("totalBorrowed"),
      value: formatCurrency(summary.totalBorrowed),
      icon: <TrendingUp className="w-4 h-4 text-blue-600 rotate-180" />,
      bg: "bg-blue-50/30 dark:bg-blue-950/10",
      border: "border-blue-100/60 dark:border-blue-900/30",
      desc: t("totalBorrowedDesc"),
    },
    {
      id: "card-total-repaid",
      title: t("totalRepaid"),
      value: formatCurrency(summary.totalRepaid),
      icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />,
      bg: "bg-blue-50/50 dark:bg-blue-950/20",
      border: "border-blue-100/80 dark:border-blue-900/40",
      desc: t("totalRepaidDesc"),
    },
    {
      id: "card-pending",
      title: t("pendingAmount"),
      value: formatCurrency(summary.pendingAmount),
      icon: <Clock className="w-4 h-4 text-amber-600" />,
      bg: "bg-amber-50/50 dark:bg-amber-950/20",
      border: "border-amber-100/80 dark:border-amber-900/40",
      desc: t("pendingAmountDesc"),
    },
    {
      id: "card-overdue",
      title: t("overdueAmount"),
      value: formatCurrency(summary.overdueAmount),
      icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
      bg: "bg-rose-50/50 dark:bg-rose-950/20",
      border: "border-rose-100/80 dark:border-rose-900/40",
      desc: t("overdueAmountDesc"),
    },
    {
      id: "card-active-debts",
      title: t("activeTransactions"),
      value: `${summary.activeDebtsCount} ${t(summary.activeDebtsCount === 1 ? "itemSingular" : "itemPlural")}`,
      icon: <Landmark className="w-4 h-4 text-violet-600" />,
      bg: "bg-violet-50/50 dark:bg-violet-950/20",
      border: "border-violet-100/80 dark:border-violet-900/40",
      desc: t("activeTransactionsDesc"),
    },
  ];

  return (
    <div id="analytics-section" className="w-full">
      <div className="flex items-center gap-1.5 mb-2.5">
        <TrendingUp className="w-4 h-4 text-indigo-500" />
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {t("summaryTitle")}
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            id={card.id}
            className={`col-span-1 p-3.5 rounded-xl border ${card.bg} ${card.border} shadow-xs flex flex-col justify-between hover:shadow-sm transition-all duration-300 transform hover:-translate-y-0.5`}
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 font-sans tracking-wide uppercase leading-tight">
                {card.title}
              </span>
              <div className="p-1.5 rounded-lg bg-white dark:bg-zinc-900 shadow-xs flex-shrink-0">
                {card.icon}
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-md md:text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight font-sans">
                {card.value}
              </span>
              <p className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-0.5 leading-normal">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
