import { Routes } from '@angular/router';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuardGuard } from './guards/auth-guard.guard';
import { quizExitGuard } from './guards/quiz-exit.guard.ts.guard';
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.component').then((c) => {
            return c.HomeComponent;
          }),
        canActivate: [authGuardGuard],
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'questions',
        loadComponent: () =>
          import('./pages/questions/questions.component').then(
            (c) => c.QuestionsComponent
          ),
        canActivate: [authGuardGuard],
        canDeactivate: [quizExitGuard],
      },

      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login.component').then((c) => c.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/register/register.component').then(
            (c) => c.RegisterComponent
          ),
      },
      {
        path: 'aboutus',
        loadComponent: () =>
          import('./pages/about-us/about-us.component').then(
            (c) => c.AboutUsComponent
          ),
        canActivate: [authGuardGuard],
      },
      {
        path: 'user/:id',
        loadComponent: () =>
          import('./pages/user/user.component').then((c) => c.UserComponent),
        canActivate: [authGuardGuard],
      },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
