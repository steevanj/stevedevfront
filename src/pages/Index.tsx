// src/pages/Index.tsx
import { motion } from "framer-motion";
import { ArrowRight, Download, Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import profileImage from "@/assets/profile-hero.png";
import { useEffect, useState } from "react";
import apiClient from "@/api/apiClient"; // axios instance
import { differenceInMonths, parseISO, isValid } from "date-fns";

const iconMap: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter, // use Twitter icon for X
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

interface SocialLink {
  platform: string;
  icon?: string;
  url: string;
}

interface Profile {
  id?: string;
  full_name: string;
  title: string;
  bio: string;
  experience_years?: number;
  resume_url?: string;
  social_links?: SocialLink[];
}

interface Project {
  id: string;
  title: string;
  description: string;
  github_url?: string;
  status: string;
  featured: boolean;
  tech_stack?: string[];
}

interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string; // YYYY-MM-DD
  end_date?: string | null;
  profile?: string;
  description?: string;
}

const DEFAULT_SOCIALS: SocialLink[] = [
  { platform: "github", icon: "github", url: "https://github.com/steevanj" },
  { platform: "linkedin", icon: "linkedin", url: "https://www.linkedin.com/in/steechinna/" },
  { platform: "x", icon: "x", url: "https://x.com/SteevanDev" },
];

const Index = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile, projects and experiences in parallel
        const [profileRes, projectsRes, expRes] = await Promise.all([
          apiClient.get("/api/profile/profiles/"),
          apiClient.get("/api/profile/projects/"),
          apiClient.get("/api/profile/experiences/"),
        ]);

        const profileData = Array.isArray(profileRes.data) ? profileRes.data[0] : profileRes.data;
        setProfile(profileData || null);

        const projectsData = Array.isArray(projectsRes.data) ? projectsRes.data : projectsRes.data?.results || [];
        setProjects(projectsData || []);

        const expData = Array.isArray(expRes.data) ? expRes.data : expRes.data?.results || [];
        setExperiences(expData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sum durations across experiences (handles overlaps by summing each job's duration)
  const computeExperienceYearsSum = (expList: Experience[]) => {
    if (!Array.isArray(expList) || expList.length === 0) return null;

    const validRanges = expList
      .map((e) => {
        if (!e?.start_date) return null;
        // Prefer parseISO for strict parsing
        const start = parseISO(e.start_date);
        const end = e?.end_date ? parseISO(e.end_date) : new Date();
        if (!isValid(start)) return null;
        const safeEnd = isValid(end) ? end : new Date();
        return { start, end: safeEnd };
      })
      .filter(Boolean) as { start: Date; end: Date }[];

    if (!validRanges.length) return null;

    const monthsSum = validRanges.reduce((acc, r) => {
      const months = Math.max(0, differenceInMonths(r.end, r.start));
      return acc + months;
    }, 0);

    return Math.floor(monthsSum / 12);
  };

  // Compute experience to display: prefer computed sum, fallback to profile.experience_years, final fallback 0
  const computedYears = computeExperienceYearsSum(experiences);
  const experienceYears = computedYears ?? (typeof profile?.experience_years === "number" ? Math.floor(profile.experience_years) : 0);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile data found.</div>;

  const featuredProjects = projects.filter((p) => p.status === "production" && p.featured);

  // Merge API social links with defaults so we always show links below resume
  const apiLinks = profile.social_links || [];
  const mergedMap = new Map<string, SocialLink>();
  for (const s of DEFAULT_SOCIALS) mergedMap.set(s.platform.toLowerCase(), s);
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
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle opacity-60" />
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <motion.div
                custom={0}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mb-4 inline-block rounded-full bg-accent px-4 py-1.5 font-mono text-xs font-medium text-accent-foreground"
              >
                {experienceYears}+ years of experience
              </motion.div>

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
                className="mb-3 flex flex-wrap gap-3"
              >
                <Link to="/projects">
                  <Button size="lg" className="shadow-primary">
                    View Projects <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                {profile.resume_url && (
                  <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg">
                      <Download className="mr-2 h-4 w-4" /> Resume
                    </Button>
                  </a>
                )}
              </motion.div>

              {/* Social links placed directly below the Resume button */}
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
                  const ariaLabel = platformKey === "x" ? "X" : platformKey.charAt(0).toUpperCase() + platformKey.slice(1);
                  return (
                    <a
                      key={platformKey}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                      aria-label={ariaLabel}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{ariaLabel}</span>
                    </a>
                  );
                })}
              </motion.div>

              <motion.div
                custom={6}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="flex gap-3"
              >
                {/* Keep the smaller icon row for quick access as well (optional) */}
                {profile.social_links?.map((link) => {
                  const Icon = iconMap[link.icon] || Github;
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-border p-2.5 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                      aria-label={link.platform}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </motion.div>
            </div>

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
                  alt={`${profile.full_name} - ${profile.title}`}
                  className="relative z-10 w-72 rounded-2xl md:w-96"
                  loading="eager"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      {featuredProjects.length > 0 && (
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">
              Featured Project
            </h2>
            <p className="mb-8 text-muted-foreground">
              Highlighted work from my portfolio
            </p>

            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-card-hover md:p-8"
              >
                <div className="mb-3 flex flex-wrap gap-2">
                  {project.tech_stack?.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-accent px-2.5 py-1 font-mono text-xs text-accent-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <h3 className="mb-2 font-heading text-xl font-semibold text-foreground">
                  {project.title}
                </h3>
                <p className="mb-4 text-muted-foreground">
                  {project.description}
                </p>
                <div className="flex gap-3">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Github className="mr-2 h-4 w-4" /> Source Code
                      </Button>
                    </a>
                  )}
                  <Link to="/projects">
                    <Button variant="ghost" size="sm">
                      All Projects <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default Index;
