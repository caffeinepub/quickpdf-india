import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageResizeOptions as ResizeOptions } from '../processors/imageResizeProcessor';
import { ToolPrimaryActionButton } from '../ToolPrimaryActionButton';
import { ImageIcon } from 'lucide-react';

interface ImageResizeOptionsProps {
  onProcess: (options: ResizeOptions) => void;
  disabled?: boolean;
  isLoading?: boolean;
  originalWidth?: number;
  originalHeight?: number;
}

export function ImageResizeOptions({ 
  onProcess, 
  disabled, 
  isLoading,
  originalWidth,
  originalHeight 
}: ImageResizeOptionsProps) {
  const [mode, setMode] = useState<'pixels' | 'percentage' | 'target-size'>('pixels');
  const [width, setWidth] = useState<string>('800');
  const [height, setHeight] = useState<string>('600');
  const [percentage, setPercentage] = useState<string>('50');
  const [targetSize, setTargetSize] = useState<string>('50');
  const [targetUnit, setTargetUnit] = useState<'KB' | 'MB'>('KB');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [validationError, setValidationError] = useState<string>('');

  // Auto-calculate height when width changes (if aspect ratio is maintained)
  useEffect(() => {
    if (mode === 'pixels' && maintainAspectRatio && originalWidth && originalHeight) {
      const w = parseInt(width);
      if (!isNaN(w) && w > 0) {
        const aspectRatio = originalWidth / originalHeight;
        const calculatedHeight = Math.round(w / aspectRatio);
        setHeight(calculatedHeight.toString());
      }
    }
  }, [width, maintainAspectRatio, mode, originalWidth, originalHeight]);

  const validateInputs = (): string | null => {
    if (mode === 'pixels') {
      const w = parseInt(width);
      const h = parseInt(height);
      
      if (isNaN(w) && isNaN(h)) {
        return 'Please enter at least width or height';
      }
      if (!isNaN(w) && w <= 0) {
        return 'Width must be greater than 0';
      }
      if (!isNaN(h) && h <= 0) {
        return 'Height must be greater than 0';
      }
    } else if (mode === 'percentage') {
      const p = parseInt(percentage);
      if (isNaN(p) || p <= 0 || p > 200) {
        return 'Percentage must be between 1 and 200';
      }
    } else if (mode === 'target-size') {
      const size = parseInt(targetSize);
      if (isNaN(size) || size <= 0) {
        return 'Target size must be greater than 0';
      }
    }
    return null;
  };

  const handleProcess = () => {
    const error = validateInputs();
    if (error) {
      setValidationError(error);
      return;
    }
    
    setValidationError('');

    const options: ResizeOptions = {
      mode,
      maintainAspectRatio,
      quality,
    };

    if (mode === 'pixels') {
      const w = parseInt(width);
      const h = parseInt(height);
      options.width = !isNaN(w) && w > 0 ? w : undefined;
      options.height = !isNaN(h) && h > 0 ? h : undefined;
    } else if (mode === 'percentage') {
      options.percentage = parseInt(percentage);
    } else if (mode === 'target-size') {
      const size = parseInt(targetSize);
      options.targetSizeKB = targetUnit === 'MB' ? size * 1024 : size;
    }

    onProcess(options);
  };

  return (
    <div className="space-y-4 sm:space-y-6 rounded-lg border border-border bg-card p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base sm:text-lg font-semibold">Resize Options</h3>
        
        {/* Quality Selector */}
        <div className="flex items-center gap-2">
          <Label htmlFor="quality" className="text-sm text-muted-foreground whitespace-nowrap">Quality:</Label>
          <Select value={quality} onValueChange={(v) => setQuality(v as any)} disabled={disabled}>
            <SelectTrigger id="quality" className="w-[110px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger 
            value="pixels" 
            className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            By Pixels
          </TabsTrigger>
          <TabsTrigger 
            value="percentage" 
            className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            By Percentage
          </TabsTrigger>
          <TabsTrigger 
            value="target-size" 
            className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
          >
            Target Size
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pixels" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="width" className="text-sm">Width (px)</Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                min="1"
                placeholder="800"
                disabled={disabled}
                className="min-w-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height" className="text-sm">Height (px)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="1"
                placeholder="600"
                disabled={disabled || (maintainAspectRatio && !!width)}
                className="min-w-0"
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
          {maintainAspectRatio && (
            <p className="text-xs text-muted-foreground">
              Height will be calculated automatically based on width
            </p>
          )}
        </TabsContent>

        <TabsContent value="percentage" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="percentage" className="text-sm">Scale Percentage</Label>
            <Input
              id="percentage"
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              min="1"
              max="200"
              placeholder="50"
              disabled={disabled}
              className="min-w-0"
            />
            <p className="text-xs text-muted-foreground">
              Common values: 10% (tiny), 25% (small), 50% (half), 75% (three-quarters), 100% (original)
            </p>
          </div>
        </TabsContent>

        <TabsContent value="target-size" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="target-size" className="text-sm">Target File Size</Label>
            <div className="flex flex-col xs:flex-row gap-2">
              <Input
                id="target-size"
                type="number"
                value={targetSize}
                onChange={(e) => setTargetSize(e.target.value)}
                min="1"
                placeholder="50"
                disabled={disabled}
                className="flex-1 min-w-0"
              />
              <Select value={targetUnit} onValueChange={(v) => setTargetUnit(v as any)} disabled={disabled}>
                <SelectTrigger className="w-full xs:w-[90px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KB">KB</SelectItem>
                  <SelectItem value="MB">MB</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Image will be compressed to approximately this size (±5% tolerance)
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {validationError && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 p-3">
          <p className="text-sm text-destructive">{validationError}</p>
        </div>
      )}

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
