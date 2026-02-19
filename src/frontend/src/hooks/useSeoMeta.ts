import { useEffect } from 'react';

interface SeoMetaOptions {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export function useSeoMeta({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
}: SeoMetaOptions) {
  useEffect(() => {
    // Set page title
    document.title = `${title} | QuickPDF India`;

    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Set Open Graph tags
    const ogTags = {
      'og:title': ogTitle || title,
      'og:description': ogDescription || description,
      'og:type': 'website',
      'og:image': ogImage || '/assets/generated/quickpdf-india-logo.dim_512x256.png',
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    });

    // Set Twitter Card tags
    const twitterTags = {
      'twitter:card': twitterCard,
      'twitter:title': twitterTitle || ogTitle || title,
      'twitter:description': twitterDescription || ogDescription || description,
      'twitter:image': twitterImage || ogImage || '/assets/generated/quickpdf-india-logo.dim_512x256.png',
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      let metaTag = document.querySelector(`meta[name="${name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    });
  }, [title, description, ogTitle, ogDescription, ogImage, twitterCard, twitterTitle, twitterDescription, twitterImage]);
}
