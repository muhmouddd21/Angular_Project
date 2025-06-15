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
  navigateToGrade(): void {
    this.router.navigateByUrl('/questions/grade');
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

  saveQuiz() {
    if (!this.isQuizCompleted()) {
      alert('Please Answer all questions');
      return;
    }

this.getData.getRequest(fireStoreRestApi.concat(`${this.authServive.Uid}`), {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.authServive.idtoken}`,
  },
}).subscribe({
  next: (response) => {
    try {
      // Parse the ArrayBuffer response to JSON
      let parsedResponse;
      if (response instanceof ArrayBuffer) {
        const textDecoder = new TextDecoder();
        const responseText = textDecoder.decode(response);
        parsedResponse = JSON.parse(responseText);
      } else {
        parsedResponse = response;
      }

      // Log the parsed response to see its structure
      console.log('GET response:', JSON.stringify(parsedResponse, null, 2));

      // Create the new quiz object
      const newQuiz = {
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
                        values: q.options.map((opt) => ({ stringValue: opt })),
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
      },
    };

      // Get existing quizzes array or create empty array if none exists
      let existingQuizzes = [];

      // Check if response has the expected structure
      if (parsedResponse &&
          parsedResponse.fields &&
          parsedResponse.fields.quizzes &&
          parsedResponse.fields.quizzes.arrayValue &&
          parsedResponse.fields.quizzes.arrayValue.values) {
        existingQuizzes = parsedResponse.fields.quizzes.arrayValue.values;
      } else {
        console.log('No existing quizzes found or unexpected response structure:', parsedResponse);
      }

    // Add the new quiz to the existing array
    existingQuizzes.push(newQuiz);

    // Create the updated document structure
    const firestoreFormatted = {
      fields: {
        quizzes: {
          arrayValue: {
            values: existingQuizzes,
          },
        },
      },
    };

    // Send the updated data
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
        next: (response) => {
          console.log('Quiz added successfully:', response);
        },
        error: (error) => {
          console.error('Error saving quiz:', error);
          this.showAlert();
          this.router.navigate(['login']);
        },
        complete: () => {
          alert('Quiz saved successfully');
          this.router.navigateByUrl('/');
          this.quizState.clearQuiz();
        },
      });
    } catch (error) {
      console.error('Error processing response:', error);
      this.showAlert();
      this.router.navigate(['login']);
    }
  },
  error: (error) => {
    console.error('Error fetching existing data:', error);
    // If document doesn't exist, create it with the new quiz
    const firestoreFormatted = {
      fields: {
        quizzes: {
          arrayValue: {
            values: [{
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
                                values: q.options.map((opt) => ({ stringValue: opt })),
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
              },
            }],
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
        next: (response) => {
          console.log('New document created with quiz:', response);
        },
        error: (error) => {
          console.error('Error creating document:', error);
          this.showAlert();
          this.router.navigate(['login']);
        },
        complete: () => {
          alert('Quiz saved successfully');
          this.router.navigateByUrl('/');
          this.quizState.clearQuiz();
        },
      });
  },
});
}
}
