import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { IftaLabelModule } from 'primeng/iftalabel';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectStandService } from './services/select-stand-service';
import { ICashier } from '@core/models';
import { CashierService } from './services/cashier-service';

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
export class Login {
  private router = inject(Router)
  private fb = inject<FormBuilder>(FormBuilder);
  private cdr = inject(ChangeDetectorRef)

  private selectStandService = inject(SelectStandService);
  private cashierService = inject(CashierService)

  groupedGalleries: any[] = [];
  selectedStand: string | undefined;

  loginForm = this.fb.group<ICashier>({
    fullName: '',
    standId: ''
  });

  async ngOnInit() {
    this.groupedGalleries = await this.selectStandService.getGroupedStands();
  }

  loginUser() {
    const formValue = this.loginForm.value;
    if (!formValue.standId || !formValue.fullName) {
      return;
    }
    this.cashierService.createCashier(formValue as ICashier);
    this.router.navigate(['/cashier']);
  }
}
