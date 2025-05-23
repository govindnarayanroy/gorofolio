export interface Question {
  id: string;
  text: string;
  category: string;
}

export interface QuestionSet {
  title: string;
  questions: Question[];
}

export type Domain = "backend" | "frontend" | "pm"; 