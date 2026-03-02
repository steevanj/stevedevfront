import { motion } from "framer-motion";
import { ExternalLink, Github, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchProjects, ProjectResponse } from "@/api/projects"; // normalized API

const Projects = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects(); // always normalized
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const published = projects.filter((p) => p.status === "production");

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-2 font-heading text-3xl font-bold text-foreground md:text-4xl">
          Projects
        </h1>
        <p className="mb-12 text-muted-foreground">
          A collection of backend projects I've built
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {published.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-card-hover"
          >
            {project.featured && (
              <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-primary">
                <Star className="h-3.5 w-3.5 fill-primary" />
                Featured
              </div>
            )}

            <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
              {project.title}
            </h3>

            <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>

            {/* Tech stack rendering */}
            <div className="mb-4 flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <span
                  key={tech.id}
                  className="rounded-md bg-accent px-2 py-0.5 font-mono text-xs text-accent-foreground"
                >
                  {tech.name}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <Github className="mr-1.5 h-3.5 w-3.5" /> Code
                  </Button>
                </a>
              )}
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Live
                  </Button>
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
