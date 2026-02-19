interface HowToUseSectionProps {
  steps: string[];
}

export function HowToUseSection({ steps }: HowToUseSectionProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-6 text-2xl font-bold">How to Use This Tool</h2>
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li key={index} className="flex gap-4">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#22c55e] text-sm font-bold text-white">
              {index + 1}
            </span>
            <p className="pt-1 text-muted-foreground">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
