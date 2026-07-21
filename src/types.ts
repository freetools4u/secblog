export interface Author {
  name: string;
  avatar: string;
  bio: string;
  role: string;
  twitter?: string;
  github?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown or rich text
  category: 'AI Productivity' | 'Career & Hiring' | 'Education' | 'Design & Focus';
  tags: string[];
  readTime: string;
  date: string;
  author: Author;
  coverImage: string;
  keywords: string[];
  metaDescription: string;
  schemaType: 'BlogPosting' | 'TechArticle' | 'NewsArticle';
  featured?: boolean;
  readCount?: number;
}

export interface SEOChecklistResult {
  score: number;
  checks: {
    id: string;
    label: string;
    status: 'pass' | 'warn' | 'fail';
    message: string;
  }[];
}
