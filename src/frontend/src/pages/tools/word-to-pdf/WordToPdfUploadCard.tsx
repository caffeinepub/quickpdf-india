import { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { WORD_TO_PDF_THEME } from './WordToPdfTheme';

interface WordToPdfUploadCardProps {
  onFileSelected: (file: File) => void;
  selectedFile?: File;
  onConvert?: () => void;
  onRemove?: () => void;
}

/**
 * Upload card with drag-and-drop, large upload button, and file preview
 * Modern green/white theme matching Smallpdf/iLovePDF style
 */
export function WordToPdfUploadCard({
  onFileSelected,
  selectedFile,
  onConvert,
  onRemove,
}: WordToPdfUploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFileSelected(files[0]);
      }
    },
    [onFileSelected]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
    }
  };

  // Show file preview if file is selected
  if (selectedFile) {
    return (
      <div className="space-y-6">
        {/* Selected File Preview */}
        <div className="rounded-lg border-2 border-[#22c55e]/30 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="flex-shrink-0 rounded-lg bg-[#22c55e]/10 p-3">
                <FileText className="h-8 w-8 text-[#22c55e]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1 truncate">
                  {selectedFile.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedFile.name.toLowerCase().endsWith('.docx') ? 'Word Document (DOCX)' : 'Word Document (DOC)'}
                </p>
              </div>
            </div>
            {onRemove && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="flex-shrink-0 text-muted-foreground hover:text-destructive"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Convert Button */}
        {onConvert && (
          <div className="text-center">
            <Button
              onClick={onConvert}
              size="lg"
              className={cn(
                'w-full sm:w-auto px-8 py-6 text-lg font-semibold',
                WORD_TO_PDF_THEME.primaryButton
              )}
            >
              <FileText className="mr-2 h-5 w-5" />
              Convert to PDF
            </Button>
            <p className="mt-3 text-sm text-muted-foreground">
              Your document will be converted securely
            </p>
          </div>
        )}
      </div>
    );
  }

  // Show upload dropzone
  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        'relative rounded-xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-200',
        isDragging
          ? 'border-[#22c55e] bg-[#22c55e]/5 scale-[1.02]'
          : 'border-border bg-white hover:border-[#22c55e]/50 hover:bg-[#22c55e]/5'
      )}
    >
      <input
        type="file"
        id="word-file-input"
        className="hidden"
        accept=".doc,.docx"
        onChange={handleFileInput}
      />

      <div className="flex flex-col items-center space-y-6">
        {/* Icon */}
        <div className="rounded-full bg-[#22c55e]/10 p-6 sm:p-8">
          <Upload className="h-12 w-12 sm:h-16 sm:w-16 text-[#22c55e]" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold">
            {isDragging ? 'Drop your Word file here' : 'Upload Word File'}
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            Drag and drop your file here, or click to browse
          </p>
        </div>

        {/* Upload Button */}
        <Button
          asChild
          size="lg"
          className={cn(
            'px-8 py-6 text-lg font-semibold',
            WORD_TO_PDF_THEME.primaryButton
          )}
        >
          <label htmlFor="word-file-input" className="cursor-pointer">
            <Upload className="mr-2 h-5 w-5" />
            Select Word File
          </label>
        </Button>

        {/* File Info */}
        <div className="pt-4 border-t border-border w-full">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Supported formats: <span className="font-medium">.doc, .docx</span> • Max size: <span className="font-medium">10MB</span>
          </p>
        </div>
      </div>
    </div>
  );
}
