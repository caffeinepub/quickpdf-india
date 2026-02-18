import { useCallback, useState, useId } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FILE_SIZE_LIMITS } from '@/config/toolLimits';
import { SelectedFilesList } from './SelectedFilesList';

interface UploadDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFileTypes: string;
  maxFiles?: number;
  fileType?: 'pdf' | 'image' | 'conversion' | 'default';
  maxFileSizeBytes?: number;
  selectedFiles?: File[];
  onRemoveFile?: (index: number) => void;
}

export function UploadDropzone({
  onFilesSelected,
  acceptedFileTypes,
  maxFiles = 1,
  fileType = 'default',
  maxFileSizeBytes,
  selectedFiles = [],
  onRemoveFile,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Generate unique ID for this instance to avoid conflicts
  const inputId = useId();

  const maxFileSize = maxFileSizeBytes || FILE_SIZE_LIMITS[fileType] || FILE_SIZE_LIMITS.default;
  const maxFileSizeMB = maxFileSize / (1024 * 1024);

  // Parse accepted file types for validation
  const acceptedExtensions = acceptedFileTypes.split(',').map(ext => ext.trim().toLowerCase());

  const validateFileType = (file: File): boolean => {
    const fileName = file.name.toLowerCase();
    
    // Check if file extension matches accepted types
    const isValidExtension = acceptedExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isValidExtension) {
      setError(
        `Invalid file type. Please select a file with one of these extensions: ${acceptedFileTypes}`
      );
      return false;
    }
    
    return true;
  };

  const validateFiles = (files: File[]): boolean => {
    setError(null);

    if (!files || files.length === 0) {
      setError('No files selected. Please choose a file.');
      return false;
    }

    if (maxFiles === 1 && files.length > 1) {
      setError('Please select only one file at a time.');
      return false;
    }

    if (files.length > maxFiles) {
      setError(`Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed`);
      return false;
    }

    // Validate file types
    for (const file of files) {
      if (!validateFileType(file)) {
        return false;
      }
    }

    // Validate file sizes
    for (const file of files) {
      if (file.size > maxFileSize) {
        setError(
          `File "${file.name}" is too large. Maximum size is ${maxFileSizeMB}MB. Please use a smaller file.`
        );
        return false;
      }
    }

    return true;
  };

  const handleFiles = useCallback(
    (files: FileList | null, inputElement?: HTMLInputElement) => {
      if (!files || files.length === 0) {
        return;
      }

      const fileArray = Array.from(files);
      if (validateFiles(fileArray)) {
        setError(null); // Clear any previous errors
        onFilesSelected(fileArray);
      }
      
      // Reset input value to allow selecting the same file again
      if (inputElement) {
        inputElement.value = '';
      }
    },
    [onFilesSelected, maxFiles, maxFileSize, acceptedFileTypes]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files, e.target);
  };

  // Show selected files if any
  if (selectedFiles.length > 0) {
    return (
      <div className="space-y-4">
        <SelectedFilesList
          files={selectedFiles}
          onRemove={onRemoveFile}
          showRemove={true}
        />
        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative rounded-lg border-2 border-dashed p-12 text-center transition-colors',
          isDragging
            ? 'border-[#22c55e] bg-[#22c55e]/5'
            : 'border-border bg-muted/30 hover:border-[#22c55e]/50'
        )}
      >
        <input
          type="file"
          id={inputId}
          className="hidden"
          accept={acceptedFileTypes}
          multiple={maxFiles > 1}
          onChange={handleInputChange}
        />
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-[#22c55e]/10 p-6">
            <Upload className="h-12 w-12 text-[#22c55e]" />
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold">
              {isDragging ? 'Drop your file here' : 'Drag & drop your file'}
            </h3>
            <p className="text-sm text-muted-foreground">
              or{' '}
              <label htmlFor={inputId} className="cursor-pointer font-medium text-[#22c55e] hover:underline">
                browse
              </label>{' '}
              to choose a file
            </p>
          </div>
          <Button
            asChild
            className="bg-[#22c55e] text-white hover:bg-[#16a34a]"
          >
            <label htmlFor={inputId} className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              Select File
            </label>
          </Button>
          <p className="text-xs text-muted-foreground">
            Accepted: {acceptedFileTypes} • Max size: {maxFileSizeMB}MB
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
