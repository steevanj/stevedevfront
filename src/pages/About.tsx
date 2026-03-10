// src/pages/About.tsx

import { motion } from "framer-motion";
import profileImage from "@/assets/profile-hero.png";
import { useEffect, useState } from "react";
import apiClient from "@/api/apiClient";
import { differenceInMonths, parseISO, isValid } from "date-fns";

interface Skill {
  id: string;
  name: string;
  category: string;
  icon?: string;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

interface Education {
  id: string;
  institution: string;
  degree?: string;
  field_of_study?: string;
  start_date: string;
  end_date?: string;
}

interface Profile {
  full_name: string;
  bio?: string;
  skills?: Skill[];
  experiences?: Experience[];
  education?: Education[];
}

/* ICON RENDERER */
const RenderIcon = ({ icon }: { icon?: string }) => {
  if (!icon) {
    return <i className="fa-solid fa-code text-primary text-lg" />;
  }

  if (icon.startsWith("devicon-")) {
    return <i className={`${icon} text-lg`} />;
  }

  return <i className={`${icon} text-lg`} />;
};

/* EXPERIENCE CALCULATOR (internships included) */
const computeExperienceYears = (exp: Experience[]) => {
  if (!exp || !exp.length) return 0;

  const months = exp.reduce((acc, e) => {
    const start = parseISO(e.start_date);
    const end = e.end_date ? parseISO(e.end_date) : new Date();

    if (!isValid(start) || !isValid(end)) return acc;

    const diff = differenceInMonths(end, start);

    return acc + Math.max(diff, 0);
  }, 0);

  return Number((months / 12).toFixed(1));
};

const About = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get("/api/profile/profiles/");
        const data = Array.isArray(res.data) ? res.data[0] : res.data;

        setProfile(data);
        setSkills(data.skills || []);
        setExperiences(data.experiences || []);
        setEducation(data.education || []);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!profile) return <div>No profile data found.</div>;

  const experienceYears = computeExperienceYears(experiences);
  const careerEntries = experiences.length + education.length;
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between gap-6">

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              About Me
            </h1>
            <p className="text-muted-foreground text-sm">
              Backend engineer crafting scalable systems
            </p>
          </div>

          <div className="hidden md:block">
            <img
              src={profileImage}
              alt={profile.full_name}
              className="w-32 rounded-lg shadow-lg"
            />
          </div>

        </div>
      </motion.div>

      <div className="mt-8 grid gap-10 md:grid-cols-3">

        {/* LEFT SECTION */}
        <div className="md:col-span-2">

          {/* BIO */}
          <div className="prose max-w-none">
            <p className="text-muted-foreground">
              {profile.bio || "No bio available."}
            </p>
          </div>

          {/* STATS */}
          <div className="mt-6 grid grid-cols-3 gap-4">

            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {experienceYears} yrs
              </div>
              <div className="text-xs text-muted-foreground">
                Experience
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {skills.length}+
              </div>
              <div className="text-xs text-muted-foreground">
                Technologies
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {careerEntries}+
              </div>
              <div className="text-xs text-muted-foreground">
                Career Entries
              </div>
            </div>

          </div>

          {/* SKILLS */}
          <div className="mt-8">

            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Skills & Technologies
            </h2>

            <div className="grid gap-3 md:grid-cols-2">

              {categories.map((category) => (
                <div
                  key={category}
                  className="rounded-lg border border-border bg-card p-4"
                >

                  <div className="mb-3 flex items-center justify-between">

                    <div className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                      {category}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {skills.filter((s) => s.category === category).length}
                    </div>

                  </div>

                  <div className="flex flex-wrap gap-3">

                    {skills
                      .filter((s) => s.category === category)
                      .map((skill) => (

                        <div
                          key={skill.id}
                          className="group flex items-center gap-3 rounded-lg border border-border bg-card/50 px-3 py-2 shadow-sm transition transform hover:-translate-y-0.5 hover:shadow-lg hover:bg-primary/5"
                        >

                          <div className="flex h-8 w-8 min-w-[32px] items-center justify-center rounded-md bg-primary/5 text-primary transition-transform duration-200 group-hover:scale-110">
                            <RenderIcon icon={skill.icon} />
                          </div>

                          <div className="text-sm font-medium text-foreground">
                            {skill.name}
                          </div>

                        </div>

                      ))}

                  </div>

                </div>
              ))}

            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div>
          <div className="sticky top-20 space-y-6">

            {/* PROFILE CARD */}
            <div className="rounded-lg border border-border bg-card p-4 text-center">

              <img
                src={profileImage}
                alt={profile.full_name}
                className="mx-auto mb-3 h-28 w-28 rounded-lg object-cover shadow-md"
              />

              <div className="text-lg font-semibold text-foreground">
                {profile.full_name}
              </div>

              <div className="text-xs text-muted-foreground">
                Backend Engineer
              </div>

            </div>

            {/* CAREER ROADMAP */}
            <div className="rounded-lg border border-border bg-card p-5">

              <h3 className="font-semibold mb-6 text-sm">
                Career Pathway
              </h3>

              <div className="relative pl-8">

                {/* ROAD LINE */}
                <div className="absolute left-3 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />

                {/* EDUCATION */}
                {education.map((edu) => (
                  <div key={edu.id} className="relative mb-8">

                    <div className="absolute -left-[2px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow">
                      <i className="fa-solid fa-graduation-cap text-xs"></i>
                    </div>

                    <div className="ml-6 border rounded-lg p-3 shadow-sm hover:shadow transition">

                      <div className="text-sm font-semibold">
                        {edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {edu.institution}
                      </div>

                      <div className="text-xs text-muted-foreground mt-1">
                        {edu.start_date} – {edu.end_date || "Present"}
                      </div>

                    </div>

                  </div>
                ))}

                {/* EXPERIENCE */}
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative mb-8">

                    <div className="absolute -left-[2px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow">
                      <i className="fa-solid fa-briefcase text-xs"></i>
                    </div>

                    <div className="ml-6 border rounded-lg p-3 shadow-sm hover:shadow transition">

                      <div className="text-sm font-semibold">
                        {exp.role} @ {exp.company}
                      </div>

                      <div className="text-xs text-muted-foreground mt-1">
                        {exp.start_date} – {exp.end_date || "Present"}
                      </div>

                      {exp.description && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {exp.description}
                        </p>
                      )}

                    </div>

                  </div>
                ))}

              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default About;