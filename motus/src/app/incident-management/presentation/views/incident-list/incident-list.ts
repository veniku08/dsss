import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { IncidentApiEndpoint } from '../../../infrastructure/incident-api-endpoint';
import { Incident } from '../../../domain/model/incident.entity';
import { VehicleApiEndpoint } from '../../../../fleet-management/infrastructure/vehicle-api-endpoint';
import { Vehicle } from '../../../../fleet-management/domain/model/vehicle.entity';
import { AuthApiEndpoint } from '../../../../iam/infrastructure/auth-api-endpoint';
import { User } from '../../../../iam/domain/model/user.entity';
import { DialogComponent } from '../../../../shared/presentation/components/dialog/dialog';
import { IncidentFormComponent } from '../../components/incident-form/incident-form';

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, DialogComponent, IncidentFormComponent],
  templateUrl: './incident-list.html',
  styleUrls: ['./incident-list.css']
})
export class IncidentListComponent implements OnInit {
  private incidentApi = inject(IncidentApiEndpoint);
  private vehicleApi = inject(VehicleApiEndpoint);
  private authApi = inject(AuthApiEndpoint);
  private cdr = inject(ChangeDetectorRef);

  incidents: Incident[] = [];
  vehicles: Vehicle[] = [];
  drivers: User[] = [];

  showDialog = false;
  editingIncident: Incident = new Incident();

  ngOnInit(): void {
    this.loadVehiclesAndDrivers();
    this.load();
  }

  loadVehiclesAndDrivers(): void {
    this.vehicleApi.getAll().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando vehículos:', err)
    });

    this.authApi.getAll().subscribe({
      next: (data) => {
        this.drivers = data.filter(u => u.role === 'DRIVER');
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando conductores:', err)
    });
  }

  load(): void {
    this.incidentApi.getAll().subscribe({
      next: (data) => {
        this.incidents = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando incidencias:', err)
    });
  }

  getVehicleLabel(id: number): string {
    const v = this.vehicles.find(x => x.id === id);
    return v ? `${v.plate} - ${v.brand} ${v.model}` : `#${id}`;
  }

  getDriverName(id: number): string {
    const d = this.drivers.find(x => x.id === id);
    return d ? d.name : `#${id}`;
  }

  openCreate(): void {
    this.editingIncident = new Incident();
    this.showDialog = true;
  }

  openEdit(i: Incident): void {
    this.editingIncident = { ...i };
    this.showDialog = true;
  }

  close(): void {
    this.showDialog = false;
  }

  save(incident: Incident): void {
    if (incident.id === 0) {
      this.incidentApi.create(incident).subscribe(() => {
        this.load();
        this.close();
      });
    } else {
      this.incidentApi.update(incident.id, incident).subscribe(() => {
        this.load();
        this.close();
      });
    }
  }

  delete(id: number): void {
    if (confirm('¿Eliminar esta incidencia?')) {
      this.incidentApi.delete(id).subscribe(() => this.load());
    }
  }
}
