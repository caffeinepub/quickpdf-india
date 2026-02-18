import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface WordToPdfProgressCardProps {
  state: 'uploading' | 'converting';
  progress: number;
  fileName: string;
}

/**
 * Progress card showing conversion status with animated loader
 * Displays different messages for uploading vs converting stages
 */
export function WordToPdfProgressCard({
  state,
  progress,
  fileName,
}: WordToPdfProgressCardProps) {
  const getStatusMessage = () => {
    if (state === 'uploading') {
      return 'Uploading your document...';
    }
    return 'Converting to PDF...';
  };

  const getStatusDescription = () => {
    if (state === 'uploading') {
      return 'Preparing your file for conversion';
    }
    return 'Processing your document, this may take a moment';
  };

  return (
    <div className="rounded-xl border-2 border-[#22c55e]/30 bg-white p-8 sm:p-12 text-center shadow-lg">
      {/* Animated Loader */}
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#22c55e]/20 animate-ping" />
          <Loader2 className="relative h-16 w-16 sm:h-20 sm:w-20 animate-spin text-[#22c55e]" />
        </div>
      </div>

      {/* Status Text */}
      <h3 className="mb-2 text-xl sm:text-2xl font-bold">
        {getStatusMessage()}
      </h3>
      <p className="mb-6 text-sm sm:text-base text-muted-foreground">
        {getStatusDescription()}
      </p>

      {/* File Name */}
      <p className="mb-4 text-sm text-muted-foreground truncate max-w-md mx-auto">
        {fileName}
      </p>

      {/* Progress Bar */}
      <div className="mx-auto max-w-md space-y-2">
        <Progress value={progress} className="h-3" />
        <p className="text-sm font-semibold text-[#22c55e]">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}
