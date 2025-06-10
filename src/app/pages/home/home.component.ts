// src/app/home/home.component.ts
import { Component } from '@angular/core';
import { FAQComponent } from '../components/faq/faq.component';
import { FormsModule } from '@angular/forms';
import { OpenrouterService } from '../../services/ai-api.service';
import { CommonModule } from '@angular/common';
import { QuizResponse } from '../../interfaces/quiz-response';
import { Router } from '@angular/router';

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

  constructor(
    private openrouterService: OpenrouterService,
    private router: Router
  ) {}

  sendMessage() {
    this.isLoading = true;

    const userMessage = `
    Generate a quiz on the topic "${this.quizTopic}" at the "${this.quizLevel}" level. Follow these requirements strictly:
    1. **Validation**:  
    - If the topic is invalid (non-academic, unrecognized, or nonsensical), return null without explanation.  
    - Only accept difficulty levels: beginner, intermediate, or advanced.  

    2. **Format**:
    Return a well-structured object matching this TypeScript interface:  
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
    return only 5 questions for now just for testing`;

    this.openrouterService.sendMessage(userMessage).subscribe({
      next: (res) => {
        this.response = res.choices?.[0]?.message?.content || 'No response';
        console.log(this.response);
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
