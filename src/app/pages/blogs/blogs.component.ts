import { Component } from '@angular/core';
import { BlogService } from '../../core/services/blog.service';
import { Blog } from '../../models/common.model';
import { AuthService } from '../../auth/auth.service';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css'],
})
export class BlogsComponent {
  blogs: Blog[] = [];
  showSingleBlog: boolean = false;
  selectedBlog: Blog | null = null;
  showOptions: boolean = false;
  isEditMode: boolean = false;
  blogToEdit: Blog | null = null;
  loading = true;

  constructor(
    private blogService: BlogService,
    private authService: AuthService,
    private analytics: AngularFireAnalytics
  ) {}

  ngOnInit(): void {
    this.blogService.getAllBlogs().subscribe({
      next: (data) => {
        this.blogs = data;
        this.loading = false;

        this.analytics.logEvent('view_all_blogs', {
          num_blogs: data.length,
        });
      },
      error: (err) => {
        console.error('Error fetching blogs:', err);
        this.loading = false;
      },
    });
  }

  showBlogDetails(blog: Blog): void {
    this.selectedBlog = blog;
    this.showSingleBlog = true;

    this.analytics.logEvent('view_blog', {
      blog_id: blog.id,
      blog_title: blog.title,
      author_id: blog.authorId,
    });
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
    this.authService
      .getCurrentUser()
      .pipe(take(1))
      .subscribe((user) => {
        if (user && user.uid === blog.authorId) {
          this.isEditMode = true;
          this.blogToEdit = blog;
          this.openCreateModal(blog);
          this.showOptions = false;

          this.analytics.logEvent('edit_blog', {
            blog_id: blog.id,
            blog_title: blog.title,
            author_id: blog.authorId,
          });
        } else {
          Toastify({
            text: 'You can only edit blogs you created.',
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

  deleteBlog(blog: Blog): void {
    this.authService
      .getCurrentUser()
      .pipe(take(1))
      .subscribe((user) => {
        if (user && user.uid === blog.authorId) {
          this.blogService
            .deleteBlog(blog.id)
            .then(() => {
              console.log('Blog deleted successfully');
              this.blogs = this.blogs.filter((b) => b.id !== blog.id);
              this.showOptions = false;

              // Log the event for deleting a blog
              this.analytics.logEvent('delete_blog', {
                blog_id: blog.id,
                blog_title: blog.title,
                author_id: blog.authorId,
              });

              Toastify({
                text: 'Blog deleted successfully.',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'right',
                stopOnFocus: true,
                style: {
                  background: '#28a745',
                },
              }).showToast();
            })
            .catch((error) => {
              console.error('Error deleting blog:', error);
            });
        } else {
          Toastify({
            text: 'You can only delete blogs you created.',
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

  openCreateModal(blog: Blog | null = null): void {}

  handleBlogSubmit(blog: Blog): void {
    this.authService
      .isAuthenticated()
      .pipe(take(1))
      .subscribe((isLoggedIn) => {
        if (isLoggedIn) {
          if (this.isEditMode && this.blogToEdit) {
            this.blogService
              .updateBlog(this.blogToEdit.id, blog)
              .then(() => {
                console.log('Blog updated successfully');
                this.blogToEdit = null;
                this.isEditMode = false;

                // Log the event for updating a blog
                this.analytics.logEvent('update_blog', {
                  blog_id: blog.id,
                  blog_title: blog.title,
                  author_id: blog.authorId,
                });

                Toastify({
                  text: 'Blog updated successfully.',
                  duration: 3000,
                  close: true,
                  gravity: 'top',
                  position: 'right',
                  stopOnFocus: true,
                  style: {
                    background: '#28a745',
                  },
                }).showToast();
              })
              .catch((error) => {
                console.error('Error updating blog:', error);
              });
          } else {
            this.blogService.addBlog(blog).then(() => {
              console.log('Blog created successfully');

              // Log the event for creating a new blog
              this.analytics.logEvent('create_blog', {
                blog_id: blog.id,
                blog_title: blog.title,
                author_id: blog.authorId,
              });

              Toastify({
                text: 'Blog created successfully.',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'right',
                stopOnFocus: true,
                style: {
                  background: '#28a745',
                },
              }).showToast();
            });
          }
        } else {
          Toastify({
            text: 'Please sign in to create or update a blog.',
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
}
