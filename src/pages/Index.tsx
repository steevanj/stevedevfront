import { motion } from "framer-motion";
import { ArrowRight, Download, Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import profileImage from "@/assets/profile-hero.png";
import { useEffect, useState } from "react";
import apiClient from "@/api/apiClient";
import SkillsCarousel from "@/components/ui/SkillsCarousel";

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const DEFAULT_SOCIALS = [
  { platform: "github", icon: "github", url: "https://github.com/steevanj" },
  { platform: "linkedin", icon: "linkedin", url: "https://www.linkedin.com/in/steechinna/" },
  { platform: "x", icon: "x", url: "https://x.com/SteevanDev" },
];

const Index = () => {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchData = async () => {
      try {

        const [profileRes, projectsRes] = await Promise.all([
          apiClient.get("/api/profile/profiles/"),
          apiClient.get("/api/profile/projects/")
        ]);

        const profileData = Array.isArray(profileRes.data)
          ? profileRes.data[0]
          : profileRes.data;

        setProfile(profileData || null);

        const projectsData = Array.isArray(projectsRes.data)
          ? projectsRes.data
          : projectsRes.data?.results || [];

        setProjects(projectsData || []);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!profile) return <div>No profile data found.</div>;

  const featuredProjects = projects.filter(
    (p) => p.status === "production" && p.featured
  );

  const apiLinks = profile.social_links || [];

  const mergedMap = new Map();

  for (const s of DEFAULT_SOCIALS) {
    mergedMap.set(s.platform.toLowerCase(), s);
  }

  for (const s of apiLinks) {
    if (!s || !s.platform || !s.url) continue;

    mergedMap.set(String(s.platform).toLowerCase(), {
      platform: String(s.platform).toLowerCase(),
      icon: s.icon || String(s.platform).toLowerCase(),
      url: s.url,
    });
  }

  const socials = Array.from(mergedMap.values());

  return (
    <div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-subtle opacity-60" />

        <div className="container relative mx-auto px-4 py-20 md:py-32">

          <div className="grid items-center gap-12 md:grid-cols-2">

            {/* LEFT */}
            <div>

              <motion.h1
                custom={1}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mb-2 font-heading text-4xl font-bold tracking-tight text-foreground md:text-6xl"
              >
                {profile.full_name}
              </motion.h1>

              <motion.p
                custom={2}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mb-4 font-heading text-xl font-medium text-primary md:text-2xl"
              >
                {profile.title}
              </motion.p>

              <motion.p
                custom={3}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mb-8 max-w-lg text-muted-foreground"
              >
                {profile.bio}
              </motion.p>

              <motion.div
                custom={4}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mb-4 flex flex-wrap gap-3"
              >

                <Link to="/projects">
                  <Button size="lg">
                    View Projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                {profile.resume_url && (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="lg">
                      <Download className="mr-2 h-4 w-4" />
                      Resume
                    </Button>
                  </a>
                )}

              </motion.div>

              {/* Social Links */}
              <motion.div
                custom={5}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mb-6 flex items-center gap-3"
              >

                {socials.map((link) => {

                  const platformKey = (link.platform || "").toLowerCase();
                  const Icon = iconMap[platformKey] || Github;

                  return (
                    <a
                      key={platformKey}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition hover:bg-primary/5 hover:text-primary"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );

                })}

              </motion.div>

            </div>

            {/* RIGHT IMAGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex justify-center"
            >

              <div className="relative">

                <div className="absolute -inset-4 rounded-2xl bg-gradient-subtle opacity-80" />

                <img
                  src={profileImage}
                  alt={`${profile.full_name}`}
                  className="relative z-10 w-72 rounded-2xl md:w-96"
                />

              </div>

            </motion.div>

          </div>

        </div>

      </section>


      {/* Skills Carousel */}
      <SkillsCarousel />


      {/* Featured Projects */}
      {featuredProjects.length > 0 && (

        <section className="container mx-auto px-4 py-20">

          <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">
            Featured Project
          </h2>

          <p className="mb-8 text-muted-foreground">
            Highlighted work from my portfolio
          </p>

          {featuredProjects.map((project) => (

            <div
              key={project.id}
              className="rounded-xl border border-border bg-card p-6 shadow-card md:p-8 mb-6"
            >

              <div className="mb-3 flex flex-wrap gap-2">

                {project.tech_stack?.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-accent px-2.5 py-1 font-mono text-xs"
                  >
                    {tech}
                  </span>
                ))}

              </div>

              <h3 className="mb-2 text-xl font-semibold">
                {project.title}
              </h3>

              <p className="mb-4 text-muted-foreground">
                {project.description}
              </p>

              <div className="flex gap-3">

                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <Github className="mr-2 h-4 w-4" />
                      Source Code
                    </Button>
                  </a>
                )}

                <Link to="/projects">
                  <Button variant="ghost" size="sm">
                    All Projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

              </div>

            </div>

          ))}

        </section>

      )}

    </div>
  );
};

export default Index;