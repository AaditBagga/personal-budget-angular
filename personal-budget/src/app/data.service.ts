import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private budgetData: { title: string; budget: number }[] = [];

  constructor(private http: HttpClient) {}

  // Fetch data from the backend
  getBudgetData(): Observable<any> {
    return this.http.get('http://localhost:3000/budget');
  }

  // Store data in the service
  setBudgetData(data: { title: string; budget: number }[]): void {
    this.budgetData = data;
  }
  isBudgetDataEmpty(): boolean {
    return this.budgetData.length === 0;
  }

  // Retrieve data from the service
  getChartData(): { title: string; budget: number }[] {
    return this.budgetData;
  }
}
