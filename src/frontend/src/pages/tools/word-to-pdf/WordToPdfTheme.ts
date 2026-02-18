/**
 * Module-scoped styling configuration for Word-to-PDF tool
 * Green/white theme matching modern PDF tools (Smallpdf/iLovePDF style)
 */
export const WORD_TO_PDF_THEME = {
  primaryButton: 'bg-[#22c55e] text-white hover:bg-[#16a34a] shadow-lg hover:shadow-xl transition-all',
  primaryColor: '#22c55e',
  primaryColorHover: '#16a34a',
  accentBorder: 'border-[#22c55e]/30',
  accentBackground: 'bg-[#22c55e]/5',
} as const;
