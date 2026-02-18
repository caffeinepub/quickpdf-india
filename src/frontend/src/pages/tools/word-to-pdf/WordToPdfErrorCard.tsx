import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WORD_TO_PDF_THEME } from './WordToPdfTheme';
import { cn } from '@/lib/utils';

interface WordToPdfErrorCardProps {
  error: string;
  onTryAgain: () => void;
}

/**
 * Error card with clear error message and retry action
 * Provides actionable guidance to the user
 */
export function WordToPdfErrorCard({ error, onTryAgain }: WordToPdfErrorCardProps) {
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

      {/* Try Again Button */}
      <Button
        onClick={onTryAgain}
        size="lg"
        className={cn(
          'w-full sm:w-auto px-8 py-6 text-lg font-semibold',
          WORD_TO_PDF_THEME.primaryButton
        )}
      >
        <RotateCcw className="mr-2 h-5 w-5" />
        Try Again
      </Button>

      {/* Help Text */}
      <p className="mt-6 text-xs text-muted-foreground">
        If the problem persists, try a different file or check that your document is not corrupted
      </p>
    </div>
  );
}
