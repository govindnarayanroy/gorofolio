// Simple session storage for interview data
export interface QuestionAnswer {
  questionIndex: number;
  question: string;
  audioBlob?: Blob;
  transcript: string;
  score?: number;
  tips?: string[];
}

export interface InterviewSession {
  domain: string;
  startTime: Date;
  answers: QuestionAnswer[];
  isComplete: boolean;
}

class SessionManager {
  private currentSession: InterviewSession | null = null;

  startSession(domain: string): InterviewSession {
    this.currentSession = {
      domain,
      startTime: new Date(),
      answers: [],
      isComplete: false,
    };
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentInterviewSession', JSON.stringify({
        ...this.currentSession,
        // Don't store blobs in localStorage
        answers: this.currentSession.answers.map(a => ({ ...a, audioBlob: undefined }))
      }));
    }
    
    return this.currentSession;
  }

  addAnswer(answer: Omit<QuestionAnswer, 'score' | 'tips'>): void {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    const existingIndex = this.currentSession.answers.findIndex(
      a => a.questionIndex === answer.questionIndex
    );

    if (existingIndex >= 0) {
      this.currentSession.answers[existingIndex] = {
        ...this.currentSession.answers[existingIndex],
        ...answer
      };
    } else {
      this.currentSession.answers.push(answer);
    }

    this.saveSession();
  }

  updateAnswerScore(questionIndex: number, score: number, tips: string[]): void {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    const answer = this.currentSession.answers.find(a => a.questionIndex === questionIndex);
    if (answer) {
      answer.score = score;
      answer.tips = tips;
      this.saveSession();
    }
  }

  completeSession(): InterviewSession {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    this.currentSession.isComplete = true;
    this.saveSession();
    return this.currentSession;
  }

  getCurrentSession(): InterviewSession | null {
    return this.currentSession;
  }

  loadSession(): InterviewSession | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem('currentInterviewSession');
      if (stored) {
        const session = JSON.parse(stored);
        this.currentSession = {
          ...session,
          startTime: new Date(session.startTime)
        };
        return this.currentSession;
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
    
    return null;
  }

  clearSession(): void {
    this.currentSession = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentInterviewSession');
    }
  }

  private saveSession(): void {
    if (typeof window !== 'undefined' && this.currentSession) {
      localStorage.setItem('currentInterviewSession', JSON.stringify({
        ...this.currentSession,
        // Don't store blobs in localStorage
        answers: this.currentSession.answers.map(a => ({ ...a, audioBlob: undefined }))
      }));
    }
  }
}

export const sessionManager = new SessionManager(); 