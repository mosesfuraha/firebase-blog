import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ReactiveFormsModule } from '@angular/forms';
import { appConfig } from './app.config';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, CommonModule],
  providers: [provideClientHydration(), ...appConfig.providers],
  bootstrap: [AppComponent],
})
export class AppModule {}
