import { Link } from '@tanstack/react-router';
import { Heart, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' ? window.location.hostname : 'quickpdf-india';
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://quickpdf.in';
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(siteUrl);
      } else {
        // Fallback for older browsers or mobile
        const textArea = document.createElement('textarea');
        textArea.value = siteUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">About QuickPDF India</h3>
            <p className="text-sm text-muted-foreground">
              Fast, secure, and free PDF & image tools for everyone. No login required.
            </p>
          </div>

          {/* PDF Tools */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">PDF Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/merge-pdf" className="text-muted-foreground hover:text-foreground">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link to="/split-pdf" className="text-muted-foreground hover:text-foreground">
                  Split PDF
                </Link>
              </li>
              <li>
                <Link to="/compress-pdf" className="text-muted-foreground hover:text-foreground">
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link to="/resize-pdf" className="text-muted-foreground hover:text-foreground">
                  Resize PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Image Tools */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Image Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/resize-image" className="text-muted-foreground hover:text-foreground">
                  Resize Image
                </Link>
              </li>
              <li>
                <Link to="/image-to-pdf" className="text-muted-foreground hover:text-foreground">
                  Image to PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust & Privacy */}
        <div className="mt-8 border-t border-border pt-8">
          <div className="mb-4 space-y-2 text-sm text-muted-foreground">
            <p>✓ Files are secure and auto-deleted after processing</p>
            <p>✓ No login required</p>
            <p>✓ 100% free to use</p>
          </div>

          {/* Website Link Copy Section */}
          <div className="mb-6 rounded-lg border border-border bg-card p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Website Link</p>
                <p className="text-sm text-muted-foreground">{siteUrl}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyUrl}
                className="gap-2 whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <p>© {currentYear} QuickPDF India. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with <Heart className="h-4 w-4 fill-[#2ecc71] text-[#2ecc71]" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(appIdentifier)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
