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
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://blog.zenire.in/#website",
          "name": "Zenire Blog",
          "url": "https://blog.zenire.in",
          "description": "High-density technical publication covering AI Productivity, Career & Hiring, Education, and Design & Focus.",
          "publisher": {
            "@type": "Organization",
            "name": "Zenire",
            "logo": {
              "@type": "ImageObject",
              "url": "https://blog.zenire.in/favicon.ico"
            }
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://blog.zenire.in/?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "SiteNavigationElement",
          "@id": "https://blog.zenire.in/#navigation",
          "name": "Primary Categories",
          "hasPart": [
            {
              "@type": "WebPage",
              "name": "AI Productivity",
              "url": "https://blog.zenire.in/category/AI%20Productivity",
              "description": "Prompt engineering, automated workflows, and agentic productivity tools."
            },
            {
              "@type": "WebPage",
              "name": "Career & Hiring",
              "url": "https://blog.zenire.in/category/Career%20%26%20Hiring",
              "description": "CV construction, technical recruitment trends, and professional advancement."
            },
            {
              "@type": "WebPage",
              "name": "Education",
              "url": "https://blog.zenire.in/category/Education",
              "description": "Cognitive learning frameworks, personalized knowledge graphs, and pedagogy."
            },
            {
              "@type": "WebPage",
              "name": "Design & Focus",
              "url": "https://blog.zenire.in/category/Design%20%26%20Focus",
              "description": "Digital minimalism, ergonomics, and peak mental performance environments."
            }
          ]
        },
        {
          "@type": "ItemList",
          "@id": "https://blog.zenire.in/#sitelinks",
          "name": "Main Site Categories",
          "itemListElement": [
            {
              "@type": "SiteNavigationElement",
              "position": 1,
              "name": "AI Productivity",
              "url": "https://blog.zenire.in/category/AI%20Productivity"
            },
            {
              "@type": "SiteNavigationElement",
              "position": 2,
              "name": "Career & Hiring",
              "url": "https://blog.zenire.in/category/Career%20%26%20Hiring"
            },
            {
              "@type": "SiteNavigationElement",
              "position": 3,
              "name": "Education",
              "url": "https://blog.zenire.in/category/Education"
            },
            {
              "@type": "SiteNavigationElement",
              "position": 4,
              "name": "Site Categories: Design & Focus",
              "url": "https://blog.zenire.in/category/Design%20%26%20Focus"
            }
          ]
        }
      ]
    };

    if (post) {
      schemaData = {
        "@context": "https://schema.org",
        "@type": post.schemaType || "BlogPosting",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${canonicalUrl}/${post.slug}`
        },
        "headline": post.title,
        "description": post.metaDescription || post.excerpt,
        "image": post.coverImage,
        "articleSection": post.category,
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
