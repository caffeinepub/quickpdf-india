import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageResizeOptions as ResizeOptions } from '../processors/imageResizeProcessor';
import { ToolPrimaryActionButton } from '../ToolPrimaryActionButton';
import { ImageIcon } from 'lucide-react';

interface ImageResizeOptionsProps {
  onProcess: (options: ResizeOptions) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function ImageResizeOptions({ onProcess, disabled, isLoading }: ImageResizeOptionsProps) {
  const [mode, setMode] = useState<'pixels' | 'percentage' | 'target-size'>('pixels');
  const [width, setWidth] = useState<string>('800');
  const [height, setHeight] = useState<string>('600');
  const [percentage, setPercentage] = useState<string>('50');
  const [targetSize, setTargetSize] = useState<string>('50');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

  const handleProcess = () => {
    const options: ResizeOptions = {
      mode,
      maintainAspectRatio,
    };

    if (mode === 'pixels') {
      options.width = parseInt(width) || undefined;
      options.height = parseInt(height) || undefined;
    } else if (mode === 'percentage') {
      options.percentage = parseInt(percentage);
    } else if (mode === 'target-size') {
      options.targetSizeKB = parseInt(targetSize);
    }

    onProcess(options);
  };

  return (
    <div className="space-y-6 rounded-lg border border-border bg-card p-6">
      <h3 className="text-lg font-semibold">Resize Options</h3>

      <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pixels">By Pixels</TabsTrigger>
          <TabsTrigger value="percentage">By Percentage</TabsTrigger>
          <TabsTrigger value="target-size">Target Size</TabsTrigger>
        </TabsList>

        <TabsContent value="pixels" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                min="1"
                placeholder="800"
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="1"
                placeholder="600"
                disabled={disabled}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="aspect-ratio"
              checked={maintainAspectRatio}
              onCheckedChange={(checked) => setMaintainAspectRatio(checked as boolean)}
              disabled={disabled}
            />
            <Label htmlFor="aspect-ratio" className="cursor-pointer text-sm">
              Maintain aspect ratio
            </Label>
          </div>
        </TabsContent>

        <TabsContent value="percentage" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="percentage">Scale Percentage</Label>
            <Input
              id="percentage"
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              min="1"
              max="100"
              placeholder="50"
              disabled={disabled}
            />
            <p className="text-xs text-muted-foreground">
              Enter a value between 1-100 (e.g., 50 = half size)
            </p>
          </div>
        </TabsContent>

        <TabsContent value="target-size" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target-size">Target Size (KB)</Label>
            <Input
              id="target-size"
              type="number"
              value={targetSize}
              onChange={(e) => setTargetSize(e.target.value)}
              min="1"
              placeholder="50"
              disabled={disabled}
            />
            <p className="text-xs text-muted-foreground">
              Image will be compressed to approximately this size
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <ToolPrimaryActionButton
        onClick={handleProcess}
        disabled={disabled}
        loading={isLoading}
        icon={ImageIcon}
        size="lg"
        className="w-full"
      >
        {isLoading ? 'Processing...' : 'Resize Image'}
      </ToolPrimaryActionButton>
    </div>
  );
}
