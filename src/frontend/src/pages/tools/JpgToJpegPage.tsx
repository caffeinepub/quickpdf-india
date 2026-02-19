import { Seo } from '@/components/seo/Seo';
import { ToolExperience } from '@/components/tools/ToolExperience';
import { RelatedToolsLinks } from '@/components/seo/RelatedToolsLinks';
import { ToolFaq } from '@/components/faq/ToolFaq';
import { useToolJob } from '@/hooks/useToolJob';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { jpgToJpegProcessor } from '@/components/tools/processors/conversion';

export function JpgToJpegPage() {
  useScrollToTop();
  const { jobStatus, progress, resultFile, error, startJob } = useToolJob();

  const handleFilesSelected = async (files: File[]) => {
    await startJob(
      async (onProgress) => {
        const resultFile = await jpgToJpegProcessor(files, { onProgress });
        return { name: resultFile.name, blob: resultFile };
      },
      'jpg-to-jpeg',
      'processing'
    );
  };

  const faqItems = [
    {
      question: "What's the difference between JPG and JPEG?",
      answer:
        'JPG and JPEG are exactly the same image format - they are just different file extensions. The only difference is the name. JPEG stands for "Joint Photographic Experts Group," and JPG is simply a shortened version that was used in older Windows systems that required 3-letter extensions.',
    },
    {
      question: 'Why would I need to convert JPG to JPEG?',
      answer:
        'You might need this conversion for system compatibility, file naming conventions, or specific software requirements. Some systems or applications may expect files with a .jpeg extension rather than .jpg, even though they are the same format.',
    },
    {
      question: 'Does the conversion affect image quality?',
      answer:
        'No, the conversion maintains high quality (95% quality setting) and preserves the original image dimensions. Since JPG and JPEG are the same format, this is essentially just a file extension change with re-encoding at high quality.',
    },
    {
      question: 'Is this conversion instant?',
      answer:
        'Yes! The conversion is very fast since it only involves loading the image and saving it with a new extension. All processing happens instantly in your browser.',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Absolutely! All processing happens entirely in your browser. Your image never leaves your device or gets uploaded to any server, ensuring complete privacy and security.',
    },
  ];

  return (
    <>
      <Seo
        title="Convert JPG to JPEG - Free Online Image Format Converter"
        description="Convert JPG images to JPEG format instantly. Fast, secure, and free. All processing happens in your browser - no uploads required."
      />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Convert JPG to JPEG</h1>
          <p className="text-lg text-muted-foreground">
            Convert your JPG images to JPEG format instantly. Perfect for system compatibility and
            file naming requirements. All processing happens securely in your browser.
          </p>
        </header>

        <ToolExperience
          onFilesSelected={handleFilesSelected}
          acceptedFileTypes=".jpg,.jpeg"
          maxFiles={1}
          jobStatus={jobStatus}
          progress={progress}
          resultFile={resultFile}
          error={error}
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ToolFaq faqs={faqItems} />
          </div>
          <aside>
            <RelatedToolsLinks
              currentToolId="jpg-to-jpeg"
              relatedToolIds={['resize-image', 'jpeg-to-jpg', 'image-to-pdf']}
            />
          </aside>
        </div>
      </div>
    </>
  );
}

export default JpgToJpegPage;
