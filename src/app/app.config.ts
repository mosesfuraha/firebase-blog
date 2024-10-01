import { ApplicationConfig } from '@angular/core';
import { importProvidersFrom } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { firebaseConfig } from './constants/constants';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(AngularFireModule.initializeApp(firebaseConfig)),
    importProvidersFrom(AngularFireDatabaseModule),
    AngularFireAuth,
    importProvidersFrom(AngularFirestoreModule),
  ],
};
