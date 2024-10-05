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
  isMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

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
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
