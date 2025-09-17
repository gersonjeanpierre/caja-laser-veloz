import { Input, Output, EventEmitter, Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgClass, NgTemplateOutlet } from '@angular/common';
import { IftaLabelModule } from "primeng/iftalabel";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'crud-form',
  templateUrl: './crud-form.html',
  styleUrl: './crud-form.css',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgClass,
    IftaLabelModule,
    ButtonModule,
    InputTextModule,
    SelectButtonModule,
    SelectModule,
    DatePickerModule,
    CheckboxModule,
    InputMaskModule,
    NgTemplateOutlet,
    CommonModule,
    InputNumberModule,
    TextareaModule
  ]
})
export class CrudForm {
  @Input() form!: FormGroup;
  @Input() formName?: string;
  @Input() columns: number = 3;
  @Input() rows?: number;
  @Input() columnSizes?: string[];
  @Input() fields: {
    name: string;
    label: string;
    type?: string;
    class?: string;
    placeholder?: string;
    options?: { label: string; value: any; }[];
    optionsSelect?: {
      label: string,
      value?: string,
      id?: string
      items: {
        label: string, value: any
      }[]
    }[];
    colStart?: number;
    colEnd?: number;
    rowStart?: number;
    rowEnd?: number;
  }[] = [];
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}