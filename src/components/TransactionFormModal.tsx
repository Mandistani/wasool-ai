import React, { useState, useEffect } from "react";
import { X, Calendar, User, Bookmark, AlignLeft } from "lucide-react";
import { Transaction } from "../types";
import { getTodayDateString } from "../utils";
import { useLanguage } from "../LanguageContext";

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    borrowerName: string;
    relationship: string;
    amount: number;
    lendingDate: string;
    dueDate: string;
    purpose: string;
    additionalNotes: string;
    type: "lent" | "borrowed";
  }) => void;
  transactionToEdit: Transaction | null;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  transactionToEdit,
}) => {
  const { t } = useLanguage();

  const [borrowerName, setBorrowerName] = useState("");
  const [relationship, setRelationship] = useState("Friend");
  const [amount, setAmount] = useState<number | "">("");
  const [lendingDate, setLendingDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [type, setType] = useState<"lent" | "borrowed">("lent");

  // Validation error state
  const [errors, setErrors] = useState<{
    borrowerName?: string;
    amount?: string;
    dueDate?: string;
  }>({});

  const relationshipOptions = [
    "Friend",
    "Brother",
    "Sister",
    "Cousin",
    "Uncle/Aunt",
    "Classmate",
    "Colleague",
    "Neighbor",
    "Other",
  ];

  // Initialize form states
  useEffect(() => {
    if (transactionToEdit) {
      setBorrowerName(transactionToEdit.borrowerName);
      setRelationship(transactionToEdit.relationship);
      setAmount(transactionToEdit.amount);
      setLendingDate(transactionToEdit.lendingDate);
      setDueDate(transactionToEdit.dueDate);
      setPurpose(transactionToEdit.purpose);
      setAdditionalNotes(transactionToEdit.additionalNotes);
      setType(transactionToEdit.type || "lent");
    } else {
      // Defaults for a new debt
      setBorrowerName("");
      setRelationship("Friend");
      setAmount("");
      setLendingDate(getTodayDateString());
      setDueDate("");
      setPurpose("");
      setAdditionalNotes("");
      setType("lent");
    }
    setErrors({});
  }, [transactionToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!borrowerName.trim()) {
      newErrors.borrowerName = type === "lent" ? t("errNameLent") : t("errNameBorrowed");
    }

    if (amount === "" || Number(amount) <= 0) {
      newErrors.amount = t("errAmount");
    }

    if (lendingDate && dueDate && dueDate < lendingDate) {
      newErrors.dueDate = t("errDueDate");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        borrowerName: borrowerName.trim(),
        relationship,
        amount: Number(amount),
        lendingDate,
        dueDate,
        purpose: purpose.trim(),
        additionalNotes: additionalNotes.trim(),
        type,
      });
    }
  };

  return (
    <div
      id="transaction-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
    >
      <div
        id="transaction-modal-card"
        className="relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl animate-fade-in p-5 md:p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
          <h2 id="modal-title" className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-sans tracking-tight">
            {transactionToEdit ? t("formEditDebt") : t("formRecordDebt")}
          </h2>
          <button
            id="btn-close-modal"
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-3.5">
          {/* Transaction Type */}
          <div>
            <label className="block text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              {t("formTypeLabel")}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                id="btn-type-lent"
                onClick={() => setType("lent")}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  type === "lent"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300 shadow-xs"
                    : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
                }`}
              >
                <span className="text-sm">💰</span>
                <span>{t("formTypeLent")}</span>
              </button>
              <button
                type="button"
                id="btn-type-borrowed"
                onClick={() => setType("borrowed")}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  type === "borrowed"
                    ? "bg-blue-50 border-blue-500 text-blue-800 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-300 shadow-xs"
                    : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
                }`}
              >
                <span className="text-base">💸</span>
                <span>{t("formTypeBorrowed")}</span>
              </button>
            </div>
          </div>

          {/* Borrower / Lender Name */}
          <div>
            <label className="block text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              {type === "lent" ? t("formBorrowerName") : t("formLenderName")}
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-zinc-400" />
              </div>
              <input
                id="input-borrower-name"
                type="text"
                placeholder={type === "lent" ? t("formBorrowerPlaceholder") : t("formLenderPlaceholder")}
                value={borrowerName}
                onChange={(e) => setBorrowerName(e.target.value)}
                className={`block w-full ps-9 pe-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:ring-2 transition-all bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 ${
                  errors.borrowerName
                    ? "border-rose-400 focus:ring-rose-500 focus:border-rose-500"
                    : "border-zinc-200 dark:border-zinc-800 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              />
            </div>
            {errors.borrowerName && (
              <p id="error-borrower-name" className="mt-1 text-[10px] text-rose-500 font-medium">
                {errors.borrowerName}
              </p>
            )}
          </div>

          {/* Grid: Relationship & Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Relationship */}
            <div>
              <label className="block text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                {t("formRelationship")}
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                  <Bookmark className="h-4 w-4 text-zinc-400" />
                </div>
                <select
                  id="select-relationship"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="block w-full ps-9 pe-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:border-indigo-500 transition-all appearance-none"
                >
                  {relationshipOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {t(`rel_${opt.replace("/", "")}` as any)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                {type === "lent" ? t("formAmountLent") : t("formAmountBorrowed")}
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                  <span className="text-xs font-semibold text-zinc-400 select-none">Rs.</span>
                </div>
                <input
                  id="input-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  className={`block w-full ps-9 pe-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:ring-2 transition-all bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 ${
                    errors.amount
                      ? "border-rose-400 focus:ring-rose-500 focus:border-rose-500"
                      : "border-zinc-200 dark:border-zinc-800 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                />
              </div>
              {errors.amount && (
                <p id="error-amount" className="mt-1 text-[10px] text-rose-500 font-medium">
                  {errors.amount}
                </p>
              )}
            </div>
          </div>

          {/* Grid: Lending Date & Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Lending Date */}
            <div>
              <label className="block text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                {type === "lent" ? t("formDateLent") : t("formDateBorrowed")}
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                </div>
                <input
                  id="input-lending-date"
                  type="date"
                  value={lendingDate}
                  onChange={(e) => setLendingDate(e.target.value)}
                  className="block w-full ps-9 pe-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                {t("formDueDate")}
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                </div>
                <input
                  id="input-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={`block w-full ps-9 pe-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:ring-2 transition-all bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 ${
                    errors.dueDate
                      ? "border-rose-400 focus:ring-rose-500 focus:border-rose-500"
                      : "border-zinc-200 dark:border-zinc-800 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                />
              </div>
              {errors.dueDate && (
                <p id="error-due-date" className="mt-1 text-[10px] text-rose-500 font-medium">
                  {errors.dueDate}
                </p>
              )}
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              {t("formPurpose")}
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                <AlignLeft className="h-4 w-4 text-zinc-400" />
              </div>
              <input
                id="input-purpose"
                type="text"
                placeholder={t("formPurposePlaceholder")}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="block w-full ps-9 pe-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              {t("formNotes")}
            </label>
            <textarea
              id="input-notes"
              rows={2}
              placeholder={t("formNotesPlaceholder")}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="block w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800 mt-4">
            <button
              id="btn-cancel-form"
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors"
            >
              {t("btnCancel")}
            </button>
            <button
              id="btn-submit-form"
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all"
            >
              {transactionToEdit ? t("btnSaveChanges") : type === "lent" ? t("btnAddLent") : t("btnAddBorrowed")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
