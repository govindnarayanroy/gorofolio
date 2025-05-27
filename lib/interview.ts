import { Question, QuestionSet, Domain } from "./types/interview";
import { Profile } from "./types";
// Remove the getUserResume import since we'll make this optional
// import { getUserResume } from "./database";
import backendQuestions from "../data/questions/backend.json";
import frontendQuestions from "../data/questions/frontend.json";

const STATIC_QUESTION_SETS: Record<string, QuestionSet> = {
  backend: backendQuestions,
  frontend: frontendQuestions,
  pm: {
    title: "Product Management",
    questions: [
      {
        id: "pm-1",
        text: "How would you prioritize features for a new product launch?",
        category: "Product Strategy"
      },
      {
        id: "pm-2",
        text: "Describe your approach to gathering and analyzing user feedback.",
        category: "User Research"
      },
      {
        id: "pm-3",
        text: "How do you handle conflicting requirements from different stakeholders?",
        category: "Stakeholder Management"
      },
      {
        id: "pm-4",
        text: "Walk me through how you would conduct a competitive analysis.",
        category: "Market Analysis"
      },
      {
        id: "pm-5",
        text: "How do you measure the success of a product feature?",
        category: "Metrics & Analytics"
      },
      {
        id: "pm-6",
        text: "Describe a time when you had to make a difficult product decision with limited data.",
        category: "Decision Making"
      },
      {
        id: "pm-7",
        text: "How would you approach launching a product in a new market?",
        category: "Go-to-Market"
      },
      {
        id: "pm-8",
        text: "What frameworks do you use for product roadmap planning?",
        category: "Product Planning"
      },
      {
        id: "pm-9",
        text: "How do you work with engineering teams to ensure product requirements are met?",
        category: "Cross-functional Collaboration"
      },
      {
        id: "pm-10",
        text: "Describe your experience with A/B testing and experimentation.",
        category: "Product Experimentation"
      },
      {
        id: "pm-11",
        text: "How would you handle a situation where a key feature is significantly delayed?",
        category: "Risk Management"
      },
      {
        id: "pm-12",
        text: "What's your approach to user story writing and acceptance criteria?",
        category: "Requirements Management"
      }
    ]
  }
};

/**
 * Extracts potential interview domains from user profile data
 */
export function extractDomainsFromProfile(profile: Profile): string[] {
  const domains = new Set<string>();
  
  // Extract from job titles and experiences
  if (profile.experiences) {
    profile.experiences.forEach(exp => {
      if (exp.role) {
        const role = exp.role.toLowerCase();
        if (role.includes('software') || role.includes('developer') || role.includes('engineer')) {
          domains.add('Software Engineering');
        }
        if (role.includes('frontend') || role.includes('front-end') || role.includes('react') || role.includes('vue')) {
          domains.add('Frontend Development');
        }
        if (role.includes('backend') || role.includes('back-end') || role.includes('api') || role.includes('server')) {
          domains.add('Backend Development');
        }
        if (role.includes('product') && role.includes('manager')) {
          domains.add('Product Management');
        }
        if (role.includes('data') && (role.includes('scientist') || role.includes('analyst'))) {
          domains.add('Data Science');
        }
        if (role.includes('design') || role.includes('ux') || role.includes('ui')) {
          domains.add('UX/UI Design');
        }
        if (role.includes('marketing') || role.includes('growth')) {
          domains.add('Marketing');
        }
        if (role.includes('sales') || role.includes('business development')) {
          domains.add('Sales');
        }
      }
    });
  }
  
  // Extract from skills
  if (profile.skills) {
    profile.skills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      if (['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css'].some(tech => skillLower.includes(tech))) {
        domains.add('Frontend Development');
      }
      if (['node.js', 'python', 'java', 'go', 'rust', 'api', 'database', 'sql'].some(tech => skillLower.includes(tech))) {
        domains.add('Backend Development');
      }
      if (['figma', 'sketch', 'adobe', 'design', 'prototyping'].some(tech => skillLower.includes(tech))) {
        domains.add('UX/UI Design');
      }
      if (['python', 'r', 'machine learning', 'data analysis', 'pandas', 'numpy'].some(tech => skillLower.includes(tech))) {
        domains.add('Data Science');
      }
    });
  }
  
  // Extract from education
  if (profile.education) {
    profile.education.forEach(edu => {
      if (edu.degree) {
        const degree = edu.degree.toLowerCase();
        if (degree.includes('computer science') || degree.includes('software')) {
          domains.add('Software Engineering');
        }
        if (degree.includes('design') || degree.includes('art')) {
          domains.add('UX/UI Design');
        }
        if (degree.includes('business') || degree.includes('mba')) {
          domains.add('Product Management');
          domains.add('Marketing');
        }
        if (degree.includes('data') || degree.includes('statistics') || degree.includes('mathematics')) {
          domains.add('Data Science');
        }
      }
    });
  }
  
  return Array.from(domains);
}

/**
 * Gets dynamic domains based on user profile, with fallback to static domains
 * Now works without requiring resume data - provides static domains by default
 */
export async function getDynamicDomains(): Promise<{ domain: string; title: string; isCustom: boolean }[]> {
  // Always start with static domains to ensure the interview system works
  const domains: { domain: string; title: string; isCustom: boolean }[] = [];
  
  // Add static domains first
  Object.entries(STATIC_QUESTION_SETS).forEach(([key, questionSet]) => {
    domains.push({
      domain: key,
      title: questionSet.title,
      isCustom: false
    });
  });
  
  // TODO: In the future, we can add personalized domains based on user profile
  // This would require a separate API call that doesn't block the basic functionality
  
  return domains;
}

/**
 * Picks 10 unique random questions from a given domain
 */
export function getRandomQuestionSet(domain: Domain): Question[] {
  const questionSet = STATIC_QUESTION_SETS[domain];
  if (!questionSet || !questionSet.questions || questionSet.questions.length === 0) {
    console.warn(`No questions found for domain: ${domain}, falling back to backend questions`);
    // For custom domains or empty question sets, use backend questions as fallback
    const backendQuestions = STATIC_QUESTION_SETS['backend'];
    if (!backendQuestions || !backendQuestions.questions || backendQuestions.questions.length === 0) {
      console.error('No fallback questions available');
      return [];
    }
    const questions = [...backendQuestions.questions];
    
    // Fisher-Yates shuffle
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    
    return questions.slice(0, 10);
  }
  
  const questions = [...questionSet.questions];
  
  // Fisher-Yates shuffle
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
  
  return questions.slice(0, Math.min(10, questions.length));
}

/**
 * Gets all available domains (legacy function for backward compatibility)
 */
export function getAvailableDomains(): Domain[] {
  return Object.keys(STATIC_QUESTION_SETS) as Domain[];
}

/**
 * Gets the title for a given domain (legacy function for backward compatibility)
 */
export function getDomainTitle(domain: Domain): string {
  return STATIC_QUESTION_SETS[domain]?.title || domain;
} 