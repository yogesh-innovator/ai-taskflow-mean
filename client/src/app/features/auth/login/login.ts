import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, pipe } from 'rxjs';
import { AuthService } from '../../../core/services/auth';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  constructor(private router: Router, private autheService: AuthService) {

  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;
    this.loading = true;
    this.error = null;

    this.autheService.login({
      email: this.email,
      password: this.password,
    }).pipe(finalize(() => this.loading = false)).subscribe({
      next: (res: any) => {
        this.autheService.setSession(res);
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.error(err);
        this.error =
          err?.error?.message || 'Login failed. Please check your credentials.';
      },
    });
  }
}