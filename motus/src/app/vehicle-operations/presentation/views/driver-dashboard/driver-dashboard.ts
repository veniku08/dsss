import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../iam/application/auth.service';
import { IncidentApiEndpoint } from '../../../../incident-management/infrastructure/incident-api-endpoint';
import { InspectionApiEndpoint } from '../../../../inspection-management/infrastructure/inspection-api-endpoint';
import { VehicleApiEndpoint } from '../../../../fleet-management/infrastructure/vehicle-api-endpoint';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './driver-dashboard.html',
  styleUrls: ['./driver-dashboard.css']
})
export class DriverDashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private incidentApi = inject(IncidentApiEndpoint);
  private inspectionApi = inject(InspectionApiEndpoint);
  private vehicleApi = inject(VehicleApiEndpoint);

  user = this.auth.currentUser;

  totalIncidents = signal(0);
  totalInspections = signal(0);
  currentVehicle = signal<string>('Sin asignar');

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    const user = this.user();
    if (!user) return;

    this.incidentApi.getAll().subscribe(data => {
      this.totalIncidents.set(data.filter(i => i.driverId === user.id).length);
    });

    this.inspectionApi.getAll().subscribe(data => {
      this.totalInspections.set(data.filter(i => i.inspectorId === user.id).length);
    });

    this.vehicleApi.getAll().subscribe(data => {
      const available = data.find(v => v.status === 'AVAILABLE');
      if (available) {
        this.currentVehicle.set(`${available.plate} - ${available.brand} ${available.model}`);
      }
    });
  }
}
