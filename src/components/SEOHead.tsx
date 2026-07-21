import { useEffect } from 'react';
import { BlogPost } from '../types';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  post?: BlogPost;
}

export default function SEOHead({ title, description, keywords, canonicalUrl = 'https://blog.zenire.in', post }: SEOHeadProps) {
  useEffect(() => {
    // Dynamically update document title
    const fullTitle = `${title} | Zenire Blog`;
    document.title = fullTitle;

    // Dynamically update meta description
    let metaDescriptionElement = document.querySelector('meta[name="description"]');
    if (!metaDescriptionElement) {
      metaDescriptionElement = document.createElement('meta');
      metaDescriptionElement.setAttribute('name', 'description');
      document.head.appendChild(metaDescriptionElement);
    }
    metaDescriptionElement.setAttribute('content', description);

    // Dynamically update meta keywords
    let metaKeywordsElement = document.querySelector('meta[name="keywords"]');
    if (!metaKeywordsElement) {
      metaKeywordsElement = document.createElement('meta');
      metaKeywordsElement.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywordsElement);
    }
    metaKeywordsElement.setAttribute('content', keywords.join(', '));

    // Update canonical link
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', canonicalUrl);

    // Dynamic JSON-LD Schema Markup injection
    const existingSchema = document.getElementById('zenire-jsonld');
    if (existingSchema) {
      existingSchema.remove();
    }

    const schemaScript = document.createElement('script');
    schemaScript.id = 'zenire-jsonld';
    schemaScript.type = 'application/ld+json';

    let schemaData: any = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Zenire Blog",
      "url": "https://blog.zenire.in",
      "description": "A high-performance blog platform covering AI Productivity, Careers, and Education.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://blog.zenire.in/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };

    if (post) {
      schemaData = {
        "@context": "https://schema.org",
        "@type": post.schemaType || "BlogPosting",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${canonicalUrl}/post/${post.slug}`
        },
        "headline": post.title,
        "description": post.metaDescription || post.excerpt,
        "image": post.coverImage,
        "author": {
          "@type": "Person",
          "name": post.author.name,
          "jobTitle": post.author.role
        },
        "publisher": {
          "@type": "Organization",
          "name": "Zenire",
          "logo": {
            "@type": "ImageObject",
            "url": "https://blog.zenire.in/favicon.ico"
          }
        },
        "datePublished": post.date,
        "dateModified": post.date,
        "keywords": post.keywords.join(', ')
      };
    }

    schemaScript.text = JSON.stringify(schemaData, null, 2);
    document.head.appendChild(schemaScript);

    return () => {
      // Clean up dynamic schema elements on unmount if necessary
    };
  }, [title, description, keywords, canonicalUrl, post]);

  return null; // Side-effect only component
}
