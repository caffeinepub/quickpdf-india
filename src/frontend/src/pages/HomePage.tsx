import { Hero } from '@/components/home/Hero';
import { ToolsGrid } from '@/components/home/ToolsGrid';
import { HomeFaq } from '@/components/home/HomeFaq';
import { BlogPreview } from '@/components/home/BlogPreview';
import { Seo } from '@/components/seo/Seo';

export default function HomePage() {
  return (
    <>
      <Seo
        title="Free PDF & Image Tools"
        description="Free online PDF and image tools for India. Merge, split, compress PDFs and resize images. Fast, secure, and no login required."
      />
      <Hero />
      <ToolsGrid />
      <HomeFaq />
      <BlogPreview />
    </>
  );
}
