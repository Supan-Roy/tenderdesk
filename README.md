# TenderDesk — Browser-Based Tender Document Package Builder

> **Prepare. Verify. Package.**  
> *A 100% frontend, privacy-focused, browser-only tool for transforming raw tender PDF attachments into checked, correctly ordered, professional PDF submission packages.*

---

## 🔗 Live Demo & Repository

- **Live Demo (HTTPS):** [https://tenderdesk-theta.vercel.app](https://tenderdesk-theta.vercel.app)
- **GitHub Repository:** [https://github.com/Supan-Roy/tenderdesk.git](https://github.com/Supan-Roy/tenderdesk.git)
- **License:** [MIT License](LICENSE) — Copyright (c) 2026 Supan Roy

---

## 📌 Overview

**TenderDesk** solves a critical organizational workflow problem for government and enterprise bidders: taking a messy collection of uploaded PDF documents (Trade Licenses, TIN Certificates, VAT Registrations, Bank Solvency Certificates, Technical & Financial Proposals) and validating them against strict tender specifications (`requirements.json`), enforcing expiry date compliance, detecting duplicate files, and compiling a single, unified PDF package complete with an **English Cover Page**, a **Table of Contents / Index Page**, and **Dynamic Page Footers** (`<tender_id> | Page X of Y`).

All document processing, hashing, PDF parsing, and compilation occur **100% locally in the user's web browser** — ensuring complete data privacy with zero server uploads, no backend databases, and full offline functionality after initial page load.

---

## 📐 System Architecture

Below is the complete client-side processing pipeline and architectural data flow of TenderDesk:

```mermaid
graph TD
    A[User / Bidder] -->|1. Ingest requirements.json| B[JSON Parser & Schema Validator]
    A -->|2. Upload PDF Documents| C[Client-Side PDF Inspector]
    
    subgraph Browser Processing Pipeline (Zero Backend)
        B --> D[Tender Workspace State Manager]
        C -->|pdfjs-dist| E[PDF Page Counter & Header Inspector]
        C -->|Web Crypto API| F[SHA-256 Binary Content Hasher]
        
        E --> G[Duplicate Content Detector]
        F --> G
        G --> D
        
        D -->|User matches file & enters expiry| H[Real-time Status Engine]
        H -->|Evaluates Invariants| I{Status Gatekeeper}
        
        I -->|MISSING / EXPIRED / EXPIRY_NEEDED| J[Block Package Generation]
        I -->|All Mandatory OK| K[Package Compiler Engine]
        
        subgraph pdf-lib Compiler Engine
            K --> L[1. Merge PDF Pages in Requirement Order]
            K --> M[2. Insert English Cover Page at Index 0]
            K --> N[3. Insert Table of Contents / Index at Index 1]
            K --> O[4. Stamp Page Footers across All Pages]
        end
    end
    
    O -->|5. Download Uint8Array| P[<tender_id>_Package.pdf Download]
    D -->|Export Action| Q[CSV Checklist Exporter]
    D -->|Save Action| R[JSON Session Serializer & LocalStorage]
```

---

## 🖼️ Screenshots

Visual proof of the application UI and screenshot assets for submission review:

- **Status & Checklist Overview:** [`screenshots/status-overview.png`](screenshots/status-overview.png)
- **Package Ready State:** [`screenshots/package-ready.png`](screenshots/package-ready.png)

---

## ✨ Exhaustive List of Main Features

### 1. Requirements JSON Ingestion & Validation
- Parses dynamic tender specifications following the official `requirements.json` schema.
- Displays Tender Metadata: **Tender ID**, **Title**, **Procuring Entity**, **Bidder Name**, and **Submission Deadline**.
- Enforces strict requirement ordering by numeric `order` field.
- Supports bilingual requirement titles in English (`title_en`) and Bangla (`title_bn`).

### 2. PDF Upload & Verification Engine
- Drag-and-drop and file-picker multi-file upload support.
- Enforces limit rules: **Maximum 30 PDF files** and **Maximum 50 MB total package size**.
- Performs magic header byte inspection (`%PDF-`) to reject non-PDF files immediately with clear error alerts.
- Extracts accurate PDF page counts using `pdfjs-dist`.

### 3. One-to-One Requirement Matching
- Enforces strict 1-to-1 matching rules: one requirement maps to at most one file; one file maps to at most one requirement.
- Interactive dropdown selectors allow changing or unmatching assignments seamlessly.
- Removing an uploaded file automatically cleans up associated requirement matches and stale expiry dates.

### 4. Real-Time Status Engine
Calculates document statuses instantly on any user action:
- `MISSING` 🔴: Mandatory requirement with no matched file.
- `NOT_PROVIDED` ⚪: Optional requirement with no matched file.
- `EXPIRY_NEEDED` 🟡: Matched document requires an expiry date that has not been entered.
- `EXPIRED` 🔴: Matched document expiry date precedes the tender submission deadline (`expiryDate < submissionDeadline`).
- `OK` 🟢: Document matched with valid expiry date ($\ge$ submission deadline) or requirement does not require expiry.

### 5. Cryptographic Exact Duplicate Detection
- Computes SHA-256 binary content hashes via the browser's native **Web Crypto API** (`crypto.subtle.digest`).
- Base hash comparison on actual PDF file bytes, **NOT filenames**.
- Flags duplicate files and prevents using duplicate content to fake separate required documents.

### 6. Package Generation Gatekeeper
- Automatically disables the **Generate Package** button whenever any mandatory document is `MISSING`, `EXPIRY_NEEDED`, `EXPIRED`, or in duplicate conflict.
- Remains enabled when optional documents are `NOT_PROVIDED` and all mandatory documents are `OK`.

### 7. PDF Package Compilation & Page Merging (`pdf-lib`)
- Compiles the final merged PDF package client-side without external server APIs.
- Preserves original PDF page dimensions, vector graphics, and text layouts.
- Merges documents strictly according to numeric requirement `order`.
- Automatically skips unmatched optional documents without creating empty pages.

### 8. Dynamic English Cover Page (Page 1)
- Rendered on A4 page layout at Page 1 (index 0).
- Includes header banner, Tender Info box (ID, Title, Procuring Entity, Bidder, Deadline, Creation Date), and **INCLUDED DOCUMENTS** table listing included requirements, filenames, and page counts.

### 9. Dynamic PDF Index / Table of Contents Page (Page 2)
- Placed on Page 2 (index 1) with subtitle *"Included Documents and Starting Pages"*.
- Calculates exact starting page numbers based on actual PDF page counts (e.g. Page 1 Cover, Page 2 Index, Page 3+ Documents).
- Uses clean dot leaders (`. . . . . .`) to align titles with right-aligned starting page numbers.

### 10. Page Footer Stamping
- Stamps standard footer `<tender_id> | Page X of Y` across **every page** in the package (including cover as Page 1 and index as Page 2).
- Positioned dynamically at `y=22` points with line separator, supporting any page size.

### 11. Package Download Naming
- Automatically triggers browser file download formatted as: `<tender_id>_Package.pdf` (e.g. `T-2026-0417_Package.pdf`).

### 12. Bilingual Interface Toggle
- Instant UI language toggle between English (`en`) and Bangla (`bn`).

---

## 🎁 Implemented Bonus Features

| # | Bonus Feature | Implementation Details |
|---|---|---|
| 1 | **PDF Index Page** | Dedicated Table of Contents at Page 2 with starting page numbers & dot leaders (`src/features/package/indexPage.ts`). |
| 2 | **Auto-Match by Filenames** | Keyword matching (`trade`, `tin`, `vat`, `bank`, `solvency`, `iso`, `proposal`) to auto-assign files to requirements (`src/features/matching/autoMatcher.ts`). |
| 3 | **Safe PDF Error Handler** | Catches `PasswordException` & `InvalidPDFException` to present readable warnings for damaged or protected PDFs (`src/features/documents/pdfUtils.ts`). |
| 4 | **CSV / Excel Checklist Export** | Exports complete requirements checklist, matched files, page counts, expiry dates, and statuses to UTF-8 BOM CSV (`src/features/tender/exporter.ts`). |
| 5 | **Save & Reopen Session** | Serializes full project state to JSON for export/import and auto-syncs session with `localStorage` (`src/features/tender/projectSerializer.ts`). |
| 6 | **Bangla Text PDF Support** | Provides safe Unicode transliteration and bilingual title formatting (`Title [Bangla Transliterated]`) to prevent PDF font encoding crashes (`src/utils/banglaPdfUtils.ts`). |
| 7 | **Official Seal & Signature Stamper** | Embeds uploaded PNG seal or signature images at specified coordinates on target PDF pages (`src/features/package/sealStamper.ts`). |

---

## 🧪 Automated Testing Suite

TenderDesk includes a comprehensive test suite built with **Vitest**. All business rules, matching invariants, status calculations, SHA-256 hashing, index page logic, and PDF generator outputs are verified automatically.

### Test Results Summary:
- **Total Test Files:** 14 passed (14)
- **Total Unit Tests:** **44 passed (44)**
- **Test Coverage:**
  - `tenderUtils.test.ts` (7 tests): JSON parsing & order sorting
  - `documentStatus.test.ts` (7 tests): Status calculation business rules
  - `matching.test.ts` (5 tests): 1-to-1 matching constraints
  - `duplicateDetector.test.ts` (6 tests): SHA-256 content duplicate detection
  - `indexPage.test.ts` (4 tests): Start page & index calculations
  - `autoMatcher.test.ts` (2 tests): Keyword auto-matching logic
  - `safePdfHandler.test.ts` (3 tests): Damaged & password-protected PDF safety
  - `exporter.test.ts` (1 test): CSV checklist export
  - `projectSerializer.test.ts` (2 tests): Project JSON import/export
  - `banglaPdfUtils.test.ts` (2 tests): Bangla text PDF sanitization
  - `sealStamper.test.ts` (1 test): PNG seal image embedding
  - `packageGenerator.test.ts` (2 tests): `pdf-lib` package compiler
  - `generatePackage.test.ts` (1 test): 6-page sample deliverable test
  - `generatePackageFromHackathonFolder.test.ts` (1 test): Official 17-page `hackathon/` sample pack compilation

---

## 🛠️ Technical Stack & Dependencies

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "pdf-lib": "^1.17.1",
    "pdfjs-dist": "^4.10.38",
    "lucide-react": "^0.475.0"
  },
  "devDependencies": {
    "typescript": "^5.7.3",
    "vite": "^6.2.0",
    "vitest": "^4.1.11",
    "@tailwindcss/vite": "^4.0.9",
    "tailwindcss": "^4.0.9"
  }
}
```

---

## 💻 How to Run Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Commands

```bash
# 1. Clone the repository
git clone https://github.com/Supan-Roy/tenderdesk.git
cd tenderdesk

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Run automated test suite
npm test

