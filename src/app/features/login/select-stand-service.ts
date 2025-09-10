import { inject, Injectable } from '@angular/core';
import { DexieService } from '@shared/idb-dexiejs/dexie-service';

@Injectable({
  providedIn: 'root'
})
export class SelectStandService {
  private galleries = inject(DexieService).galleries;
  private stands = inject(DexieService).stands;

  async getGroupedStands() {
    const galleries = await this.galleries.toArray();
    const stands = await this.stands.toArray();

    return galleries.map(gallery => ({
      label: gallery.name,
      value: gallery.id,
      items: stands
        .filter(stand => stand.galleryId === gallery.id)
        .map(stand => ({
          label: stand.name,
          value: stand.id
        }))
    }));
  }

  async getStandById(standId: string) {
    return this.stands.get(standId);
  }
}
