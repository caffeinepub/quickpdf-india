# Specification

## Summary
**Goal:** Replace the broken client-side Word-to-PDF feature with a stable upload → convert → download flow that does not use or reference pdfMake or CDN-loaded libraries.

**Planned changes:**
- Remove all pdfMake initialization/loading logic and retire any pdfMake-based Word-to-PDF modules so no routes/pages reference pdfMake.
- Rebuild the `/word-to-pdf` page UI as a simple 3-step flow: Upload `.docx` → Convert (primary green button) → Download PDF, with clear English status messages.
- Add strict frontend validation: accept only a single `.docx` file, enforce a 10MB max size, and show clear English validation errors; keep Convert disabled until valid.
- Add a backend-based conversion API endpoint and wire the frontend Convert action to upload the `.docx` and receive PDF bytes for download (with `.docx` filename converted to `.pdf`); handle backend errors with clear English messages.
- Update/remove any Word-to-PDF page copy/metadata that claims conversion happens “in your browser” and ensure UI text matches the new backend-based flow.

**User-visible outcome:** Users can upload one valid `.docx` (≤10MB), click a clear green Convert button to send it to the backend for conversion, then download the resulting `.pdf`, with straightforward English loading/success/error messages and no pdfMake-related errors.
