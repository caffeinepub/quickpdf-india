import { Seo } from '@/components/seo/Seo';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export default function PrivacyPolicyPage() {
  useScrollToTop();

  const lastUpdated = 'February 19, 2026';

  return (
    <>
      <Seo
        title="Privacy Policy - The Bharat PDF"
        description="The Bharat PDF Privacy Policy - Learn how we protect your data and privacy. All file processing happens in your browser with no server uploads."
      />

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-4 text-4xl font-bold">Privacy Policy</h1>
        <p className="mb-8 text-sm text-muted-foreground">Last Updated: {lastUpdated}</p>

        <div className="prose prose-lg max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Introduction</h2>
            <p className="leading-relaxed text-muted-foreground">
              At The Bharat PDF, we take your privacy seriously. This Privacy Policy explains how we handle your information when you use our website and tools. We are committed to protecting your personal data and being transparent about our practices. By using our services, you agree to the terms outlined in this policy.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">File Processing and Storage</h2>
            <p className="leading-relaxed text-muted-foreground">
              All file processing on The Bharat PDF happens entirely within your web browser using client-side JavaScript technology. When you upload a file to use any of our tools, the file is processed locally on your device and never transmitted to our servers or any third-party servers. Your files remain completely private and under your control at all times.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Once you close your browser tab or navigate away from the tool page, all file data is automatically cleared from your browser's memory. We do not store, cache, or retain any copies of your files. This client-side processing approach ensures maximum privacy and security for your sensitive documents.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Cookies and Tracking</h2>
            <p className="leading-relaxed text-muted-foreground">
              The Bharat PDF uses minimal cookies to enhance your browsing experience and maintain basic functionality. We use session cookies to remember your preferences during your visit, such as theme settings or language preferences. These cookies do not contain any personal information and are automatically deleted when you close your browser.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              We may use analytics cookies to understand how visitors use our website, which helps us improve our services. These analytics are aggregated and anonymized, meaning we cannot identify individual users. You can disable cookies in your browser settings at any time, though this may affect some website functionality.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Data Collection Practices</h2>
            <p className="leading-relaxed text-muted-foreground">
              We collect minimal data necessary to operate our website. This includes basic technical information such as your IP address, browser type, device type, and pages visited. This information is used solely for maintaining website security, preventing abuse, and improving our services. We do not collect personal information such as names, email addresses, or phone numbers unless you voluntarily provide them through our contact form.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              When you use our contact form, we collect only the information you provide (name, email, and message content) to respond to your inquiry. This information is stored securely and is never shared with third parties or used for marketing purposes without your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Third-Party Advertising (AdSense)</h2>
            <p className="leading-relaxed text-muted-foreground">
              The Bharat PDF may display advertisements through Google AdSense to support the free operation of our services. Google AdSense uses cookies and similar technologies to serve ads based on your prior visits to our website or other websites. These advertising cookies enable Google and its partners to serve ads to you based on your browsing history across the internet.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              You can opt out of personalized advertising by visiting Google's Ads Settings at{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#22c55e] hover:underline"
              >
                www.google.com/settings/ads
              </a>
              . Additionally, you can opt out of third-party vendor cookies by visiting the Network Advertising Initiative opt-out page at{' '}
              <a
                href="http://www.networkadvertising.org/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#22c55e] hover:underline"
              >
                www.networkadvertising.org/choices/
              </a>
              . Please note that opting out of personalized ads does not mean you will see fewer ads; it means the ads you see will be less relevant to your interests.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Data Security Measures</h2>
            <p className="leading-relaxed text-muted-foreground">
              We implement industry-standard security measures to protect our website and any data we collect. Our website uses HTTPS encryption to secure data transmission between your browser and our servers. Since all file processing happens client-side in your browser, your files are never exposed to network transmission risks or server-side vulnerabilities.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              While we take reasonable precautions to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security but are committed to using best practices to safeguard your data.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">User Rights</h2>
            <p className="leading-relaxed text-muted-foreground">
              You have the right to access, correct, or delete any personal information we may have collected from you. Since we collect minimal data and do not store your files, there is typically no personal data to access or delete. If you have submitted information through our contact form and wish to have it removed, please contact us at support@thebharatpdf.com.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              You also have the right to object to data processing, request data portability, and lodge a complaint with a supervisory authority if you believe your privacy rights have been violated.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Changes to This Policy</h2>
            <p className="leading-relaxed text-muted-foreground">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make significant changes, we will update the "Last Updated" date at the top of this page. We encourage you to review this policy periodically to stay informed about how we protect your privacy.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-[#22c55e]">Contact Information</h2>
            <p className="leading-relaxed text-muted-foreground">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
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
