# Wasool AI (وصول اے آئی) 🤝💸

> **Empathetic Debt Management & Relationship-First AI Reminder Generator**

Wasool AI helps you track money lent to or borrowed from friends, family, and colleagues, while drafting polite, non-confrontational reminder messages using AI so you get repaid without jeopardizing important relationships.

🌐 **Live Demo:** [https://agent-6a60bfc87dee6900f8574be1--wasool-ai.netlify.app/](https://agent-6a60bfc87dee6900f8574be1--wasool-ai.netlify.app/)

---

## 🌟 Features

### 1. 📊 Financial Analytics Dashboard
- **Comprehensive Overview:** Real-time metrics for **Total Lent**, **Total Recovered**, **Total Borrowed**, **Total Repaid**, **Pending Amount**, and **Overdue Amount**.
- **Dual Transaction Support:** Manage both money you have lent to others and money you have borrowed from others in a single unified interface.
- **Status Badges:** Clear visual indicators for **Pending**, **Overdue**, and **Fully Repaid / Recovered** debts.

### 2. 🤖 Relationship-First AI Reminder Generator
- **Powered by Google Gemini AI:** Uses advanced generative language models with intelligent multi-model fallbacks (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`, etc.).
- **4 Custom Tone Presets:**
  - 💛 **Warm & Casual:** Super relaxed, prioritizes friendship, includes friendly emojis.
  - 💼 **Polite & Professional:** Clear, respectful, and structured. Ideal for colleagues or acquaintances.
  - 😄 **Warm & Friendly:** Lighthearted with a subtle touch of humor to ease social friction naturally.
  - 🎯 **Polite & Direct:** Straightforward and factual, ideal for overdue debts or formal arrangements.
- **Relationship Context Awareness:** Customizes reminder messaging based on borrower relationship (*Friend, Brother, Sister, Father, Mother, Cousin, Colleague, Classmate, Neighbor, etc.*).
- **Custom Context Input:** Add custom notes for the AI (e.g. *"He promised to pay on Tuesday"* or *"Remind him about the dinner bill"*).
- **AI Relationship Advice:** Provides a short, actionable tip alongside every message draft explaining why the message works.

### 3. 🌐 Full Bilingual & RTL Support (English & Urdu)
- **Instant Language Switching:** Seamlessly toggle between **English** and **Urdu (اردو)**.
- **Native RTL Layouts:** Full Right-To-Left (RTL) interface adjustment when Urdu is selected.
- **Localized Messages:** AI drafts reminders in the active UI language (English or Urdu/Roman Urdu).

### 4. 🔍 Advanced Searching, Filtering & Sorting
- **Real-Time Search:** Search transactions by borrower name, lender name, or relationship tag.
- **Filter Controls:** Filter by status (*Pending, Overdue, Paid*), transaction type (*Lent vs. Borrowed*), and relationship.
- **Sorting Options:** Sort transactions by **Date**, **Amount**, or **Borrower Name**.

### 5. ⚡ Local Data Persistence & Privacy
- **Instant Client Storage:** Saves all transaction data locally in browser `localStorage`.
- **Zero Registration Required:** Start tracking immediately with complete privacy.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React Icons
- **Backend / AI Integration:** Express.js server, `@google/genai` (Google Gemini SDK)
- **Deployment:** Vercel / Netlify / Cloud Run ready with Serverless API handlers

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or higher
- **npm** or **bun** / **yarn**
- **Google Gemini API Key**: Obtain a free API key from [Google AI Studio](https://aistudio.google.com/).

### Installation

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
   Create a `.env` file in the root directory (or copy from `.env.example`):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## 📦 Deployment Guide

### Deploying to Netlify

1. Connect your repository to Netlify.
2. Set Build Command: `npm run build`
3. Set Publish Directory: `dist`
4. In **Site Configuration > Environment Variables**, add:
   - `GEMINI_API_KEY` = *your_gemini_api_key*
5. Deploy!

### Deploying to Vercel

1. Import your project into Vercel.
2. The included `vercel.json` and `/api` serverless routes automatically handle API requests.
3. In **Settings > Environment Variables**, add:
   - `GEMINI_API_KEY` = *your_gemini_api_key*
4. Click **Deploy**.

---

## 🔐 Environment Variables

| Variable | Description | Required |
| :--- | :--- | :---: |
| `GEMINI_API_KEY` | Google Gemini API key for AI reminder generation | Yes |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).