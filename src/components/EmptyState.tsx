import React from "react";
import { PlusCircle, Landmark, Sparkles } from "lucide-react";
import { useLanguage } from "../LanguageContext";

interface EmptyStateProps {
  onAddFirst: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddFirst }) => {
  const { t } = useLanguage();

  return (
    <div
      id="empty-state-card"
      className="flex flex-col items-center justify-center text-center p-6 md:p-10 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-sm max-w-xl mx-auto my-5 transition-all animate-fade-in"
    >
      <div id="illustration-container" className="relative mb-4">
        <div className="absolute -inset-1 rounded-full bg-indigo-50 dark:bg-indigo-950/20 blur-md animate-pulse"></div>
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-md text-white">
          <Landmark className="w-7 h-7" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white border-2 border-white dark:border-zinc-900 shadow-sm animate-bounce">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      <h3 id="empty-state-title" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 font-sans tracking-tight">
        {t("emptyTitle")}
      </h3>
      <p id="empty-state-desc" className="mt-1.5 text-zinc-500 dark:text-zinc-400 max-w-sm text-xs leading-relaxed">
        {t("emptyDesc")}
      </p>

      <button
        id="btn-add-first-debt"
        onClick={onAddFirst}
        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <PlusCircle className="w-3.5 h-3.5" />
        {t("emptyBtn")}
      </button>
    </div>
  );
};
