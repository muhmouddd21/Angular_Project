import { Injectable } from '@angular/core';
import { QuizResponse } from '../interfaces/quiz-response';

@Injectable({
  providedIn: 'root',
})
export class QuizStateService {
  private quizData!: QuizResponse;

  setQuiz(data: QuizResponse) {
    this.quizData = data;
  }

  getQuiz() {
    return this.quizData;
  }
  clearQuiz() {
    this.quizData = {} as QuizResponse;
  }
}
