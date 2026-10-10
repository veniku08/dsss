import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
import { User } from '../domain/model/user.entity';
import { Credentials } from '../domain/model/credentials.entity';
import { AuthApiEndpoint } from '../infrastructure/auth-api-endpoint';

const STORAGE_KEY = 'motus_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Dependencias con inject() — más limpio que constructor
  private authApi = inject(AuthApiEndpoint);
  private router = inject(Router);

  // Signal privado con el usuario actual
  private currentUserSignal = signal<User | null>(this.loadFromStorage());

  // Signal público de solo lectura
  currentUser = this.currentUserSignal.asReadonly();

  // Computed: derivan del signal
  isLoggedIn = computed(() => this.currentUserSignal() !== null);
  userRole = computed(() => this.currentUserSignal()?.role ?? null);

  /**
   * Login: busca el usuario por email y password.
   */
  login(credentials: Credentials): Observable<User> {
    return this.authApi.findByCredentials(credentials.email, credentials.password).pipe(
      map(users => {
        if (users.length === 0) {
          throw new Error('Credenciales inválidas');
        }
        const user = new User();
        Object.assign(user, users[0]);
        return user;
      }),
      tap(user => {
        this.currentUserSignal.set(user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      })
    );
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem(STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  private loadFromStorage(): User | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const data = JSON.parse(raw);
      const user = new User();
      Object.assign(user, data);
      return user;
    } catch {
      return null;
    }
  }

  redirectByRole(user: User): void {
    if (user.role === 'DRIVER') {
      this.router.navigate(['/driver/dashboard']);
    } else if (user.role === 'FLEET_MANAGER') {
      this.router.navigate(['/fleet']);
    }
  }
}
