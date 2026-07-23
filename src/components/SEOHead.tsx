import { useEffect } from 'react';
import { BlogPost } from '../types';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  post?: BlogPost;
}

export default function SEOHead({ title, description, keywords, canonicalUrl, post }: SEOHeadProps) {
  useEffect(() => {
    // Standardize Title formatting without redundancy
    const fullTitle = title.includes('Zenire Blog') ? title : `${title} | Zenire Blog`;
    document.title = fullTitle;

    // Derived current URL
    const currentCanonical = canonicalUrl || (post 
      ? `https://blog.zenire.in/${post.slug}` 
      : (typeof window !== 'undefined' ? window.location.href : 'https://blog.zenire.in'));

    // Helper to set or update meta tags
    const setMetaTag = (selector: string, attribute: string, attributeValue: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Primary Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords.join(', '));

    // Update canonical link
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', currentCanonical);

    // OpenGraph Tags
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Zenire Blog');
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', post ? 'article' : 'website');
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', currentCanonical);
    if (post?.coverImage) {
      setMetaTag('meta[property="og:image"]', 'property', 'og:image', post.coverImage);
    }

    // Twitter Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    if (post?.coverImage) {
      setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', post.coverImage);
    }

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
              "url": "https://zenire.in/favicon.ico"
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
              "url": "https://blog.zenire.in/category/ai-productivity",
              "description": "Prompt engineering, automated workflows, and agentic productivity tools."
            },
            {
              "@type": "WebPage",
              "name": "Career & Hiring",
              "url": "https://blog.zenire.in/category/career-hiring",
              "description": "CV construction, technical recruitment trends, and professional advancement."
            },
            {
              "@type": "WebPage",
              "name": "Education",
              "url": "https://blog.zenire.in/category/education",
              "description": "Cognitive learning frameworks, personalized knowledge graphs, and pedagogy."
            },
            {
              "@type": "WebPage",
              "name": "Design & Focus",
              "url": "https://blog.zenire.in/category/design-focus",
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
              "url": "https://blog.zenire.in/category/ai-productivity"
            },
            {
              "@type": "SiteNavigationElement",
              "position": 2,
              "name": "Career & Hiring",
              "url": "https://blog.zenire.in/category/career-hiring"
            },
            {
              "@type": "SiteNavigationElement",
              "position": 3,
              "name": "Education",
              "url": "https://blog.zenire.in/category/education"
            },
            {
              "@type": "SiteNavigationElement",
              "position": 4,
              "name": "Site Categories: Design & Focus",
              "url": "https://blog.zenire.in/category/design-focus"
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
          "@id": currentCanonical
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
            "url": "https:/zenire.in/favicon.ico"
          }
        },
        "datePublished": post.date,
        "dateModified": post.date,
        "keywords": post.keywords.join(', ')
      };
    }

    schemaScript.text = JSON.stringify(schemaData, null, 2);
    document.head.appendChild(schemaScript);
  }, [title, description, keywords, canonicalUrl, post]);

  return null;
}
