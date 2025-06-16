import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GetDataService } from '../../services/get-data.service';
import { QuizStateService } from '../../services/quiz-state.service';
import { AuthService } from '../../services/auth.service';
import { fireStoreRestApi } from '../../firebaseUrl';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  quizGrades: {
    topic: string;
    level: string;
    numberOfQuestions: number;
    numberOfWrongAnswers: number;
    quizTime: string;
    questions: any[];
    originalData: any;
  }[] = [];

  email: string = '';

  constructor(
    private getData: GetDataService,
    private authService: AuthService,
    private quizState: QuizStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.email = this.authService.email;
    this.loadUserQuizData();
  }

  loadUserQuizData(): void {
    this.getData
      .getRequest(fireStoreRestApi.concat(`${this.authService.Uid}`), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.idtoken}`,
        },
      })
      .subscribe({
        next: (response) => {
          let parsedResponse: any;

          if (response instanceof ArrayBuffer) {
            const textDecoder = new TextDecoder();
            const responseText = textDecoder.decode(response);
            parsedResponse = JSON.parse(responseText);
          } else {
            parsedResponse = response;
          }

          const values =
            parsedResponse?.fields?.quizzes?.arrayValue?.values || [];

          this.quizGrades = values.map((v: any) => {
            const fields = v.mapValue.fields;
            const questions = fields.questions?.arrayValue?.values || [];
            const wrongAnswers = fields.wrongAnswers?.arrayValue?.values || [];

            return {
              topic: fields.topic.stringValue,
              level: fields.level.stringValue,
              numberOfQuestions: questions.length,
              numberOfWrongAnswers: wrongAnswers.length,
              quizTime: new Date(
                fields.quizTime.timestampValue
              ).toLocaleString(),
              questions: questions.map((q: any) => ({
                id: q.mapValue.fields.id.stringValue,
                question: q.mapValue.fields.question.stringValue,
                options: q.mapValue.fields.options.arrayValue.values.map(
                  (opt: any) => opt.stringValue
                ),
                correctAnswer: q.mapValue.fields.correctAnswer.stringValue,
              })),
              originalData: v, // Save original to help with deletion
            };
          });
        },
        error: (err) => {
          console.error('Error loading quiz data:', err);
        },
      });
  }

  requiz(grade: any): void {
    const quizForm = {
      topic: grade.topic,
      level: grade.level,
      questions: grade.questions,
    };

    this.quizState.setQuiz(quizForm);
    this.router.navigateByUrl('/questions');
  }

  deleteQuiz(index: number): void {
    if (!confirm('Are you sure you want to delete this quiz?')) return;

    this.quizGrades.splice(index, 1);

    const newQuizArray = this.quizGrades.map((grade) => grade.originalData);

    const body = {
      fields: {
        quizzes: {
          arrayValue: {
            values: newQuizArray,
          },
        },
      },
    };

    this.getData
      .patchRequest(fireStoreRestApi.concat(`${this.authService.Uid}`), body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.idtoken}`,
        },
      })
      .subscribe({
        next: () => {
          console.log('Quiz deleted successfully.');
        },
        error: (err) => {
          console.error('Failed to delete quiz:', err);
        },
      });
  }
}

// quizGrades: QuizGrade[] = [
//   {
//     id: 1,
//     quizName: 'Introduction to Programming',
//     subject: 'Computer Science',
//     score: 85,
//     maxScore: 100,
//     percentage: 85,
//     date: new Date('2024-01-15'),
//     status: 'good'
//   },
//   {
//     id: 2,
//     quizName: 'Basic Mathematics',
//     subject: 'Mathematics',
//     score: 92,
//     maxScore: 100,
//     percentage: 92,
//     date: new Date('2024-01-20'),
//     status: 'excellent'
//   },
//   {
//     id: 3,
//     quizName: 'World History Quiz',
//     subject: 'History',
//     score: 78,
//     maxScore: 100,
//     percentage: 78,
//     date: new Date('2024-01-25'),
//     status: 'average'
//   },
//   {
//     id: 4,
//     quizName: 'English Grammar',
//     subject: 'English',
//     score: 88,
//     maxScore: 100,
//     percentage: 88,
//     date: new Date('2024-02-01'),
//     status: 'good'
//   },
//   {
//     id: 5,
//     quizName: 'Physics Fundamentals',
//     subject: 'Physics',
//     score: 95,
//     maxScore: 100,
//     percentage: 95,
//     date: new Date('2024-02-05'),
//     status: 'excellent'
//   },
//   {
//     id: 6,
//     quizName: 'Chemistry Basics',
//     subject: 'Chemistry',
//     score: 72,
//     maxScore: 100,
//     percentage: 72,
//     date: new Date('2024-02-10'),
//     status: 'average'
//   },
//   {
//     id: 7,
//     quizName: 'Biology Test',
//     subject: 'Biology',
//     score: 65,
//     maxScore: 100,
//     percentage: 65,
//     date: new Date('2024-02-15'),
//     status: 'poor'
//   },
//   {
//     id: 8,
//     quizName: 'Advanced Programming',
//     subject: 'Computer Science',
//     score: 90,
//     maxScore: 100,
//     percentage: 90,
//     date: new Date('2024-02-20'),
//     status: 'excellent'
//   }
// ];

// averageScore: number = 0;
// highestScore: number = 0;
// passedQuizzes: number = 0;

// private calculateStats() {
//   const totalScore = this.quizGrades.reduce((sum, grade) => sum + grade.percentage, 0);
//   this.averageScore = Math.round(totalScore / this.quizGrades.length);
//   this.highestScore = Math.max(...this.quizGrades.map(grade => grade.percentage));
//   this.passedQuizzes = this.quizGrades.filter(grade => grade.percentage >= 70).length;
// }

// private getGradeStatus(percentage: number): 'excellent' | 'good' | 'average' | 'poor' {
//   if (percentage >= 90) return 'excellent';
//   if (percentage >= 80) return 'good';
//   if (percentage >= 70) return 'average';
//   return 'poor';
// }
