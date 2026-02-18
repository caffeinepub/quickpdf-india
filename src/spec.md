# Specification

## Summary
**Goal:** Restore Word→PDF conversion reliability by initializing pdfMake locally with its VFS (fonts) bundle, removing any CDN/script-tag loading.

**Planned changes:**
- Update `frontend/src/components/tools/processors/conversion/wordToPdfLibraries.ts` to import `pdfmake/build/pdfmake` and `pdfmake/build/vfs_fonts` locally and explicitly set `pdfMake.vfs = pdfFonts.pdfMake.vfs`.
- Remove any remaining usage of `window.pdfMake`, CDN URLs, and `<script>` injection for pdfMake or fonts in the Word→PDF library loader.
- In `initPdfMake()`, add validation that `pdfFonts` is defined and that `pdfFonts.pdfMake.vfs` / `pdfMake.vfs` are available before reporting initialization success.
- Add initialization-time debug logs in `initPdfMake()` to print `pdfMake` and `pdfFonts` objects before any PDF generation attempts.
- Ensure initialization can recover without a page reload by adding a single retry path that clears cached initialization state once before surfacing the final error through the existing Word→PDF error flow (in English).

**User-visible outcome:** The Word→PDF tool works again without the “VFS (fonts) not available” error, and if initialization fails it retries once automatically before showing the existing error message in English.
