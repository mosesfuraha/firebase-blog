import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics'; // Import AngularFireAnalytics
import { map, Observable } from 'rxjs';
import { Blog, Comment as BlogComment } from '../../models/common.model';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly blogCollection: AngularFirestoreCollection<Blog>;
  private readonly blogCollectionPath = 'blogs';
  private readonly commentsCollection = 'comments';

  constructor(
    private firestore: AngularFirestore,
    private analytics: AngularFireAnalytics
  ) {
    this.blogCollection = firestore.collection<Blog>(this.blogCollectionPath);
  }

  getAllBlogs(): Observable<Blog[]> {
    this.analytics.logEvent('fetch_blogs');
    return this.blogCollection.valueChanges({ idField: 'id' });
  }

  getBlog(id: string): Observable<Blog | undefined> {
    this.analytics.logEvent('view_blog', { blogId: id });
    return this.blogCollection.doc<Blog>(id).valueChanges();
  }

  addBlog(blog: Blog): Promise<void> {
    const id = this.firestore.createId();
    return this.blogCollection
      .doc(id)
      .set({ ...blog, id })
      .then(() => {
        this.analytics.logEvent('create_blog', {
          blogId: id,
          title: blog.title,
        });
      });
  }

  updateBlog(id: string, blog: Blog): Promise<void> {
    return this.blogCollection
      .doc(id)
      .update(blog)
      .then(() => {
        this.analytics.logEvent('update_blog', {
          blogId: id,
          title: blog.title,
        });
      });
  }

  deleteBlog(id: string): Promise<void> {
    return this.blogCollection
      .doc(id)
      .delete()
      .then(() => {
        this.analytics.logEvent('delete_blog', { blogId: id });
      });
  }

  getCommentsForBlog(blogId: string): Observable<BlogComment[]> {
    this.analytics.logEvent('fetch_comments', { blogId });
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
      .set(comment)
      .then(() => {
        this.analytics.logEvent('add_comment', {
          commentId,
          blogId: comment.blogId,
        }); // Track comment addition
      });
  }

  deleteComment(commentId: string): Promise<void> {
    return this.firestore
      .collection(this.commentsCollection)
      .doc(commentId)
      .delete()
      .then(() => {
        this.analytics.logEvent('delete_comment', { commentId });
      });
  }

  updateComment(
    commentId: string,
    updatedComment: Partial<BlogComment>
  ): Promise<void> {
    return this.firestore
      .collection(this.commentsCollection)
      .doc(commentId)
      .update(updatedComment)
      .then(() => {
        this.analytics.logEvent('update_comment', { commentId });
      });
  }
}
