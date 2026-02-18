import {
  FileText,
  Scissors,
  Minimize2,
  Maximize2,
  Trash2,
  Droplet,
  FileType,
  FileInput,
  Image,
  ImageIcon,
} from 'lucide-react';

export interface Tool {
  id: string;
  label: string;
  description: string;
  route: string;
  icon: any;
  category: 'pdf' | 'image' | 'conversion';
}

export const toolsCatalog: Tool[] = [
  {
    id: 'merge-pdf',
    label: 'Merge PDF',
    description: 'Combine multiple PDF files into one',
    route: '/merge-pdf',
    icon: FileText,
    category: 'pdf',
  },
  {
    id: 'split-pdf',
    label: 'Split PDF',
    description: 'Extract pages from your PDF',
    route: '/split-pdf',
    icon: Scissors,
    category: 'pdf',
  },
  {
    id: 'compress-pdf',
    label: 'Compress PDF',
    description: 'Reduce PDF file size',
    route: '/compress-pdf',
    icon: Minimize2,
    category: 'pdf',
  },
  {
    id: 'resize-pdf',
    label: 'Resize PDF',
    description: 'Change PDF page dimensions',
    route: '/resize-pdf',
    icon: Maximize2,
    category: 'pdf',
  },
  {
    id: 'remove-pages',
    label: 'Remove Pages',
    description: 'Delete unwanted pages from PDF',
    route: '/remove-pages',
    icon: Trash2,
    category: 'pdf',
  },
  {
    id: 'add-watermark',
    label: 'Add Watermark',
    description: 'Add text watermark to PDF',
    route: '/add-watermark',
    icon: Droplet,
    category: 'pdf',
  },
  {
    id: 'pdf-to-word',
    label: 'PDF to Word',
    description: 'Convert PDF to Word document',
    route: '/pdf-to-word',
    icon: FileType,
    category: 'conversion',
  },
  {
    id: 'word-to-pdf',
    label: 'Word to PDF',
    description: 'Convert Word to PDF',
    route: '/word-to-pdf',
    icon: FileInput,
    category: 'conversion',
  },
  {
    id: 'image-to-pdf',
    label: 'Image to PDF',
    description: 'Convert images to PDF',
    route: '/image-to-pdf',
    icon: Image,
    category: 'conversion',
  },
  {
    id: 'resize-image',
    label: 'Resize Image',
    description: 'Resize and compress images',
    route: '/resize-image',
    icon: ImageIcon,
    category: 'image',
  },
];
