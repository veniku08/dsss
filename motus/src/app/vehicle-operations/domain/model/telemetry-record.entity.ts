import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class TelemetryRecord extends BaseEntity {
  vehicleId: number;
  timestamp: Date;
  latitude: number;
  longitude: number;
  speed: number;
  fuelLevel: number;
  engineTemperature: number;

  constructor() {
    super();
    this.vehicleId = 0;
    this.timestamp = new Date();
    this.latitude = 0;
    this.longitude = 0;
    this.speed = 0;
    this.fuelLevel = 0;
    this.engineTemperature = 0;
  }
}
