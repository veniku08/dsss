import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inspection, InspectionItem } from '../../../domain/model/inspection.entity';
import { VehicleApiEndpoint } from '../../../../fleet-management/infrastructure/vehicle-api-endpoint';
import { Vehicle } from '../../../../fleet-management/domain/model/vehicle.entity';
import { AuthApiEndpoint } from '../../../../iam/infrastructure/auth-api-endpoint';
import { User } from '../../../../iam/domain/model/user.entity';

@Component({
  selector: 'app-inspection-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inspection-form.html',
  styleUrls: ['./inspection-form.css']
})
export class InspectionFormComponent implements OnInit {
  @Input() inspection: Inspection = new Inspection();
  @Output() save = new EventEmitter<Inspection>();
  @Output() cancel = new EventEmitter<void>();

  private vehicleApi = inject(VehicleApiEndpoint);
  private authApi = inject(AuthApiEndpoint);

  vehicles: Vehicle[] = [];
  drivers: User[] = [];

  defaultItems: InspectionItem[] = [
    { name: 'Frenos', status: 'OK' },
    { name: 'Luces', status: 'OK' },
    { name: 'Llantas', status: 'OK' },
    { name: 'Aceite', status: 'OK' },
    { name: 'Refrigerante', status: 'OK' }
  ];

  ngOnInit(): void {
    this.loadVehicles();
    this.loadDrivers();

    if (!this.inspection.items || this.inspection.items.length === 0) {
      this.inspection.items = JSON.parse(JSON.stringify(this.defaultItems));
    }

    if (!this.inspection.date) {
      this.inspection.date = new Date();
    }
  }

  loadVehicles(): void {
    this.vehicleApi.getAll().subscribe(data => {
      this.vehicles = data;
    });
  }

  loadDrivers(): void {
    this.authApi.getAll().subscribe(data => {
      this.drivers = data.filter(u => u.role === 'DRIVER');
    });
  }

  onSubmit(): void {
    this.save.emit(this.inspection);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
