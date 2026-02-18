/**
 * Standard page sizes in points (1 point = 1/72 inch)
 */
export const PAGE_SIZES = {
  A4: { width: 595.28, height: 841.89 },
  Letter: { width: 612, height: 792 },
  Legal: { width: 612, height: 1008 },
  A3: { width: 841.89, height: 1190.55 },
  A5: { width: 419.53, height: 595.28 },
} as const;

export type PageSize = keyof typeof PAGE_SIZES;

export function getPageDimensions(size: PageSize): { width: number; height: number } {
  return PAGE_SIZES[size];
}
