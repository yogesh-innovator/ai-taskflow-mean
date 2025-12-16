import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth';

interface NavItem {
  label: string;
  path: string;
  roles?: string[]; // roles allowed to see this
}


@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {

  constructor(public authService: AuthService) {

  }

  navItems: NavItem[] = [
    {
      label: 'Dashboard', path: '/dashboard',
      roles: ['admin', 'manager', 'user']
    },
    { label: 'Admin Panel', path: '/admin', roles: ['admin'] }
  ]

}
