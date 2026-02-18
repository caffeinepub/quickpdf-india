import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Upload } from 'lucide-react';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="container py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Free PDF & Image Tools for India
        </h1>
        <p className="mb-8 text-lg text-muted-foreground md:text-xl">
          Merge, split, compress, and convert PDFs and images instantly. Fast, secure, and completely
          free. No login required.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            onClick={() => navigate({ to: '/merge-pdf' })}
            className="bg-[#2ecc71] text-lg hover:bg-[#27ae60]"
          >
            <Upload className="mr-2 h-5 w-5" />
            Start Processing Files
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          ✓ Secure & Private • ✓ No Registration • ✓ Files Auto-Deleted
        </p>
      </div>
    </section>
  );
}
