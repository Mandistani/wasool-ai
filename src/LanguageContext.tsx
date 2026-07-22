import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ur";

export const translations = {
  en: {
    // Brand & Header
    brandDesc: "Empathetic Debt Management",
    addNewDebt: "Add New Debt",

    // Hero Banner
    heroTitle: "Track debts without hurting relationships.",
    heroDesc: "Wasool AI helps you organize money you've lent to friends and family while generating respectful AI-powered reminder messages that preserve trust and relationships.",
    tonePresets: "Tone Presets",
    tonePresetsDesc: "4 Intelligent Styles",

    // Analytics Summary
    summaryTitle: "Your Lending & Borrowing Summary",
    totalLent: "Total Lent",
    totalLentDesc: "Total money lent",
    totalRecovered: "Total Recovered",
    totalRecoveredDesc: "Lent money received back",
    totalBorrowed: "Total Borrowed",
    totalBorrowedDesc: "Total money borrowed",
    totalRepaid: "Total Repaid",
    totalRepaidDesc: "Borrowed money paid back",
    pendingAmount: "Pending Amount",
    pendingAmountDesc: "Active unpaid items",
    overdueAmount: "Overdue Amount",
    overdueAmountDesc: "Past due date limit",
    activeTransactions: "Active Transactions",
    activeTransactionsDesc: "Unpaid & overdue count",
    itemSingular: "item",
    itemPlural: "items",

    // Search and Filters
    searchPlaceholder: "Search borrower, relationship...",
    allStatuses: "All Statuses",
    statusPending: "Pending",
    statusOverdue: "Overdue",
    statusPaid: "Fully Repaid",
    allRelationships: "All Relationships",
    allTypes: "All Types",
    typeLent: "Lent",
    typeBorrowed: "Borrowed",
    sortBy: "Sort By:",
    sortDate: "Date",
    sortAmount: "Amount",
    sortName: "Name",

    // Empty State
    emptyTitle: "No debts recorded yet",
    emptyDesc: "Keep track of the money you lend to friends, family, or colleagues, and easily generate friendly AI-powered reminders.",
    emptyBtn: "Add Your First Debt",

    // Search Empty State
    searchEmptyTitle: "No search results matching your filters",
    searchEmptyDesc: "Try adjusting your search query, status filters, or relationship tags.",

    // Debt Cards
    cardAmountLent: "Amount Lent",
    cardAmountBorrowed: "Amount Borrowed",
    cardLentDate: "Lent Date",
    cardBorrowedDate: "Borrowed Date",
    cardDueDate: "Due Date",
    daysRemaining: "{days} days remaining",
    daysOverdue: "{days} days overdue",
    dueToday: "Due today!",
    noDueDate: "No due date set",
    badgeRecovered: "Recovered",
    badgeRepaid: "Repaid",
    badgeOverdue: "Overdue",
    badgePending: "Pending",
    btnMarkRecovered: "Mark Recovered",
    btnMarkRepaid: "Mark Repaid",
    btnRecovered: "Recovered",
    btnRepaid: "Repaid",
    tooltipEditLent: "Edit Loan details",
    tooltipEditBorrowed: "Edit Borrowed details",
    tooltipDelete: "Delete Transaction",
    tooltipRemind: "Draft AI Reminder",

    // Add / Edit Form Modal
    formRecordDebt: "Record New Debt",
    formEditDebt: "Edit Debt Details",
    formTypeLabel: "Transaction Type *",
    formTypeLent: "I Lent Money",
    formTypeBorrowed: "I Borrowed Money",
    formBorrowerName: "Borrower Name *",
    formLenderName: "Lender Name *",
    formBorrowerPlaceholder: "e.g., Haris Baloch",
    formLenderPlaceholder: "e.g., Zain Ahmed",
    formRelationship: "Relationship *",
    formRelationshipPlaceholder: "e.g., Friend, Sibling, Coworker",
    formAmountLent: "Loan Amount (Rs.) *",
    formAmountBorrowed: "Borrowed Amount (Rs.) *",
    formDateLent: "Lending Date",
    formDateBorrowed: "Borrowing Date",
    formDueDate: "Due Date",
    formPurpose: "Purpose of Loan",
    formPurposePlaceholder: "e.g., Business setup, Medical emergency",
    formNotes: "Additional Notes / Custom Context",
    formNotesPlaceholder: "Any special agreement, flexible terms...",
    btnCancel: "Cancel",
    btnSaveChanges: "Save Changes",
    btnAddLent: "Add Lent Debt",
    btnAddBorrowed: "Add Borrowed Debt",

    // Validation Errors
    errNameLent: "Borrower name is required",
    errNameBorrowed: "Lender name is required",
    errAmount: "Amount must be greater than 0",
    errDueDate: "Due date cannot be earlier than start date",

    // Delete Confirmation Modal
    deleteTitle: "Delete Transaction",
    deleteWarning: "Are you sure you want to delete this debt entry for {name}? This action cannot be undone.",
    btnDelete: "Delete Entry",

    // AI Reminder Modal
    reminderTitle: "Draft Relationship-First Reminder",
    reminderSubtitle: "Let Wasool AI write a polite, non-confrontational message tailored to your relationship.",
    reminderToneLabel: "Select Message Tone",
    toneWarmLabel: "Warm & Casual",
    toneWarmDesc: "Super relaxed, highlights friendship first, includes nice emojis.",
    toneProfLabel: "Polite & Professional",
    toneProfDesc: "Clear, warm, respectful, structured. Ideal for acquaintances/colleagues.",
    toneGentleLabel: "Warm & Friendly",
    toneGentleDesc: "Friendly joke to ease any potential social friction naturally.",
    toneDirectLabel: "Polite & Direct",
    toneDirectDesc: "Straight to the facts, ideal for overdue debts or clear agreements.",
    reminderContextLabel: "Custom Context for AI (Optional)",
    reminderContextPlaceholder: "e.g., Zain said he would pay on Tuesday, or remind him about the weekend dinner...",
    btnGenerate: "Generate Reminder Draft",
    btnGenerating: "Generating draft...",
    reminderDraftLabel: "Your Generated Reminder Draft",
    reminderAdviceLabel: "Wasool AI Relationship Advice",
    btnCopy: "Copy to Clipboard",
    btnCopied: "Copied!",

    // Toast Notifications
    toastCopied: "Copied reminder draft to clipboard!",
    toastUpdateLent: "Updated loan details for {name}",
    toastUpdateBorrowed: "Updated borrowed details from {name}",
    toastAddLent: "Successfully recorded {amount} lent to {name}",
    toastAddBorrowed: "Successfully recorded {amount} borrowed from {name}",
    toastRecovered: "Marked loan of {amount} to {name} as Fully Recovered!",
    toastRepaid: "Marked debt of {amount} from {name} as Fully Repaid!",
    toastReopenedLent: "Reopened loan of {amount} to {name} as Unpaid",
    toastReopenedBorrowed: "Reopened debt of {amount} from {name} as Unpaid",
    toastDeleted: "Debt entry deleted successfully",
    toastGenerateSuccess: "Polite reminder drafted successfully!",
    toastGenerateError: "Failed to draft reminder. Please try again.",

    // Relationships
    rel_Friend: "Friend",
    rel_Brother: "Brother",
    rel_Sister: "Sister",
    rel_Father: "Father",
    rel_Mother: "Mother",
    rel_Cousin: "Cousin",
    rel_UncleAunt: "Uncle/Aunt",
    rel_Classmate: "Classmate",
    rel_Colleague: "Colleague",
    rel_Neighbor: "Neighbor",
    rel_Other: "Other",
  },
  ur: {
    // Brand & Header
    brandDesc: "قرضوں کا ہمدردانہ انتظام",
    addNewDebt: "نیا قرض شامل کریں",

    // Hero Banner
    heroTitle: "رشتوں کو نقصان پہنچائے بغیر قرضوں کا حساب رکھیں۔",
    heroDesc: "وصول اے آئی آپ کو دوستوں اور خاندان کے اراکین کو دیے گئے پیسوں کو منظم کرنے میں مدد کرتا ہے، اور ساتھ ہی احترام سے بھرپور اے آئی کی مدد سے یاددہانی کے پیغامات تیار کرتا ہے جو اعتماد اور تعلقات کو برقرار رکھتے ہیں۔",
    tonePresets: "لہجے کے انداز",
    tonePresetsDesc: "4 ذہین انداز",

    // Analytics Summary
    summaryTitle: "آپ کے لین دین کا خلاصہ",
    totalLent: "کل دیا گیا قرض",
    totalLentDesc: "کل رقم جو ادھار دی گئی",
    totalRecovered: "کل وصول شدہ",
    totalRecoveredDesc: "واپس ملنے والی رقم",
    totalBorrowed: "کل لیا گیا قرض",
    totalBorrowedDesc: "کل رقم جو ادھار لی گئی",
    totalRepaid: "کل ادا شدہ",
    totalRepaidDesc: "واپس ادا کی گئی رقم",
    pendingAmount: "بقایا رقم",
    pendingAmountDesc: "غیر ادا شدہ بقایا جات",
    overdueAmount: "تاخیر شدہ رقم",
    overdueAmountDesc: "مقررہ تاریخ سے اوپر رقم",
    activeTransactions: "فعال لین دین",
    activeTransactionsDesc: "غیر ادا شدہ اور تاخیر شدہ تعداد",
    itemSingular: "آئٹم",
    itemPlural: "آئٹمز",

    // Search and Filters
    searchPlaceholder: "قرض دار یا رشتے سے تلاش کریں...",
    allStatuses: "تمام حالتیں",
    statusPending: "بقایا",
    statusOverdue: "تاخیر شدہ",
    statusPaid: "مکمل ادا شدہ",
    allRelationships: "تمام رشتے",
    allTypes: "تمام اقسام",
    typeLent: "دیا ہوا",
    typeBorrowed: "لیا ہوا",
    sortBy: "ترتیب دیں:",
    sortDate: "تاریخ",
    sortAmount: "رقم",
    sortName: "نام",

    // Empty State
    emptyTitle: "ابھی تک کوئی قرض درج نہیں ہے",
    emptyDesc: "دوستوں، خاندان یا ساتھیوں کو دیے گئے پیسوں کا حساب رکھیں، اور آسانی سے اے آئی سے چلنے والی دوستانہ یاددہانیاں بنائیں۔",
    emptyBtn: "اپنا پہلا قرض درج کریں",

    // Search Empty State
    searchEmptyTitle: "آپ کے فلٹرز کے مطابق کوئی نتیجہ نہیں ملا",
    searchEmptyDesc: "اپنی تلاش، اسٹیٹس فلٹرز یا رشتوں کے ٹیگز تبدیل کر کے کوشش کریں۔",

    // Debt Cards
    cardAmountLent: "دی گئی رقم",
    cardAmountBorrowed: "لی گئی رقم",
    cardLentDate: "قرض دینے کی تاریخ",
    cardBorrowedDate: "قرض لینے کی تاریخ",
    cardDueDate: "واپسی کی تاریخ",
    daysRemaining: "{days} دن باقی",
    daysOverdue: "{days} دن تاخیر",
    dueToday: "آج ہی واپسی ہے!",
    noDueDate: "کوئی مقررہ تاریخ نہیں ہے",
    badgeRecovered: "وصول شدہ",
    badgeRepaid: "ادا شدہ",
    badgeOverdue: "تاخیر شدہ",
    badgePending: "بقایا",
    btnMarkRecovered: "وصول نشان زد کریں",
    btnMarkRepaid: "ادا نشان زد کریں",
    btnRecovered: "وصول شدہ",
    btnRepaid: "ادا شدہ",
    tooltipEditLent: "تفصیلات تبدیل کریں",
    tooltipEditBorrowed: "تفصیلات تبدیل کریں",
    tooltipDelete: "لین دین حذف کریں",
    tooltipRemind: "یاددہانی بنائیں (AI)",

    // Add / Edit Form Modal
    formRecordDebt: "نیا قرض درج کریں",
    formEditDebt: "قرض کی تفصیلات تبدیل کریں",
    formTypeLabel: "لین دین کی قسم *",
    formTypeLent: "میں نے قرض دیا",
    formTypeBorrowed: "میں نے قرض لیا",
    formBorrowerName: "قرض دار کا نام *",
    formLenderName: "قرض خواہ کا نام *",
    formBorrowerPlaceholder: "مثلاً حارث بلوچ",
    formLenderPlaceholder: "مثلاً زین احمد",
    formRelationship: "رشتہ *",
    formRelationshipPlaceholder: "مثلاً دوست، بھائی، ساتھی ملازم",
    formAmountLent: "قرض کی رقم (روپے) *",
    formAmountBorrowed: "لی گئی رقم (روپے) *",
    formDateLent: "دینے کی تاریخ",
    formDateBorrowed: "لینے کی تاریخ",
    formDueDate: "واپسی کی تاریخ",
    formPurpose: "قرض کا مقصد",
    formPurposePlaceholder: "مثلاً کاروبار، طبی ضرورت وغیرہ",
    formNotes: "اضافی نوٹس / مخصوص تفصیلات",
    formNotesPlaceholder: "کوئی خاص معاہدہ، لچکدار شرائط وغیرہ...",
    btnCancel: "منسوخ کریں",
    btnSaveChanges: "تبدیلیاں محفوظ کریں",
    btnAddLent: "دیا ہوا قرض شامل کریں",
    btnAddBorrowed: "لیا ہوا قرض شامل کریں",

    // Validation Errors
    errNameLent: "قرض دار کا نام ضروری ہے",
    errNameBorrowed: "قرض خواہ کا نام ضروری ہے",
    errAmount: "رقم 0 سے زیادہ ہونی چاہیے",
    errDueDate: "مقررہ تاریخ شروع کی تاریخ سے پہلے نہیں ہو سکتی",

    // Delete Confirmation Modal
    deleteTitle: "لین دین حذف کریں",
    deleteWarning: "کیا آپ واقعی {name} کا قرض کا اندراج حذف کرنا چاہتے ہیں؟ اس عمل کو واپس نہیں لیا جا سکے گا۔",
    btnDelete: "اندراج حذف کریں",

    // AI Reminder Modal
    reminderTitle: "شائستہ دوستانہ یاددہانی بنائیں",
    reminderSubtitle: "وصول اے آئی کو آپ کے رشتے کے مطابق ایک مہذب اور دوستانہ یاددہانی کا پیغام لکھنے دیں۔",
    reminderToneLabel: "پیغام کا لہجہ منتخب کریں",
    toneWarmLabel: "دوستانہ اور غیر رسمی",
    toneWarmDesc: "انتہائی لچکدار، دوستی کو اولیت دیتا ہے، اور خوبصورت ایموجیز شامل کرتا ہے۔",
    toneProfLabel: "مہذب اور پیشہ ورانہ",
    toneProfDesc: "واضح، گرمجوش، احترام والا۔ جاننے والوں یا ساتھیوں کے لیے بہترین۔",
    toneGentleLabel: "گرمجوش اور دوستانہ",
    toneGentleDesc: "کسی بھی امکانی معاشرتی ہچکچاہٹ کو دور کرنے کے لیے دوستانہ مذاق۔",
    toneDirectLabel: "مہذب اور دو ٹوک",
    toneDirectDesc: "سیدھی بات، تاخیر شدہ قرضوں یا واضح معاہدوں کے لیے بہترین۔",
    reminderContextLabel: "اے آئی کے لیے مخصوص معلومات (اختیاری)",
    reminderContextPlaceholder: "مثلاً زین نے منگل کو دینے کا کہا تھا، یا یاددہانی میں ویک اینڈ ڈنر کا ذکر کریں...",
    btnGenerate: "یاددہانی کا مسودہ بنائیں",
    btnGenerating: "مسودہ تیار ہو رہا ہے...",
    reminderDraftLabel: "تیار کردہ یاددہانی کا مسودہ",
    reminderAdviceLabel: "وصول اے آئی کا دوستانہ مشورہ",
    btnCopy: "مسودہ کاپی کریں",
    btnCopied: "کاپی ہو گیا!",

    // Toast Notifications
    toastCopied: "یاددہانی کا مسودہ کاپی کر لیا گیا ہے!",
    toastUpdateLent: "قرض کی تفصیلات {name} کے لیے اپ ڈیٹ کر دی گئیں",
    toastUpdateBorrowed: "لیے گئے قرض کی تفصیلات {name} کے لیے اپ ڈیٹ کر دی گئیں",
    toastAddLent: "کامیابی سے {amount} روپے {name} کو دیے گئے قرض کے طور پر درج کر لیے گئے",
    toastAddBorrowed: "کامیابی سے {amount} روپے {name} سے لیے گئے قرض کے طور پر درج کر لیے گئے",
    toastRecovered: "{name} کو دیا گیا {amount} کا قرض مکمل طور پر وصول شدہ نشان زد کر دیا گیا!",
    toastRepaid: "{name} سے لیا گیا {amount} کا قرض مکمل طور پر ادا شدہ نشان زد کر دیا گیا!",
    toastReopenedLent: "{name} کو دیے گئے {amount} کے قرض کو دوبارہ غیر ادا شدہ نشان زد کر دیا گیا",
    toastReopenedBorrowed: "{name} سے لیے گئے {amount} کے قرض کو دوبارہ غیر ادا شدہ نشان زد کر دیا گیا",
    toastDeleted: "اندراج کامیابی سے حذف کر دیا گیا",
    toastGenerateSuccess: "شائستہ یاددہانی کا مسودہ کامیابی سے تیار کر لیا گیا!",
    toastGenerateError: "یاددہانی کا مسودہ تیار کرنے میں ناکامی۔ دوبارہ کوشش کریں۔",

    // Relationships
    rel_Friend: "دوست",
    rel_Brother: "بھائی",
    rel_Sister: "بہن",
    rel_Father: "والد",
    rel_Mother: "والدہ",
    rel_Cousin: "کزن",
    rel_UncleAunt: "انکل / آنٹی",
    rel_Classmate: "ہم جماعت",
    rel_Colleague: "ساتھی ملازم",
    rel_Neighbor: "ہمسایہ",
    rel_Other: "دیگر",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en, params?: Record<string, string | number>) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("wasool_language");
    if (saved === "en" || saved === "ur") {
      return saved as Language;
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("wasool_language", lang);
  };

  const isRtl = language === "ur";

  useEffect(() => {
    // Handle html dir attribute
    document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", language);
    if (isRtl) {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
  }, [language, isRtl]);

  const t = (key: keyof typeof translations.en, params?: Record<string, string | number>): string => {
    const dict = translations[language];
    let text = dict[key] || translations.en[key] || String(key);

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(`{${paramKey}}`, String(paramValue));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
