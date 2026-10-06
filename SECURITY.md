# Security Policy

## 🛡️ Security Overview

**TenderDesk** is designed from the ground up as a **100% client-side browser application**. All document processing, JSON validation, PDF page inspection, requirement matching, and future package compilation happen entirely within your local web browser.

### Key Security Guarantees:
- **Zero Server Uploads:** Your tender documents and PDFs never leave your browser.
- **No Remote Databases or Backend API Storage:** No telemetry, tracking, or document storage server is used.
- **Local Memory Execution:** Files are loaded using browser Blob/ArrayBuffer APIs and Web Crypto API.

---

## 🔒 Reporting a Vulnerability

If you discover a potential security issue or vulnerability in TenderDesk, please report it responsibly:

1. **Email:** Reach out directly to [Supan Roy](https://github.com/Supan-Roy).
2. **Details to Include:**
   - Description of the issue or vector
   - Steps to reproduce
   - Potential impact
3. **Response Time:** We aim to acknowledge reports within **48 hours** and provide a resolution timeline.

Please do **not** disclose security vulnerabilities publicly until a fix has been released.
