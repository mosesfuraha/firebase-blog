import { Component } from '@angular/core';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isModalOpen = false;
  loggedInUser: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.loggedInUser = user.displayName || user.email;
      }
    });
  }

  openCreateBlogModal(): void {
    this.authService.isAuthenticated().subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.isModalOpen = true;
      } else {
        Toastify({
          text: 'Please sign in to create a blog.',
          duration: 3000,
          close: true,
          gravity: 'top',
          position: 'right',
          stopOnFocus: true,
          style: {
            background: '#ff5a5f',
          },
        }).showToast();
      }
    });
  }

  closeCreateBlogModal(): void {
    this.isModalOpen = false;
  }

  navigateToAuth(): void {
    this.router.navigate(['auth']);
  }

  navigateToProfile(): void {
    this.router.navigate(['profile']);
  }

  getInitials(name: string): string {
    const [firstName, lastName] = name.split(' ');
    return `${firstName?.charAt(0) || ''}${
      lastName?.charAt(0) || ''
    }`.toUpperCase();
  }
}
