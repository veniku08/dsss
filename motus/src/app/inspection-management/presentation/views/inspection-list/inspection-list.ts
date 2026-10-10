import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { InspectionApiEndpoint } from '../../../infrastructure/inspection-api-endpoint';
import { Inspection } from '../../../domain/model/inspection.entity';
import { VehicleApiEndpoint } from '../../../../fleet-management/infrastructure/vehicle-api-endpoint';
import { Vehicle } from '../../../../fleet-management/domain/model/vehicle.entity';
import { AuthApiEndpoint } from '../../../../iam/infrastructure/auth-api-endpoint';
import { User } from '../../../../iam/domain/model/user.entity';
import { DialogComponent } from '../../../../shared/presentation/components/dialog/dialog';
import { InspectionFormComponent } from '../../components/inspection-form/inspection-form';

@Component({
  selector: 'app-inspection-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogComponent,
    TranslatePipe,
    InspectionFormComponent
  ],
  templateUrl: './inspection-list.html',
  styleUrls: ['./inspection-list.css']
})
export class InspectionListComponent implements OnInit {
  private inspectionApi = inject(InspectionApiEndpoint);
  private vehicleApi = inject(VehicleApiEndpoint);
  private authApi = inject(AuthApiEndpoint);
  private cdr = inject(ChangeDetectorRef);

  inspections: Inspection[] = [];
  filteredInspections: Inspection[] = [];
  vehicles: Vehicle[] = [];
  inspectors: User[] = [];

  searchTerm = '';
  showDialog = false;
  editingInspection: Inspection = new Inspection();

  ngOnInit(): void {
    this.loadVehiclesAndInspectors();
    this.loadInspections();
  }

  loadVehiclesAndInspectors(): void {
    this.vehicleApi.getAll().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando vehículos:', err)
    });

    this.authApi.getAll().subscribe({
      next: (data) => {
        this.inspectors = data.filter(u => u.role === 'DRIVER' || u.role === 'FLEET_MANAGER');
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando inspectores:', err)
    });
  }

  loadInspections(): void {
    this.inspectionApi.getAll().subscribe({
      next: (data) => {
        this.inspections = data;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando inspecciones:', err)
    });
  }

  applyFilters(): void {
    this.filteredInspections = this.inspections.filter(i => {
      return !this.searchTerm ||
        i.vehicleId.toString().includes(this.searchTerm) ||
        i.inspectorId.toString().includes(this.searchTerm);
    });
  }

  getVehicleLabel(id: number): string {
    const v = this.vehicles.find(x => x.id === id);
    return v ? `${v.plate} - ${v.brand} ${v.model}` : `#${id}`;
  }

  getInspectorName(id: number): string {
    const i = this.inspectors.find(x => x.id === id);
    return i ? i.name : `#${id}`;
  }

  openCreate(): void {
    const newInspection = new Inspection();
    newInspection.date = new Date();
    this.editingInspection = newInspection;
    this.showDialog = true;
  }

  openEdit(inspection: Inspection): void {
    this.editingInspection = JSON.parse(JSON.stringify(inspection));
    this.showDialog = true;
  }

  close(): void {
    this.showDialog = false;
  }

  save(inspection: Inspection): void {
    if (inspection.id === 0) {
      this.inspectionApi.create(inspection).subscribe(() => {
        this.loadInspections();
        this.close();
      });
    } else {
      this.inspectionApi.update(inspection.id, inspection).subscribe(() => {
        this.loadInspections();
        this.close();
      });
    }
  }

  delete(id: number): void {
    if (confirm('¿Eliminar esta inspección?')) {
      this.inspectionApi.delete(id).subscribe(() => this.loadInspections());
    }
  }

  getPassedCount(inspection: Inspection): number {
    return inspection.items.filter(i => i.status === 'OK').length;
  }
}
