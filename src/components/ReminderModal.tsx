import React, { useState, useEffect } from "react";
import { X, Sparkles, Copy, Check, MessageSquare, AlertCircle, RefreshCw, HelpCircle } from "lucide-react";
import { Transaction, ToneType, ReminderResponse } from "../types";
import { formatCurrency } from "../utils";
import { useLanguage } from "../LanguageContext";

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  addToast: (message: string, type: "success" | "error" | "info") => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  transaction,
  addToast,
}) => {
  const { t, language } = useLanguage();

  const [tone, setTone] = useState<ToneType>("super_friendly");
  const [customContext, setCustomContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reminder, setReminder] = useState<ReminderResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Reset form states when modal opens/closes or transaction changes
  useEffect(() => {
    if (isOpen) {
      setTone("super_friendly");
      setCustomContext("");
      setError(null);
      setReminder(null);
      setCopied(false);
    }
  }, [isOpen, transaction]);

  if (!isOpen || !transaction || (transaction.type && transaction.type !== "lent")) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setReminder(null);
    setCopied(false);

    try {
      const response = await fetch("/api/generate-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          borrowerName: transaction.borrowerName,
          relationship: transaction.relationship,
          amount: transaction.amount,
          dueDate: transaction.dueDate,
          lendingDate: transaction.lendingDate,
          purpose: transaction.purpose,
          tone: tone,
          additionalNotes: customContext || transaction.additionalNotes,
          language: language, // Pass language to backend!
        }),
      });

      if (!response.ok) {
        let errorMsg = "";
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.details || errorData.message || "";
        } catch (e) {
          errorMsg = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMsg || "Failed to contact Gemini API. Please check configuration.");
      }

      const data = await response.json();
      setReminder({
        reminderText: data.reminderText,
        advice: data.advice,
      });
      addToast(t("toastGenerateSuccess"), "success");
    } catch (err: any) {
      console.error("Reminder generator error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      addToast(t("toastGenerateError"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (reminder?.reminderText) {
      navigator.clipboard.writeText(reminder.reminderText);
      setCopied(true);
      addToast(t("toastCopied"), "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const tonesList: { value: ToneType; label: string; desc: string; emoji: string }[] = [
    {
      value: "super_friendly",
      label: t("toneWarmLabel"),
      desc: t("toneWarmDesc"),
      emoji: "🌸",
    },
    {
      value: "polite_professional",
      label: t("toneProfLabel"),
      desc: t("toneProfDesc"),
      emoji: "👔",
    },
    {
      value: "soft_humorous",
      label: t("toneGentleLabel"),
      desc: t("toneGentleDesc"),
      emoji: "😄",
    },
    {
      value: "firm_direct",
      label: t("toneDirectLabel"),
      desc: t("toneDirectDesc"),
      emoji: "📍",
    },
  ];

  return (
    <div
      id="reminder-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
    >
      <div
        id="reminder-modal-card"
        className="relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl animate-fade-in p-5 md:p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 id="reminder-modal-title" className="text-base font-bold text-zinc-900 dark:text-zinc-50 font-sans tracking-tight">
                {t("reminderTitle")}
              </h2>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                {t("typeLent")}: {formatCurrency(transaction.amount)} {t("btnSaveChanges") === "Save Changes" ? "to" : "کو"} {transaction.borrowerName} ({t(`rel_${transaction.relationship.replace("/", "")}` as any) || transaction.relationship})
              </p>
            </div>
          </div>
          <button
            id="btn-close-reminder-modal"
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {!reminder && !loading && !error && (
          <div className="space-y-4">
            {/* Tone Selector */}
            <div>
              <label className="block text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-2">
                {t("reminderToneLabel")}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tonesList.map((t) => (
                  <button
                    key={t.value}
                    id={`btn-tone-${t.value}`}
                    type="button"
                    onClick={() => setTone(t.value)}
                    className="flex items-start gap-2.5 p-3 rounded-xl border text-start transition-all border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/10 hover:border-zinc-200 dark:hover:border-zinc-700 data-[selected=true]:border-indigo-500 data-[selected=true]:bg-indigo-50/40 dark:data-[selected=true]:bg-indigo-950/20 data-[selected=true]:ring-1 data-[selected=true]:ring-indigo-500"
                    data-selected={tone === t.value}
                  >
                    <span className="text-lg mt-0.5">{t.emoji}</span>
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 leading-tight">
                        {t.label}
                      </h4>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">
                        {t.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                {t("reminderContextLabel")}
              </label>
              <textarea
                id="textarea-custom-context"
                rows={2}
                placeholder={t("reminderContextPlaceholder")}
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                className="block w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:border-indigo-500 transition-all resize-none"
              />
              <p className="text-[9px] text-zinc-400 mt-1 leading-normal">
                {t("reminderSubtitle")}
              </p>
            </div>

            {/* Generate Action Button */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <button
                id="btn-generate-ai-reminder"
                onClick={handleGenerate}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {t("btnGenerate")}
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div id="ai-loading-state" className="flex flex-col items-center justify-center py-12 text-center space-y-3.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-4 border-indigo-100 dark:border-indigo-900 border-t-indigo-600 animate-spin"></div>
              <Sparkles className="w-4 h-4 text-indigo-500 absolute top-3 left-3 animate-pulse" />
            </div>
            <div className="space-y-1 max-w-xs">
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 font-sans animate-pulse">
                {t("btnGenerating")}
              </h4>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-relaxed">
                {language === "ur" ? "ہمارا اے آئی آپ کے تعلقات کو محفوظ رکھتے ہوئے ایک احترام والا پیغام تیار کر رہا ہے..." : "Our AI is drafting a respectful, customized message designed to preserve your valuable bond."}
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div id="ai-error-state" className="flex flex-col items-center justify-center py-8 text-center space-y-3">
            <div className="p-2.5 bg-rose-50 dark:bg-rose-950/20 rounded-full text-rose-500">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-md">
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">
                {language === "ur" ? "یاددہانی بنانے میں ناکامی" : "Reminder Generation Failed"}
              </h4>
              <p className="text-[10px] text-rose-600 dark:text-rose-400 leading-relaxed">
                {error}
              </p>
            </div>
            <div className="flex gap-2.5 pt-1.5">
              <button
                id="btn-error-retry"
                onClick={handleGenerate}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {language === "ur" ? "دوبارہ کوشش کریں" : "Try Again"}
              </button>
              <button
                id="btn-error-change-tone"
                onClick={() => setError(null)}
                className="px-3.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 transition-colors"
              >
                {language === "ur" ? "تبدیل کریں" : "Change Options"}
              </button>
            </div>
          </div>
        )}

        {/* Success State */}
        {reminder && !loading && !error && (
          <div className="space-y-4">
            {/* The Draft Area */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3" />
                  {t("reminderDraftLabel")}
                </span>
                <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 px-2.5 py-0.5 rounded-full font-medium">
                  {tonesList.find((t) => t.value === tone)?.label}
                </span>
              </div>
              <div
                id="reminder-draft-container"
                className="relative bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 md:p-5"
              >
                <p id="generated-reminder-text" className="text-zinc-800 dark:text-zinc-200 text-xs md:text-sm leading-relaxed whitespace-pre-line select-text pb-10">
                  {reminder.reminderText}
                </p>
                <button
                  id="btn-copy-reminder"
                  onClick={handleCopy}
                  className="absolute bottom-2.5 right-2.5 p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-950 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 shadow-xs transition-all flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[10px] font-medium text-emerald-500">{t("btnCopied")}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-medium">{t("btnCopy")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Relationship Advice */}
            <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/40 rounded-xl space-y-1">
              <h5 className="text-[10px] font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3 h-3" />
                {t("reminderAdviceLabel")}
              </h5>
              <p id="ai-advice-text" className="text-[11px] text-indigo-950/80 dark:text-indigo-200/90 leading-relaxed font-sans font-medium">
                {reminder.advice}
              </p>
            </div>

            {/* Actions Footer */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                id="btn-remind-change-options"
                onClick={() => {
                  setReminder(null);
                  setError(null);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {language === "ur" ? "لہجہ یا نوٹس تبدیل کریں" : "Change Tone or Notes"}
              </button>
              <div className="flex w-full sm:w-auto gap-2.5">
                <button
                  id="btn-close-success"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 text-xs font-semibold shadow-xs transition-colors text-center"
                >
                  {language === "ur" ? "بند کریں" : "Close Draft"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
