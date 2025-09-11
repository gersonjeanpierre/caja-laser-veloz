import { Injectable, inject } from '@angular/core';
import { DexieService } from '@shared/idb-dexiejs/dexie-service';
import { Customer } from '@core/models/customer.model';
import { v7 as uuidv7 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private db = inject(DexieService);

  async createCustomer(customer: Customer): Promise<void> {
    const customerWithId = {
      ...customer,
      id: uuidv7()
    };
    await this.db.customers.add(customerWithId);
  }

  async getCustomers(): Promise<Customer[]> {
    return await this.db.customers.toArray();
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<void> {
    await this.db.customers.update(id, customer);
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.db.customers.delete(id);
  }

  async getCustomerById(id: string): Promise<Customer | undefined> {
    return await this.db.customers.get(id);
  }
}
