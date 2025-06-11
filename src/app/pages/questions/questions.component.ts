import { Component } from '@angular/core';
import { QuizResponse } from '../../interfaces/quiz-response';
import { QuizQuestion } from '../../interfaces/quiz-question';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizStateService } from '../../services/quiz-state.service';
@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss',
})
export class QuestionsComponent {
  answerStatus: (string | null)[] = [];
  selectedOption!: string;
  questionsForm!: QuizResponse;
  wrongAnswer: QuizQuestion[] = [];
  grade: number = 0;

  constructor(private router: Router, private quizState: QuizStateService) {}
  ngOnInit() {
    this.questionsForm = this.quizState.getQuiz();
    const numOfQuestions = this.questionsForm.questions.length;
    this.answerStatus = new Array(numOfQuestions).fill(null);
  }

  checkAnswer(index: number, question: QuizQuestion, corrAnswer: string) {
    if (this.selectedOption !== corrAnswer) {
      this.wrongAnswer.push(question);
      this.answerStatus[index] = 'incorrect';
    } else {
      this.answerStatus[index] = 'correct';
      this.grade++;
    }
  }
  navigateToGrade(): void {
    this.router.navigateByUrl('/questions/grade');
  }
  isQuizCompleted(): boolean {
    return this.answerStatus.every((status) => status !== null);
  }

  saveQuiz(): void {
    alert('Your quiz has been saved!');
    //add fire base logic here
  }

  goHome(): void {
    this.quizState.clearQuiz();
    this.router.navigateByUrl('/');
  }
}
