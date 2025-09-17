import { inject, Injectable } from '@angular/core';
import { Designer as DesignerModel } from '@core/models/designer.model';
import { DexieService } from '@shared/idb-dexiejs/dexie-service';
import { v7 as uuidv7 } from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class DesignerService {
  private designerDexie = inject(DexieService).designers;

  async createDesigner(designer: DesignerModel) {
    const designerWithId = {
      ...designer,
      id: uuidv7()
    };
    await this.designerDexie.add(designerWithId);
  };

  async getDesigners() {
    return await this.designerDexie.toArray();
  }

  async getDesignerById(id: string): Promise<DesignerModel | undefined> {
    return await this.designerDexie.get(id);
  }

  async updateDesigner(id: string, designer: Partial<DesignerModel>) {
    await this.designerDexie.update(id, designer);
  }

  async deleteDesigner(id: string) {
    // elimnar solo hacer isActive false
    const designer = await this.getDesignerById(id);
    try {
      if (designer) {
        await this.updateDesigner(id, { isActive: false });
      }
    } catch (error) {
      console.error('Error al eliminar diseñador(a):', error);
    }
  }
}
