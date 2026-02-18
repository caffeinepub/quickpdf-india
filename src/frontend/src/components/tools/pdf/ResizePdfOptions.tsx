import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export type PageSize = 'A4' | 'Letter' | 'Legal' | 'A3' | 'A5';

interface ResizePdfOptionsProps {
  value: PageSize;
  onChange: (size: PageSize) => void;
}

export function ResizePdfOptions({ value, onChange }: ResizePdfOptionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resize Settings</CardTitle>
        <CardDescription>Choose the target page size for your PDF</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="page-size">Target Page Size</Label>
          <Select value={value} onValueChange={(v) => onChange(v as PageSize)}>
            <SelectTrigger id="page-size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A4">A4 (210 × 297 mm)</SelectItem>
              <SelectItem value="Letter">Letter (8.5 × 11 in)</SelectItem>
              <SelectItem value="Legal">Legal (8.5 × 14 in)</SelectItem>
              <SelectItem value="A3">A3 (297 × 420 mm)</SelectItem>
              <SelectItem value="A5">A5 (148 × 210 mm)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
