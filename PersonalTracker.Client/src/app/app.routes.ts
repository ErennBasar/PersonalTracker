import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { MainLayout } from './layout/main-layout/main-layout'

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', component: MainLayout }, // Ana sayfa (Şimdilik direkt açık, sonra koruma eklenecek)
  { path: '**', redirectTo: 'login' }
];
