import { ArrowDown, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ToolNextStepCalloutProps {
  message: string;
}

export function ToolNextStepCallout({ message }: ToolNextStepCalloutProps) {
  return (
    <Alert className="border-[#22c55e] bg-[#22c55e]/10 animate-in fade-in slide-in-from-top-2 duration-500">
      <Sparkles className="h-4 w-4 text-[#22c55e]" />
      <AlertDescription className="flex items-center gap-2 text-foreground">
        <span className="font-medium">{message}</span>
        <ArrowDown className="h-4 w-4 animate-bounce text-[#22c55e]" />
      </AlertDescription>
    </Alert>
  );
}
