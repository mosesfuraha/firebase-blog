import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../../core/services/blog.service';
import { Blog } from '../../models/common.model';

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.css'],
})
export class CreateBlogComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter();

  blogForm: FormGroup;

  constructor(private fb: FormBuilder, private blogService: BlogService) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      imageUrl: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      category: ['', Validators.required],
      date: ['', Validators.required],
      authorName: ['', Validators.required],
      authorId: ['', Validators.required],
    });
  }

  close(): void {
    this.closeModal.emit();
  }

  submit(): void {
    if (this.blogForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    const newBlog: Blog = this.blogForm.value;
    newBlog.date = new Date().toISOString();

    this.blogService
      .addBlog(newBlog)
      .then(() => {
        console.log('Blog added successfully');
        this.close();
      })
      .catch((error) => {
        console.error('Error adding blog:', error);
      });
  }
}
