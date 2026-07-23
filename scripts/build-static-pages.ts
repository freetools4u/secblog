import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ARTICLES } from '../src/articles/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const indexPath = path.resolve(distDir, 'index.html');

function generateStaticPages() {
  if (!fs.existsSync(indexPath)) {
    console.error('Error: dist/index.html does not exist. Run "vite build" first.');
    process.exit(1);
  }

  const baseHtmlTemplate = fs.readFileSync(indexPath, 'utf-8');

  console.log('Generating static HTML pages for each article and category...');

  // 1. Generate standalone page for each article under dist/<slug>/index.html & dist/<slug>.html
  ARTICLES.forEach((post) => {
    const articleDir = path.resolve(distDir, post.slug);
    fs.mkdirSync(articleDir, { recursive: true });

    // Customize meta tags for SEO and Social Cards
    let articleHtml = baseHtmlTemplate;

    // Replace Title
    articleHtml = articleHtml.replace(
      /<title>.*?<\/title>/gi,
      `<title>${escapeXml(post.title)} - Zenire Blog</title>`
    );

    // Prepare metadata tags
    const metaTags = `
    <meta name="description" content="${escapeXml(post.metaDescription)}" />
    <meta name="keywords" content="${escapeXml(post.keywords.join(', '))}" />
    <meta name="author" content="${escapeXml(post.author.name)}" />
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeXml(post.title)}" />
    <meta property="og:description" content="${escapeXml(post.metaDescription)}" />
    <meta property="og:image" content="${escapeXml(post.coverImage)}" />
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeXml(post.title)}" />
    <meta name="twitter:description" content="${escapeXml(post.metaDescription)}" />
    <meta name="twitter:image" content="${escapeXml(post.coverImage)}" />
    `;

    articleHtml = articleHtml.replace('</head>', `${metaTags}\n  </head>`);

    // Fix relative asset paths for subfolders (e.g. ./assets/ -> ../assets/)
    // Replaces ./assets or "assets/ with ../assets/
    const subfolderArticleHtml = articleHtml
      .replace(/src="\.\/assets\//g, 'src="../assets/')
      .replace(/href="\.\/assets\//g, 'href="../assets/')
      .replace(/src="assets\//g, 'src="../assets/')
      .replace(/href="assets\//g, 'href="../assets/');

    // Write dist/<slug>/index.html
    fs.writeFileSync(path.resolve(articleDir, 'index.html'), subfolderArticleHtml, 'utf-8');

    // Also write dist/<slug>.html for direct extensionless access
    const directFileArticleHtml = articleHtml
      .replace(/src="\.\/assets\//g, 'src="./assets/')
      .replace(/href="\.\/assets\//g, 'href="./assets/');
    fs.writeFileSync(path.resolve(distDir, `${post.slug}.html`), directFileArticleHtml, 'utf-8');

    console.log(` ✓ Created standalone static page: dist/${post.slug}/index.html & dist/${post.slug}.html`);
  });

  // 2. Generate static pages for Categories
  const categories = ['AI Productivity', 'Career & Hiring', 'Education', 'Design & Focus'];
  categories.forEach((cat) => {
    const encodedCat = encodeURIComponent(cat);
    const categoryDir = path.resolve(distDir, 'category', encodedCat);
    fs.mkdirSync(categoryDir, { recursive: true });

    let catHtml = baseHtmlTemplate;
    catHtml = catHtml.replace(
      /<title>.*?<\/title>/gi,
      `<title>${escapeXml(cat)} Articles - Zenire Blog</title>`
    );

    const subfolderCatHtml = catHtml
      .replace(/src="\.\/assets\//g, 'src="../../assets/')
      .replace(/href="\.\/assets\//g, 'href="../../assets/')
      .replace(/src="assets\//g, 'src="../../assets/')
      .replace(/href="assets\//g, 'href="../../assets/');

    fs.writeFileSync(path.resolve(categoryDir, 'index.html'), subfolderCatHtml, 'utf-8');
    console.log(` ✓ Created static category page: dist/category/${encodedCat}/index.html`);
  });

  // 3. Create 404.html fallback for GitHub Pages client-side routing
  fs.copyFileSync(indexPath, path.resolve(distDir, '404.html'));
  console.log(' ✓ Created dist/404.html for GitHub Pages fallback');

  // 4. Create .nojekyll file to prevent GitHub Pages from bypassing underscores
  fs.writeFileSync(path.resolve(distDir, '.nojekyll'), '', 'utf-8');
  console.log(' ✓ Created dist/.nojekyll');

  console.log('Static pages generation completed successfully!');
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

generateStaticPages();
