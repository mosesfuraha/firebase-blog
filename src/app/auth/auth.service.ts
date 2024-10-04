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
  updateProfile, // Import to update profile details like displayName
} from '@angular/fire/auth';
import { from, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  private readonly loggedIn = new BehaviorSubject<boolean>(false);

  constructor() {
    onAuthStateChanged(this.firebaseAuth, (user) => {
      this.loggedIn.next(!!user);
    });
  }

  // Register method now takes an additional `username` parameter
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
        // Set the displayName (username) after the user is created
        return updateProfile(userCredential.user, {
          displayName: username,
        });
      })
      .then(() => {
        console.log('User registered with username:', username);
      });

    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {
      this.loggedIn.next(true);
    });
    return from(promise);
  }

  createAcountWithGoogle(): Observable<void> {
    const provider = new GoogleAuthProvider();
    const promise = signInWithPopup(this.firebaseAuth, provider)
      .then(() => {
        this.loggedIn.next(true);
      })
      .catch((error) => {
        if (error.code === 'auth/popup-closed-by-user') {
          return Promise.reject(
            new Error('Google login canceled by the user.')
          );
        }
        return Promise.reject(error);
      });

    return from(promise); // return the promise to an observable
  }

  isAuthenticated(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  logout(): void {
    signOut(this.firebaseAuth).then(() => {
      this.loggedIn.next(false);
    });
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
