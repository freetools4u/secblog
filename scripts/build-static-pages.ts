import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BlogPost } from '../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const indexPath = path.resolve(distDir, 'index.html');

async function loadArticlesForBuild(): Promise<BlogPost[]> {
  const articlesDir = path.resolve(rootDir, 'src', 'articles');
  const files = fs.readdirSync(articlesDir);
  const posts: BlogPost[] = [];

  for (const file of files) {
    if (file.endsWith('.ts') && file !== 'index.ts') {
      const fullPath = path.resolve(articlesDir, file);
      const mod = await import(fullPath);
      const post = mod.post || mod.default;
      if (post && post.slug) {
        posts.push(post);
      }
    }
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

async function generateStaticPages() {
  if (!fs.existsSync(indexPath)) {
    console.error('Error: dist/index.html does not exist. Run "vite build" first.');
    process.exit(1);
  }

  const articles = await loadArticlesForBuild();
  console.log(`Loaded ${articles.length} articles dynamically for static build.`);

  const rawHtml = fs.readFileSync(indexPath, 'utf-8');

  // Inject dynamic base tag calculation into head so assets load properly from any subfolder or 404 route on GitHub Pages
  const baseScript = `<script>
    (function() {
      var path = window.location.pathname;
      var segments = path.split('/').filter(Boolean);
      var baseHref = '/';
      if (window.location.hostname.endsWith('.github.io') && segments.length > 0) {
        baseHref = '/' + segments[0] + '/';
      }
      document.write('<base href="' + baseHref + '" />');
    })();
  </script>`;

  const baseHtmlTemplate = rawHtml.includes('<head>')
    ? rawHtml.replace('<head>', `<head>\n    ${baseScript}`)
    : `${baseScript}\n${rawHtml}`;

  console.log('Generating static HTML pages for each article and category...');

  // 1. Update primary dist/index.html with the resilient baseScript
  fs.writeFileSync(indexPath, baseHtmlTemplate, 'utf-8');

  // 2. Create dist/category/index.html & dist/category.html for /category route
  const categoryOverviewDir = path.resolve(distDir, 'category');
  fs.mkdirSync(categoryOverviewDir, { recursive: true });

  let categoryOverviewHtml = baseHtmlTemplate.replace(
    /<title>.*?<\/title>/gi,
    `<title>Categories - Zenire Blog</title>`
  );
  fs.writeFileSync(path.resolve(categoryOverviewDir, 'index.html'), categoryOverviewHtml, 'utf-8');
  fs.writeFileSync(path.resolve(distDir, 'category.html'), categoryOverviewHtml, 'utf-8');
  console.log(' ✓ Created static pages for /category/ & /category.html');

  // 3. Generate standalone page for each article under dist/<slug>/index.html & dist/<slug>.html
  articles.forEach((post) => {
    const articleDir = path.resolve(distDir, post.slug);
    fs.mkdirSync(articleDir, { recursive: true });

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

    // Write dist/<slug>/index.html & dist/<slug>.html
    fs.writeFileSync(path.resolve(articleDir, 'index.html'), articleHtml, 'utf-8');
    fs.writeFileSync(path.resolve(distDir, `${post.slug}.html`), articleHtml, 'utf-8');

    console.log(` ✓ Created standalone static page: dist/${post.slug}/index.html & dist/${post.slug}.html`);
  });

  // 4. Dynamically derive all categories from loaded articles
  const categories = Array.from(new Set(articles.map(a => a.category))).filter(Boolean);
  categories.forEach((cat) => {
    const encodedCat = encodeURIComponent(cat);

    // Directory for encoded category (e.g. category/AI%20Productivity/index.html)
    const categoryDir = path.resolve(distDir, 'category', encodedCat);
    fs.mkdirSync(categoryDir, { recursive: true });

    let catHtml = baseHtmlTemplate.replace(
      /<title>.*?<\/title>/gi,
      `<title>${escapeXml(cat)} Articles - Zenire Blog</title>`
    );

    fs.writeFileSync(path.resolve(categoryDir, 'index.html'), catHtml, 'utf-8');
    fs.writeFileSync(path.resolve(distDir, 'category', `${encodedCat}.html`), catHtml, 'utf-8');

    // Also create unencoded category directory if cat has spaces (e.g. category/AI Productivity/index.html)
    if (cat !== encodedCat) {
      const unencodedDir = path.resolve(distDir, 'category', cat);
      fs.mkdirSync(unencodedDir, { recursive: true });
      fs.writeFileSync(path.resolve(unencodedDir, 'index.html'), catHtml, 'utf-8');
    }

    console.log(` ✓ Created static category page for ${cat}`);
  });

  // 5. Create 404.html fallback for GitHub Pages client-side routing
  fs.writeFileSync(path.resolve(distDir, '404.html'), baseHtmlTemplate, 'utf-8');
  console.log(' ✓ Created dist/404.html for GitHub Pages fallback');

  // 6. Create .nojekyll file to prevent GitHub Pages from bypassing underscores
  fs.writeFileSync(path.resolve(distDir, '.nojekyll'), '', 'utf-8');
  console.log(' ✓ Created dist/.nojekyll');

  // 7. Dynamically generate sitemap.xml for dist and public folders
  const today = new Date().toISOString().split('T')[0];
  const allCategories = ['AI Productivity', 'Career & Hiring', 'Education', 'Design & Focus'];
  
  const categoryUrlsXml = allCategories.map(cat => `  <url>
    <loc>https://blog.zenire.in/category/${encodeURIComponent(cat)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n');

  const postUrlsXml = articles.map(post => `  <url>
    <loc>https://blog.zenire.in/${post.slug}</loc>
    <lastmod>${post.date || today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n');

  const dynamicSitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Home Page -->
  <url>
    <loc>https://blog.zenire.in/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Categories -->
${categoryUrlsXml}

  <!-- Active Articles -->
${postUrlsXml}
</urlset>`;

  fs.writeFileSync(path.resolve(distDir, 'sitemap.xml'), dynamicSitemapContent, 'utf-8');
  const publicDir = path.resolve(rootDir, 'public');
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(path.resolve(publicDir, 'sitemap.xml'), dynamicSitemapContent, 'utf-8');
  }
  console.log(' ✓ Dynamically generated sitemap.xml in dist/ and public/');

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
