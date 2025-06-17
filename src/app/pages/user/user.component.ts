import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GetDataService } from '../../services/get-data.service';
import { QuizStateService } from '../../services/quiz-state.service';
import { AuthService } from '../../services/auth.service';
import { fireStoreRestApi } from '../../firebaseUrl';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  quizGrades: any[] = [];
  email: string = '';

  searchText: string = '';
  filterLevel: string = '';
  sortKey: string = 'topic';
  sortOrder: 'asc' | 'desc' = 'asc';

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

  get uniqueLevels(): string[] {
    return [...new Set(this.quizGrades.map((g) => g.level))];
  }

  loadUserQuizData(): void {
    this.getData
      .getRequest(fireStoreRestApi + this.authService.Uid, {
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
              wrongAnswers: wrongAnswers.map((q: any) => ({
                id: q.mapValue.fields.id.stringValue,
                question: q.mapValue.fields.question.stringValue,
                options: q.mapValue.fields.options.arrayValue.values.map(
                  (opt: any) => opt.stringValue
                ),
                correctAnswer: q.mapValue.fields.correctAnswer.stringValue,
              })),
              originalData: v,
            };
          });
        },
        error: (err) => {
          console.error('Error loading quiz data:', err);
        },
      });
  }

  filteredAndSortedGrades(): any[] {
    let list = this.quizGrades;

    if (this.searchText) {
      list = list.filter((g) =>
        g.topic.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    // Filter
    if (this.filterLevel) {
      list = list.filter((g) => g.level === this.filterLevel);
    }

    // Sort
    list = [...list].sort((a, b) => {
      let aVal, bVal;

      if (this.sortKey === 'grade') {
        aVal = a.numberOfQuestions - a.numberOfWrongAnswers;
        bVal = b.numberOfQuestions - b.numberOfWrongAnswers;
      } else {
        aVal = a[this.sortKey].toLowerCase?.() ?? '';
        bVal = b[this.sortKey].toLowerCase?.() ?? '';
      }

      const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    return list;
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }
  isPerfectScore(grade: any): boolean {
  return ((grade.numberOfQuestions - grade.numberOfWrongAnswers) / grade.numberOfQuestions) === 1;
}

  requiz(grade: any): void {
    this.quizState.setQuiz({
      topic: grade.topic,
      level: grade.level,
      questions: grade.questions,
    });
    this.router.navigateByUrl('/questions');
  }

  retryWrongAnswers(grade: any): void {
    if (grade.wrongAnswers.length === 0) {
      alert('No wrong answers to retry.');
      return;
    }

    this.quizState.setQuiz({
      topic: grade.topic,
      level: grade.level,
      questions: grade.wrongAnswers,
    });
    this.router.navigateByUrl('/questions');
  }

  deleteQuiz(index: number): void {
    if (!confirm('Are you sure you want to delete this quiz?')) return;

    this.quizGrades.splice(index, 1);
    const newQuizArray = this.quizGrades.map((g) => g.originalData);

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
      .patchRequest(fireStoreRestApi + this.authService.Uid, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.idtoken}`,
        },
      })
      .subscribe({
        next: () => console.log('Quiz deleted successfully.'),
        error: (err) => console.error('Failed to delete quiz:', err),
      });
  }
}
