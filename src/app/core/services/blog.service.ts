import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { Blog, Comment as BlogComment } from '../../models/common.model';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly blogCollection: AngularFirestoreCollection<Blog>;
  private readonly blogCollectionPath = 'blogs';
  private readonly commentsCollection = 'comments';

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
  getCommentsForBlog(blogId: string): Observable<BlogComment[]> {
    return this.firestore
      .collection<BlogComment>(this.commentsCollection, (ref) =>
        ref.where('blogId', '==', blogId)
      )
      .valueChanges()
      .pipe(
        map((comments) => {
          return comments.map((comment) => ({
            ...comment,
            content: comment.content,
            authorName: comment.authorName,
            date: comment.date,
            blogId: comment.blogId,
          }));
        })
      );
  }

  addCommentToBlog(comment: BlogComment): Promise<void> {
    const commentId = this.firestore.createId();
    return this.firestore
      .collection(this.commentsCollection)
      .doc(commentId)
      .set(comment);
  }

  deleteComment(commentId: string): Promise<void> {
    return this.firestore
      .collection(this.commentsCollection)
      .doc(commentId)
      .delete();
  }

  updateComment(
    commentId: string,
    updatedComment: Partial<BlogComment>
  ): Promise<void> {
    return this.firestore
      .collection(this.commentsCollection)
      .doc(commentId)
      .update(updatedComment);
  }
}
