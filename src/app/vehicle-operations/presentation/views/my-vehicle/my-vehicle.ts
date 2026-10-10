import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleApiEndpoint } from '../../../../fleet-management/infrastructure/vehicle-api-endpoint';
import { Vehicle } from '../../../../fleet-management/domain/model/vehicle.entity';

@Component({
  selector: 'app-my-vehicle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-vehicle.html',
  styleUrls: ['./my-vehicle.css']
})
export class MyVehicleComponent implements OnInit {
  private vehicleApi = inject(VehicleApiEndpoint);
  vehicle = signal<Vehicle | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.vehicleApi.getAll().subscribe({
      next: (data) => {
        // Simulación: asigna el primer vehículo disponible
        const available = data.find(v => v.status === 'AVAILABLE');
        this.vehicle.set(available || null);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
