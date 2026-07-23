import { BlogPost } from '../types';

import post1 from './ai-automation-guide-2026';
import post2 from './modern-zen-office-blueprint-2026';
import post3 from './building-ai-proof-resume-2026';
import post4 from './personalized-knowledge-graphs-education';
import post5 from './perfect-context-window-llm-2026';
import post6 from './psychology-digital-minimalism-2026';
import post7 from './ai-productivity-blueprint-2026';

export const ARTICLES: BlogPost[] = [
  post1,
  post2,
  post3,
  post4,
  post5,
  post6,
  post7
];

export const getArticleBySlug = (slug: string): BlogPost | undefined => {
  return ARTICLES.find(article => article.slug === slug);
};

export const getArticlesByCategory = (category: string): BlogPost[] => {
  if (category === 'all') return ARTICLES;
  return ARTICLES.filter(article => article.category === category);
};

export const getFeaturedArticles = (): BlogPost[] => {
  return ARTICLES.filter(article => article.featured);
};

export const getPopularArticles = (limit: number = 5): BlogPost[] => {
  return [...ARTICLES].sort((a, b) => b.readCount - a.readCount).slice(0, limit);
};

export default ARTICLES;
