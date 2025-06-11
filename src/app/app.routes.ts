import { Routes } from '@angular/router';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

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
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'questions',
        loadComponent: () =>
          import('./pages/questions/questions.component').then((c) => {
            return c.QuestionsComponent;
          }),
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
        path: 'test',
        loadComponent: () =>
          import('./pages/test/test.component').then(
            (c) => c.TestComponent
          ),
      },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
