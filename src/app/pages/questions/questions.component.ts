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
import { GetDataService } from '../../services/get-data.service';

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
  selectedOption!: string;
  questionsForm!: QuizResponse;
  wrongAnswer: QuizQuestion[] = [];
  grade: number = 0;
  quizSaved: boolean = false;

  constructor(
    private router: Router,
    private quizState: QuizStateService,
    private sendData: SendDataService,
    private getData: GetDataService,
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

  isQuizCompleted(): boolean {
    return this.answerStatus.every((status) => status !== null);
  }

  showAlert() {
    this.showErrorAlert = true;
  }

  goHome(): void {
    this.quizState.clearQuiz();
    this.router.navigateByUrl('/');
  }

  navigateToGrade(): void {
    this.router.navigateByUrl('/questions/grade');
  }

  isQuizSaved(): boolean {
    return this.quizSaved;
  }

  saveQuiz() {
    if (!this.isQuizCompleted()) {
      alert('Please answer all questions.');
      return;
    }

    this.getData
      .getRequest(fireStoreRestApi.concat(`${this.authServive.Uid}`), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authServive.idtoken}`,
        },
      })
      .subscribe({
        next: (response) => {
          try {
            let parsedResponse;
            if (response instanceof ArrayBuffer) {
              const textDecoder = new TextDecoder();
              const responseText = textDecoder.decode(response);
              parsedResponse = JSON.parse(responseText);
            } else {
              parsedResponse = response;
            }

            const newQuiz = this.buildQuizPayload();

            let existingQuizzes = [];
            if (parsedResponse?.fields?.quizzes?.arrayValue?.values) {
              existingQuizzes = parsedResponse.fields.quizzes.arrayValue.values;
            }

            existingQuizzes.push(newQuiz);

            const firestoreFormatted = {
              fields: {
                quizzes: {
                  arrayValue: {
                    values: existingQuizzes,
                  },
                },
              },
            };

            this.sendData
              .patchRequest(
                fireStoreRestApi.concat(`${this.authServive.Uid}`),
                firestoreFormatted,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.authServive.idtoken}`,
                  },
                }
              )
              .subscribe({
                next: (res) => {
                  console.log('Quiz added:', res);
                },
                error: (err) => {
                  console.error('Save error:', err);
                  this.showAlert();
                  this.router.navigate(['login']);
                },
                complete: () => {
                  this.quizSaved = true;
                  alert('Quiz saved successfully');
                  this.quizState.clearQuiz();
                  this.router.navigateByUrl('/');
                },
              });
          } catch (error) {
            console.error('Parse error:', error);
            this.showAlert();
            this.router.navigate(['login']);
          }
        },
        error: (error) => {
          console.error('GET failed, creating new:', error);

          const firestoreFormatted = {
            fields: {
              quizzes: {
                arrayValue: {
                  values: [this.buildQuizPayload()],
                },
              },
            },
          };

          this.sendData
            .patchRequest(
              fireStoreRestApi.concat(`${this.authServive.Uid}`),
              firestoreFormatted,
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${this.authServive.idtoken}`,
                },
              }
            )
            .subscribe({
              next: (res) => {
                console.log('Created new quiz doc:', res);
              },
              error: (err) => {
                console.error('Create doc error:', err);
                this.showAlert();
                this.router.navigate(['login']);
              },
              complete: () => {
                this.quizSaved = true;
                alert('Quiz saved successfully');
                this.quizState.clearQuiz();
                this.router.navigateByUrl('/');
              },
            });
        },
      });
  }

  private buildQuizPayload() {
    return {
      mapValue: {
        fields: {
          topic: { stringValue: this.questionsForm.topic },
          level: { stringValue: this.questionsForm.level },
          quizTime: { timestampValue: new Date().toISOString() },
          questions: {
            arrayValue: {
              values: this.questionsForm.questions.map((q) => ({
                mapValue: {
                  fields: {
                    id: { stringValue: q.id },
                    question: { stringValue: q.question },
                    options: {
                      arrayValue: {
                        values: q.options.map((opt) => ({
                          stringValue: opt,
                        })),
                      },
                    },
                    correctAnswer: { stringValue: q.correctAnswer },
                  },
                },
              })),
            },
          },
          wrongAnswers: {
            arrayValue: {
              values: this.wrongAnswer.map((q) => ({
                mapValue: {
                  fields: {
                    id: { stringValue: q.id },
                    question: { stringValue: q.question },
                    options: {
                      arrayValue: {
                        values: q.options.map((opt) => ({
                          stringValue: opt,
                        })),
                      },
                    },
                    correctAnswer: { stringValue: q.correctAnswer },
                  },
                },
              })),
            },
          },
        },
      },
    };
  }
}
