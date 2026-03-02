// src/pages/BlogPost.tsx
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { useEffect, useState } from "react";
import apiClient from "@/api/apiClient"; // axios instance

interface TagObj { id?: string; name?: string; }
type Tag = string | TagObj;

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  is_published?: boolean;
  read_time?: number;
  tags?: Tag[] | null;
  published_at?: string | null;
}

const tryEndpoints = (slug?: string) => {
  if (!slug) return [];
  return [
    `/api/blogs/posts/${encodeURIComponent(slug)}/`,
    `/api/blogs/posts/${encodeURIComponent(slug)}`,
    `/api/blogs/posts/?slug=${encodeURIComponent(slug)}`,
  ];
};

const normalizeTags = (rawTags: Tag[] | undefined | null): TagObj[] => {
  if (!rawTags) return [];
  return rawTags.map((t, i) => {
    if (!t) return { id: `tag-${i}`, name: String(t) };
    if (typeof t === "string") return { id: t, name: t };
    // assume object with id/name
    return { id: (t.id as string) || `tag-${i}`, name: (t.name as string) || String(t.id) || `tag-${i}` };
  });
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFoundRedirect, setNotFoundRedirect] = useState(false);

  useEffect(() => {
    if (!slug) {
      setError("No post identifier provided.");
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      setPost(null);

      const endpoints = tryEndpoints(slug);
      // eslint-disable-next-line no-console
      console.log("apiClient baseURL:", (apiClient as any).defaults?.baseURL || "no baseURL set");

      for (const path of endpoints) {
        try {
          // eslint-disable-next-line no-console
          console.log("Trying blog endpoint:", path);
          const res = await apiClient.get(path);
          const data = res.data;
          let candidate: any = null;

          if (Array.isArray(data)) {
            candidate = data.find((p) => String(p.slug) === String(slug));
          } else if (data && typeof data === "object") {
            if (Array.isArray(data.results)) {
              candidate = data.results.find((p) => String(p.slug) === String(slug));
            } else if (data.slug || data.id) {
              candidate = data;
            }
          }

          if (!candidate) {
            // eslint-disable-next-line no-console
            console.log("No matching post in response for", path);
            continue;
          }

          // eslint-disable-next-line no-console
          console.log("Fetched post candidate:", candidate);

          if (candidate.is_published === false) {
            setError("This post is not published yet.");
            setLoading(false);
            return;
          }

          // Normalize tags before storing
          const normalized = {
            ...candidate,
            tags: normalizeTags(candidate.tags),
          };

          setPost(normalized);
          setLoading(false);
          return;
        } catch (err: any) {
          // eslint-disable-next-line no-console
          console.warn("Request failed for endpoint", path, err?.response?.status || err.message);
          if (err?.response?.status && err.response.status !== 404) {
            setError(`Server returned ${err.response.status}. Try again later.`);
            setLoading(false);
            return;
          }
        }
      }

      setError("Post not found (404).");
      setLoading(false);
      setTimeout(() => setNotFoundRedirect(true), 1200);
    };

    fetchPost();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (notFoundRedirect) return <Navigate to="/blog" replace />;
  if (error) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
        <div className="mb-6">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-2 text-lg font-semibold text-foreground">Unable to load post</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <div className="mt-4">
            <Link to="/blog" className="text-sm text-primary underline">Return to blog index</Link>
          </div>
        </div>
      </div>
    );
  }
  if (!post) return <Navigate to="/blog" replace />;

  // Safe date handling
  let formattedDate = "Unknown date";
  if (post.published_at) {
    try {
      const parsed = parseISO(post.published_at);
      if (isValid(parsed)) {
        formattedDate = format(parsed, "MMMM d, yyyy");
      } else {
        const fallback = new Date(post.published_at);
        if (isValid(fallback)) formattedDate = format(fallback, "MMMM d, yyyy");
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("Failed to parse published_at:", post.published_at, e);
    }
  }

  // Ensure tags are normalized objects with id/name
  const tags = normalizeTags(post.tags as Tag[] | undefined);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <div className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
          <time>{formattedDate}</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {post.read_time ?? "—"} min read
          </span>
        </div>

        <h1 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">{post.title}</h1>

        <div className="mb-8 flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span
              key={tag.id || tag.name || `tag-${idx}`}
              className="rounded-md bg-accent px-2.5 py-1 font-mono text-xs text-accent-foreground"
            >
              {tag.name}
            </span>
          ))}
        </div>

        <div className="prose prose-lg max-w-none">
          {String(post.content || "").split("\n\n").map((block, i) => {
            if (block.startsWith("## ")) {
              return (
                <h2 key={`h2-${i}`} className="mb-4 mt-8 font-heading text-xl font-semibold text-foreground">
                  {block.replace("## ", "")}
                </h2>
              );
            }
            if (block.startsWith("```")) {
              const lines = block.split("\n");
              const code = lines.slice(1, -1).join("\n");
              return (
                <pre key={`code-${i}`} className="my-4 overflow-x-auto rounded-lg border border-border bg-secondary p-4">
                  <code className="font-mono text-sm text-foreground">{code}</code>
                </pre>
              );
            }
            return (
              <p key={`p-${i}`} className="mb-4 leading-relaxed text-muted-foreground">{block}</p>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default BlogPost;
