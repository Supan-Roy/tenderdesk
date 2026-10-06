# TenderDesk — Tender Document Package Builder

> **Prepare. Verify. Package.**

TenderDesk helps office staff turn a collection of PDF tender documents into one complete, validated, correctly ordered PDF package — running entirely locally in your browser.

---

## 👤 Participant Details

- **Name:** Supan Roy
- **Live Demo (HTTPS):** [https://tenderdesk-theta.vercel.app](https://tenderdesk-theta.vercel.app)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn / pnpm

### Installation & Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Run automated test suite
npm test

# 4. Build for production
npm run build

# 5. Preview production build locally
npm run preview
```

---

## ✨ Features & Architecture

- **Requirements Loading:** Dynamic JSON schema ingestion (`requirements.json`).
- **Client-Side PDF Upload & Inspection:** Fast local PDF page count using `pdfjs-dist`.
- **1-to-1 Document Matching:** Interactive requirement-to-file matching workflow.
- **Expiry Validation:** Automated document validity check relative to tender submission deadline (`MISSING`, `EXPIRY_NEEDED`, `EXPIRED`, `NOT_PROVIDED`, `OK`).
- **Real-Time Status Summary:** Dynamic status checklist & blocking issue warning indicators.
- **Content Duplicate Detection:** Browser SHA-256 content hashing via Web Crypto API.
- **Bilingual Support:** Lightweight i18n supporting English (`en`) and Bangla (`bn`).
- **Automated Test Suite:** Comprehensive Vitest tests for tender JSON parsing, document status rules, matching invariants, and duplicate detection.

---

## 🎁 Bonus Features (Architected / Planned)

- Index page generation after cover
- Digital seal / signature placement
- Excel / CSV checklist export
- Local browser state persistence (Save / Reopen)
- Bangla text on generated cover & footers
- Intelligent auto-matching based on filenames
- Damaged / password-protected PDF safety handling
- Optional client-side AI document matching helper

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 6
- **Testing:** Vitest
- **Styling:** Tailwind CSS
- **PDF Libraries:** `pdf-lib` (generation/merging), `pdfjs-dist` (inspection/counting)
- **Icons:** `lucide-react`

---

## 🤖 AI Assistance Declaration

- **AI Tools Used:** Antigravity AI Pair Programmer (Gemini 3.6 Flash)
- **Most Useful Prompt:** *"Set up the initial TenderDesk repository architecture for a 90-minute AI Vibe-Coding contest following strict modular frontend boundaries."*

---

## 📄 License

[MIT License](LICENSE) — Copyright (c) 2026 Supan Roy
