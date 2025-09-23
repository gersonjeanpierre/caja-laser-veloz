import { ChangeDetectorRef, Component, inject, signal, ViewChild } from '@angular/core';
import { CashierModel, SaleModel } from '@core/models';
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
import { TagModule } from 'primeng/tag';

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
    Customer,
    TagModule
  ],
})
export class Sales {
  private salesService = inject(SalesService);
  private designerService = inject(DexieService).designers;
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  designers = signal<Designer[]>([]);
  selectDesigners: ISelectPrimeNG[] = [];
  paymentMethods = paymentMethods;
  productStatusOptions = productStatusOptions;
  saleStatusOptions = saleStatusOptions;

  ticketDialog = signal(false);
  customerDialog = signal(false);
  addCustomerDialog = signal(false);
  loading = signal(true);
  showAllSales = signal(false);

  sales = signal<SaleModel[]>([]);
  allSales = signal<SaleModel[]>([]);
  selectedCustomer = signal<CustomerModel | null>(null);

  ticketForm: FormGroup = this.fb.group({
    id: '',
    correlative: 0,
    standId: '',
    cashierId: '',
    designerId: '',
    designerName: '',
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
    isActive: true,
  })

  @ViewChild('toast') toast!: MessageToast;

  async ngOnInit() {
    this.loadSales();
    await this.selectOptionDesigner();
    this.cdr.detectChanges();
  }

  async loadSales() {
    this.loading.set(true);
    try {
      this.allSales.set(await this.salesService.getSales());
      this.filterSales();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading sales:', error);
    } finally {
      this.loading.set(false);
    }
  }

  filterSales() {
    if (this.showAllSales()) {
      this.sales.set(this.allSales());
    } else {
      this.sales.set(this.allSales().filter(sale => sale.isActive !== false));
    }
  }

  onShowAllSalesChange(event: any) {
    this.showAllSales.set(event.target.checked);
    this.filterSales();
  }

  createNewTicket() {
    this.ticketForm.reset();
    this.ticketDialog.set(true);
    this.openCustomerDialog();
    this.cdr.detectChanges();
  }

  saveClient() {
    const ticket: SaleModel = this.ticketForm.value;
    const cashier: CashierModel = JSON.parse(localStorage.getItem('selectedCashier') || '{}');
    ticket.cashierId = cashier.id || '';
    ticket.standId = cashier.standId || '';
    ticket.designerName = this.designers().find(d => d.id === ticket.designerId)?.name || '';

    if (!ticket.id || ticket.id === '') {
      ticket.isActive = true;
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

  editTicket(sale: SaleModel) {
    this.ticketForm.patchValue(sale);
    this.ticketDialog.set(true);
  }

  deleteTicket(sale: SaleModel) {
    // implementar el delete logico
    sale.isActive = false;
    this.salesService.updateSale(sale.id || '', sale)
      .then(() => {
        this.loadSales();
        this.showSuccess('Ticket eliminado exitosamente');
      })
      .catch(error => {
        this.showError(error.message || 'Error al eliminar el ticket');
      });
  }

  async selectOptionDesigner() {
    const designers = (await this.designerService.toArray()).map(
      (designer) => ({
        label: designer.name,
        value: designer.id ?? '',
      })
    )
    this.designers.set(await this.designerService.toArray());
    this.selectDesigners = designers;
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
    this.ticketDialog.set(false);
  }


  openCustomerDialog() {
    this.customerDialog.set(true);
  }

  onCustomerSelected(customer: CustomerModel) {
    this.selectedCustomer.set(customer);
    this.ticketForm.patchValue({ customerId: customer.id, phone: customer.phone });
    this.customerDialog.set(false);
  }



  openAddCustomerDialog() {
    this.addCustomerDialog.set(true);
  }

  openWhatsApp(phone: string) {
    const whatsappUrl = `https://wa.me/${phone}`;
    window.open(whatsappUrl, '_blank');
  }

  copyPhoneToClipboard(phone: string) {
    navigator.clipboard.writeText(phone).then(() => {
      this.showSuccess('Número de teléfono copiado al portapapeles');
    }).catch(err => {
      this.showError('Error al copiar el número de teléfono: ' + err);
    });
  }

  globalFilterValue(psales: any): string {
    const filter = psales?.filters?.['global'];
    if (Array.isArray(filter)) {
      return filter[0]?.value ?? '';
    }
    return filter?.value ?? '';
  }

  getProductStatusSeverity(status: string): string {
    switch (status) {
      case 'ENPROCESO':
        return 'info';
      case 'LISTO':
        return 'warn';
      case 'ENTREGADO':
        return 'success';
      default:
        return 'default';
    }
  }
  getSaleStatusSeverity(status: string): string {
    switch (status) {
      case 'ADELANTO':
        return 'info';
      case 'PAGADO':
        return 'warn';
      case 'COMPLETADO':
        return 'success';
      default:
        return 'default';
    }
  }

  get ticketFields() {
    return [
      // Primera fila
      {
        name: 'correlative', label: 'Correlativo', type: 'correlative',
        class: 'w-36',
        colStart: 1, colEnd: 2, rowStart: 1, rowEnd: 2
      },
      {
        name: 'designerId', label: 'Diseñador', type: 'select-options',
        class: 'w-full', options: this.selectDesigners,
        colStart: 2, colEnd: 4, rowStart: 1, rowEnd: 2
      },

      {
        name: 'phone', label: 'Teléfono Cliente', type: 'tel',
        class: 'w-56',
        colStart: 4, colEnd: 5, rowStart: 1, rowEnd: 2
      },

      // Segunda fila
      {
        name: 'advancePayment', label: 'Adelanto', type: 'number',
        class: 'w-36',
        colStart: 1, colEnd: 2, rowStart: 2, rowEnd: 3
      },
      {
        name: 'saleValue', label: 'Saldo', type: 'number',
        class: 'w-40',
        colStart: 2, colEnd: 3, rowStart: 2, rowEnd: 3
      },
      {
        name: 'totalAmount', label: 'Total', type: 'number',
        class: 'w-40',
        colStart: 3, colEnd: 4, rowStart: 2, rowEnd: 3
      },
      {
        name: 'paymentMethod', label: 'Método de Pago', type: 'select-icon',
        class: 'w-56', options: this.paymentMethods,
        colStart: 4, colEnd: 5, rowStart: 2, rowEnd: 3
      },
      // Tercera fila
      {
        name: 'statusProduct', label: 'Estado Producto', type: 'select-options',
        class: 'w-36', options: this.productStatusOptions,
        colStart: 1, colEnd: 2, rowStart: 3, rowEnd: 4
      },
      {
        name: 'statusSale', label: 'Estado Venta', type: 'select-options',
        class: 'w-40', options: this.saleStatusOptions,
        colStart: 2, colEnd: 3, rowStart: 3, rowEnd: 4
      },
      {
        name: 'createdAt', label: 'Hora', type: 'date-time',
        class: 'w-40',
        colStart: 3, colEnd: 4, rowStart: 3, rowEnd: 4
      },
      // Notas ocupa dos columnas
      {
        name: 'notes', label: 'Notas', type: 'textarea',
        class: 'w-full p-fluid',
        colStart: 1, colEnd: 5, rowStart: 4, rowEnd: 5
      },
    ];
  }
}