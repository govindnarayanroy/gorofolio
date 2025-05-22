export interface Experience {
    company: string;
    role: string;
    start: string; // "2022-04"
    end?: string;  // undefined → “Present”
    bullets: string[];
  }
  
  export interface Education {
    school: string;
    degree: string;
    year: string;
  }
  
  export interface Profile {
    name: string;
    headline: string;
    summary: string;
    experiences: Experience[];
    education: Education[];
    skills: string[];
    links: { label: string; url: string }[];
  }