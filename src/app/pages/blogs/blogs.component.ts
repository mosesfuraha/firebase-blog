import { Component } from '@angular/core';
import { BlogService } from '../../core/services/blog.service';
import { Blog } from '../../models/common.model';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.css',
})
export class BlogsComponent {
  blogs: Blog[] = [];

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getAllBlogs().subscribe({
      next: (data) => {
        this.blogs = data;
      },
      error: (err) => {
        console.error('Error fetching blogs:', err);
      },
    });
  }
}
