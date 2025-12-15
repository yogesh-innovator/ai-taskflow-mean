import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth';


@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  name = '';
  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {

  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.loading = true;
    this.error = null;

    this.authService.register({
      name:this.name,
      email: this.email,
      password: this.password
    }).pipe(finalize(() => this.loading = false)).subscribe({
      next: (res:any) => {
        this.authService.setSession(res);
        this.router.navigate(['/dashboard']);
      },
      error: (err:any) => {
        console.error(err);
        this.error= 
        err?.error?.message || 'Registration failed. Please try again'
      }
    });
  }

}
