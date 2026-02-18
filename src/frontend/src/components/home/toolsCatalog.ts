import {
  FileText,
  Scissors,
  Minimize2,
  Droplet,
  FileX,
  FileImage,
  FileType,
  Image,
  Maximize2,
  Combine,
} from 'lucide-react';

export interface Tool {
  id: string;
  label: string;
  description: string;
  route: string;
  icon: any;
  category: 'pdf' | 'image' | 'conversion';
}

export const TOOLS_CATALOG: Tool[] = [
  {
    id: 'merge-pdf',
    label: 'Merge PDF',
    description: 'Combine multiple PDF files into one document',
    route: '/merge-pdf',
    icon: Combine,
    category: 'pdf',
  },
  {
    id: 'split-pdf',
    label: 'Split PDF',
    description: 'Split a PDF into separate pages',
    route: '/split-pdf',
    icon: Scissors,
    category: 'pdf',
  },
  {
    id: 'compress-pdf',
    label: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining quality',
    route: '/compress-pdf',
    icon: Minimize2,
    category: 'pdf',
  },
  {
    id: 'resize-pdf',
    label: 'Resize PDF',
    description: 'Change PDF page size to A4, Letter, or other formats',
    route: '/resize-pdf',
    icon: Maximize2,
    category: 'pdf',
  },
  {
    id: 'remove-pages',
    label: 'Remove Pages',
    description: 'Delete specific pages from your PDF',
    route: '/remove-pages',
    icon: FileX,
    category: 'pdf',
  },
  {
    id: 'add-watermark',
    label: 'Add Watermark',
    description: 'Add text watermark to your PDF pages',
    route: '/add-watermark',
    icon: Droplet,
    category: 'pdf',
  },
  {
    id: 'pdf-to-word',
    label: 'PDF to Word',
    description: 'Convert PDF documents to editable Word files',
    route: '/pdf-to-word',
    icon: FileType,
    category: 'conversion',
  },
  {
    id: 'word-to-pdf',
    label: 'Word to PDF',
    description: 'Convert Word documents (.doc, .docx) to PDF format',
    route: '/word-to-pdf',
    icon: FileText,
    category: 'conversion',
  },
  {
    id: 'image-to-pdf',
    label: 'Image to PDF',
    description: 'Convert images (JPG, PNG) to PDF documents',
    route: '/image-to-pdf',
    icon: FileImage,
    category: 'conversion',
  },
  {
    id: 'resize-image',
    label: 'Resize Image',
    description: 'Resize and compress images to specific dimensions or file size',
    route: '/resize-image',
    icon: Image,
    category: 'image',
  },
];
