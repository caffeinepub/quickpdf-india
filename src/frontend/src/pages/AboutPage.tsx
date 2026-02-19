import { Seo } from '@/components/seo/Seo';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export default function AboutPage() {
  useScrollToTop();

  return (
    <>
      <Seo
        title="About Us - The Bharat PDF"
        description="Learn about The Bharat PDF - your trusted source for free online PDF and image processing tools. Fast, secure, and privacy-focused document solutions."
      />

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold">About The Bharat PDF</h1>

        <div className="prose prose-lg max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Our Purpose</h2>
            <p className="leading-relaxed text-muted-foreground">
              The Bharat PDF was created to provide free, accessible, and powerful PDF and image processing tools to everyone. We believe that essential document management capabilities should be available to all users without requiring expensive software installations, subscriptions, or complicated setups. Our mission is to democratize access to professional-grade document tools through simple, browser-based solutions.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Our Mission</h2>
            <p className="leading-relaxed text-muted-foreground">
              We are committed to delivering fast, secure, and user-friendly tools that respect your privacy. Every tool on our platform is designed with three core principles: simplicity, security, and speed. We process all files directly in your browser using client-side technology, which means your documents never leave your device. This approach ensures maximum privacy and security while providing instant results without server delays or upload times.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Our goal is to continuously expand our toolkit based on user needs, maintaining the highest standards of quality and performance. We strive to make document processing as effortless as possible, whether you're a student, professional, or business owner.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Our Tools</h2>
            <p className="leading-relaxed text-muted-foreground">
              The Bharat PDF offers a comprehensive suite of PDF manipulation tools including merge, split, compress, resize, watermark, and page removal capabilities. Our conversion tools enable seamless transformation between PDF and popular formats like Word, Excel, PowerPoint, and various image formats. Additionally, we provide specialized image processing tools for resizing and format conversion.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Each tool is optimized for performance and ease of use, with intuitive interfaces that guide you through every step. We support batch processing where applicable, allowing you to work with multiple files efficiently. Our tools handle complex documents while preserving formatting, quality, and structure to the best extent possible.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Why Choose Us</h2>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>100% Browser-Based:</strong> No software installation required. All processing happens securely in your browser.
              </li>
              <li>
                <strong>Complete Privacy:</strong> Your files never leave your device. We don't store, access, or transmit your documents.
              </li>
              <li>
                <strong>Always Free:</strong> All our tools are completely free to use with no hidden charges or premium tiers.
              </li>
              <li>
                <strong>No Registration:</strong> Start using our tools immediately without creating an account or providing personal information.
              </li>
              <li>
                <strong>Fast Processing:</strong> Client-side processing means instant results without waiting for server uploads or downloads.
              </li>
              <li>
                <strong>Mobile Friendly:</strong> Our responsive design works seamlessly on desktop, tablet, and mobile devices.
              </li>
              <li>
                <strong>Regular Updates:</strong> We continuously improve our tools and add new features based on user feedback.
              </li>
            </ul>
          </section>

          <section className="rounded-lg border border-[#22c55e]/20 bg-[#22c55e]/5 p-6">
            <p className="text-center text-lg font-medium">
              Thank you for choosing The Bharat PDF. We're here to make your document processing simple, secure, and efficient.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
