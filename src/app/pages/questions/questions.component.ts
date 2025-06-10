import { Component } from '@angular/core';
import { QuizResponse } from '../../interfaces/quiz-response';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss',
})
export class QuestionsComponent {
  userAnswers: string[] = [];
  answerStatus: ('correct' | 'incorrect' | null)[] = [];

  questions: QuizResponse = {
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
    const total = this.questions.questions.length;
    this.userAnswers = new Array(total).fill('');
    this.answerStatus = new Array(total).fill(null);
  }

  checkAnswer(index: number, correctAnswer: string) {
    const selected = this.userAnswers[index];
    if (selected === correctAnswer) {
      this.answerStatus[index] = 'correct';
    } else {
      this.answerStatus[index] = 'incorrect';
    }
  }
}
