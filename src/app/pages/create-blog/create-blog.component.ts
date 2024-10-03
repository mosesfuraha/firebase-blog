import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../../core/services/blog.service';
import { Blog } from '../../models/common.model';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Import Firebase Storage
import { finalize } from 'rxjs/operators'; // Import to handle completion of upload process

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.css'],
})
export class CreateBlogComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  blogForm: FormGroup;
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  imageUrl: string = ''; // Store the uploaded image URL

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private storage: AngularFireStorage // Inject AngularFireStorage
  ) {
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

  // // Handle file selection
  // onFileSelected(event: any): void {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     this.selectedFile = file;
  //     console.log('Selected file:', file);
  //     this.uploadFile(file);
  //   }
  // }

  // // Upload the selected file to Firebase Storage
  // uploadFile(file: File): void {
  //   const filePath = `blogs/${Date.now()}_${file.name}`; // Path to store the file
  //   const fileRef = this.storage.ref(filePath); // Reference to the file
  //   const task = this.storage.upload(filePath, file); // Upload task

  //   // Monitor upload progress
  //   task.percentageChanges().subscribe((progress) => {
  //     if (progress) {
  //       this.uploadProgress = progress;
  //       console.log('Upload progress:', progress);
  //     }
  //   });

  //   // Get download URL when upload completes
  //   task
  //     .snapshotChanges()
  //     .pipe(
  //       finalize(() => {
  //         fileRef.getDownloadURL().subscribe((url) => {
  //           console.log('File uploaded! Download URL:', url);
  //           this.blogForm.patchValue({ imageUrl: url }); // Set the image URL in the form
  //         });
  //       })
  //     )
  //     .subscribe();
  // }

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
