export interface QuizItem {
  question: string;
  options: string[];
  correct_answer: string;
}

export interface UploadResponse {
  summary: string;
  quiz_array: QuizItem[];
  summaryFallbackUsed?: boolean;
  summaryFallbackError?: string;
}

export interface AskAIResponse {
  ai_answer: string;
}
