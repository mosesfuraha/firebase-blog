import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { IExpense } from '../../models/common.model';
import { ExpensesService } from '../../core/services/expenses.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
})
export class ExpensesComponent implements OnInit {
  showAddExpenseModal: boolean = false;
  expenses: IExpense[] = [];
  editingExpenseForm: FormGroup = new FormGroup({
    title: new FormControl(''),
    price: new FormControl(''),
    description: new FormControl(''),
  });
  editingKey: string | null = null;

  constructor(private expensesService: ExpensesService) {}

  ngOnInit(): void {
    this.getAllExpenses();
  }

  getAllExpenses() {
    this.expensesService
      .getAllExpenses()
      .snapshotChanges()
      .subscribe({
        next: (data) => {
          this.expenses = data.map((item) => {
            const expense = item.payload.val();
            const key = item.key;
            return { ...expense, key } as IExpense;
          });
        },
        error: (err) => {
          console.error('Error fetching expenses:', err);
        },
      });
  }

  editExpense(key: string) {
    this.expensesService
      .getExpense(key)
      .valueChanges()
      .subscribe((expense) => {
        if (expense) {
          this.editingKey = key;
          this.editingExpenseForm.patchValue({
            title: expense.title,
            price: expense.price,
            description: expense.description,
          });
        }
      });
  }

  saveExpense() {
    if (this.editingKey) {
      const updatedExpense = this.editingExpenseForm.value;
      this.expensesService.updateExpense(this.editingKey, updatedExpense);
      this.editingKey = null;
      this.editingExpenseForm.reset();
    }
  }

  removeExpense(key: string) {
    this.expensesService.deleteExpense(key);
  }

  closeModal() {
    this.editingKey = null;
    this.editingExpenseForm.reset();
  }
  openAddExpenseModal() {
    this.showAddExpenseModal = true;
  }

  closeAddExpenseModal() {
    this.showAddExpenseModal = false;
  }
}
