import { Component } from '@angular/core';
import { Cashier } from '@features/cashier/cashier';

@Component({
  selector: 'app-layout',
  imports: [Cashier],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

}
