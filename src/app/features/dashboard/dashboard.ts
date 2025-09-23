import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  dateNow = new Date();
  dateNowFormatted = '';

  ngOnInit() {
    // Lógica de inicialización del componente
    this.capitalizeDate();
  }

  capitalizeDate() {
    const pipe = new DatePipe('es');
    const rawDate = pipe.transform(this.dateNow, 'fullDate');
    this.dateNowFormatted = rawDate
      ? rawDate.replace(/^\w/, c => c.toUpperCase())
        .replace(/ de (\w)/, (match, month) => ` de ${month.toUpperCase()}`)
      : ''
  }

}
