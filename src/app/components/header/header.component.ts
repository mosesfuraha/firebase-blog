import { Component } from '@angular/core';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { User } from '@angular/fire/auth'; // If using Firebase Auth

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isModalOpen = false;
  loggedInUser: User | null = null;
  isDropdownOpen = false;
  isProfileVisible = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.loggedInUser = user;
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

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleProfile(): void {
    this.isProfileVisible = !this.isProfileVisible;
  }

  navigateToAuth(): void {
    this.router.navigate(['auth']);
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.loggedInUser = null;
      this.isDropdownOpen = false;
      this.isProfileVisible = false;
      this.router.navigate(['auth']);
    });
  }

  getInitials(user: User): string {
    const name = user.displayName || user.email || '';
    const [firstName, lastName] = name.split(' ');
    return `${firstName?.charAt(0) || ''}${
      lastName?.charAt(0) || ''
    }`.toUpperCase();
  }
}
