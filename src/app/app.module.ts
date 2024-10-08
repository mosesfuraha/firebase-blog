import { NgModule, isDevMode } from '@angular/core';
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
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { BlogsComponent } from './pages/blogs/blogs.component';
import { HttpClientModule } from '@angular/common/http';
import { SingleBlogComponent } from './pages/single-blog/single-blog.component';
import { CreateBlogComponent } from './pages/create-blog/create-blog.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ProfileComponent } from './pages/profile/profile.component';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    BlogsComponent,
    SingleBlogComponent,
    CreateBlogComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    AngularFireAnalyticsModule,

    ServiceWorkerModule.register('manifest.js', {
      enabled: !isDevMode(),

      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [provideClientHydration(), ...appConfig.providers],
  bootstrap: [AppComponent],
})
export class AppModule {}
