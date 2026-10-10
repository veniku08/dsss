import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class Vehicle extends BaseEntity {
  plate: string;
  brand: string;
  model: string;
  year: number;
  odometer: number;
  status: 'AVAILABLE' | 'IN_MAINTENANCE' | 'OUT_OF_SERVICE';

  constructor() {
    super();
    this.plate = '';
    this.brand = '';
    this.model = '';
    this.year = 0;
    this.odometer = 0;
    this.status = 'AVAILABLE';
  }
}
