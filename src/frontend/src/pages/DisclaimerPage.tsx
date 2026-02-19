import { Seo } from '@/components/seo/Seo';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export default function DisclaimerPage() {
  useScrollToTop();

  return (
    <>
      <Seo
        title="Disclaimer - The Bharat PDF"
        description="The Bharat PDF Disclaimer - Important information about tool limitations, accuracy, and user responsibilities when using our free PDF and image processing services."
      />

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-4 text-4xl font-bold">Disclaimer</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Please read this disclaimer carefully before using The Bharat PDF's tools and services.
        </p>

        <div className="prose prose-lg max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">No Warranty</h2>
            <p className="leading-relaxed text-muted-foreground">
              The Bharat PDF provides all tools and services on an "as is" and "as available" basis without any warranties or guarantees of any kind, whether express or implied. We do not warrant that our tools will meet your specific requirements, that the operation will be uninterrupted or error-free, or that defects will be corrected. The entire risk as to the quality and performance of the tools rests with you.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Accuracy Limitations</h2>
            <p className="leading-relaxed text-muted-foreground">
              While we strive to provide accurate and reliable tools, the accuracy of file processing and conversion results may vary depending on the complexity, format, and quality of your input files. Automated processing cannot always perfectly replicate manual work, especially with complex documents containing intricate formatting, special fonts, embedded objects, or non-standard structures.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              PDF to Word, Excel, and PowerPoint conversions may not preserve all formatting, layouts, fonts, or special elements from the original document. Image quality in conversions depends on the source file resolution and format. Compression tools may reduce file quality to achieve smaller file sizes. Results may differ from your expectations, and we cannot guarantee specific outcomes.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">User Responsibility</h2>
            <p className="leading-relaxed text-muted-foreground">
              You are solely responsible for verifying the accuracy, quality, and suitability of all processed files before using them for any purpose. It is your responsibility to review the output carefully and ensure it meets your requirements. Do not rely on our tools for critical, legal, medical, financial, or other important documents without thorough verification.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              You must ensure you have the legal right to process any files you use with our tools. We are not responsible for any consequences arising from your use of processed files, including but not limited to data loss, corruption, inaccuracies, or any damages resulting from reliance on the output.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">No Guarantees on Conversion Quality</h2>
            <p className="leading-relaxed text-muted-foreground">
              Document conversion between different formats (such as PDF to Word, Excel to PDF, or PowerPoint to PDF) involves complex transformations that may not always produce perfect results. Factors affecting conversion quality include:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Original document complexity and structure</li>
              <li>Use of custom fonts, styles, or formatting</li>
              <li>Embedded images, charts, tables, or special objects</li>
              <li>Document protection or encryption</li>
              <li>File corruption or non-standard formatting</li>
              <li>Browser capabilities and available memory</li>
            </ul>
            <p className="leading-relaxed text-muted-foreground">
              We do not guarantee that converted files will be identical to the original or suitable for your intended use. Always verify converted documents before distribution or submission.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Third-Party Tools and Libraries</h2>
            <p className="leading-relaxed text-muted-foreground">
              Our tools utilize various open-source libraries and third-party technologies for file processing. While we select reliable and well-maintained libraries, we cannot control or guarantee their performance, accuracy, or continued availability. Any limitations or issues with these underlying technologies may affect the functionality of our tools.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Use at Your Own Risk</h2>
            <p className="leading-relaxed text-muted-foreground">
              Your use of The Bharat PDF and all its tools is entirely at your own risk. We shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of or inability to use our services, including but not limited to damages for loss of profits, data, or other intangible losses, even if we have been advised of the possibility of such damages.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              We recommend maintaining backup copies of all important files before processing them with our tools. While our client-side processing approach ensures your files never leave your device, technical issues, browser crashes, or other unforeseen circumstances could potentially result in data loss.
            </p>
          </section>

          <section className="rounded-lg border border-[#22c55e]/20 bg-[#22c55e]/5 p-6">
            <h3 className="mb-3 text-lg font-semibold">Important Reminder</h3>
            <p className="text-muted-foreground">
              By using The Bharat PDF, you acknowledge that you have read, understood, and agree to this disclaimer. If you do not agree with any part of this disclaimer, please do not use our services. For questions or concerns, please contact us at{' '}
              <a href="mailto:support@thebharatpdf.com" className="text-[#22c55e] hover:underline">
                support@thebharatpdf.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
