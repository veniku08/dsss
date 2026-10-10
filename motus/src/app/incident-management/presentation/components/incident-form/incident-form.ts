import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Incident } from '../../../domain/model/incident.entity';
import { VehicleApiEndpoint } from '../../../../fleet-management/infrastructure/vehicle-api-endpoint';
import { Vehicle } from '../../../../fleet-management/domain/model/vehicle.entity';
import { AuthApiEndpoint } from '../../../../iam/infrastructure/auth-api-endpoint';
import { User } from '../../../../iam/domain/model/user.entity';

@Component({
  selector: 'app-incident-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './incident-form.html',
  styleUrls: ['./incident-form.css']
})
export class IncidentFormComponent implements OnInit {
  @Input() incident: Incident = new Incident();
  @Output() save = new EventEmitter<Incident>();
  @Output() cancel = new EventEmitter<void>();

  private vehicleApi = inject(VehicleApiEndpoint);
  private authApi = inject(AuthApiEndpoint);

  vehicles: Vehicle[] = [];
  drivers: User[] = [];

  ngOnInit(): void {
    this.loadVehicles();
    this.loadDrivers();

    if (!this.incident.date) {
      this.incident.date = new Date();
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
    this.save.emit(this.incident);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
