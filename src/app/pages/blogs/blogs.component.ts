import { Component } from '@angular/core';
import { BlogService } from '../../core/services/blog.service';
import { Blog } from '../../models/common.model';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css'],
})
export class BlogsComponent {
  blogs: Blog[] = [];
  showSingleBlog: boolean = false;
  selectedBlog: Blog | null = null;
  showOptions: boolean = false; // To track if dropdown is open

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

  toggleOptions(blog: Blog): void {
    if (this.selectedBlog === blog && this.showOptions) {
      this.showOptions = false;
    } else {
      this.selectedBlog = blog;
      this.showOptions = true;
    }
  }

  editBlog(blog: Blog): void {
    console.log('Editing blog:', blog);

    this.showOptions = false;
  }

  deleteBlog(blog: Blog): void {
    console.log('Deleting blog:', blog);

    if (blog.id) {
      this.blogService
        .deleteBlog(blog.id)
        .then(() => {
          console.log('Blog deleted successfully');

          this.blogs = this.blogs.filter((b) => b.id !== blog.id);
          this.showOptions = false;
        })
        .catch((error) => {
          console.error('Error deleting blog:', error);
        });
    } else {
      console.error('Blog ID not found, cannot delete blog');
    }
  }
}
