import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { MainLayout } from './layout/main-layout/main-layout'

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'tasks', component: MainLayout },
  { path: '**', redirectTo: 'login' }
];
