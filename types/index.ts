export interface UserProfile {
  name?: string;
  ageRange: string;
  educationLevel: string;
  location: string;
}

export interface TaskMetrics {
  taskName: string;
  taskStartTime: number;
  taskCompletionTime: number;
  timeTaken: number;
  errors: number;
  retries: number;
  tapAccuracy?: number;
  navigationMistakes?: number;
  additionalData?: any;
}

export interface QuestionAnswer {
  questionId: number;
  question: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

export interface AssessmentResults {
  userProfile: UserProfile;
  operationalMetrics: TaskMetrics[];
  questionAnswers: QuestionAnswer[];
  operationalScore: number;
  knowledgeScore: number;
  finalScore: number;
  level: string;
  completedAt: number;
}

export type Language = 'en' | 'yo' | 'ha' | 'ig' | 'pcm';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}
