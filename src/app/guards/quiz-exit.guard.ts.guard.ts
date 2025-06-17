// src/app/guards/quiz-exit.guard.ts
import { CanDeactivateFn } from '@angular/router';
import { QuestionsComponent } from '../pages/questions/questions.component';

export const quizExitGuard: CanDeactivateFn<QuestionsComponent> = (
  component: QuestionsComponent
) => {
  return (
    component.isQuizSaved() ||
    confirm(
      'You have not finished or saved your quiz. Are you sure you want to leave?'
    )
  );
};