# 5. Run TypeScript typecheck
npm run typecheck

# 6. Build for production
npm run build

# 7. Preview production build locally
npm run preview
```

---

## ⚠️ Technical Debt & Known Limitations

1. **Vite Bundle Chunk Size Warning**:
   - `pdf-lib` and `pdfjs-dist` together increase the minified JS bundle size to ~1.09 MB. In production, dynamic `import()` code-splitting for PDF parsing libraries can be implemented to split vendor chunks.
2. **Client-Side Memory Utilization**:
   - Processing 30 large PDF files (>40 MB total) in memory using `pdf-lib` `ArrayBuffer` operations consumes temporary browser RAM. For low-spec mobile browsers, web workers can be used to handle PDF merging off the main UI thread.
3. **Bangla PDF Font Encoding in pdf-lib**:
   - Standard PDF fonts (Helvetica) use WinAnsi encoding. TenderDesk includes a transliteration utility (`banglaPdfUtils.ts`) to prevent PDF rendering crashes when rendering Bangla titles on PDF covers. Embedding custom TTF fonts (e.g. SolaimanLipi) would enable native complex script rendering.

---

## 🤖 AI Assistance Declaration

- **AI Tools Used:** Google Antigravity AI Pair Programmer (Gemini 3.6 Flash)
- **Most Useful AI Prompt:**
  *"Implement the TenderDesk status engine and PDF package compiler using pdf-lib to insert an English cover page at index 0, an Index page at index 1, and stamp '<tender_id> | Page X of Y' footers across all merged document pages."*

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

Copyright (c) 2026 **Supan Roy**
