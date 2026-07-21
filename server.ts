import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface Comment {
  id: string;
  name: string;
  content: string;
  date: string;
  likes: number;
}

// In-memory storage for comments keyed by slug
const commentsDB: Record<string, Comment[]> = {
  "personalized-knowledge-graphs-education": [
    {
      id: 'seed-1',
      name: 'Sarah Jenkins',
      content: `This is incredibly insightful. I implemented the automated triage process on our support email pipeline using your exact routing blueprint and we saved roughly 10 hours in the first week. The sitemap generation advice is also critical for indexing. Thank you!`,
      date: '2026-07-16',
      likes: 5
    }
  ]
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Serve index.html transformed by Vite for all non-API GET requests to support direct loading / SPA routing in dev
    app.get('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api/')) {
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
