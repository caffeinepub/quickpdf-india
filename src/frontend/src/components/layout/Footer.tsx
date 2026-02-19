import { Link } from '@tanstack/react-router';
import { Heart, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    try {
      const url = window.location.origin;
      
      // Modern Clipboard API with fallback
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers or mobile
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          textArea.remove();
        } catch (err) {
          console.error('Fallback copy failed:', err);
          textArea.remove();
          throw err;
        }
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'quickpdf-tools');

  return (
    <footer className="border-t border-border bg-card/30 py-12">
      <div className="container">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* PDF Tools */}
          <div>
            <h3 className="mb-4 font-semibold">PDF Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/merge-pdf"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link
                  to="/split-pdf"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Split PDF
                </Link>
              </li>
              <li>
                <Link
                  to="/compress-pdf"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link
                  to="/resize-pdf"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Resize PDF
                </Link>
              </li>
              <li>
                <Link
                  to="/remove-pages"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Remove Pages
                </Link>
              </li>
              <li>
                <Link
                  to="/add-watermark"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Add Watermark
                </Link>
              </li>
            </ul>
          </div>

          {/* Conversion Tools */}
          <div>
            <h3 className="mb-4 font-semibold">Conversion Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/pdf-to-word"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  PDF to Word
                </Link>
              </li>
              <li>
                <Link
                  to="/word-to-pdf"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Word to PDF
                </Link>
              </li>
              <li>
                <Link
                  to="/tools/excel-to-pdf"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Excel to PDF
                </Link>
              </li>
              <li>
                <Link
                  to="/tools/pdf-to-excel"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  PDF to Excel
                </Link>
              </li>
              <li>
                <Link
                  to="/tools/powerpoint-to-pdf"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  PowerPoint to PDF
                </Link>
              </li>
              <li>
                <Link
                  to="/tools/pdf-to-powerpoint"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  PDF to PowerPoint
                </Link>
              </li>
              <li>
                <Link
                  to="/tools/pdf-to-jpg"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  PDF to JPG
                </Link>
              </li>
              <li>
                <Link
                  to="/image-to-pdf"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Image to PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Image Tools */}
          <div>
            <h3 className="mb-4 font-semibold">Image Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/resize-image"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Resize Image
                </Link>
              </li>
              <li>
                <Link
                  to="/tools/jpg-to-jpeg"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  JPG to JPEG
                </Link>
              </li>
              <li>
                <Link
                  to="/tools/jpeg-to-jpg"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  JPEG to JPG
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="mb-4 font-semibold">About</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/blog"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Blog
                </Link>
              </li>
            </ul>
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-muted-foreground">Share this site:</p>
              <button
                onClick={handleCopyUrl}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label="Copy website URL"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Trust Message */}
        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            All processing happens in your browser. Your files never leave your device.
          </p>
        </div>

        {/* Copyright and Attribution */}
        <div className="mt-6 flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground sm:flex-row sm:gap-4">
          <p>© {currentYear} QuickPDF Tools. All rights reserved.</p>
          <span className="hidden sm:inline">•</span>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 transition-colors hover:text-foreground"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
