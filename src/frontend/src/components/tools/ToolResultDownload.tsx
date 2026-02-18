import { Download, CheckCircle } from 'lucide-react';
import { downloadBlob } from '@/lib/download';
import { ToolPrimaryActionButton } from './ToolPrimaryActionButton';

interface ToolResultDownloadProps {
  fileName: string;
  fileBlob: Blob;
}

export function ToolResultDownload({ fileName, fileBlob }: ToolResultDownloadProps) {
  const handleDownload = () => {
    downloadBlob(fileBlob, fileName);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-8 text-center shadow-sm">
      <div className="mb-4 flex justify-center">
        <div className="rounded-full bg-[#22c55e]/10 p-4">
          <CheckCircle className="h-12 w-12 text-[#22c55e]" />
        </div>
      </div>
      <h3 className="mb-2 text-xl font-semibold text-[#22c55e]">Success!</h3>
      <p className="mb-2 text-lg font-medium">Processing Complete</p>
      <p className="mb-6 text-sm text-muted-foreground">Your file is ready to download</p>
      <ToolPrimaryActionButton
        onClick={handleDownload}
        icon={Download}
        size="lg"
      >
        Download {fileName}
      </ToolPrimaryActionButton>
      <p className="mt-4 text-xs text-muted-foreground">
        Files are processed securely in your browser
      </p>
    </div>
  );
}
