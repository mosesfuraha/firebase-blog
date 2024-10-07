import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from '@angular/fire/auth';
import { from, Observable, BehaviorSubject } from 'rxjs';
import { Analytics, logEvent } from '@angular/fire/analytics';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  analytics = inject(Analytics);
  private readonly loggedIn = new BehaviorSubject<boolean>(false);

  constructor() {
    onAuthStateChanged(this.firebaseAuth, (user) => {
      this.loggedIn.next(!!user);
      if (user) {
        logEvent(this.analytics, 'user_logged_in', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
      }
    });
  }

  register(
    email: string,
    password: string,
    username: string
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    )
      .then((userCredential) => {
        return updateProfile(userCredential.user, {
          displayName: username,
        });
      })
      .then(() => {
        console.log('User registered with username:', username);

        // Log a 'sign_up' event in Analytics
        logEvent(this.analytics, 'sign_up', {
          method: 'email',
          email: email,
          username: username,
        });
      });

    return from(promise);
  }

  // Login method with analytics
  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((userCredential) => {
      this.loggedIn.next(true);

      // Log a 'login' event in Analytics
      logEvent(this.analytics, 'login', {
        method: 'email',
        uid: userCredential.user.uid,
        email: email,
      });
    });
    return from(promise);
  }

  // Google sign-in method with analytics
  createAcountWithGoogle(): Observable<void> {
    const provider = new GoogleAuthProvider();
    const promise = signInWithPopup(this.firebaseAuth, provider)
      .then((result) => {
        this.loggedIn.next(true);

        // Log a 'login' event for Google sign-in in Analytics
        logEvent(this.analytics, 'login', {
          method: 'google',
          uid: result.user.uid,
          email: result.user.email,
        });
      })
      .catch((error) => {
        if (error.code === 'auth/popup-closed-by-user') {
          return Promise.reject(
            new Error('Google login canceled by the user.')
          );
        }
        return Promise.reject(error);
      });

    return from(promise);
  }

  // Logout method with analytics
  logout(): Promise<void> {
    return signOut(this.firebaseAuth).then(() => {
      this.loggedIn.next(false);

      // Log a 'logout' event in Analytics
      logEvent(this.analytics, 'logout', {
        uid: this.firebaseAuth.currentUser?.uid,
      });
    });
  }

  isAuthenticated(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getCurrentUser(): Observable<User | null> {
    return new Observable((observer) => {
      onAuthStateChanged(this.firebaseAuth, (user) => {
        observer.next(user);
        observer.complete();
      });
    });
  }
}
