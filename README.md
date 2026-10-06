# TenderDesk

Tender Document Package Builder

## Overview

TenderDesk is a browser-based tool for turning tender PDF documents into a checked, correctly ordered final PDF package. It processes documents entirely locally in the user's browser, validating document requirements, checking expiry dates, detecting duplicate files, and stamping cover pages and page footers without sending any data to external servers.

## Live Demo

[https://tenderdesk-theta.vercel.app](https://tenderdesk-theta.vercel.app)

## Features

- Load tender requirements from `requirements.json`
- Tender details and requirement list overview
- Multiple PDF document upload (up to 30 files / 50 MB total)
- PDF validation, error handling, and page counting via `pdfjs-dist`
- File removal and selection management
- One-to-one document requirement matching
- Expiry date entry and automated validity checks against submission deadline
- Real-time document status engine (`MISSING`, `EXPIRY_NEEDED`, `EXPIRED`, `NOT_PROVIDED`, `OK`)
- Cryptographic exact duplicate PDF detection using browser SHA-256 content hashing
- Package generation blocking on mandatory missing or expired documents
- Ordered PDF package generation using `pdf-lib`
- Automated English cover page creation with tender details and included document checklist
- Page numbering footer (`<tender_id> | Page X of Y`) stamped on every page
- Standard package download naming (`<tender_id>_Package.pdf`)
- Bilingual interface (English and Bangla)

## How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Run automated tests
npm test

# 4. Build for production
npm run build
```

## Main Features Completed

- Requirements JSON Ingestion & Display
- PDF Upload & Inspection
- Document Matching UX
- Expiry & Status Engine
- Duplicate Detection
- PDF Package Generation & Merging
- Dynamic English Cover Page
- Dynamic Page Footer Stamping (`<tender_id> | Page X of Y`)
- Bilingual Support (English / Bangla)
- Automated Vitest Test Suite

## Bonus Features

No bonus features implemented. Main contest requirements were prioritized.

## Known Problems / Limitations

No known issues. All 28 automated tests and production build verification passed cleanly.

## AI Tools Used

- Google Antigravity

## Most Useful AI Prompt

"Implement the TenderDesk status engine and PDF package compiler using pdf-lib to insert an English cover page at index 0 and stamp '<tender_id> | Page X of Y' footers across all merged document pages."

## Technical Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- pdf-lib
- pdfjs-dist
- Vitest
- lucide-react

---

## License

[MIT License](LICENSE) — Copyright (c) 2026 Supan Roy
