import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

type UserRole = 'household' | 'helper' | 'admin' | 'user' | '';

function readRole(): UserRole {
  const raw = localStorage.getItem('careNestAuth');
  if (!raw) return '';
  try {
    const parsed = JSON.parse(raw) as { role?: UserRole };
    return parsed.role || '';
  } catch {
    return '';
  }
}

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('careNestToken');
  if (!token) {
    void router.navigateByUrl('/auth/login');
    return false;
  }
  return true;
};

export function roleGuard(...roles: UserRole[]): CanActivateFn {
  return () => {
    const router = inject(Router);
    const role = readRole();
    if (!role || !roles.includes(role)) {
      void router.navigateByUrl('/');
      return false;
    }
    return true;
  };
}
