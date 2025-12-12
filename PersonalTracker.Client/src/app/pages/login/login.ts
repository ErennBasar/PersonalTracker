import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs'; // Giriş/Kayıt geçişi için
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import { LoginRequest, RegisterRequest } from '../../models/auth';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatSnackBarModule,
    MatSelectModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  // Giriş ve Kayıt verilerini tutacak objeler
  loginData : LoginRequest = { username: '', password: '' };
  registerData : RegisterRequest = { username: '', password: '', gender: '' };

  genderOptions = [
    { value: 'he', viewValue: 'he' },
    { value: 'she', viewValue: 'she' },
    { value: 'it', viewValue: 'it' },
    { value: 'him', viewValue: 'him' },
    { value: 'her', viewValue: 'her' },
    { value: 'they', viewValue: 'they' },
    { value: 'them', viewValue: 'them' },
    { value: 'he/she', viewValue: 'he/she' },
    { value: 'him/her', viewValue: 'him/her' },
    { value: 'he/she/it', viewValue: 'he/she/it' },
    { value: 'they/them', viewValue: 'they/them' },
    { value: 'lpgtQ++', viewValue: 'lpgtQ++' },
    { value: 'Aug A2 fully automatic', viewValue: 'Aug A2 fully automatic' },
    { value: 'Apache attack helicopter', viewValue: 'Apache attack helicopter' },
    { value: 'M4 silicon chip', viewValue: 'M4 silicon chip' },
    { value: 'RTX 5090', viewValue: 'RTX 5090' },
    { value: 'Redmi note 8 pro', viewValue: 'Redmi note 8 pro' },
    { value: 'siklafon', viewValue: 'siklafon' }
  ];
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onLogin() {

    if (!this.loginData.username || !this.loginData.password) {
      this.snackBar.open('Lütfen bilgileri doldurun', 'Kapat', { duration: 2000 });
      return;
    }

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        this.snackBar.open('Giriş Başarılı!', 'Tamam', { duration: 3000 });
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        this.snackBar.open('Giriş Başarısız: ' + err.error, 'Kapat', { duration: 3000 });
      }
    });
  }

  onRegister() {

    if (!this.registerData.username || !this.registerData.password || !this.registerData.gender) {
      this.snackBar.open('Lütfen tüm alanları doldurun', 'Kapat', { duration: 2000 });
      return;
    }

    this.authService.register(this.registerData).subscribe({
      next: (res) => {
        this.snackBar.open('Kayıt Başarılı! Şimdi giriş yapabilirsiniz.', 'Tamam', { duration: 3000 });
        // Belki burada otomatik login sekmesine geçiş yapılabilir
      },
      error: (err) => {
        const msg = typeof err.error === 'string' ? err.error : 'Kayıt başarısız oldu.';
        this.snackBar.open(msg, 'Kapat', { duration: 3000 });
      }
    });
  }
}
