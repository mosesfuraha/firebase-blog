import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isModalOpen = false;

  openCreateBlogModal(): void {
    this.isModalOpen = true;
  }

  closeCreateBlogModal(): void {
    this.isModalOpen = false;
  }
}
