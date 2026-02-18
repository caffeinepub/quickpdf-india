import { X, CheckCircle, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize, getFileTypeLabel } from '@/lib/fileFormat';

interface SelectedFilesListProps {
  files: File[];
  onRemove?: (index: number) => void;
  showRemove?: boolean;
}

export function SelectedFilesList({ files, onRemove, showRemove = true }: SelectedFilesListProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-3">
      {files.map((file, index) => (
        <div
          key={`${file.name}-${index}`}
          className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-sm"
        >
          <div className="flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-[#22c55e]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{file.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{getFileTypeLabel(file)}</span>
                  <span>•</span>
                  <span>{formatFileSize(file.size)}</span>
                </div>
              </div>
              {showRemove && onRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(index)}
                  className="h-8 w-8 p-0 flex-shrink-0"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
