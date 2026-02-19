import { AlertCircle, RotateCcw, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WORD_TO_PDF_THEME } from './WordToPdfTheme';
import { cn } from '@/lib/utils';

interface WordToPdfErrorCardProps {
  error: string;
  onRetry?: () => void;
  onStartOver: () => void;
}

/**
 * Error card with clear error message, retry action, and start over option
 * Provides actionable guidance to the user with specific error handling
 */
export function WordToPdfErrorCard({ error, onRetry, onStartOver }: WordToPdfErrorCardProps) {
  // Determine if error is retryable based on error message
  const isRetryable = onRetry && !error.toLowerCase().includes('invalid file') && 
                      !error.toLowerCase().includes('unsupported') &&
                      !error.toLowerCase().includes('too large');

  return (
    <div className="rounded-xl border-2 border-destructive/30 bg-destructive/5 p-8 sm:p-12 text-center">
      {/* Error Icon */}
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertCircle className="h-16 w-16 sm:h-20 sm:w-20 text-destructive" />
        </div>
      </div>

      {/* Error Text */}
      <h3 className="mb-2 text-xl sm:text-2xl font-bold text-destructive">
        Conversion Failed
      </h3>
      <p className="mb-6 text-sm sm:text-base text-foreground max-w-md mx-auto">
        {error}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        {/* Retry Button - only show if retryable */}
        {isRetryable && (
          <Button
            onClick={onRetry}
            size="lg"
            className={cn(
              'w-full sm:w-auto px-8 py-6 text-lg font-semibold',
              WORD_TO_PDF_THEME.primaryButton
            )}
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Retry Conversion
          </Button>
        )}

        {/* Start Over Button */}
        <Button
          onClick={onStartOver}
          size="lg"
          variant={isRetryable ? "outline" : "default"}
          className={cn(
            'w-full sm:w-auto px-8 py-6 text-lg font-semibold',
            isRetryable 
              ? 'border-[#22c55e]/30 hover:bg-[#22c55e]/5' 
              : WORD_TO_PDF_THEME.primaryButton
          )}
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Start Over
        </Button>
      </div>

      {/* Help Text */}
      <div className="mt-6 space-y-2">
        <p className="text-xs text-muted-foreground">
          {isRetryable 
            ? 'Click "Retry Conversion" to try again with the same file, or "Start Over" to select a different file.'
            : 'Please select a different file or check that your document meets the requirements.'}
        </p>
        <p className="text-xs text-muted-foreground">
          Supported formats: .doc, .docx • Maximum size: 10MB
        </p>
      </div>
    </div>
  );
}
