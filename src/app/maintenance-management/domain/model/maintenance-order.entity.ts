import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class MaintenanceOrder extends BaseEntity {
  vehicleId: number;
  type: 'PREVENTIVE' | 'CORRECTIVE';
  description: string;
  scheduledDate: Date;
  cost: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

  constructor() {
    super();
    this.vehicleId = 0;
    this.type = 'PREVENTIVE';
    this.description = '';
    this.scheduledDate = new Date();
    this.cost = 0;
    this.status = 'PENDING';
  }
}
