import { Seo } from '@/components/seo/Seo';
import { ToolExperience } from '@/components/tools/ToolExperience';
import { RelatedToolsLinks } from '@/components/seo/RelatedToolsLinks';
import { ToolFaq } from '@/components/faq/ToolFaq';
import { useToolJob } from '@/hooks/useToolJob';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { jpegToJpgProcessor } from '@/components/tools/processors/conversion';

export function JpegToJpgPage() {
  useScrollToTop();
  const { jobStatus, progress, resultFile, error, startJob } = useToolJob();

  const handleFilesSelected = async (files: File[]) => {
    await startJob(
      async (onProgress) => {
        const resultFile = await jpegToJpgProcessor(files, { onProgress });
        return { name: resultFile.name, blob: resultFile };
      },
      'jpeg-to-jpg',
      'processing'
    );
  };

  const faqItems = [
    {
      question: "What's the difference between JPEG and JPG?",
      answer:
        'JPEG and JPG are exactly the same image format - they are just different file extensions. The only difference is the name. JPEG stands for "Joint Photographic Experts Group," and JPG is simply a shortened version that was used in older Windows systems that required 3-letter extensions.',
    },
    {
      question: 'Why would I need to convert JPEG to JPG?',
      answer:
        'You might need this conversion for file naming conventions, legacy system compatibility, or specific software requirements. Some older systems or applications may expect files with a .jpg extension rather than .jpeg, even though they are the same format.',
    },
    {
      question: 'Does the conversion affect image quality?',
      answer:
        'No, the conversion maintains high quality (95% quality setting) and preserves the original image dimensions. Since JPEG and JPG are the same format, this is essentially just a file extension change with re-encoding at high quality.',
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
        title="Convert JPEG to JPG - Free Online Image Format Converter"
        description="Convert JPEG images to JPG format instantly. Fast, secure, and free. All processing happens in your browser - no uploads required."
      />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Convert JPEG to JPG</h1>
          <p className="text-lg text-muted-foreground">
            Convert your JPEG images to JPG format instantly. Perfect for legacy system
            compatibility and file naming requirements. All processing happens securely in your
            browser.
          </p>
        </header>

        <ToolExperience
          onFilesSelected={handleFilesSelected}
          acceptedFileTypes=".jpeg,.jpg"
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
              currentToolId="jpeg-to-jpg"
              relatedToolIds={['resize-image', 'jpg-to-jpeg', 'image-to-pdf']}
            />
          </aside>
        </div>
      </div>
    </>
  );
}

export default JpegToJpgPage;
