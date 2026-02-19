import { cn } from '@/lib/utils';

interface AdSlotProps {
  variant: 'header-banner' | 'sidebar' | 'in-content' | 'pre-download' | 'in-article' | 'post-tool' | 'footer-banner';
  className?: string;
}

export function AdSlot({ variant, className }: AdSlotProps) {
  const variants = {
    'header-banner': 'h-24 w-full',
    sidebar: 'h-96 w-full',
    'in-content': 'h-32 w-full',
    'pre-download': 'h-24 w-full',
    'in-article': 'h-64 w-full',
    'post-tool': 'h-24 w-full max-w-3xl mx-auto',
    'footer-banner': 'h-24 w-full',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/10',
        variants[variant],
        className
      )}
    >
      <p className="text-xs text-muted-foreground">Ad Space - {variant}</p>
    </div>
  );
}
