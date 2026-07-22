# Wasool AI (وصول اے آئی) 🤝💸

<p align="center">
  <strong>Empathetic Debt Tracking & Relationship-First AI Reminder Generator</strong>
</p>

<p align="center">
  <a href="https://agent-6a60bfc87dee6900f8574be1--wasool-ai.netlify.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live_Demo-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Gemini_AI-2.5_Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
</p>

---

## 📌 1. About Wasool AI

### What It Does
**Wasool AI** is a relationship-first debt management platform that helps users track personal loans (money lent or borrowed) and generate empathetic, polite, AI-powered repayment reminders tailored to specific personal or professional relationships.

### The Real Problem It Solves
Asking friends, family members, roommates, or colleagues to repay money is notoriously awkward, uncomfortable, and socially risky. People often delay asking for their own money back out of fear of looking aggressive, rude, or desperate—eventually leading to forgotten debts, strained relationships, or lost money.

### Who It Is For
- **Friends & Family:** Individuals lending small or large amounts to close relations who want a gentle way to follow up.
- **Roommates & Classmates:** People splitting rent, utilities, or event bills who need quick, friendly reminders.
- **Freelancers & Small Business Owners:** Independent workers needing professional yet courteous follow-up messages for clients or acquaintances.

---

## 🌐 2. Live Demo

🚀 **Clickable Live Application URL:**  
👉 **[https://agent-6a60bfc87dee6900f8574be1--wasool-ai.netlify.app/](https://agent-6a60bfc87dee6900f8574be1--wasool-ai.netlify.app/)**

---

## ✨ 3. Comprehensive Features List

- 📊 **Financial Analytics Dashboard:** Real-time visibility into **Total Lent**, **Total Recovered**, **Total Borrowed**, **Total Repaid**, **Pending Amount**, and **Overdue Amount**.
- 🔄 **Dual Transaction Tracking:** Seamlessly record both money you have lent (*receivables*) and money you have borrowed (*payables*).
- 🤖 **Relationship-First AI Reminder Generator:** Context-aware AI engine that crafts personalized reminder messages designed to preserve trust and friendship.
- 🎭 **4 Tone Presets:**
  - 💛 **Warm & Casual:** Low-pressure, relaxed, and friendly with emojis.
  - 💼 **Polite & Professional:** Formal, clean, and respectful.
  - 😄 **Soft & Humorous:** Lighthearted with gentle humor to break social tension.
  - 🎯 **Firm & Direct:** Clear, factual, and respectful for overdue debts.
- 💡 **AI Relationship Tips:** Provides expert advice alongside each message draft explaining why the message works well for that relationship.
- 🌐 **Full Bilingual & Native RTL Support (English & Urdu):** Complete interface and AI reminder generation in **English** and **Urdu (اردو)** with full Right-To-Left alignment.
- 🔍 **Search, Filter & Sort:** Search transactions by name or relationship tag; filter by status (*Pending, Overdue, Paid*) or type (*Lent vs. Borrowed*); sort by date, amount, or name.
- 🔒 **Privacy-First Local Persistence:** Operates directly inside browser `localStorage` without requiring sign-up or exposing sensitive financial records.

---

## 🤖 4. The AI Feature & System Prompt

### What the AI Feature Does
The AI Reminder Generator accepts context regarding a debt—including the borrower's name, relationship (*Friend, Brother, Sister, Father, Colleague, Cousin, etc.*), lent amount, dates, loan purpose, tone selection, user notes, and language—and crafts a ready-to-send reminder message along with an actionable communication tip.

### System Prompt & Instructions
The backend utilizes the following prompt architecture sent to Google Gemini models:

```text
You are Wasool AI, an expert interpersonal relationship advisor and empathetic copywriter.
Generate a polite, relationship-preserving reminder message for a debt based on these details:

- Borrower's Name: {borrowerName}
- Relationship: {relationship} (e.g., Friend, Sibling, Cousin, Coworker)
- Lent Amount: {formattedAmount}
- Lent Date: {lendingDate}
- Due Date: {dueDate}
- Purpose/Reason for loan: {purpose}
- Tone requested: {tone} ({toneDescription})
- Custom user notes/context: {additionalNotes}

LANGUAGE & CULTURAL REQUIREMENTS:
- Write both the "reminderText" and "advice" in the user's selected language (English or natural, respectful Urdu).
- Use proper Unicode script for Urdu with respectful terms of address ("Aap").

Instructions:
1. Write a direct copy-pasteable reminder message matching the specified tone and relationship.
2. Ensure the text feels custom, natural, and non-robotic.
3. Do not sound passive-aggressive, confrontational, or preachy.
4. Avoid placeholders like "[Insert Date Here]".
5. Generate a short relationship advice tip (1-2 sentences) explaining why this message works.
```

---

## 🛠️ 5. Tools, Services & AI Models Used

| Category | Tools & Services Used |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Tailwind CSS, Lucide React Icons, Motion |
| **Build & Tooling** | Vite, ESBuild, TSX |
| **Backend & API** | Express.js / Node.js Serverless API endpoints (`/api/generate-reminder`) |
| **AI Models & SDK** | Google Gen AI SDK (`@google/genai`) using `gemini-2.5-flash` with multi-model fallbacks (`gemini-2.0-flash`, `gemini-1.5-flash`) |
| **Deployment & Hosting** | Netlify & Vercel Serverless Functions |

---

## 📸 6. Application Screenshots

### Screen 1: Financial Analytics Dashboard
> *Real-time metrics overview displaying Total Lent, Recovered, Borrowed, and Repaid balances alongside search and filter controls.*

![image alt](https://github.com/Mandistani/wasool-ai/blob/c7fe64be1dd0664a967eff865102c3f2b0e199e3/dashboard.png)
*(Main interface showing transaction list, status tags, and quick-action buttons)*

---

### Screen 2: Relationship-First AI Reminder Generator
> *Interactive modal showing custom tone selection, relationship tags, generated AI draft, and relationship advice tip.*

[ ![Image Alt]([image_url](https://github.com/Mandistani/wasool-ai/blob/b69573ad312b8ed590d0f8ca50754b17d8f161f2/screenshots/dashboard.png.png))](https://github.com/Mandistani/wasool-ai/blob/main/screenshots/dashboard.png.png?raw=true)
*(Drafting empathetic reminders in 4 distinct tones with copy-to-clipboard functionality)*

---

### Screen 3: Bilingual Urdu (RTL) View
> *Full Urdu language experience with native Right-To-Left layout and localized Urdu AI reminder drafts.*

![Urdu RTL Interface](screenshots/urdu.png)
*(Native Urdu interface with localized navigation, metrics, and Urdu AI drafts)*

---

## 💻 7. How to Run the Project Locally

### Prerequisites
- **Node.js** (v18.x or higher)
- **npm** (or `bun` / `yarn`)
- A free **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### Step-by-Step Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/wasool-ai.git
   cd wasool-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. **Access the App:**
   Open your browser at `http://localhost:3000`.

---

## 📄 License

This project is open-source and released under the **MIT License**.
