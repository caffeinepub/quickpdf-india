import { Button } from '@/components/ui/button';
import { Download, CheckCircle } from 'lucide-react';
import { downloadBlob } from '@/lib/download';
import { AdSlot } from '../ads/AdSlot';

interface ToolResultDownloadProps {
  fileName: string;
  fileBlob: Blob;
}

export function ToolResultDownload({ fileName, fileBlob }: ToolResultDownloadProps) {
  const handleDownload = () => {
    try {
      downloadBlob(fileBlob, fileName);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <>
      <div className="mt-32">
        <AdSlot variant="post-tool" />
      </div>
      <div className="mt-8 rounded-lg border border-[#22c55e] bg-[#22c55e]/5 p-6 text-center sm:p-8">
        <div className="mb-4 flex justify-center">
          <CheckCircle className="h-16 w-16 text-[#22c55e]" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-[#22c55e] sm:text-2xl">
          Processing Complete!
        </h3>
        <p className="mb-6 text-muted-foreground">Your file is ready for download</p>
        <Button
          onClick={handleDownload}
          size="lg"
          className="w-full bg-[#22c55e] hover:bg-[#27ae60] sm:w-auto"
        >
          <Download className="mr-2 h-5 w-5" />
          Download {fileName}
        </Button>
      </div>
    </>
  );
}
