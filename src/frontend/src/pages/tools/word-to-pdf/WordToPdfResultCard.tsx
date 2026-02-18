import { CheckCircle2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadBlob } from '@/lib/download';
import { WORD_TO_PDF_THEME } from './WordToPdfTheme';
import { cn } from '@/lib/utils';

interface WordToPdfResultCardProps {
  fileName: string;
  blob: Blob;
  onProcessAnother: () => void;
}

/**
 * Success result card with download button and process another option
 * Shows explicit success message with green checkmark
 */
export function WordToPdfResultCard({
  fileName,
  blob,
  onProcessAnother,
}: WordToPdfResultCardProps) {
  const handleDownload = () => {
    downloadBlob(blob, fileName);
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="rounded-xl border-2 border-[#22c55e]/30 bg-white p-8 sm:p-12 text-center shadow-lg">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-[#22c55e]/10 p-4">
            <CheckCircle2 className="h-16 w-16 sm:h-20 sm:w-20 text-[#22c55e]" />
          </div>
        </div>

        {/* Success Text */}
        <h3 className="mb-2 text-xl sm:text-2xl font-bold text-[#22c55e]">
          Conversion Successful!
        </h3>
        <p className="mb-6 text-sm sm:text-base text-muted-foreground">
          Your Word document has been converted to PDF successfully
        </p>

        {/* File Name */}
        <p className="mb-6 text-sm font-medium text-foreground truncate max-w-md mx-auto">
          {fileName}
        </p>

        {/* Download Button */}
        <Button
          onClick={handleDownload}
          size="lg"
          className={cn(
            'w-full sm:w-auto px-8 py-6 text-lg font-semibold',
            WORD_TO_PDF_THEME.primaryButton
          )}
        >
          <Download className="mr-2 h-5 w-5" />
          Download PDF
        </Button>
      </div>

      {/* Process Another File */}
      <div className="text-center">
        <Button
          variant="outline"
          onClick={onProcessAnother}
          className="w-full sm:w-auto border-[#22c55e]/30 hover:bg-[#22c55e]/5"
        >
          Process Another File
        </Button>
      </div>
    </div>
  );
}
