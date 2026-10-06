# TenderDesk — Tender Document Package Builder

> **Prepare. Verify. Package.**

TenderDesk helps office staff turn a collection of PDF tender documents into one complete, validated, correctly ordered PDF package — running entirely locally in your browser.

---

## 👤 Participant Details

- **Name:** [YOUR_NAME_HERE]
- **Registration Number:** [YOUR_REGISTRATION_NUMBER_HERE]
- **Live Demo (HTTPS):** [YOUR_LIVE_HTTPS_URL_HERE]

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

# 3. Build for production
npm run build

# 4. Preview production build locally
npm run preview
```

---

## ✨ Features Architecture

- **Requirements Loading:** Dynamic JSON schema ingestion (`requirements.json`).
- **Client-Side PDF Upload & Inspection:** Fast local PDF page count using `pdfjs-dist`.
- **Document Matching:** Strict 1-to-1 matching between requirements and uploaded files.
- **Expiry Validation:** Automated document validity check relative to tender submission deadline (`MISSING`, `EXPIRY_NEEDED`, `EXPIRED`, `NOT_PROVIDED`, `OK`).
- **Content Duplicate Detection:** Browser SHA-256 content hashing via Web Crypto API.
- **Package Generation:** Native PDF merge with cover page and standard footers (`<tender_id> | Page X of Y`) via `pdf-lib`.
- **Bilingual Support:** Lightweight i18n supporting English (`en`) and Bangla (`bn`).

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
- **Styling:** Tailwind CSS
- **PDF Libraries:** `pdf-lib` (generation/merging), `pdfjs-dist` (inspection/counting)
- **Icons:** `lucide-react`

---

## ⚠️ Known Issues / Limitations

- Initial workspace architecture setup complete. Full workflow logic pending implementation step.

---

## 🤖 AI Assistance Declaration

- **AI Tools Used:** Antigravity AI Pair Programmer (Gemini 3.6 Flash)
- **Most Useful Prompt:** *"Set up the initial TenderDesk repository architecture for a 90-minute AI Vibe-Coding contest following strict modular frontend boundaries."*

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
