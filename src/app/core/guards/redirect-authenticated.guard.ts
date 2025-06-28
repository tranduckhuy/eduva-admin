import { inject } from '@angular/core';
import { Router, CanMatchFn } from '@angular/router';

import { AuthService } from '../auth/services/auth.service';
import { UserService } from '../../shared/services/api/user/user.service';

export const redirectAuthenticatedGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const userService = inject(UserService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();
  const user = userService.currentUser();

  if (isLoggedIn && user) {
    router.navigate(['/admin']);
    return false;
  }

  return true;
};
