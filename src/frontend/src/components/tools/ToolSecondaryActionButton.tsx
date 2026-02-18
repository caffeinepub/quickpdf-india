import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolSecondaryActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  variant?: 'outline' | 'ghost';
}

export function ToolSecondaryActionButton({
  onClick,
  disabled = false,
  icon: Icon,
  children,
  className,
  size = 'default',
  variant = 'outline',
}: ToolSecondaryActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size={size}
      variant={variant}
      className={cn('gap-2', className)}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </Button>
  );
}
