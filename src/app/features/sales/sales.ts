import { ChangeDetectorRef, Component, inject, signal, ViewChild } from '@angular/core';
import { ICashier, Sale } from '@core/models';
import { SalesService } from './services/sales-service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CrudForm } from '@shared/components/crud-form/crud-form';
import { Dialog } from "primeng/dialog";
import { MessageToast } from '@shared/components/message-toast/message-toast';
import { paymentMethods } from '@shared/select-options/sales/payment-method.select';
import { DexieService } from '@shared/idb-dexiejs/dexie-service';
import { ISelectPrimeNG } from '@core/interface/select-primeng.interface';
import { Designer } from '@core/models/designer.model';
import { Customer as CustomerModel } from '@core/models/customer.model';
import { Customer } from '@features/customer/customer';
import { saleStatusOptions } from '@shared/select-options/sales/sale-status.select';
import { productStatusOptions } from '@shared/select-options/sales/product-status.select';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.html',
  styleUrl: './sales.css',
  imports: [
    DatePipe,
    CurrencyPipe,
    TableModule,
    ButtonModule,
    IconField,
    InputIcon,
    InputTextModule,
    CrudForm,
    Dialog,
    MessageToast,
    Customer
  ],
})
export class Sales {
  private salesService = inject(SalesService);
  private designerService = inject(DexieService).designers;
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  sales: Sale[] = [];
  loading: boolean = true;
  ticketDialog: boolean = false;
  designers = signal<Designer[]>([]);
  selectDesigners: ISelectPrimeNG[] = [];
  paymentMethods = paymentMethods;
  productStatusOptions = productStatusOptions;
  saleStatusOptions = saleStatusOptions;

  ticketForm: FormGroup = this.fb.group({
    id: '',
    correlative: 0,
    standId: '',
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

  @ViewChild('toast') toast!: MessageToast;

  async ngOnInit() {
    // this.ticketFields;
    this.loadSales();
    await this.selectOptionDesigner();
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
    // this.openCustomerDialog();
  }

  saveClient() {
    const ticket: Sale = this.ticketForm.value;
    const cashier: ICashier = JSON.parse(localStorage.getItem('selectedCashier') || '{}');
    ticket.cashierId = cashier.id || '';
    ticket.standId = cashier.standId || '';

    if (!ticket.id || ticket.id === '') {
      this.salesService.createNewTicket(ticket)
        .then(() => {
          // this.loadSales();
          this.showSuccess('Ticket agregado exitosamente');

        })
        .catch(error => {
          this.showError(error.message || 'Error al agregar el ticket');
        });
    } else {
      this.salesService.updateSale(ticket.id, ticket)
        .then(() => {
          // this.loadSales();
          this.showSuccess('Ticket actualizado exitosamente');

        })
        .catch(error => {
          this.showError(error.message || 'Error al actualizar el ticket');
        });
    }
    this.loadSales();
    this.hideDialog();
  }

  editTicket(sale: Sale) {
    this.ticketForm.patchValue(sale);
    this.ticketDialog = true;
  }

  deleteTicket(sale: Sale) { }

  async selectOptionDesigner() {
    const designers = (await this.designerService.toArray()).map(
      (designer) => ({
        label: designer.name,
        value: designer.id,
      })
    )
    this.designers.set(await this.designerService.toArray());
    this.selectDesigners = designers;
  }

  get ticketFields() {
    return [
      // 3 columns
      { name: 'correlative', label: 'Correlativo', type: 'number', class: 'w-32' },
      { name: 'designerId', label: 'Diseñador ID', type: 'select-options', class: 'w-52', options: this.selectDesigners },
      { name: 'createdAt', label: 'Hora', type: 'date-time', class: 'w-24' },
      // 4 columns
      { name: 'advancePayment', label: 'Adelanto', type: 'number', class: 'w-28' },
      { name: 'saleValue', label: 'Saldo', type: 'number', class: 'w-28' },
      { name: 'totalAmount', label: 'Total', type: 'number', class: 'w-28' },
      { name: 'paymentMethod', label: 'Método de Pago', type: 'select-icon', class: 'w-52', options: this.paymentMethods },
      // 3 columns
      { name: 'statusProduct', label: 'Estado del Producto', type: 'select-options', class: 'w-40', options: this.productStatusOptions },
      { name: 'statusSale', label: 'Estado de la Venta', type: 'select-options', class: 'w-40', options: this.saleStatusOptions },
      { name: 'phone', label: 'Teléfono', type: 'text', class: 'w-40' },
      // full width
      { name: 'notes', label: 'Notas', type: 'text', class: 'p-fluid' },
    ]
  }

  showSuccess(message: string) {
    this.toast.clear();
    this.toast.severity = 'success';
    this.toast.summary = 'Éxito';
    this.toast.life = 2000;
    this.toast.detail = message;
    this.toast.position = 'bottom-right'
    this.toast.sticky = false;
    this.toast.show();
    this.cdr.detectChanges();
  }

  showError(message: string) {
    this.toast.clear();
    this.toast.severity = 'error';
    this.toast.summary = 'Error';
    this.toast.position = 'bottom-center'
    this.toast.detail = message;
    this.toast.sticky = true;
    this.toast.show();
    this.cdr.detectChanges();
  }

  hideDialog() {
    this.ticketDialog = false;
  }

  customerDialog = false;
  selectedCustomer: CustomerModel | null = null;

  openCustomerDialog() {
    this.customerDialog = true;
  }

  onCustomerSelected(customer: CustomerModel) {
    this.selectedCustomer = customer;
    this.ticketForm.patchValue({ customerId: customer.id, phone: customer.phone });
    this.customerDialog = false;
  }

  addCustomerDialog = false;

  openAddCustomerDialog() {
    this.addCustomerDialog = true;
  }

  openWhatsApp(phone: string) {
    const whatsappUrl = `https://wa.me/${phone}`;
    window.open(whatsappUrl, '_blank');
  }
}
