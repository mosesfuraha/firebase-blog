import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Blog } from '../../models/common.model';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly blogCollection: AngularFirestoreCollection<Blog>;
  private readonly blogCollectionPath = 'blogs';

  constructor(private firestore: AngularFirestore) {
    this.blogCollection = firestore.collection<Blog>(this.blogCollectionPath);
  }

  getAllBlogs(): Observable<Blog[]> {
    return this.blogCollection.valueChanges({ idField: 'id' });
  }

  getBlog(id: string): Observable<Blog | undefined> {
    return this.blogCollection.doc<Blog>(id).valueChanges();
  }

  addBlog(blog: Blog): Promise<void> {
    const id = this.firestore.createId();
    return this.blogCollection.doc(id).set({ ...blog, id });
  }

  updateBlog(id: string, blog: Blog): Promise<void> {
    return this.blogCollection.doc(id).update(blog);
  }

  deleteBlog(id: string): Promise<void> {
    return this.blogCollection.doc(id).delete();
  }
}
