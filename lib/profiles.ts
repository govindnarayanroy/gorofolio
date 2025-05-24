import { Profile } from "@/lib/types";

// Dummy profile data for testing - matches modern professional aesthetic
const DUMMY_PROFILES: Record<string, Profile> = {
  "123": {
    name: "Sarah Smith",
    headline: "Senior Software Engineer",
    summary: "Experienced software engineer specializing in full-stack web development. Skilled in JavaScript, React, and cloud-based solutions with a strong background in leading agile teams.",
    experiences: [
      {
        company: "Tech Company",
        role: "Senior Software Engineer",
        start: "2019-06",
        end: undefined, // Present
        bullets: [
          "Led development of microservices architecture serving 10M+ users",
          "Mentored 5 junior developers and implemented best practices",
          "Reduced deployment time by 60% through CI/CD automation",
          "Built scalable React applications with TypeScript and Next.js"
        ]
      },
      {
        company: "StartupCo",
        role: "Full Stack Developer",
        start: "2017-03",
        end: "2019-05",
        bullets: [
          "Developed MVP product from scratch using MERN stack",
          "Implemented real-time features with Socket.io and Redis",
          "Collaborated with design team to create responsive UI/UX",
          "Optimized database queries resulting in 40% performance improvement"
        ]
      }
    ],
    education: [
      {
        school: "University X",
        degree: "Bachelor of Science • Computer Science",
        year: "2014-2018"
      }
    ],
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "Python", "AWS", "Docker", "GraphQL", "MongoDB", "PostgreSQL"],
    links: [
      { label: "GitHub", url: "https://github.com/sarahsmith" },
      { label: "LinkedIn", url: "https://linkedin.com/in/sarahsmith" },
      { label: "Portfolio", url: "https://sarahsmith.dev" },
      { label: "Twitter", url: "https://twitter.com/sarahsmith_dev" }
    ]
  },
  "456": {
    name: "Alex Chen",
    headline: "Product Designer • UX Specialist",
    summary: "Creative product designer with 6+ years of experience crafting user-centered digital experiences. Passionate about solving complex problems through elegant design solutions.",
    experiences: [
      {
        company: "Design Studio Pro",
        role: "Senior Product Designer",
        start: "2021-01",
        end: undefined,
        bullets: [
          "Lead design for B2B SaaS platform used by 50K+ businesses",
          "Conducted user research and usability testing with 200+ participants",
          "Designed comprehensive design system adopted across 8 product teams",
          "Increased user engagement by 35% through redesigned onboarding flow"
        ]
      },
      {
        company: "Creative Agency",
        role: "UX Designer",
        start: "2018-09",
        end: "2020-12",
        bullets: [
          "Created wireframes and prototypes for mobile and web applications",
          "Collaborated with developers to ensure design implementation quality",
          "Managed design projects for Fortune 500 clients",
          "Established user-centered design processes and methodologies"
        ]
      }
    ],
    education: [
      {
        school: "Design Institute",
        degree: "Bachelor of Fine Arts • Interactive Design",
        year: "2014-2018"
      }
    ],
    skills: ["Figma", "Sketch", "Adobe Creative Suite", "Prototyping", "User Research", "Design Systems", "HTML/CSS", "JavaScript"],
    links: [
      { label: "Behance", url: "https://behance.net/alexchen" },
      { label: "Dribbble", url: "https://dribbble.com/alexchen" },
      { label: "LinkedIn", url: "https://linkedin.com/in/alexchen" },
      { label: "Website", url: "https://alexchen.design" }
    ]
  }
};

export function getProfileById(id: string): Profile | null {
  return DUMMY_PROFILES[id] ?? null;
}

export function getAllProfileIds(): string[] {
  return Object.keys(DUMMY_PROFILES);
} 