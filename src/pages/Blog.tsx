import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { fetchBlogs, BlogResponse } from "@/api/blogs"; // updated API layer

const Blog = () => {
  const [posts, setPosts] = useState<BlogResponse[]>([]);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await fetchBlogs(); // normalized response
        setPosts(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    loadBlogs();
  }, []);

  const published = posts
    .filter((p) => p.is_published)
    .sort(
      (a, b) =>
        new Date(b.published_at || "").getTime() -
        new Date(a.published_at || "").getTime()
    );

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-2 font-heading text-3xl font-bold text-foreground md:text-4xl">
          Blog
        </h1>
        <p className="mb-12 text-muted-foreground">
          Thoughts on backend development, architecture, and engineering
        </p>
      </motion.div>

      <div className="space-y-6">
        {published.map((post, i) => {
          let formattedDate = "";
          if (post.published_at) {
            const dateObj = new Date(post.published_at);
            if (!isNaN(dateObj.getTime())) {
              formattedDate = format(dateObj, "MMM d, yyyy");
            }
          }

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="group block rounded-xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <time>{formattedDate || "Unpublished"}</time>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {post.read_time} min read
                      </span>
                    </div>

                    <h2 className="mb-2 font-heading text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                      {post.title}
                    </h2>

                    <p className="mb-3 text-sm text-muted-foreground">
                      {post.excerpt || post.content.slice(0, 120) + "..."}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-md bg-accent px-2 py-0.5 font-mono text-xs text-accent-foreground"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <ArrowRight className="hidden h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary md:block" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Blog;
