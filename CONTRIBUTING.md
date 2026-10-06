# Contributing to TenderDesk

Thank you for your interest in contributing to **TenderDesk**! We welcome contributions, bug reports, and feature suggestions.

---

## 🚀 How to Contribute

### 1. Fork & Clone
Fork the repository on GitHub and clone your fork locally:
```bash
git clone https://github.com/<your-username>/tenderdesk.git
cd tenderdesk
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

### 4. Running the Development Server
```bash
npm run dev
```

### 5. Running Tests & Type Checks
Before submitting a pull request, ensure all tests and type checks pass cleanly:
```bash
# Run Vitest test suite
npm test

# Run TypeScript type checks
npm run typecheck

# Run production build validation
npm run build
```

---

## 📋 Code Guidelines

- **TypeScript:** Use strict TypeScript types. Avoid using `any`.
- **Client-Side First:** All features must execute 100% locally inside the browser. Do not introduce backend servers or persistent external databases.
- **i18n:** Add user-facing strings to both `src/i18n/en.ts` and `src/i18n/bn.ts`.
- **Testing:** Add Vitest unit tests in `tests/` for any new business logic or utilities.

---

## 🤝 Code of Conduct

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
