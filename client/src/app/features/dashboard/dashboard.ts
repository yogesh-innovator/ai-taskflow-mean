import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit{

  message = '';
  loading = false;
  error:string | null = null;

  constructor(
    private http: HttpClient,
    public authService: AuthService, private router: Router
  ){

  }

  ngOnInit(): void {
    
  }

  fetchProtectedMessage(){
    this.loading = true;
    this.error = null;

    this.http.get<{status:string;data:any}>(
      `${environment.apiBaseUrl}/protected/me`
    ).subscribe({
      next: (res) => {
        this.message = res.data?.message ?? 'Dashboard loaded';
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 
        'Failed to load protected data';
        this.loading = false;

        if(err.status === 401 || err.status === 403 ){
          this.authService.logout();
        }
      },
    });
  }

 logout() {
  this.authService.logout();
 }

  

}
