import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../application/auth.service';

/**
 * Interceptor que añade el token de autenticación (si existe)
 * a todas las peticiones HTTP que salgan de la app.
 *
 * Por ahora no usamos JWT real, pero dejamos la estructura lista.
 */
export const iamInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const user = auth.currentUser();

  // Si el usuario está logueado, añadimos un header simulado
  if (user) {
    const cloned = req.clone({
      setHeaders: {
        'X-User-Id': user.id.toString(),
        'X-User-Role': user.role
      }
    });
    return next(cloned);
  }

  return next(req);
};
