import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Blog } from '../../models/common.model';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private blogUrl = 'data.json';

  constructor(private http: HttpClient) {}

  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.blogUrl);
  }
}
