import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface Comment {
  id: string;
  name: string;
  content: string;
  date: string;
  likes: number;
}

// Helper to generate dynamic sitemap.xml on demand
async function generateDynamicSitemapXml(): Promise<string> {
  const articlesDir = path.resolve(process.cwd(), 'src', 'articles');
  const files = fs.readdirSync(articlesDir);
  const posts: { slug: string; date: string; category: string }[] = [];

  for (const file of files) {
    if (file.endsWith('.ts') && file !== 'index.ts') {
      try {
        const fullPath = path.resolve(articlesDir, file);
        const mod = await import(fullPath);
        const post = mod.post || mod.default;
        if (post && post.slug) {
          posts.push({
            slug: post.slug,
            date: post.date || new Date().toISOString().split('T')[0],
            category: post.category || 'AI Productivity',
          });
        }
      } catch (e) {
        console.error(`Error loading article ${file} for sitemap:`, e);
      }
    }
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const categories = [
    'AI Productivity',
    'Career & Hiring',
    'Education',
    'Design & Focus'
  ];

  const today = new Date().toISOString().split('T')[0];

  const categoryUrlsXml = categories.map(cat => `  <url>
    <loc>https://blog.zenire.in/category/${encodeURIComponent(cat)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n');

  const postUrlsXml = posts.map(post => `  <url>
    <loc>https://blog.zenire.in/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
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

  <!-- Articles -->
${postUrlsXml}
</urlset>`;
}

// In-memory storage for comments keyed by slug
const commentsDB: Record<string, Comment[]> = {};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Dynamic Sitemap XML Endpoint
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const xml = await generateDynamicSitemapXml();
      res.header("Content-Type", "application/xml");
      res.status(200).send(xml);
    } catch (err) {
      console.error("Error generating sitemap:", err);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Dynamic Robots.txt Endpoint
  app.get("/robots.txt", (req, res) => {
    res.header("Content-Type", "text/plain");
    res.status(200).send(`User-agent: *
Allow: /
Disallow: /api/

# Sitemap link for Google Search Console (GSC)
Sitemap: https://blog.zenire.in/sitemap.xml
`);
  });

  // API endpoints for comments
  app.get("/api/comments/:slug", (req, res) => {
    const { slug } = req.params;
    const comments = commentsDB[slug] || [];
    res.json(comments);
  });

  app.post("/api/comments/:slug", (req, res) => {
    const { slug } = req.params;
    const { name, content } = req.body;

    if (!name || !content) {
      return res.status(400).json({ error: "Name and content are required" });
    }

    const newComment: Comment = {
      id: "comment_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
      name,
      content,
      date: new Date().toISOString().split("T")[0],
      likes: 0
    };

    if (!commentsDB[slug]) {
      commentsDB[slug] = [];
    }

    commentsDB[slug].push(newComment);
    res.json(commentsDB[slug]);
  });

  app.post("/api/comments/:slug/:commentId/like", (req, res) => {
    const { slug, commentId } = req.params;
    const comments = commentsDB[slug] || [];
    const comment = comments.find(c => c.id === commentId);

    if (comment) {
      comment.likes = (comment.likes || 0) + 1;
      res.json({ success: true, likes: comment.likes });
    } else {
      res.status(404).json({ error: "Comment not found" });
    }
  });

  app.post("/api/comments/:slug/:commentId/unlike", (req, res) => {
    const { slug, commentId } = req.params;
    const comments = commentsDB[slug] || [];
    const comment = comments.find(c => c.id === commentId);

    if (comment) {
      comment.likes = Math.max(0, (comment.likes || 0) - 1);
      res.json({ success: true, likes: comment.likes });
    } else {
      res.status(404).json({ error: "Comment not found" });
    }
  });

  app.delete("/api/comments/:slug/:commentId", (req, res) => {
    const { slug, commentId } = req.params;
    if (commentsDB[slug]) {
      commentsDB[slug] = commentsDB[slug].filter(c => c.id !== commentId);
    }
    res.json({ success: true, comments: commentsDB[slug] || [] });
  });

  // Serve static files from public directory first
  app.use(express.static(path.resolve(process.cwd(), 'public')));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Serve index.html transformed by Vite for all non-API GET requests to support direct loading / SPA routing in dev
    app.get('*', async (req, res, next) => {
      // Don't intercept API routes or direct static asset requests (images, fonts, scripts)
      if (req.originalUrl.startsWith('/api/') || /\.(png|jpe?g|gif|svg|ico|webp|css|js|map|json|woff2?|ttf|eot)$/i.test(req.path)) {
        return next();
      }
      try {
        const fs = await import("fs");
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
