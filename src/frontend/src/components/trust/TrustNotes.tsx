import { Shield, Lock, Zap } from 'lucide-react';

export function TrustNotes() {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-[#2ecc71]" />
          <div>
            <h4 className="mb-1 text-sm font-semibold">Secure & Private</h4>
            <p className="text-xs text-muted-foreground">
              Files are secure and auto-deleted after processing
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Lock className="h-5 w-5 text-[#2ecc71]" />
          <div>
            <h4 className="mb-1 text-sm font-semibold">No Login Required</h4>
            <p className="text-xs text-muted-foreground">Use all tools without creating an account</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Zap className="h-5 w-5 text-[#2ecc71]" />
          <div>
            <h4 className="mb-1 text-sm font-semibold">Fast Processing</h4>
            <p className="text-xs text-muted-foreground">
              Client-side processing for instant results
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
