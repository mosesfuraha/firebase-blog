import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Blog, Comment as BlogComment } from '../../models/common.model';
import { BlogService } from '../../core/services/blog.service';

import { FormControl } from '@angular/forms';
import { take } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { MetaService } from '../../core/meta.service';

@Component({
  selector: 'app-single-blog',
  templateUrl: './single-blog.component.html',
  styleUrls: ['./single-blog.component.css'],
})
export class SingleBlogComponent {
  @Input() blog: Blog | null = null;
  @Output() backToBlogs = new EventEmitter<void>();

  comments: BlogComment[] = [];
  newComment = new FormControl('');
  liked = false;
  disliked = false;
  loggedInUser: string | null = null;

  constructor(
    private blogService: BlogService,
    private authService: AuthService,
    private metaService: MetaService
  ) {}

  ngOnInit(): void {
    if (this.blog) {
      this.metaService.setMetaTags(
        this.blog.title,
        this.blog.description,
        this.blog.imageUrl
      );

      this.blogService
        .getCommentsForBlog(this.blog.id)
        .subscribe((comments) => {
          this.comments = comments;
        });
    }

    this.authService
      .getCurrentUser()
      .pipe(take(1))
      .subscribe((user) => {
        this.loggedInUser = user?.displayName || 'Anonymous';
      });
  }

  ngOnDestroy(): void {
    this.metaService.clearMetaTags();
  }

  onBack(): void {
    this.backToBlogs.emit();
  }

  toggleLike(): void {
    this.liked = !this.liked;
    if (this.liked) {
      this.disliked = false;
    }
  }

  toggleDislike(): void {
    this.disliked = !this.disliked;
    if (this.disliked) {
      this.liked = false;
    }
  }

  addComment(): void {
    if (this.newComment.valid && this.blog) {
      const { id: blogId } = this.blog;

      const comment: BlogComment = {
        authorName: this.loggedInUser || 'Anonymous',
        content: this.newComment.value,
        date: new Date().toISOString(),
        blogId: blogId,
      };

      this.blogService
        .addCommentToBlog(comment)
        .then(() => {
          this.newComment.reset();
          this.comments.push(comment);
        })
        .catch((error) => {
          console.error('Error adding comment:', error);
        });
    }
  }
}
