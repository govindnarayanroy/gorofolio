import { Question, QuestionSet, Domain } from "./types/interview";
import backendQuestions from "../data/questions/backend.json";
import frontendQuestions from "../data/questions/frontend.json";

const QUESTION_SETS: Record<Domain, QuestionSet> = {
  backend: backendQuestions,
  frontend: frontendQuestions,
  pm: {
    title: "Product Management",
    questions: [] // TODO: Add PM questions
  }
};

/**
 * Picks 10 unique random questions from a given domain
 */
export function getRandomQuestionSet(domain: Domain): Question[] {
  const questionSet = QUESTION_SETS[domain];
  const questions = [...questionSet.questions];
  
  // Fisher-Yates shuffle
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
  
  return questions.slice(0, 10);
}

/**
 * Gets all available domains
 */
export function getAvailableDomains(): Domain[] {
  return Object.keys(QUESTION_SETS) as Domain[];
}

/**
 * Gets the title for a given domain
 */
export function getDomainTitle(domain: Domain): string {
  return QUESTION_SETS[domain].title;
} 