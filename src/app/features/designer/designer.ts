import { Component } from '@angular/core';
import { designersSeed } from '@shared/idb-dexiejs/seeds/designers.seed';

@Component({
  selector: 'app-designer',
  imports: [],
  templateUrl: './designer.html',
  styleUrl: './designer.css'
})
export class Designer {
  designers: any[] = []

  ngOnInit() {
    this.designers = designersSeed
    console.log(this.designers);
  }
}