import { Hero } from '@/components/home/Hero';
import { IntroContent } from '@/components/home/IntroContent';
import { ToolsGrid } from '@/components/home/ToolsGrid';
import { HomeFaq } from '@/components/home/HomeFaq';
import { BlogPreview } from '@/components/home/BlogPreview';
import { Seo } from '@/components/seo/Seo';
import { AdSlot } from '@/components/ads/AdSlot';

export default function HomePage() {
  return (
    <>
      <Seo
        title="The Bharat PDF - Free PDF & Image Tools"
        description="Free online PDF and image tools for India. Merge, split, compress PDFs and resize images. Fast, secure, and no login required. All processing happens in your browser."
      />
      <Hero />
      <IntroContent />
      <div className="container mt-32 mb-32">
        <AdSlot variant="in-article" />
      </div>
      <ToolsGrid />
      <div className="container mt-32 mb-32">
        <AdSlot variant="in-article" />
      </div>
      <HomeFaq />
      <BlogPreview />
    </>
  );
}
