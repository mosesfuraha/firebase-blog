import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  loggedInUser: User | null = null;
  isLoggingOut = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.loggedInUser = user;
    });
  }

  logout(): void {
    this.isLoggingOut = true;
    this.authService
      .logout()
      .then(() => {
        this.router.navigate(['auth']);
      })
      .catch((error: any) => {
        console.error('Logout error:', error);
      })
      .finally(() => {
        this.isLoggingOut = false;
      });
  }
}
