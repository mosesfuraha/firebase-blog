import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { ExpenseFormComponent } from './pages/expense-form/expense-form.component';

const routes: Routes = [
  { path: '', component: ExpensesComponent },
  { path: 'form', component: ExpenseFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
