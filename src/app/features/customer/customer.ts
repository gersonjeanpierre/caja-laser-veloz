import { ChangeDetectorRef, Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { Customer as CustomerModel } from '@core/models/customer.model';
import { CustomerService } from './services/customer-service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CrudForm } from '@shared/components/crud-form/crud-form';
import { Dialog } from "primeng/dialog";
import { MessageToast } from '@shared/components/message-toast/message-toast';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.html',
  styleUrl: './customer.css',
  imports: [
    TableModule,
    ButtonModule,
    IconField,
    InputIcon,
    InputTextModule,
    CrudForm,
    Dialog,
    MessageToast
  ],
})
export class Customer {

  private customerService = inject(CustomerService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  customers: CustomerModel[] = [];
  loading: boolean = true;
  customerDialog: boolean = false;

  customerForm: FormGroup = this.fb.group({
    id: '',
    typePerson: ['', Validators.required],
    typeClient: ['', Validators.required],
    phone: ['', [Validators.pattern(/^\+\d{1,4}\s?\d{6,15}$/), Validators.required]],
    fullName: '',
    socialReason: '',
    dni: ['', [Validators.minLength(8), Validators.maxLength(8)]],
    ruc: ['', [Validators.minLength(11), Validators.maxLength(11)]],
    ce: ['', [Validators.minLength(6), Validators.maxLength(20)]],
    email: ['', [Validators.email]],
    isActive: true,
  })

  @Output() customerSelected = new EventEmitter<Customer>();

  selectCustomer(customer: Customer) {
    this.customerSelected.emit(customer);
  }

  @ViewChild('toast') toast!: MessageToast;

  async ngOnInit() {
    this.loadCustomers();
    this.setupConditionalLogic();
  }

  async loadCustomers() {
    this.loading = true;
    try {
      this.customers = await this.customerService.getCustomers();
      console.log('Customers loaded:', this.customers);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  createNewCustomer() {
    this.customerForm.reset();
    this.customerForm.patchValue({ isActive: true });
    this.customerDialog = true;
  }

  saveCustomer() {
    const customer: CustomerModel = this.customerForm.value;
    if (!this.customerForm.valid) {
      this.customerForm.markAllAsTouched();
      const errorMsg = this.getFirstErrorMessage();
      this.showError(errorMsg || 'Por favor, completa todos los campos requeridos correctamente.');
      return; // Detiene la ejecución si no es válido
    }
    if (!customer.id || customer.id === '') {
      this.customerService.createCustomer(customer)
        .then(() => {
          this.loadCustomers();
          this.showSuccess('Cliente agregado exitosamente');
        })
        .catch(error => {
          this.showError(error.message || 'Error al agregar el cliente');
        });
    } else {
      this.customerService.updateCustomer(customer.id, customer)
        .then(() => {
          this.loadCustomers();
          this.showSuccess('Cliente actualizado exitosamente');
        })
        .catch(error => {
          this.showError(error.message || 'Error al actualizar el cliente');
        });
    }
    this.hideDialog();
  }

  editCustomer(customer: CustomerModel) {
    this.customerForm.patchValue(customer);
    this.customerDialog = true;
  }

  deleteCustomer(customer: CustomerModel) {
    if (customer.id) {
      this.customerService.deleteCustomer(customer.id)
        .then(() => {
          this.loadCustomers();
          this.showSuccess('Cliente eliminado exitosamente');
        })
        .catch(error => {
          this.showError(error.message || 'Error al eliminar el cliente');
        });
    }
  }

  get customerFields() {
    return [
      // Fila 1: Tipos de persona y cliente (medio ancho cada uno, relacionados)
      {
        name: 'typePerson', label: 'Tipo de Persona', type: 'select', class: 'w-52', options: [
          { label: 'Natural', value: 'Natural' },
          { label: 'Jurídica', value: 'Jurídica' }
        ]
      },
      {
        name: 'typeClient', label: 'Tipo de Cliente', type: 'select', class: 'w-52', options: [
          { label: 'Nuevo', value: 'Nuevo' },
          { label: 'Frecuente', value: 'Frecuente' },
          { label: 'Imprentero', value: 'Imprentero' },
          { label: 'Imprentero Frecuente', value: 'Frecuente' }
        ]
      },

      // Fila 2: Nombre completo (ancho completo, campo principal)
      { name: 'fullName', label: 'Nombre Completo', type: 'text', class: 'p-fluid' },

      // Fila 3: Razón social (ancho completo, solo para jurídicos, pero visible siempre)
      { name: 'socialReason', label: 'Razón Social', type: 'text', class: 'p-fluid' },

      // Fila 4: Contacto (celular y email, medio ancho cada uno)
      { name: 'phone', label: 'Celular', type: 'tel', class: 'w-52', placeholder: '+51 987654321' },
      { name: 'email', label: 'Email', type: 'email', class: 'w-52' },

      // Fila 5: Documentos (DNI y CE en fila, RUC en fila siguiente para claridad)
      { name: 'dni', label: 'DNI', type: 'text', class: 'w-52' },
      { name: 'ce', label: 'CE', type: 'text', class: 'w-52' },
      { name: 'ruc', label: 'RUC', type: 'text', class: 'p-fluid' },

      // Fila 6: Estado (checkbox al final, alineado a la izquierda)
      { name: 'isActive', label: 'Activo', type: 'checkbox', class: 'w-full' },
    ];
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
    this.customerDialog = false;
  }

  private setupConditionalLogic() {
    // Lógica para 'dni' y 'ce': Deshabilitar uno cuando el otro tenga valor
    this.customerForm.get('dni')?.valueChanges.subscribe(value => {
      if (value && value.trim() !== '') {
        this.customerForm.get('ce')?.disable({ emitEvent: false });
      } else {
        this.customerForm.get('ce')?.enable({ emitEvent: false });
      }
    });

    this.customerForm.get('ce')?.valueChanges.subscribe(value => {
      if (value && value.trim() !== '') {
        this.customerForm.get('dni')?.disable({ emitEvent: false });
      } else {
        this.customerForm.get('dni')?.enable({ emitEvent: false });
      }
    });

    // Lógica para 'typePerson': Hacer obligatorios 'socialReason' y 'ruc' si es 'juridica'
    this.customerForm.get('typePerson')?.valueChanges.subscribe(value => {
      const socialReasonControl = this.customerForm.get('socialReason');
      const rucControl = this.customerForm.get('ruc');

      if (value === 'Jurídica') {
        socialReasonControl?.setValidators([Validators.required]);
        rucControl?.setValidators([
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11)
        ]);
      } else {
        socialReasonControl?.clearValidators();
        rucControl?.setValidators([Validators.minLength(11), Validators.maxLength(11)]);
      }

      socialReasonControl?.updateValueAndValidity({ emitEvent: false });
      rucControl?.updateValueAndValidity({ emitEvent: false });
    });
  }

  private errorMessages: Record<string, Record<string, string>> = {
    typePerson: {
      required: 'El tipo de persona es obligatorio.'
    },
    typeClient: {
      required: 'El tipo de cliente es obligatorio.'
    },
    ruc: {
      required: 'El RUC es obligatorio.',
      minlength: 'El RUC debe tener exactamente 11 dígitos.',
      maxlength: 'El RUC debe tener exactamente 11 dígitos.',
    },
    phone: {
      required: 'El celular es obligatorio.',
      pattern: 'El número debe tener formato internacional, ej: +51 999999999.'
    },
    dni: {
      required: 'El DNI es obligatorio.',
      minlength: 'El DNI debe tener exactamente 8 dígitos.',
      maxlength: 'El DNI debe tener exactamente 8 dígitos.',
    },
    ce: {
      required: 'El CE es obligatorio.',
      minlength: 'El CE debe tener entre 6 y 20 caracteres.',
      maxlength: 'El CE debe tener entre 6 y 20 caracteres.',
    },
    email: {
      required: 'El correo es obligatorio.',
      email: 'El correo no es válido.',
    },
  };

  private getFirstErrorMessage(): string | null {
    for (const field of Object.keys(this.errorMessages)) {
      const control = this.customerForm.get(field);
      if (control && control.invalid && control.touched) {
        const errors = control.errors;
        if (errors) {
          for (const errorKey of Object.keys(errors)) {
            const msg = this.errorMessages[field][errorKey];
            if (msg) return msg;
          }
        }
      }
    }
    return null;
  }
}
