import { ReactNode, useState, useRef, useEffect } from 'react';
import { UploadDropzone } from './UploadDropzone';
import { Progress } from '@/components/ui/progress';
import { ToolResultDownload } from './ToolResultDownload';
import { TrustNotes } from '../trust/TrustNotes';
import { AdSlot } from '../ads/AdSlot';
import { ToolError, formatToolError } from './toolError';
import { ChevronDown, ChevronUp, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToolStepIndicator } from './ToolStepIndicator';
import { ToolNextStepCallout } from './ToolNextStepCallout';

interface ToolExperienceProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFileTypes: string;
  maxFiles?: number;
  fileType?: 'pdf' | 'image' | 'conversion' | 'default';
  maxFileSizeBytes?: number;
  children?: ReactNode;
  jobStatus: 'idle' | 'uploading' | 'processing' | 'done' | 'error';
  progress?: number;
  resultFile?: { name: string; blob: Blob };
  error?: ToolError;
  selectedFiles?: File[];
  onRemoveFile?: (index: number) => void;
  onStartOver?: () => void;
}

export function ToolExperience({
  onFilesSelected,
  acceptedFileTypes,
  maxFiles = 1,
  fileType = 'default',
  maxFileSizeBytes,
  children,
  jobStatus,
  progress = 0,
  resultFile,
  error,
  selectedFiles = [],
  onRemoveFile,
  onStartOver,
}: ToolExperienceProps) {
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const [showNextStepCallout, setShowNextStepCallout] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  const errorDisplay = error ? formatToolError(error) : null;

  // Determine current step
  const getCurrentStep = (): 1 | 2 | 3 => {
    if (jobStatus === 'done') return 3;
    if (selectedFiles.length > 0 && jobStatus === 'idle') return 2;
    return 1;
  };

  // Auto-scroll to options after file selection
  useEffect(() => {
    if (selectedFiles.length > 0 && children && jobStatus === 'idle') {
      setShowNextStepCallout(true);
      
      // Scroll to options section after a brief delay
      setTimeout(() => {
        optionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);

      // Hide callout after 5 seconds
      const timer = setTimeout(() => {
        setShowNextStepCallout(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [selectedFiles.length, children, jobStatus]);

  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      {(selectedFiles.length > 0 || jobStatus !== 'idle') && jobStatus !== 'error' && (
        <ToolStepIndicator currentStep={getCurrentStep()} />
      )}

      {/* Upload Section */}
      {jobStatus === 'idle' && (
        <>
          <UploadDropzone
            onFilesSelected={onFilesSelected}
            acceptedFileTypes={acceptedFileTypes}
            maxFiles={maxFiles}
            fileType={fileType}
            maxFileSizeBytes={maxFileSizeBytes}
            selectedFiles={selectedFiles}
            onRemoveFile={onRemoveFile}
          />
          {selectedFiles.length === 0 && <TrustNotes />}
        </>
      )}

      {/* Next Step Callout */}
      {showNextStepCallout && selectedFiles.length > 0 && children && jobStatus === 'idle' && (
        <ToolNextStepCallout message="Now choose settings below" />
      )}

      {/* Options Section (if provided) */}
      {children && selectedFiles.length > 0 && jobStatus === 'idle' && (
        <>
          <AdSlot variant="in-content" />
          <div
            ref={optionsRef}
            className="rounded-lg border-2 border-[#22c55e]/20 bg-card p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500"
          >
            {children}
          </div>
        </>
      )}

      {/* Processing Section */}
      {(jobStatus === 'uploading' || jobStatus === 'processing') && (
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <div className="mb-4 flex justify-center">
              <Loader2 className="h-16 w-16 animate-spin text-[#22c55e]" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">
              {jobStatus === 'uploading' ? 'Uploading your file...' : 'Processing your file...'}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {jobStatus === 'uploading'
                ? 'Please wait while we upload your file'
                : 'This may take a moment depending on file size'}
            </p>
            <Progress value={progress} className="mx-auto w-full max-w-md" />
            <p className="mt-2 text-sm font-medium text-[#22c55e]">{progress}%</p>
          </div>
        </div>
      )}

      {/* Result Section */}
      {jobStatus === 'done' && resultFile && (
        <>
          <AdSlot variant="pre-download" />
          <ToolResultDownload fileName={resultFile.name} fileBlob={resultFile.blob} />
          {onStartOver && (
            <div className="text-center">
              <Button variant="outline" onClick={onStartOver}>
                Process Another File
              </Button>
            </div>
          )}
        </>
      )}

      {/* Error Section */}
      {jobStatus === 'error' && errorDisplay && (
        <div className="space-y-4">
          <div className="rounded-lg border border-destructive bg-destructive/10 p-6">
            <div className="mb-4 flex items-start gap-3">
              <AlertCircle className="h-6 w-6 flex-shrink-0 text-destructive" />
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold text-destructive">
                  {errorDisplay.summary}
                </h3>
                <p className="text-sm text-foreground">
                  Please try again with a different file or check the error details below.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowErrorDetails(!showErrorDetails)}
              className="w-full justify-between"
            >
              <span>{showErrorDetails ? 'Hide' : 'Show'} Error Details</span>
              {showErrorDetails ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {showErrorDetails && (
              <div className="mt-4 rounded-md bg-muted p-4">
                <pre className="whitespace-pre-wrap text-xs text-muted-foreground">
                  {errorDisplay.details}
                </pre>
              </div>
            )}
          </div>

          {onStartOver && (
            <div className="text-center">
              <Button onClick={onStartOver}>Try Again</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
