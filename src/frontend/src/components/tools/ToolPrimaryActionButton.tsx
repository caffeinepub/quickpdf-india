import { Button } from '@/components/ui/button';
import { Loader2, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolPrimaryActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
}

export function ToolPrimaryActionButton({
  onClick,
  disabled = false,
  loading = false,
  icon: Icon,
  children,
  className,
  size = 'lg',
}: ToolPrimaryActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      size={size}
      className={cn(
        'gap-2 bg-[#22c55e] text-white hover:bg-[#16a34a] focus-visible:ring-[#22c55e] disabled:opacity-50',
        className
      )}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : Icon ? (
        <Icon className="h-5 w-5" />
      ) : null}
      {children}
    </Button>
  );
}
