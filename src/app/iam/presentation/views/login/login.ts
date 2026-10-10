import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../application/auth.service';
import { Credentials } from '../../../domain/model/credentials.entity';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],  // ← Quitado TranslatePipe
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  credentials: Credentials = new Credentials();
  loading = signal(false);
  errorMessage = signal('');

  constructor(private auth: AuthService) {}

  onSubmit(form: any): void {
    if (form.invalid) return;
    this.loading.set(true);
    this.errorMessage.set('');

    this.auth.login(this.credentials).subscribe({
      next: (user) => {
        this.loading.set(false);
        this.auth.redirectByRole(user);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Correo o contraseña incorrectos');
      }
    });
  }

  fillDemo(role: 'DRIVER' | 'FLEET_MANAGER'): void {
    if (role === 'DRIVER') {
      this.credentials.email = 'conductor@motus.com';
      this.credentials.password = '123456';
    } else {
      this.credentials.email = 'jefe@motus.com';
      this.credentials.password = '123456';
    }
  }
}
