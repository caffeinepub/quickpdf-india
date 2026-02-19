import { Seo } from '@/components/seo/Seo';
import { RelatedToolsLinks } from '@/components/seo/RelatedToolsLinks';
import { ToolFaq } from '@/components/faq/ToolFaq';
import { AdSlot } from '@/components/ads/AdSlot';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { WordToPdfTool } from './word-to-pdf/WordToPdfTool';
import { wordToPdfFaq } from './word-to-pdf/wordToPdfFaq';

/**
 * Word to PDF converter page - rebuilt module with modern UI
 * Delegates to the module-scoped WordToPdfTool component
 * Preserves existing layout, ads, and SEO structure
 */
export default function WordToPdfPage() {
  useScrollToTop();

  return (
    <>
      <Seo
        title="Free Word to PDF Converter Online"
        description="Convert Word documents (.doc, .docx) to PDF online for free. Fast, secure, and easy to use."
      />
      <div className="container py-8 sm:py-12">
        <div className="mx-auto max-w-4xl space-y-8 sm:space-y-12">
          {/* Header Section */}
          <div className="space-y-3 text-center sm:space-y-4">
            <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              Word to PDF Converter
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg lg:text-xl">
              Convert your Word documents to PDF format instantly. Supports both .doc and .docx files.
            </p>
          </div>

          {/* Description Section */}
          <div className="rounded-lg border border-border bg-card/50 p-4 text-center sm:p-6">
            <p className="text-sm text-muted-foreground sm:text-base">
              Upload your Word document and convert it to a professional PDF in seconds. 
              Our secure converter preserves your document's formatting and layout perfectly.
            </p>
          </div>

          {/* Main Tool Component */}
          <WordToPdfTool />

          {/* Mid-page Ad */}
          <AdSlot variant="in-content" />

          {/* FAQ and Related Tools */}
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ToolFaq faqs={wordToPdfFaq} />
            </div>
            <div>
              <RelatedToolsLinks
                currentToolId="word-to-pdf"
                relatedToolIds={['pdf-to-word', 'compress-pdf', 'merge-pdf']}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
