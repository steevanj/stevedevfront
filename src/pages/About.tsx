// src/pages/About.tsx
import { motion } from "framer-motion";
import profileImage from "@/assets/profile-hero.png";
import { useEffect, useState } from "react";
import apiClient from "@/api/apiClient";
import { differenceInMonths, parseISO, isValid } from "date-fns";

interface Profile { full_name: string; bio?: string; experience_years?: number; skills?: any; }
interface Skill { id: string; name: string; category: string; icon?: string; }
interface Experience { id: string; company: string; role: string; start_date: string; end_date?: string; description?: string; }
interface Education { id: string; institution: string; degree?: string; field_of_study?: string; start_date: string; end_date?: string; description?: string; }

/* Robust icon renderer */
const RenderIcon = ({ icon }: { icon?: string }) => {
  // eslint-disable-next-line no-console
  console.log("RenderIcon:", icon);

  if (!icon) {
    return (
      <svg className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2H2V5zM2 9h16v6a2 2 0 01-2 2H4a2 2 0 01-2-2V9z" />
      </svg>
    );
  }

  const trimmed = icon.trim();

  if (trimmed.startsWith("<svg") || trimmed.startsWith("<path")) {
    return <span className="inline-block h-4 w-4" dangerouslySetInnerHTML={{ __html: icon }} aria-hidden />;
  }

  try {
    new URL(icon);
    return <img src={icon} alt="" className="h-4 w-4 object-contain" aria-hidden />;
  } catch {}

  if (trimmed.startsWith("devicon-")) {
    return <i className={`${trimmed} text-lg`} aria-hidden />;
  }

  return <i className={`${trimmed} fa-fw text-lg`} aria-hidden />;
};

