import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Sale } from '@core/models';
import { SalesService } from './services/sales-service';
import { Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Panel } from "primeng/panel";
import { Button, ButtonModule } from "primeng/button";
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CrudForm } from '@shared/components/crud-form/crud-form';
import { Dialog } from "primeng/dialog";
import { MessageToast } from '@shared/components/message-toast/message-toast';
import { paymentMethods } from '@shared/select-options/sales/payment-method';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.html',
  styleUrl: './sales.css',
  imports: [
    DatePipe,
    CurrencyPipe,
    // ReactiveFormsModule,
    // FormsModule,Module,
    TableModule,
    ButtonModule,
    IconField,
    InputIcon,
    InputTextModule,
    CrudForm,
    Dialog,
    // MessageToast,
  ],
})
export class Sales {

  private salesService = inject(SalesService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  sales: Sale[] = [];
  loading: boolean = true;
  ticketDialog: boolean = false;

  ticketForm: FormGroup = this.fb.group({
    id: '',
    correlative: 0,
    cashierId: '',
    designerId: '',
    createdAt: new Date(),
    updateAt: new Date(),
    paymentMethod: '',
    customerId: '',
    phone: '',
    items: [],
    statusProduct: '',
    statusSale: '',
    notes: '',
    generateInvoice: false,
    isIgv: false,
    saleSubtotal: 0,
    advancePayment: 0,
    discount: 0,
    saleValue: 0,
    igv: 0,
    totalAmount: 0,
  })

  ticketFields = [
    { name: 'correlative', label: 'Correlativo', type: 'number', class: 'p-fluid' },
    { name: 'cashierId', label: 'Cajero ID', type: 'text', class: 'p-fluid' },
    { name: 'designerId', label: 'Diseñador ID', type: 'text', class: 'p-fluid' },
    { name: 'paymentMethod', label: 'Método de Pago', type: 'select-enum', class: 'w-40', options: paymentMethods },
    { name: 'advancePayment', label: 'Pago Adelantado', type: 'number', class: 'p-fluid' },
    { name: 'saleValue', label: 'Saldo', type: 'number', class: 'p-fluid' },
    { name: 'totalAmount', label: 'Total', type: 'number', class: 'p-fluid' },
    { name: 'phone', label: 'Cliente', type: 'text', class: 'p-fluid' },
    { name: 'statusProduct', label: 'Estado del Producto', type: 'text', class: 'p-fluid' },
    { name: 'statusSale', label: 'Estado de la Venta', type: 'text', class: 'p-fluid' },
    { name: 'createdAt', label: 'Hora', type: 'date-time', class: 'w-48' },
    { name: 'notes', label: 'Notas', type: 'text', class: 'p-fluid' },

  ]

  ngOnInit() {
    this.loadSales();
    this.cdr.detectChanges();
  }

  async loadSales() {
    this.loading = true;
    try {
      this.sales = await this.salesService.getSales();
      console.log('Sales loaded:', this.sales);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading sales:', error);
    } finally {
      this.loading = false;
    }
  }

  createNewTicket() {
    this.ticketForm.reset();
    this.ticketDialog = true;
  }

  saveClient() {
    const ticket: Sale = this.ticketForm.value;
    console.log('Saving ticket:', ticket);
    this.salesService.createNewTicket(ticket)
      .then(() => {
        this.loadSales();
        this.cdr.detectChanges();
        this.ticketDialog = false;
      })
      .catch(error => {
        console.error('Error saving ticket:', error);
      });
  }

  hideDialog() {
    this.ticketDialog = false;
  }

  editTicket(sale: Sale) { }

  deleteTicket(sale: Sale) { }

}
