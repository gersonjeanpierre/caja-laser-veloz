import { Input, Output, EventEmitter, Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { IftaLabelModule } from "primeng/iftalabel";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { InputMaskModule } from 'primeng/inputmask';

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
    InputMaskModule
  ]
})
export class CrudForm {
  @Input() form!: FormGroup;
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
  }[] = [];
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}