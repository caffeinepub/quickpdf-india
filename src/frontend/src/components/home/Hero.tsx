import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Upload, Shield, Lock, CheckCircle } from 'lucide-react';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="container flex min-h-[600px] flex-col items-center justify-center py-16 text-center">
      <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
        Free PDF & Image Tools
        <span className="block text-[#2ecc71]">Fast, Secure, No Login Required</span>
      </h1>
      <p className="mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
        Professional PDF manipulation and image conversion tools. All processing happens in your
        browser - your files never leave your device.
      </p>

      {/* Trust Message */}
      <div className="mb-8 rounded-lg border border-[#22c55e]/30 bg-[#22c55e]/5 px-6 py-4">
        <p className="mb-4 text-lg font-semibold text-[#22c55e]">
          🔒 Your files are secure and automatically deleted after processing. No registration required.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#22c55e]" />
            <span className="text-sm font-medium">100% Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-[#22c55e]" />
            <span className="text-sm font-medium">Private Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-[#22c55e]" />
            <span className="text-sm font-medium">No Registration</span>
          </div>
        </div>
      </div>

      <Button
        size="lg"
        onClick={() => navigate({ to: '/merge-pdf' })}
        className="bg-[#2ecc71] text-lg hover:bg-[#27ae60]"
      >
        <Upload className="mr-2 h-5 w-5" />
        Start Processing Files
      </Button>
    </section>
  );
}
