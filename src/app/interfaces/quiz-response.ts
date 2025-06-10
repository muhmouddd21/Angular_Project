import { QuizQuestion } from './quiz-question';
export interface QuizResponse {
  topic: string;
  level: string;
  questions: QuizQuestion[];
}
