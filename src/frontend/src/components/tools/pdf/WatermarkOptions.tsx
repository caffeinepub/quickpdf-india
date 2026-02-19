import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export type WatermarkPosition = 'center' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
export type FontStyle = 'Helvetica' | 'Times' | 'Courier';

export interface WatermarkConfig {
  text: string;
  opacity: number;
  fontSize: number;
  rotation: number;
  position?: WatermarkPosition;
  fontStyle?: FontStyle;
}

interface WatermarkOptionsProps {
  value: WatermarkConfig;
  onChange: (config: WatermarkConfig) => void;
}

export function WatermarkOptions({ value, onChange }: WatermarkOptionsProps) {
  const handleTextChange = (text: string) => {
    onChange({ ...value, text });
  };

  const handleOpacityChange = (opacity: number[]) => {
    onChange({ ...value, opacity: opacity[0] / 100 });
  };

  const handleFontSizeChange = (fontSize: number[]) => {
    onChange({ ...value, fontSize: fontSize[0] });
  };

  const handleRotationChange = (rotation: number[]) => {
    onChange({ ...value, rotation: rotation[0] });
  };

  const handlePositionChange = (position: WatermarkPosition) => {
    onChange({ ...value, position });
  };

  const handleFontStyleChange = (fontStyle: FontStyle) => {
    onChange({ ...value, fontStyle });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Watermark Settings</CardTitle>
        <CardDescription>Customize your watermark appearance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Text Input */}
        <div className="space-y-2">
          <Label htmlFor="watermark-text">Watermark Text</Label>
          <Input
            id="watermark-text"
            type="text"
            placeholder="Enter watermark text"
            value={value.text}
            onChange={(e) => handleTextChange(e.target.value)}
          />
        </div>

        {/* Position */}
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Select
            value={value.position || 'center'}
            onValueChange={handlePositionChange}
          >
            <SelectTrigger id="position">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="topLeft">Top Left</SelectItem>
              <SelectItem value="topRight">Top Right</SelectItem>
              <SelectItem value="bottomLeft">Bottom Left</SelectItem>
              <SelectItem value="bottomRight">Bottom Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Font Style */}
        <div className="space-y-2">
          <Label htmlFor="font-style">Font Style</Label>
          <Select
            value={value.fontStyle || 'Helvetica'}
            onValueChange={handleFontStyleChange}
          >
            <SelectTrigger id="font-style">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Helvetica">Helvetica</SelectItem>
              <SelectItem value="Times">Times Roman</SelectItem>
              <SelectItem value="Courier">Courier</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Opacity Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="opacity" className="text-base font-medium">Opacity</Label>
            <span className="text-base font-semibold text-[#22c55e] bg-[#22c55e]/10 px-3 py-1 rounded-md">
              {Math.round(value.opacity * 100)}%
            </span>
          </div>
          <div className="px-1 py-2">
            <Slider
              id="opacity"
              min={0}
              max={100}
              step={5}
              value={[value.opacity * 100]}
              onValueChange={handleOpacityChange}
              className="watermark-slider"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Font Size Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="font-size" className="text-base font-medium">Font Size</Label>
            <span className="text-base font-semibold text-[#22c55e] bg-[#22c55e]/10 px-3 py-1 rounded-md">
              {value.fontSize}pt
            </span>
          </div>
          <div className="px-1 py-2">
            <Slider
              id="font-size"
              min={10}
              max={100}
              step={2}
              value={[value.fontSize]}
              onValueChange={handleFontSizeChange}
              className="watermark-slider"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>10pt</span>
            <span>100pt</span>
          </div>
        </div>

        {/* Rotation Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="rotation" className="text-base font-medium">Rotation</Label>
            <span className="text-base font-semibold text-[#22c55e] bg-[#22c55e]/10 px-3 py-1 rounded-md">
              {value.rotation}°
            </span>
          </div>
          <div className="px-1 py-2">
            <Slider
              id="rotation"
              min={-180}
              max={180}
              step={15}
              value={[value.rotation]}
              onValueChange={handleRotationChange}
              className="watermark-slider"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>-180°</span>
            <span>180°</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
