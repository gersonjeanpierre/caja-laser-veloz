import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DexieService } from './shared/idb-dexiejs/dexie-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Caja Laser Veloz');
  dexieService = inject(DexieService);
  constructor() {
    // Forzar inicialización de la base de datos
    this.dexieService.galleries.count();
  }

}
