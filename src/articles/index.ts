/// <reference types="vite/client" />
import { BlogPost } from '../types';

// Vite's eager glob import dynamically loads all article files in /src/articles/
// Any new .ts file placed in this folder is automatically discovered without any hardcoding!
const globModules = import.meta.glob<Record<string, any>>('./*.ts', { eager: true });

const articlesList: BlogPost[] = [];

for (const filePath in globModules) {
  if (filePath.endsWith('index.ts')) continue;
  const mod = globModules[filePath];
  const article = mod?.post || mod?.default;
  if (article && article.slug) {
    articlesList.push(article);
  }
}

// Sort articles by publication date descending (newest first)
articlesList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const ARTICLES: BlogPost[] = articlesList;

export const getArticleBySlug = (slug: string): BlogPost | undefined => {
  return ARTICLES.find(article => article.slug === slug);
};

export const getArticlesByCategory = (category: string): BlogPost[] => {
  if (category === 'all') return ARTICLES;
  return ARTICLES.filter(article => article.category.toLowerCase() === category.toLowerCase());
};

export const getFeaturedArticles = (): BlogPost[] => {
  return ARTICLES.filter(article => article.featured);
};

export const getPopularArticles = (limit: number = 5): BlogPost[] => {
  return [...ARTICLES].sort((a, b) => b.readCount - a.readCount).slice(0, limit);
};

export default ARTICLES;
