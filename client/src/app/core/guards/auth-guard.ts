import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth";

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isAuthenticated()){
    return true;
  }


  // If we have token but no user loaded, we still allow for now
  const token = authService.getAccessToken();
  if(token){
    return true;
  }

  router.navigate(['/login']);
  return false;
}