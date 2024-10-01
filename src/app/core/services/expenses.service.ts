import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { IExpense } from '../../models/common.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  private readonly dbPath = '/expenses';
  expensesRef: AngularFireList<IExpense>;

  constructor(private readonly db: AngularFireDatabase) {
    this.expensesRef = db.list(this.dbPath);
  }

  // Fix here: getExpense should accept a string key
  getExpense(key: string) {
    return this.db.object<IExpense>(`${this.dbPath}/${key}`);
  }

  getAllExpenses() {
    return this.expensesRef;
  }

  addExpense(expense: IExpense) {
    return this.expensesRef.push(expense);
  }

  updateExpense(key: string, expense: IExpense) {
    return this.expensesRef.update(key, expense);
  }

  deleteExpense(key: string) {
    return this.expensesRef.remove(key);
  }
}
