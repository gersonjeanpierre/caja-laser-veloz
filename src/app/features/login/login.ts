import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { IftaLabelModule } from 'primeng/iftalabel';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectStandService } from './select-stand-service';
import { ICashier } from '@core/models';
import { CashierService } from '../cashier/services/cashier-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [
    CardModule,
    InputTextModule,
    ButtonModule,
    IftaLabelModule,
    SelectModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class Login implements OnInit {
  private router = inject(Router)
  private fb = inject<FormBuilder>(FormBuilder);
  private cdr = inject(ChangeDetectorRef)

  private selectStandService = inject(SelectStandService);
  private cashierService = inject(CashierService)

  groupedGalleries: any[] = [];
  selectedStand: string | undefined;
  cashiersFullNameList: string[] = [];
  cashiersList: ICashier[] = [];

  isListCashiers = false;
  addCashier = false;

  loginForm = this.fb.group({
    id: '',
    fullName: '',
    standId: ''
  });

  async ngOnInit() {
    this.groupedGalleries = await this.selectStandService.getGroupedStands();
    await this.getCashiers();
    this.isListCashiers = this.cashiersList.length > 0;

    this.cdr.detectChanges();
  }

  async loginUser() {
    const formValue = this.loginForm.value;

    if (this.addCashier || !this.isListCashiers) {
      if (!formValue.standId || !formValue.fullName) {
        return;
      }
      const newCashier: ICashier = {
        id: '', // Se asigna en el servicio
        fullName: formValue.fullName!,
        standId: formValue.standId!
      };
      const id = await this.cashierService.createCashier(newCashier);

      const cashier = await this.cashierService.getAllCashiers().then(list => list.find(c => c.id === id));
      console.log('Nuevo cajero creado:', cashier);
      if (cashier) {
        localStorage.setItem('selectedCashier', JSON.stringify(cashier));
      }
    } else {

      const cashier = this.cashiersList.find(c => c.id === formValue.fullName);
      console.log('Cajero seleccionado:', cashier);
      if (cashier) {
        localStorage.setItem('selectedCashier', JSON.stringify(cashier));
      }
    }

    this.router.navigate(['/cortes-de-caja']);
  }

  async getCashiers() {
    const cashiers = await this.cashierService.getAllCashiers();
    this.cashiersFullNameList = cashiers.map(c => c.fullName);
    this.cashiersList = cashiers;
  }

  onCashierSelect(cashierId: string) {
    const cashier = this.cashiersList.find(c => c.id === cashierId);
    console.log('Cajero seleccionado:', cashier);
    // guradar en localstorage
    if (cashier) {
      localStorage.setItem('selectedCashier', JSON.stringify(cashier));
    }
  }

  toggleAddCashier() {
    this.addCashier = true;
    this.isListCashiers = false;
  }
}