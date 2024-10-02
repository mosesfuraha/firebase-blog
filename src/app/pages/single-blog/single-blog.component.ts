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

  constructor() {}

  onBack(): void {
    this.backToBlogs.emit(); 
  }
}
