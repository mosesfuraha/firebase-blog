import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { firebaseConfig } from './constants/constants';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireModule } from '@angular/fire/compat';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),

    provideAuth(() => getAuth()),

    provideFirestore(() => getFirestore()),

    provideDatabase(() => getDatabase()),

    importProvidersFrom(AngularFireModule.initializeApp(firebaseConfig)),
    importProvidersFrom(AngularFireDatabaseModule),
    importProvidersFrom(AngularFireModule),
  ],
};
