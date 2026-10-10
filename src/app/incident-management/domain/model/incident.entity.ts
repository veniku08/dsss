import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class Incident extends BaseEntity {
  vehicleId: number;
  driverId: number;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  date: Date;

  constructor() {
    super();
    this.vehicleId = 0;
    this.driverId = 0;
    this.description = '';
    this.severity = 'LOW';
    this.date = new Date();
  }
}
