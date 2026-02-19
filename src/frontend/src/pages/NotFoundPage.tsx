import { Seo } from '@/components/seo/Seo';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <Seo
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist. Return to QuickPDF India homepage to access our free PDF and image tools."
      />

      <div className="container mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-[#22c55e]/10">
          <Search className="h-16 w-16 text-[#22c55e]" />
        </div>

        <h1 className="mb-4 text-6xl font-bold">404</h1>
        <h2 className="mb-4 text-3xl font-semibold">Page Not Found</h2>
        <p className="mb-8 text-lg text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. The page may have been moved, deleted, or the URL might be incorrect.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            onClick={() => navigate({ to: '/' })}
            className="bg-[#22c55e] hover:bg-[#27ae60]"
            size="lg"
          >
            <Home className="mr-2 h-5 w-5" />
            Go to Homepage
          </Button>
          <Button onClick={() => window.history.back()} variant="outline" size="lg">
            Go Back
          </Button>
        </div>

        <div className="mt-12 rounded-lg border border-border bg-card p-6">
          <h3 className="mb-3 text-lg font-semibold">Looking for our tools?</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Visit our homepage to access all our free PDF and image processing tools.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <Button
              variant="link"
              onClick={() => navigate({ to: '/merge-pdf' })}
              className="text-[#22c55e]"
            >
              Merge PDF
            </Button>
            <span className="text-muted-foreground">•</span>
            <Button
              variant="link"
              onClick={() => navigate({ to: '/compress-pdf' })}
              className="text-[#22c55e]"
            >
              Compress PDF
            </Button>
            <span className="text-muted-foreground">•</span>
            <Button
              variant="link"
              onClick={() => navigate({ to: '/word-to-pdf' })}
              className="text-[#22c55e]"
            >
              Word to PDF
            </Button>
            <span className="text-muted-foreground">•</span>
            <Button
              variant="link"
              onClick={() => navigate({ to: '/resize-image' })}
              className="text-[#22c55e]"
            >
              Resize Image
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
