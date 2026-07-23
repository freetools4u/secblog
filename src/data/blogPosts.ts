import { ARTICLES, getArticleBySlug, getArticlesByCategory, getFeaturedArticles, getPopularArticles } from '../articles';
import { BlogPost } from '../types';

export const BLOG_POSTS: BlogPost[] = ARTICLES;

export { getArticleBySlug, getArticlesByCategory, getFeaturedArticles, getPopularArticles };
export default BLOG_POSTS;
