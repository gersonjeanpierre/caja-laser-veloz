
import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { Designer as DesignerModel } from '@core/models/designer.model';
import { DesignerService } from './designer-service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CrudForm } from '@shared/components/crud-form/crud-form';
import { Dialog } from "primeng/dialog";
import { MessageToast } from '@shared/components/message-toast/message-toast';
import { SelectStandService } from '@features/login/select-stand-service';

@Component({
  selector: 'app-designer',
  templateUrl: './designer.html',
  styleUrl: './designer.css',
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
export class Designer {
  private designerService = inject(DesignerService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private selectStandService = inject(SelectStandService);

  designers: DesignerModel[] = [];
  loading: boolean = true;
  designerDialog: boolean = false;
  groupedGalleries: any[] = [];

  designerForm: FormGroup = this.fb.group({
    id: '',
    name: ['', Validators.required],
    fullName: ['', Validators.required],
    isActive: true,
    standId: ''
  });

  @ViewChild('toast') toast!: MessageToast;

  async ngOnInit() {

    this.loadDesigners();
    this.groupedGalleries = await this.selectStandService.getGroupedStands();
  }

  async loadDesigners() {
    this.loading = true;
    try {
      this.designers = await this.designerService.getDesigners();
      console.log('Designers loaded:', this.designers);
    } catch (error) {
      console.error('Error loading designers:', error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  createNewDesigner() {
    this.designerForm.reset();
    this.designerForm.patchValue({ isActive: true });

    this.designerDialog = true;
  }

  saveDesigner() {
    const designer: DesignerModel = this.designerForm.value;
    if (!this.designerForm.valid) {
      this.designerForm.markAllAsTouched();
      const errorMsg = this.getFirstErrorMessage();
      this.showError(errorMsg || 'Por favor, completa todos los campos requeridos correctamente.');
      return;
    }
    if (!designer.id || designer.id === '') {
      this.designerService.createDesigner(designer)
        .then(() => {
          this.loadDesigners();
          this.showSuccess('Diseñador(a) agregado exitosamente');
        })
        .catch(error => {
          this.showError(error.message || 'Error al agregar el diseñador(a)');
        });
    } else {
      this.designerService.updateDesigner(designer.id, designer)
        .then(() => {
          this.loadDesigners();
          this.showSuccess('Diseñador(a) actualizado exitosamente');
        })
        .catch(error => {
          this.showError(error.message || 'Error al actualizar el diseñador(a)');
        });
    }
    this.hideDialog();
  }

  editDesigner(designer: DesignerModel) {
    this.designerForm.patchValue(designer);
    this.designerDialog = true;
  }

  deleteDesigner(designer: DesignerModel) {
    if (designer.id) {
      this.designerService.deleteDesigner(designer.id)
        .then(() => {
          this.loadDesigners();
          this.showSuccess('Diseñador(a) eliminado exitosamente');
        })
        .catch(error => {
          this.showError(error.message || 'Error al eliminar el diseñador(a)');
        });
    }
  }

  showSuccess(message: string) {
    this.toast.clear();
    this.toast.severity = 'success';
    this.toast.summary = 'Éxito';
    this.toast.life = 2000;
    this.toast.detail = message;
    this.toast.position = 'bottom-right';
    this.toast.sticky = false;
    this.toast.show();
    this.cdr.detectChanges();
  }

  showError(message: string) {
    this.toast.clear();
    this.toast.severity = 'error';
    this.toast.summary = 'Error';
    this.toast.position = 'bottom-center';
    this.toast.detail = message;
    this.toast.sticky = true;
    this.toast.show();
    this.cdr.detectChanges();
  }

  hideDialog() {
    this.designerDialog = false;
  }

  private errorMessages: Record<string, Record<string, string>> = {
    name: {
      required: 'El nombre es obligatorio.'
    },
    fullName: {
      required: 'El nombre completo es obligatorio.'
    }
  };

  private getFirstErrorMessage(): string | null {
    for (const field of Object.keys(this.errorMessages)) {
      const control = this.designerForm.get(field);
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

  get designerFields() {
    return [
      {
        name: 'standId', label: 'Stand', type: 'select-group',
        class: 'w-full', optionsSelect: this.groupedGalleries,
        colStart: 1, colEnd: 3, rowStart: 1, rowEnd: 2
      },
      {
        name: 'name', label: 'Nombre', type: 'text',
        class: 'w-full',
        colStart: 1, colEnd: 3, rowStart: 2, rowEnd: 3
      },
      {
        name: 'fullName', label: 'Nombre Completo', type: 'text',
        class: 'w-full',
        colStart: 1, colEnd: 5, rowStart: 3, rowEnd: 4
      },
      {
        name: 'isActive', label: 'Activo', type: 'checkbox',
        class: 'w-full',
        colStart: 1, colEnd: 2, rowStart: 4, rowEnd: 5
      },
    ];
  }
}