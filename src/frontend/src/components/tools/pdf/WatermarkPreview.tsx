import { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WatermarkConfig } from './WatermarkOptions';

interface WatermarkPreviewProps {
  config: WatermarkConfig;
}

export function WatermarkPreview({ config }: WatermarkPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !config.text) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size (A4 aspect ratio)
    const width = 400;
    const height = 565; // A4 ratio
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw border
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);

    // Calculate position
    let x = width / 2;
    let y = height / 2;

    const position = config.position || 'center';
    const margin = 40;

    switch (position) {
      case 'topLeft':
        x = margin;
        y = margin;
        break;
      case 'topRight':
        x = width - margin;
        y = margin;
        break;
      case 'bottomLeft':
        x = margin;
        y = height - margin;
        break;
      case 'bottomRight':
        x = width - margin;
        y = height - margin;
        break;
      case 'center':
      default:
        x = width / 2;
        y = height / 2;
        break;
    }

    // Set font
    const fontFamily = config.fontStyle || 'Helvetica';
    const scaledFontSize = (config.fontSize / 595) * height; // Scale to canvas
    ctx.font = `${scaledFontSize}px ${fontFamily}, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Apply transformations
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((config.rotation * Math.PI) / 180);

    // Draw watermark
    ctx.fillStyle = `rgba(128, 128, 128, ${config.opacity})`;
    ctx.fillText(config.text, 0, 0);

    ctx.restore();
  }, [config]);

  if (!config.text) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>Enter watermark text to see preview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
            <p className="text-sm text-muted-foreground">No preview available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>How your watermark will appear on the PDF</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className="max-w-full rounded-lg border border-border shadow-sm"
            style={{ maxHeight: '400px' }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
