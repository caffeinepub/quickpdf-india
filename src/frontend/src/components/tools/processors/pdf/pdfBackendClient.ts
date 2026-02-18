/**
 * Legacy backend PDF processing client (deprecated)
 * This module is kept for compatibility but is no longer used by core PDF tools.
 * All PDF processing now happens client-side using pdf-lib.
 */

import { useActor } from '@/hooks/useActor';

// Note: These backend methods are no longer available in the current backend
// All PDF processing has been moved to client-side using pdf-lib
// This file is kept for reference but should not be imported by active tools

export function usePdfBackendClient() {
  const { actor } = useActor();
  return { actor };
}

// Legacy functions - no longer functional with current backend
export async function backendMergePdf(
  file1: File,
  file2: File,
  onProgress?: (percentage: number) => void
): Promise<{ bytes: Uint8Array; contentType: string }> {
  throw new Error(
    'Backend PDF processing is no longer available. Please use client-side processing instead.'
  );
}

export async function backendSplitPdf(
  file: File,
  onProgress?: (percentage: number) => void
): Promise<{ bytes: Uint8Array; contentType: string }> {
  throw new Error(
    'Backend PDF processing is no longer available. Please use client-side processing instead.'
  );
}

export async function backendCompressPdf(
  file: File,
  onProgress?: (percentage: number) => void
): Promise<{ bytes: Uint8Array; contentType: string }> {
  throw new Error(
    'Backend PDF processing is no longer available. Please use client-side processing instead.'
  );
}
