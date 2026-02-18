import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolStepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export function ToolStepIndicator({ currentStep }: ToolStepIndicatorProps) {
  const steps = [
    { number: 1, label: 'Upload File' },
    { number: 2, label: 'Adjust Settings' },
    { number: 3, label: 'Download Result' },
  ];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                currentStep > step.number
                  ? 'border-[#22c55e] bg-[#22c55e] text-white'
                  : currentStep === step.number
                    ? 'border-[#22c55e] bg-[#22c55e] text-white'
                    : 'border-border bg-muted text-muted-foreground'
              )}
            >
              {currentStep > step.number ? (
                <Check className="h-4 w-4" />
              ) : (
                step.number
              )}
            </div>
            <span
              className={cn(
                'hidden text-sm font-medium sm:inline',
                currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'mx-2 h-0.5 w-8 sm:w-12 transition-colors',
                currentStep > step.number ? 'bg-[#22c55e]' : 'bg-border'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
