import { useState } from 'react';
import { Seo } from '@/components/seo/Seo';
import { ToolExperience } from '@/components/tools/ToolExperience';
import { RelatedToolsLinks } from '@/components/seo/RelatedToolsLinks';
import { ToolFaq } from '@/components/faq/ToolFaq';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { useToolJob } from '@/hooks/useToolJob';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { excelToPdfProcessor } from '@/components/tools/processors/conversion/excelToPdfProcessor';
import { normalizeToolError } from '@/components/tools/toolError';
import { ToolPrimaryActionButton } from '@/components/tools/ToolPrimaryActionButton';
import { FileSpreadsheet } from 'lucide-react';

export default function ExcelToPdfPage() {
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
          new Error('Please select an Excel file.'),
          'excel-to-pdf',
          'validation'
        )
      );
      return;
    }

    job.startProcessing();

    try {
      const resultBlob = await excelToPdfProcessor(selectedFiles[0], {
        onProgress: (percentage) => job.updateProgress(percentage),
      });

      const fileName = selectedFiles[0].name.replace(/\.(xlsx?|XLSX?)$/i, '.pdf');
      job.completeProcessing(fileName, resultBlob);
    } catch (error) {
      job.setError(normalizeToolError(error, 'excel-to-pdf', 'processing'));
    }
  };

  const handleStartOver = () => {
    setSelectedFiles([]);
    job.reset();
  };

  const faqs = [
    {
      question: 'What Excel versions are supported?',
      answer:
        'This tool supports both .xlsx (Excel 2007 and later) and .xls (Excel 97-2003) file formats.',
    },
    {
      question: 'Will my formatting be preserved?',
      answer:
        'The tool converts your Excel data to PDF format. Basic formatting like cell borders and text styles are preserved, but complex features like macros and formulas are not included in the PDF.',
    },
    {
      question: 'How are multiple sheets handled?',
      answer:
        'All sheets in your Excel workbook will be converted to separate pages in the resulting PDF document.',
    },
    {
      question: 'Is there a file size limit?',
      answer: 'You can convert Excel files up to 10MB in size for optimal browser performance.',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Yes! All conversion happens entirely in your browser. Your spreadsheet never leaves your device, ensuring complete privacy and security.',
    },
  ];

  return (
    <>
      <Seo
        title="Convert Excel to PDF Online Free"
        description="Convert Excel spreadsheets to PDF format online for free. Turn .xlsx and .xls files into PDF documents instantly."
      />
      <ToolPageShell
        title="Excel to PDF Converter"
        description="Convert Excel spreadsheets to PDF documents. Transform your .xlsx and .xls files into professional PDF format. All processing happens securely in your browser."
      >
        <ToolExperience
          onFilesSelected={handleFilesSelected}
          acceptedFileTypes=".xlsx,.xls"
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
              Convert to PDF
            </ToolPrimaryActionButton>
          )}
        </ToolExperience>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ToolFaq faqs={faqs} />
          </div>
          <div>
            <RelatedToolsLinks
              currentToolId="excel-to-pdf"
              relatedToolIds={['pdf-to-excel', 'word-to-pdf', 'powerpoint-to-pdf']}
            />
          </div>
        </div>
      </ToolPageShell>
    </>
  );
}
