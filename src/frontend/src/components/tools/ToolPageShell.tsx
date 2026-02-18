import { ReactNode } from 'react';

interface ToolPageShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function ToolPageShell({ title, description, children }: ToolPageShellProps) {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
