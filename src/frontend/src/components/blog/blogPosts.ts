export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  route: string;
  date: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-compress-pdf-online',
    title: 'How to Compress PDF Online',
    excerpt:
      'Learn the best methods to reduce PDF file size without losing quality. Perfect for email attachments and faster uploads.',
    route: '/blog/how-to-compress-pdf-online',
    date: '2026-02-15',
  },
  {
    slug: 'resize-image-under-50kb',
    title: 'Resize Image Under 50KB',
    excerpt:
      'Step-by-step guide to resize and compress images to meet file size requirements for forms, applications, and websites.',
    route: '/blog/resize-image-under-50kb',
    date: '2026-02-10',
  },
];
