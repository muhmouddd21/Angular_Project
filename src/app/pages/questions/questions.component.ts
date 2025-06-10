import { Component } from '@angular/core';
import { QuizResponse } from '../../interfaces/quiz-response';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizQuestion } from '../../interfaces/quiz-question';
import { Router } from '@angular/router';
@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss',
})
export class QuestionsComponent {
  answerStatus: (string | null)[] = [];
  selectedOption!: string;
  wrongAnswer: QuizQuestion[] = [];
  grade: number = 0;
  constructor(private router: Router) {}
  questionsForm: QuizResponse = {
    topic: 'JavaScript',
    level: 'beginner',
    questions: [
      {
        id: 'a1b2c3',
        question: 'What is JavaScript primarily used for?',
        options: [
          'Styling web pages',
          'Adding interactivity to websites',
          'Defining database schemas',
          'Creating 3D graphics',
        ],
        correctAnswer: 'Adding interactivity to websites',
      },
      {
        id: 'd4e5f6',
        question: 'Which keyword is used to declare a variable in JavaScript?',
        options: ['var', 'def', 'variable', 'const'],
        correctAnswer: 'var',
      },
      {
        id: 'g7h8i9',
        question: "What does the 'typeof' operator return for a string value?",
        options: ['number', 'string', 'boolean', 'object'],
        correctAnswer: 'string',
      },
      {
        id: 'j0k1l2',
        question: "Which method outputs a message to the browser's console?",
        options: ['console.log()', 'print()', 'alert()', 'document.write()'],
        correctAnswer: 'console.log()',
      },
      {
        id: 'm3n4o5',
        question: "What is the result of `3 === '3'` in JavaScript?",
        options: ['true', 'false', 'undefined', 'SyntaxError'],
        correctAnswer: 'false',
      },
    ],
  };
  ngOnInit() {
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
}
