import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { ExpenseFormComponent } from './pages/expense-form/expense-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { appConfig } from './app.config';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AppComponent, ExpensesComponent, ExpenseFormComponent],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule,CommonModule],
  providers: [provideClientHydration(), ...appConfig.providers],
  bootstrap: [AppComponent],
})
export class AppModule {}
