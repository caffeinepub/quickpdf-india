import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

interface RemovePagesOptionsProps {
  value: string;
  onChange: (value: string) => void;
  totalPages?: number;
}

export function RemovePagesOptions({ value, onChange, totalPages }: RemovePagesOptionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Remove Pages</CardTitle>
        <CardDescription>
          {totalPages ? `Your PDF has ${totalPages} pages` : 'Specify which pages to remove'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pages-to-remove">Pages to Remove</Label>
          <Input
            id="pages-to-remove"
            placeholder="e.g., 1, 3, 5-7"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>

        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Enter page numbers separated by commas. Use hyphens for ranges.
            <br />
            Examples: "1, 3, 5" or "1-3, 7-9"
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
