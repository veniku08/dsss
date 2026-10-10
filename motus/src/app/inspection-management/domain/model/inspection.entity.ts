import { BaseEntity } from '../../../shared/domain/model/base-entity';

export interface InspectionItem {
  name: string;
  status: 'OK' | 'FAIL';
}

export class Inspection extends BaseEntity {
  vehicleId: number;
  inspectorId: number;
  date: Date;
  items: InspectionItem[];
  observations: string;

  constructor() {
    super();
    this.vehicleId = 0;
    this.inspectorId = 0;
    this.date = new Date();
    this.items = [];
    this.observations = '';
  }
}
