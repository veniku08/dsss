import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TelemetryRecord } from '../../../domain/model/telemetry-record.entity';
import { VehicleApiEndpoint } from '../../../../fleet-management/infrastructure/vehicle-api-endpoint';
import { Vehicle } from '../../../../fleet-management/domain/model/vehicle.entity';

@Component({
  selector: 'app-telemetry-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './telemetry-form.html',
  styleUrls: ['./telemetry-form.css']
})
export class TelemetryFormComponent implements OnInit {
  @Input() record: TelemetryRecord = new TelemetryRecord();
  @Output() save = new EventEmitter<TelemetryRecord>();
  @Output() cancel = new EventEmitter<void>();

  private vehicleApi = inject(VehicleApiEndpoint);

  vehicles: Vehicle[] = [];

  ngOnInit(): void {
    this.vehicleApi.getAll().subscribe(data => {
      this.vehicles = data;
    });

    if (!this.record.timestamp) {
      this.record.timestamp = new Date();
    }
  }

  onSubmit(): void {
    this.save.emit(this.record);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
