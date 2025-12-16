import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth";

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const roles = route.data['roles'] as string[] | undefined;

  if (roles && !roles.includes(authService.user()?.role || '')) {
    router.navigate(['/dashboard']);
    return false;
  }

  // If we have token but no user loaded, we still allow for now
  const token = authService.getAccessToken();
  if (token) {
    return true;
  }

  // router.navigate(['/login']);
  // return false;

  return true;
}