import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth-guard";

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(
            (m) => m.Login
        )
    },

    {
        path: 'register',
        loadComponent: () =>
            import('./features/auth/register/register').then(
                (m) => m.Register
            )
    },
    {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/dashboard/dashboard').then(
                (m) => m.Dashboard
            )
    },

    // Admin example route
    {
        path: 'admin',
        canActivate: [authGuard],
        data: { roles: ['admin'] }, // We'll enforce role guard next
        loadComponent: () =>
            import('./features/admin/admin').then(
                (m) => m.Admin
            )
        },


    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
        path: '**',
        redirectTo: 'login'
    }


]