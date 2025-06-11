import { Component } from '@angular/core';
import { FAQComponent } from '../components/faq/faq.component';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/ai-api.service';
import { CommonModule } from '@angular/common';
import { QuizResponse } from '../../interfaces/quiz-response';
import { Router } from '@angular/router';
import { QuizStateService } from '../../services/quiz-state.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FAQComponent, FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  quizTopic!: string;
  quizLevel: string = 'easy';
  response: string = '';
  isLoading = false;
  questions!: QuizResponse;
  numberOfQuestions: number = 5;
  constructor(
    private GeminiService: GeminiService,
    private router: Router,
    private quizState: QuizStateService
  ) {}

  sendMessage() {
    this.isLoading = true;

    const userMessage = `
    Generate a quiz on the topic "${this.quizTopic}" at the "${this.quizLevel}" level. Follow these requirements strictly:
    1. **Validation**:  
    - If the topic is invalid (non-academic, unrecognized, or nonsensical), return null without explanation.  
    - Only accept difficulty levels: beginner, intermediate, or advanced.  

    2. **Format**:
    Return a well-structured json matching this TypeScript interface:  
    interface Quiz {
      topic: string;
      level: string;
      questions: QuizQuestion[];
    }
    interface QuizQuestion {
      id: string;          // Unique UUID or short hash
      question: string;    // Clear, conceptually focused
      options: string[];   // Exactly 4 distinct choices
      correctAnswer: string; // Must match one option exactly
    } 
    return only ${this.numberOfQuestions} questions and only
    return json only that can be parsed if there is no input 
    for the title generate a random quiz with a title descriping the random topic`;

    this.GeminiService.getChatCompletion(userMessage).subscribe({
      next: (res) => {
        let resText = res.candidates[0].content.parts[0].text;
        let cleanedJson = resText.replace(/```json|```/g, '').trim();
        const quizData: QuizResponse = JSON.parse(cleanedJson);
        this.quizState.setQuiz(quizData);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API error:', err);
        this.response = 'Error fetching response';
        this.isLoading = false;
      },
      complete: () => {
        this.router.navigateByUrl('/questions');
      },
    });
  }
}
