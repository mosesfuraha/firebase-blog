import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../core/services/blog.service';
import { Blog } from '../../models/common.model';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css'],
})
export class BlogsComponent implements OnInit {
  blogs: Blog[] = [];
  showSingleBlog: boolean = false;
  selectedBlog: Blog | null = null;

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

  showBlogDetails(blog: Blog): void {
    this.selectedBlog = blog;
    this.showSingleBlog = true;
  }

  backToBlogs(): void {
    this.showSingleBlog = false;
    this.selectedBlog = null;
  }
}
