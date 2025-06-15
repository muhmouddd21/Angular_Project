import { Component } from '@angular/core';
import { QuizResponse } from '../../interfaces/quiz-response';
import { QuizQuestion } from '../../interfaces/quiz-question';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizStateService } from '../../services/quiz-state.service';
import { SendDataService } from '../../services/send-data.service';
import { AuthService } from '../../services/auth.service';
import { fireStoreRestApi } from '../../firebaseUrl';
@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss',
})
export class QuestionsComponent {
  showErrorAlert = false;
  answerStatus: (string | null)[] = [];
  userAnswer: (string | null)[] = [];
  selectedOption!: string;
  questionsForm!: QuizResponse;
  wrongAnswer: QuizQuestion[] = [];
  grade: number = 0;

  constructor(
    private router: Router,
    private quizState: QuizStateService,
    private sendData: SendDataService,
    private authServive: AuthService
  ) {}
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

  goHome(): void {
    this.quizState.clearQuiz();
    this.router.navigateByUrl('/');
  }

  saveQuiz() {
    if (this.isQuizCompleted()) {
      alert('Please Answer all questions');
      return;
    }
    console.log(this.isQuizCompleted());

    const firestoreFormatted = {
      fields: {
        topic: { stringValue: this.questionsForm.topic },
        level: { stringValue: this.questionsForm.level },
        questions: {
          arrayValue: {
            values: this.questionsForm.questions.map((q) => ({
              mapValue: {
                fields: {
                  id: { stringValue: q.id },
                  question: { stringValue: q.question },
                  options: {
                    arrayValue: {
                      values: q.options.map((opt) => ({ stringValue: opt })),
                    },
                  },
                  correctAnswer: { stringValue: q.correctAnswer },
                },
              },
            })),
          },
        },
      },
    };

    this.sendData
      .postRequest(fireStoreRestApi, firestoreFormatted, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authServive.idtoken}`,
        },
      })
      .subscribe({
        next: (response) => {
          console.log('send correctly:', response);
        },
        error: (error) => {
          this.showAlert();
          this.router.navigate(['login']);
        },
        complete: () => {
          alert('Quiz saved successfully');
          this.router.navigateByUrl('/');
        },
      });

    this.quizState.clearQuiz();
  }

  showAlert() {
    this.showErrorAlert = true;
  }
}
