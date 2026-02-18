import { useState, useCallback } from 'react';
import { ToolError, normalizeToolError } from '@/components/tools/toolError';

export type JobStatus = 'idle' | 'uploading' | 'processing' | 'done' | 'error';

export interface ToolJobState {
  status: JobStatus;
  progress: number;
  resultFile?: { name: string; blob: Blob };
  error?: ToolError;
}

export function useToolJob() {
  const [state, setState] = useState<ToolJobState>({
    status: 'idle',
    progress: 0,
  });

  const startProcessing = useCallback(() => {
    setState({ status: 'processing', progress: 0 });
  }, []);

  const updateProgress = useCallback((progress: number) => {
    setState((prev) => ({ ...prev, progress }));
  }, []);

  const completeProcessing = useCallback((fileName: string, blob: Blob) => {
    setState({
      status: 'done',
      progress: 100,
      resultFile: { name: fileName, blob },
    });
  }, []);

  const setError = useCallback((error: ToolError) => {
    setState({
      status: 'error',
      progress: 0,
      error,
    });
  }, []);

  const reset = useCallback(() => {
    setState({ status: 'idle', progress: 0 });
  }, []);

  const startJob = useCallback(
    async (
      jobFn: (onProgress: (progress: number) => void) => Promise<{ name: string; blob: Blob }>,
      toolId: string,
      step?: string
    ) => {
      try {
        startProcessing();
        const result = await jobFn(updateProgress);
        completeProcessing(result.name, result.blob);
      } catch (error) {
        const toolError = normalizeToolError(error, toolId, step);
        setError(toolError);
      }
    },
    [startProcessing, updateProgress, completeProcessing, setError]
  );

  return {
    jobStatus: state.status,
    progress: state.progress,
    resultFile: state.resultFile,
    error: state.error,
    startProcessing,
    updateProgress,
    completeProcessing,
    setError,
    reset,
    startJob,
  };
}
