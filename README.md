# TenderDesk

Tender Document Package Builder

## Overview

TenderDesk is a browser-based tool for turning tender PDF documents into a checked, correctly ordered final PDF package. It processes documents entirely locally in the user's browser, validating document requirements, checking expiry dates, detecting duplicate files, and stamping cover pages, index pages, and page footers without sending any data to external servers.

## Live Demo

[https://tenderdesk-theta.vercel.app](https://tenderdesk-theta.vercel.app)

## Screenshots

- **Status & Checklist Overview**: `screenshots/status-overview.png`
- **Package Ready State**: `screenshots/package-ready.png`

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
- Automated PDF Index / Table of Contents page with exact starting page numbers and dot leaders
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
- Dynamic PDF Index / Table of Contents Page (Page 2)
- Dynamic Page Footer Stamping (`<tender_id> | Page X of Y`)
- Bilingual Support (English / Bangla)
- Automated Vitest Test Suite (44 unit tests)

## Bonus Features Implemented

1. **PDF Index / Table of Contents Page**: Formatted Table of Contents placed on Page 2 with exact start page calculation and dot leaders.
2. **Auto-Match Documents by Filename**: Intelligent keyword matching to suggest document-to-requirement matches based on filenames.
3. **Safe PDF Error Handling**: Graceful error handling for damaged, corrupt, or password-protected PDFs without app crashes.
4. **CSV / Excel Checklist Exporter**: Instant export of requirement checklist and statuses to CSV format.
5. **Project Save & Reopen**: Full JSON project state export/import and browser `localStorage` session auto-sync.
6. **Bangla Text PDF Rendering**: Safe Unicode text sanitization and bilingual title formatting for PDF cover and index pages.
7. **PNG Seal & Signature Placement**: Embedded PNG official seal and signature image stamping on target PDF pages.

## Known Problems / Limitations

No known issues. All 44 automated tests and production build verification passed cleanly.

## AI Tools Used

- Google Antigravity

## Most Useful AI Prompt

"Implement the TenderDesk status engine and PDF package compiler using pdf-lib to insert an English cover page at index 0, an Index page at index 1, and stamp '<tender_id> | Page X of Y' footers across all merged document pages."

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
