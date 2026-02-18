import { useEffect } from 'react';
import { useSeoMeta } from '@/hooks/useSeoMeta';

interface SeoProps {
  title: string;
  description: string;
}

export function Seo({ title, description }: SeoProps) {
  useSeoMeta(title, description);
  return null;
}
