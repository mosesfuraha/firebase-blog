import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Blog } from '../../models/common.model';

@Component({
  selector: 'app-single-blog',
  templateUrl: './single-blog.component.html',
  styleUrls: ['./single-blog.component.css'],
})
export class SingleBlogComponent {
  @Input() blog: Blog | null = null;

  @Output() backToBlogs = new EventEmitter<void>();

  newComment: string = '';
  liked = false;
  disliked = false;

  comments = [
    {
      author: 'John Doe',
      content: 'Great post! Very informative.',
      date: new Date(),
    },
    {
      author: 'Jane Smith',
      content: 'Thanks for sharing!',
      date: new Date(),
    },
  ];

  constructor() {}

  onBack(): void {
    this.backToBlogs.emit();
  }

  toggleLike(): void {
    this.liked = !this.liked;
    if (this.liked) {
      this.disliked = false; // Reset dislike if liked
    }
  }

  toggleDislike(): void {
    this.disliked = !this.disliked;
    if (this.disliked) {
      this.liked = false; // Reset like if disliked
    }
  }

  addComment(): void {
    if (this.newComment.trim()) {
      this.comments.push({
        author: 'Anonymous', // You can replace this with dynamic author data
        content: this.newComment,
        date: new Date(),
      });
      this.newComment = ''; // Clear the comment input after submission
    }
  }
}
