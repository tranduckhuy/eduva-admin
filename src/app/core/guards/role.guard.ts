import { inject } from '@angular/core';

import { Router, CanMatchFn } from '@angular/router';

import { UserService } from '../../shared/services/api/user/user.service';

import {
  type UserRoleType,
  UserRoles,
} from '../../shared/constants/user-roles.constant';

export const roleGuard: CanMatchFn = route => {
  const userService = inject(UserService);
  const router = inject(Router);

  const expectedRoles = route.data?.['roles'] as UserRoleType[] | undefined;
  const user = userService.currentUser();

  const isLoggedIn =
    !!user && Array.isArray(user.roles) && user.roles.length > 0;
  if (!isLoggedIn) {
    router.navigateByUrl('/auth/login');
    return false;
  }

  const hasExpectedRole = expectedRoles?.some(role =>
    user.roles.includes(role)
  );

  // ? If the route data has the required role(s), allow access to the route
  if (hasExpectedRole) return true;

  // ? If the user does NOT have the required role(s)
  // ? Check if they are SystemAdmin then redirect to dashboard
  // ? Otherwise, redirect "Unauthorized" page
  if (user.roles.includes(UserRoles.SYSTEM_ADMIN)) {
    router.navigate(['/admin']);
  } else {
    router.navigate(['/errors/403']);
  }

  return false;
};
