import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { quizExitGuardTsGuard } from './quiz-exit.guard.ts.guard';

describe('quizExitGuardTsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => quizExitGuardTsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
