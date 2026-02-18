import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export type PageSize = 'A4' | 'Letter';
export type FitMode = 'fit' | 'fill' | 'original';

export interface ImageToPdfConfig {
  pageSize: PageSize;
  fitMode: FitMode;
  margin: number;
}

interface ImageToPdfOptionsProps {
  value: ImageToPdfConfig;
  onChange: (config: ImageToPdfConfig) => void;
}

export function ImageToPdfOptions({ value, onChange }: ImageToPdfOptionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>PDF Settings</CardTitle>
        <CardDescription>Configure how images will be arranged in the PDF</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Page Size */}
        <div className="space-y-2">
          <Label htmlFor="page-size">Page Size</Label>
          <Select
            value={value.pageSize}
            onValueChange={(pageSize: PageSize) => onChange({ ...value, pageSize })}
          >
            <SelectTrigger id="page-size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A4">A4 (210 × 297 mm)</SelectItem>
              <SelectItem value="Letter">Letter (8.5 × 11 in)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fit Mode */}
        <div className="space-y-2">
          <Label htmlFor="fit-mode">Image Fit</Label>
          <Select
            value={value.fitMode}
            onValueChange={(fitMode: FitMode) => onChange({ ...value, fitMode })}
          >
            <SelectTrigger id="fit-mode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fit">Fit - Scale to fit page (preserve aspect ratio)</SelectItem>
              <SelectItem value="fill">Fill - Fill entire page (may crop)</SelectItem>
              <SelectItem value="original">Original Size - Keep original dimensions</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Margin */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="margin">Margin</Label>
            <span className="text-sm text-muted-foreground">{value.margin}pt</span>
          </div>
          <Slider
            id="margin"
            min={0}
            max={72}
            step={4}
            value={[value.margin]}
            onValueChange={(values) => onChange({ ...value, margin: values[0] })}
          />
          <p className="text-xs text-muted-foreground">
            Space around images on each page
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
