import { useState } from 'react';
import { Seo } from '@/components/seo/Seo';
import { ToolExperience } from '@/components/tools/ToolExperience';
import { RelatedToolsLinks } from '@/components/seo/RelatedToolsLinks';
import { ToolFaq } from '@/components/faq/ToolFaq';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { useToolJob } from '@/hooks/useToolJob';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { pdfToExcelProcessor } from '@/components/tools/processors/conversion/pdfToExcelProcessor';
import { normalizeToolError } from '@/components/tools/toolError';
import { ToolPrimaryActionButton } from '@/components/tools/ToolPrimaryActionButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, FileSpreadsheet } from 'lucide-react';

export default function PdfToExcelPage() {
  useScrollToTop();
  const job = useToolJob();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    job.reset();
  };

  const handleRemoveFile = () => {
    setSelectedFiles([]);
  };

  const handleProcess = async () => {
    if (selectedFiles.length === 0) {
      job.setError(
        normalizeToolError(
          new Error('Please select a PDF file.'),
          'pdf-to-excel',
          'validation'
        )
      );
      return;
    }

    job.startProcessing();

    try {
      const resultBlob = await pdfToExcelProcessor(selectedFiles[0], {
        onProgress: (percentage) => job.updateProgress(percentage),
      });

      const fileName = selectedFiles[0].name.replace(/\.pdf$/i, '.xlsx');
      job.completeProcessing(fileName, resultBlob);
    } catch (error) {
      job.setError(normalizeToolError(error, 'pdf-to-excel', 'processing'));
    }
  };

  const handleStartOver = () => {
    setSelectedFiles([]);
    job.reset();
  };

  const faqs = [
    {
      question: 'What types of PDFs work best?',
      answer:
        'This tool works best with PDFs containing tables and structured data. PDFs with clear column and row layouts will produce the most accurate results.',
    },
    {
      question: 'How accurate is the table detection?',
      answer:
        'The tool uses text positioning and whitespace analysis to detect tables. Simple tables convert well, but complex layouts with merged cells or irregular structures may require manual adjustment.',
    },
    {
      question: 'Can it handle multi-page PDFs?',
      answer:
        'Yes! Each page of your PDF will be analyzed for tabular data and converted to separate sheets in the Excel workbook.',
    },
    {
      question: 'Is there a file size limit?',
      answer: 'You can convert PDF files up to 10MB in size for optimal browser performance.',
    },
    {
      question: 'Is my document secure?',
      answer:
        'Yes! All conversion happens entirely in your browser. Your document never leaves your device, ensuring complete privacy and security.',
    },
  ];

  return (
    <>
      <Seo
        title="Convert PDF to Excel Online Free"
        description="Convert PDF files to Excel spreadsheets online for free. Extract tables from PDFs into editable .xlsx files instantly."
      />
      <ToolPageShell
        title="PDF to Excel Converter"
        description="Convert PDF documents to Excel spreadsheets. Extract tabular data from your PDFs and create editable .xlsx files. All processing happens securely in your browser."
      >
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This tool extracts tabular data from PDFs. Works best with PDFs containing clear tables and structured data.
          </AlertDescription>
        </Alert>

        <ToolExperience
          onFilesSelected={handleFilesSelected}
          acceptedFileTypes=".pdf"
          maxFiles={1}
          fileType="conversion"
          jobStatus={job.jobStatus}
          progress={job.progress}
          resultFile={job.resultFile}
          error={job.error}
          selectedFiles={selectedFiles}
          onRemoveFile={handleRemoveFile}
          onStartOver={handleStartOver}
        >
          {selectedFiles.length > 0 && (
            <ToolPrimaryActionButton
              onClick={handleProcess}
              icon={FileSpreadsheet}
              className="w-full"
            >
              Convert to Excel
            </ToolPrimaryActionButton>
          )}
        </ToolExperience>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ToolFaq faqs={faqs} />
          </div>
          <div>
            <RelatedToolsLinks
              currentToolId="pdf-to-excel"
              relatedToolIds={['excel-to-pdf', 'pdf-to-word', 'image-to-pdf']}
            />
          </div>
        </div>
      </ToolPageShell>
    </>
  );
}
