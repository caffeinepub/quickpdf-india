import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { toolsCatalog } from './toolsCatalog';

export function ToolsGrid() {
  const navigate = useNavigate();

  return (
    <section id="tools" className="container py-16">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold">All Tools</h2>
        <p className="text-muted-foreground">Choose from our collection of free PDF and image tools</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {toolsCatalog.map((tool) => (
          <Card key={tool.id} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-[#2ecc71]/10">
                <tool.icon className="h-6 w-6 text-[#2ecc71]" />
              </div>
              <CardTitle className="text-lg">{tool.label}</CardTitle>
              <CardDescription className="text-sm">{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate({ to: tool.route })}
                className="w-full bg-[#2ecc71] hover:bg-[#27ae60]"
              >
                Start
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
