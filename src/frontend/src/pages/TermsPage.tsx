import { Seo } from '@/components/seo/Seo';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export default function TermsPage() {
  useScrollToTop();

  const lastUpdated = 'February 19, 2026';

  return (
    <>
      <Seo
        title="Terms & Conditions - The Bharat PDF"
        description="The Bharat PDF Terms & Conditions - Read our terms of service, usage rules, and legal information for using our free PDF and image tools."
      />

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-4 text-4xl font-bold">Terms & Conditions</h1>
        <p className="mb-8 text-sm text-muted-foreground">Last Updated: {lastUpdated}</p>

        <div className="prose prose-lg max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Acceptance of Terms</h2>
            <p className="leading-relaxed text-muted-foreground">
              By accessing and using The Bharat PDF ("the Service"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services. These terms apply to all visitors, users, and others who access or use the Service. We reserve the right to modify these terms at any time, and your continued use of the Service constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Service Description</h2>
            <p className="leading-relaxed text-muted-foreground">
              The Bharat PDF provides free, browser-based tools for PDF manipulation, document conversion, and image processing. All tools operate client-side within your web browser, meaning your files are processed locally on your device without being uploaded to our servers. The Service is provided "as is" and "as available" without any warranties or guarantees of specific results.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              We strive to maintain high availability and performance, but we do not guarantee uninterrupted or error-free operation. The Service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control. We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Acceptable Use Policy</h2>
            <p className="leading-relaxed text-muted-foreground">
              You agree to use the Service only for lawful purposes and in accordance with these Terms. You must not use the Service to process files that contain illegal content, violate intellectual property rights, or infringe upon the rights of others. You are solely responsible for ensuring you have the legal right to process any files you upload to our tools.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              You must not attempt to interfere with, disrupt, or compromise the security or functionality of the Service. This includes but is not limited to attempting to gain unauthorized access, introducing malicious code, or engaging in any activity that could harm our systems or other users.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">User Responsibilities</h2>
            <p className="leading-relaxed text-muted-foreground">
              You are responsible for maintaining the confidentiality and security of any files you process using our tools. While we process files client-side in your browser for maximum privacy, you should take appropriate precautions when using shared or public computers. Always verify the output of our tools before using processed files for important purposes.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              You acknowledge that automated processing may not always produce perfect results, especially with complex documents. It is your responsibility to review all processed files and ensure they meet your requirements before distribution or submission.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Intellectual Property Rights</h2>
            <p className="leading-relaxed text-muted-foreground">
              All content, features, and functionality of The Bharat PDF, including but not limited to text, graphics, logos, icons, images, and software, are the exclusive property of The Bharat PDF or its licensors and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works based on our content without explicit permission.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              You retain all rights to the files you process using our tools. We do not claim any ownership or rights to your files. By using our Service, you grant us no rights to your content beyond what is necessary to provide the Service (which, given our client-side processing model, is minimal).
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Limitation of Liability</h2>
            <p className="leading-relaxed text-muted-foreground">
              To the fullest extent permitted by law, The Bharat PDF and its affiliates, officers, employees, agents, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from your use or inability to use the Service.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              We do not warrant that the Service will be uninterrupted, secure, or error-free, or that defects will be corrected. We make no warranties about the accuracy, reliability, or completeness of any content or results produced by our tools. Your use of the Service is at your sole risk.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Disclaimer of Warranties</h2>
            <p className="leading-relaxed text-muted-foreground">
              The Service is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance. We do not warrant that the Service will meet your requirements or that the operation will be uninterrupted or error-free.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Indemnification</h2>
            <p className="leading-relaxed text-muted-foreground">
              You agree to indemnify, defend, and hold harmless The Bharat PDF and its affiliates, officers, employees, agents, and licensors from and against any claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from your use of the Service, your violation of these Terms, or your violation of any rights of another party.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Governing Law</h2>
            <p className="leading-relaxed text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts located in India.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Changes to Terms</h2>
            <p className="leading-relaxed text-muted-foreground">
              We reserve the right to modify or replace these Terms at any time at our sole discretion. If we make material changes, we will update the "Last Updated" date at the top of this page. Your continued use of the Service after any changes constitutes acceptance of the new Terms. We encourage you to review these Terms periodically.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Contact Information</h2>
            <p className="leading-relaxed text-muted-foreground">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Email:{' '}
              <a href="mailto:support@thebharatpdf.com" className="text-[#22c55e] hover:underline">
                support@thebharatpdf.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
