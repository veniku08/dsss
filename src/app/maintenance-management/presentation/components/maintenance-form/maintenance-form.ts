import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaintenanceOrder } from '../../../domain/model/maintenance-order.entity';
import { VehicleApiEndpoint } from '../../../../fleet-management/infrastructure/vehicle-api-endpoint';
import { Vehicle } from '../../../../fleet-management/domain/model/vehicle.entity';

@Component({
  selector: 'app-maintenance-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenance-form.html',
  styleUrls: ['./maintenance-form.css']
})
export class MaintenanceFormComponent implements OnInit {
  @Input() order: MaintenanceOrder = new MaintenanceOrder();
  @Output() save = new EventEmitter<MaintenanceOrder>();
  @Output() cancel = new EventEmitter<void>();

  private vehicleApi = inject(VehicleApiEndpoint);

  vehicles: Vehicle[] = [];

  ngOnInit(): void {
    this.vehicleApi.getAll().subscribe({
      next: (data) => {
        this.vehicles = data;
      },
      error: (err) => console.error('Error cargando vehículos:', err)
    });

    if (!this.order.scheduledDate) {
      this.order.scheduledDate = new Date();
    }
  }

  onSubmit(): void {
    console.log('✅ onSubmit disparado con:', this.order);
    this.save.emit(this.order);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
