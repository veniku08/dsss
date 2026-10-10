import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../application/auth.service';

/**
 * Guard que verifica si el usuario está logueado.
 * Si no lo está, redirige a /login.
 *
 * Uso en rutas:  canActivate: [authGuard]
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

/**
 * Guard que verifica si el usuario tiene un rol específico.
 *
 * Uso en rutas:  canActivate: [roleGuard(['FLEET_MANAGER'])]
 */
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const role = auth.userRole();

    // Si el rol está permitido, deja pasar
    if (role && allowedRoles.includes(role)) {
      return true;
    }

    // Si está logueado pero no tiene permiso, redirige a su home según rol
    const user = auth.currentUser();
    if (user) {
      auth.redirectByRole(user);
    } else {
      router.navigate(['/login']);
    }
    return false;
  };
};