/* compute experience years by summing durations (handles ongoing roles) */
const computeExperienceYearsSum = (expList: Experience[]) => {
  if (!Array.isArray(expList) || expList.length === 0) return null;

  const validRanges = expList
    .map((e) => {
      if (!e?.start_date) return null;
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

const TimelineItem = ({ title, subtitle, dateRange, description, iconClass }: {
  title: string; subtitle?: string; dateRange?: string; description?: string; iconClass?: string;
}) => {
  const renderIcon = () => {
    if (!iconClass) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path d="M10 2a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V3a1 1 0 011-1z" />
          </svg>
        </div>
      );
    }
    return <i className={`${iconClass} text-lg`} aria-hidden />;
  };

  return (
    <div className="relative pl-12">
      <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border text-primary shadow-sm">
        {renderIcon()}
      </div>

      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
            {subtitle && <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>}
          </div>
          {dateRange && <div className="text-xs text-muted-foreground">{dateRange}</div>}
        </div>
        {description && <p className="mt-3 text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
};

const About = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  const findFirstArrayOfObjects = (obj: any): any[] => {
    if (!obj) return [];
    if (Array.isArray(obj) && obj.length && typeof obj[0] === "object") return obj;
    if (typeof obj === "object") {
      for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (Array.isArray(val) && val.length && typeof val[0] === "object") return val;
      }
      for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (typeof val === "object") {
          const found = findFirstArrayOfObjects(val);
          if (found.length) return found;
        }
      }
    }
    return [];
  };

  const fetchUrl = async (url: string) => {
    try {
      const parsed = new URL(url, window.location.origin);
      const sameOrigin = parsed.origin === window.location.origin;
      const path = sameOrigin ? parsed.pathname + parsed.search : url;
      const res = await apiClient.get(path);
      return res.data;
    } catch {
      const res = await apiClient.get(url);
      return res.data;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await apiClient.get("/api/profiles/profiles/");
        const profileData = Array.isArray(profileRes.data) ? profileRes.data[0] : profileRes.data;
        setProfile(profileData || null);

        const skillsRootRes = await apiClient.get("/api/skills/");
        let skillsPayload = skillsRootRes.data;
        if (skillsPayload && typeof skillsPayload === "object" && typeof skillsPayload.skills === "string") {
          skillsPayload = await fetchUrl(skillsPayload.skills);
        }

        let allSkills: Skill[] = findFirstArrayOfObjects(skillsPayload) as Skill[];
        if (!allSkills.length) {
          if (Array.isArray(skillsPayload)) allSkills = skillsPayload;
          else if (Array.isArray(skillsPayload.results)) allSkills = skillsPayload.results;
          else if (Array.isArray(skillsPayload.data)) allSkills = skillsPayload.data;
        }

        const profileSkillIds = new Set<string>();
        if (profileData && profileData.skills) {
          const raw = profileData.skills;
          if (Array.isArray(raw)) {
            raw.forEach((item: any) => {
              if (!item) return;
              if (typeof item === "string") profileSkillIds.add(item.trim());
              else if (typeof item === "object" && item.id) profileSkillIds.add(String(item.id).trim());
              else profileSkillIds.add(String(item).trim());
            });
          } else if (typeof raw === "string") {
            raw.split(",").map((s) => s.trim()).filter(Boolean).forEach((id) => profileSkillIds.add(id));
          }
        }

        const matched = allSkills.filter((s) => {
          if (!s || !s.id) return false;
          const sid = String(s.id).trim();
          return profileSkillIds.size === 0 ? true : profileSkillIds.has(sid);
        });

        setSkills(profileSkillIds.size === 0 ? allSkills : matched);

        const expRes = await apiClient.get("/api/profiles/experiences/");
        setExperiences(Array.isArray(expRes.data) ? expRes.data : expRes.data.results || []);

        const eduRes = await apiClient.get("/api/profiles/education/");
        setEducation(Array.isArray(eduRes.data) ? eduRes.data : eduRes.data.results || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile data found.</div>;

  const categories = [...new Set(skills.map((s) => s.category || "Other"))];

  // compute experience years (sum durations) and career entries count
  const computedYears = computeExperienceYearsSum(experiences);
  const experienceYears = computedYears ?? (profile.experience_years || 0);
  const careerEntries = experiences.length + education.length;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="mb-1 text-3xl font-bold text-foreground md:text-4xl">About Me</h1>
            <p className="text-sm text-muted-foreground">Backend engineer crafting scalable systems</p>
          </div>

          {/* Profile image card with subtle design adjustments */}
          <div className="hidden md:block">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-90 blur-sm transition-all duration-300 group-hover:scale-105" />
              <img
                src={profileImage}
                alt={profile.full_name}
                className="relative z-10 w-32 rounded-lg object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 grid gap-10 md:grid-cols-3">
        {/* Left: Bio + Skills */}
        <div className="md:col-span-2">
          <div className="prose max-w-none">
            {profile.bio ? profile.bio.split("\n\n").map((p, i) => (
              <p key={i} className="text-muted-foreground">{p}</p>
            )) : <p className="text-muted-foreground">No about info available.</p>}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">{experienceYears || 0}+</div>
              <div className="mt-1 text-xs text-muted-foreground">Years Exp.</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">{skills.length}+</div>
              <div className="mt-1 text-xs text-muted-foreground">Technologies</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">{careerEntries}+</div>
              <div className="mt-1 text-xs text-muted-foreground">Career Entries</div>
            </div>
          </div>

          {/* Skills with icons — improved hover and micro-interactions */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Skills & Technologies</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {categories.map((category) => (
                <div key={category} className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{category}</div>
                    <div className="text-xs text-muted-foreground">{skills.filter(s => s.category === category).length}</div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {skills.filter((s) => s.category === category).map((skill) => (
                      <div
                        key={skill.id}
                        className="group flex items-center gap-3 rounded-lg border border-border bg-card/50 px-3 py-2 shadow-sm transition transform hover:-translate-y-0.5 hover:shadow-lg hover:bg-primary/5"
                      >
                        <div className="flex h-8 w-8 min-w-[32px] items-center justify-center rounded-md bg-primary/5 text-primary transition-transform duration-200 group-hover:scale-110">
                          <RenderIcon icon={skill.icon} />
                        </div>
                        <div className="text-sm font-medium text-foreground">{skill.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Profile card + timeline */}
        <div>
          <div className="sticky top-20 space-y-6">
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <img src={profileImage} alt={profile.full_name} className="mx-auto mb-3 h-28 w-28 rounded-lg object-cover shadow-md" />
              <div className="text-lg font-semibold text-foreground">{profile.full_name}</div>
              <div className="text-xs text-muted-foreground">Backend Engineer</div>
            </div>

            {/* Timeline container with vertical line */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Career Pathway</h3>

              <div className="relative pl-6">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />

                <div className="space-y-6">
                  {education.length === 0 && <div className="text-sm text-muted-foreground">No education entries.</div>}
                  {education.sort((a, b) => (a.start_date > b.start_date ? 1 : -1)).map((edu) => (
                    <div key={edu.id} className="relative">
                      <div className="absolute -left-6 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border text-primary shadow-sm">
                        <i className="fa-solid fa-graduation-cap" aria-hidden />
                      </div>
                      <div className="ml-2">
                        <div className="text-sm font-semibold text-foreground">{edu.degree || "Degree"} in {edu.field_of_study || "Field"}</div>
                        <div className="text-xs text-muted-foreground">{edu.institution}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{edu.start_date} - {edu.end_date || "Present"}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="my-6 h-px bg-border" />

                <div className="space-y-6">
                  {experiences.length === 0 && <div className="text-sm text-muted-foreground">No experience entries.</div>}
                  {experiences.sort((a, b) => (a.start_date > b.start_date ? 1 : -1)).map((exp) => (
                    <div key={exp.id} className="relative">
                      <div className="absolute -left-6 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border text-primary shadow-sm">
                        <i className="fa-solid fa-briefcase" aria-hidden />
                      </div>
                      <div className="ml-2">
                        <div className="text-sm font-semibold text-foreground">{exp.role} @ {exp.company}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{exp.start_date} - {exp.end_date || "Present"}</div>
                        {exp.description && <div className="mt-2 text-sm text-muted-foreground">{exp.description}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default About;
