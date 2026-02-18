import { useState } from 'react';
import { useActor } from '@/hooks/useActor';
import { WordToPdfUploadCard } from './WordToPdfUploadCard';
import { WordToPdfProgressCard } from './WordToPdfProgressCard';
import { WordToPdfResultCard } from './WordToPdfResultCard';
import { WordToPdfErrorCard } from './WordToPdfErrorCard';
import { validateWordFile } from './wordToPdfValidation';
import { convertWordToPdf } from '@/lib/wordToPdfApi';
import { AdSlot } from '@/components/ads/AdSlot';

type ToolState = 'idle' | 'uploading' | 'converting' | 'success' | 'error';

interface ConversionResult {
  fileName: string;
  blob: Blob;
}

/**
 * Main Word-to-PDF tool component with modern green/white UI
 * Handles the complete conversion flow: upload → progress → download
 */
export function WordToPdfTool() {
  const { actor } = useActor();
  const [state, setState] = useState<ToolState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = (file: File) => {
    // Validate file
    const validation = validateWordFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      setState('error');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setState('idle');
  };

  const handleConvert = async () => {
    if (!selectedFile || !actor) {
      setError('Please select a file and ensure the backend is ready.');
      setState('error');
      return;
    }

    try {
      setState('uploading');
      setProgress(0);

      // Convert the file
      const pdfBlob = await convertWordToPdf(selectedFile, actor, (p) => {
        setProgress(p);
        if (p < 30) {
          setState('uploading');
        } else {
          setState('converting');
        }
      });

      // Generate output filename
      const baseName = selectedFile.name.replace(/\.(docx?|DOCX?)$/i, '');
      const outputFileName = `${baseName}.pdf`;

      setResult({
        fileName: outputFileName,
        blob: pdfBlob,
      });
      setState('success');
      setProgress(100);
    } catch (err: any) {
      console.error('Conversion error:', err);
      setError(err.message || 'Failed to convert Word document to PDF');
      setState('error');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
    setState('idle');
  };

  return (
    <div className="space-y-6">
      {/* Upload State */}
      {state === 'idle' && !selectedFile && (
        <WordToPdfUploadCard onFileSelected={handleFileSelected} />
      )}

      {/* File Selected - Ready to Convert */}
      {state === 'idle' && selectedFile && (
        <WordToPdfUploadCard
          onFileSelected={handleFileSelected}
          selectedFile={selectedFile}
          onConvert={handleConvert}
          onRemove={handleReset}
        />
      )}

      {/* Processing States */}
      {(state === 'uploading' || state === 'converting') && (
        <WordToPdfProgressCard
          state={state}
          progress={progress}
          fileName={selectedFile?.name || ''}
        />
      )}

      {/* Success State */}
      {state === 'success' && result && (
        <>
          <AdSlot variant="pre-download" />
          <WordToPdfResultCard
            fileName={result.fileName}
            blob={result.blob}
            onProcessAnother={handleReset}
          />
        </>
      )}

      {/* Error State */}
      {state === 'error' && error && (
        <WordToPdfErrorCard error={error} onTryAgain={handleReset} />
      )}
    </div>
  );
}
