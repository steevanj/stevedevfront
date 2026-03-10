// src/components/layout/Footer.tsx
import { Github, Linkedin, Twitter, Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import apiClient from "@/api/apiClient"; // axios instance

const iconMap: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter, // use Twitter icon for X; label will reflect "X"
  twitter: Twitter,
};

interface SocialLink {
  platform: string;
  icon?: string;
  url: string;
}

interface Profile {
  full_name: string;
  social_links?: SocialLink[];
}

const DEFAULT_SOCIALS: SocialLink[] = [
  { platform: "github", icon: "github", url: "https://github.com/steevanj" },
  { platform: "linkedin", icon: "linkedin", url: "https://www.linkedin.com/in/steechinna/" },
  { platform: "x", icon: "x", url: "https://x.com/SteevanDev" },
];

const Footer = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get("/api/profile/profiles/");
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setProfile(data || null);
      } catch (error) {
        // If fetching fails, we'll fall back to defaults
        console.error("Error fetching profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return null;

  // Merge API social links with defaults, prefer API values but ensure defaults exist
  const apiLinks = profile?.social_links || [];
  const mergedMap = new Map<string, SocialLink>();

  // Add defaults first
  for (const s of DEFAULT_SOCIALS) mergedMap.set(s.platform.toLowerCase(), s);

  // Override with API-provided links (if any)
  for (const s of apiLinks) {
    if (!s || !s.platform || !s.url) continue;
    mergedMap.set(String(s.platform).toLowerCase(), {
      platform: String(s.platform).toLowerCase(),
      icon: s.icon || String(s.platform).toLowerCase(),
      url: s.url,
    });
  }

  const socials = Array.from(mergedMap.values());

  const displayName = profile?.full_name || "Steve";
  const shortName = displayName.split(" ")[0] || displayName;

  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-8 md:flex-row md:justify-between">
        <div className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
          <Terminal className="h-4 w-4 text-primary" />
          <span>
            {shortName}
            <span className="text-primary">.dev</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
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
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label={ariaLabel}
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {displayName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
