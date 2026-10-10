import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { VehicleApiEndpoint } from '../../../infrastructure/vehicle-api-endpoint';
import { Vehicle } from '../../../domain/model/vehicle.entity';
import { DialogComponent } from '../../../../shared/presentation/components/dialog/dialog';
import { VehicleFormComponent } from '../../components/vehicle-form/vehicle-form';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe,
    DialogComponent,
    VehicleFormComponent
  ],
  templateUrl: './vehicle-list.html',
  styleUrls: ['./vehicle-list.css']
})
export class VehicleListComponent implements OnInit {
  private vehicleApi = inject(VehicleApiEndpoint);
  private cdr = inject(ChangeDetectorRef);

  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  searchTerm = '';
  statusFilter = 'ALL';

  showDialog = false;
  editingVehicle: Vehicle = new Vehicle();

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.vehicleApi.getAll().subscribe({
      next: (data) => {
        console.log('📦 Vehículos cargados:', data);
        this.vehicles = data;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('❌ Error cargando:', err)
    });
  }

  applyFilters(): void {
    this.filteredVehicles = this.vehicles.filter(v => {
      const matchesSearch = !this.searchTerm ||
        v.plate.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        v.brand.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.statusFilter === 'ALL' || v.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  openCreateDialog(): void {
    this.editingVehicle = new Vehicle();
    this.showDialog = true;
  }

  openEditDialog(vehicle: Vehicle): void {
    this.editingVehicle = { ...vehicle };
    this.showDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
    this.editingVehicle = new Vehicle();
  }

  saveVehicle(vehicle: Vehicle): void {
    if (!vehicle.id || vehicle.id === 0) {
      this.vehicleApi.create(vehicle).subscribe({
        next: () => {
          this.loadVehicles();
          this.closeDialog();
        },
        error: (err) => {
          console.error('❌ Error creando:', err);
          alert('Error al crear el vehículo');
        }
      });
    } else {
      this.vehicleApi.update(vehicle.id, vehicle).subscribe({
        next: () => {
          this.loadVehicles();
          this.closeDialog();
        },
        error: (err) => {
          console.error('❌ Error actualizando:', err);
          alert('Error al actualizar el vehículo');
        }
      });
    }
  }

  deleteVehicle(id: number): void {
    if (!id || id === 0) {
      alert('ID inválido');
      return;
    }

    if (!confirm('¿Estás seguro de eliminar este vehículo?')) return;

    this.vehicleApi.delete(id).subscribe({
      next: () => {
        console.log('✅ Vehículo eliminado');
        this.loadVehicles();
      },
      error: (err) => {
        // Si el vehículo ya no existe en el backend, refrescamos silenciosamente
        if (err.status === 404) {
          console.warn('El vehículo ya no existía en el servidor. Refrescando lista...');
          this.loadVehicles();
          return;
        }

        // Para otros errores, sí avisamos
        console.error('Error al eliminar:', err);
        alert(`Error al eliminar (${err.status}). Revisa la consola.`);
      }
    });
  }
}
