import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ExpensesService } from '../../core/services/expenses.service';
import { IExpense } from '../../models/common.model';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css'],
})
export class ExpenseFormComponent {
  expenseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private expensesService: ExpensesService
  ) {
    this.expenseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
    });
  }

  get title() {
    return this.expenseForm.get('title');
  }

  get price() {
    return this.expenseForm.get('price');
  }

  get description() {
    return this.expenseForm.get('description');
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      const newExpense: IExpense = {
        title: this.title?.value,
        price: this.price?.value,
        description: this.description?.value,
      };

      this.expensesService.addExpense(newExpense);

      console.log('Expense added:', newExpense);

      this.expenseForm.reset();
    } else {
      this.expenseForm.markAllAsTouched();
    }
  }
}
