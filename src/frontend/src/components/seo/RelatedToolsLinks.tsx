import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toolsCatalog } from '../home/toolsCatalog';

interface RelatedToolsLinksProps {
  currentToolId: string;
  relatedToolIds: string[];
}

export function RelatedToolsLinks({ currentToolId, relatedToolIds }: RelatedToolsLinksProps) {
  const relatedTools = toolsCatalog.filter(
    (tool) => relatedToolIds.includes(tool.id) && tool.id !== currentToolId
  );

  if (relatedTools.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Related Tools</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {relatedTools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.route}
              className="flex items-center space-x-3 rounded-lg p-3 transition-colors hover:bg-muted"
            >
              <tool.icon className="h-5 w-5 text-[#2ecc71]" />
              <div>
                <p className="font-medium">{tool.label}</p>
                <p className="text-xs text-muted-foreground">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
