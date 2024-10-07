import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../../core/services/blog.service';
import { Blog } from '../../models/common.model';
import { AuthService } from '../../auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.css'],
})
export class CreateBlogComponent implements OnInit {
  @Input() blogToEdit: Blog | null = null;
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() submitBlog: EventEmitter<Blog> = new EventEmitter();

  blogForm: FormGroup;
  isEditMode: boolean = false;
  currentUser: any = null;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private authService: AuthService
  ) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      imageUrl: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      category: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService
      .getCurrentUser()
      .pipe(take(1))
      .subscribe((user) => {
        this.currentUser = user;
      });

    if (this.blogToEdit) {
      this.isEditMode = true;
      this.blogForm.patchValue(this.blogToEdit);
    }
  }

  close(): void {
    this.closeModal.emit();
  }

  submit(): void {
    const blog: Blog = this.blogForm.value;
    blog.date = new Date().toISOString();

    if (this.currentUser) {
      blog.authorName = this.currentUser.displayName || 'Anonymous';
      blog.authorId = this.currentUser.uid;
    }

    if (this.isEditMode && this.blogToEdit) {
      this.blogService
        .updateBlog(this.blogToEdit.id, blog)
        .then(() => {
          console.log('Blog updated successfully');
          this.submitBlog.emit(blog);
          this.close();
        })
        .catch((error) => {
          console.error('Error updating blog:', error);
        });
    } else {
      this.blogService
        .addBlog(blog)
        .then(() => {
          console.log('Blog added successfully');
          this.submitBlog.emit(blog);
          this.close();
        })
        .catch((error) => {
          console.error('Error adding blog:', error);
        });
    }
  }
}
