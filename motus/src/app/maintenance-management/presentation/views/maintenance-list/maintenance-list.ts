import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaintenanceApiEndpoint } from '../../../infrastructure/maintenance-api-endpoint';
import { MaintenanceOrder } from '../../../domain/model/maintenance-order.entity';
import { VehicleApiEndpoint } from '../../../../fleet-management/infrastructure/vehicle-api-endpoint';
import { Vehicle } from '../../../../fleet-management/domain/model/vehicle.entity';
import { DialogComponent } from '../../../../shared/presentation/components/dialog/dialog';
import { MaintenanceFormComponent } from '../../components/maintenance-form/maintenance-form';

@Component({
  selector: 'app-maintenance-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogComponent,
    MaintenanceFormComponent
  ],
  templateUrl: './maintenance-list.html',
  styleUrls: ['./maintenance-list.css']
})
export class MaintenanceListComponent implements OnInit {
  private maintenanceApi = inject(MaintenanceApiEndpoint);
  private vehicleApi = inject(VehicleApiEndpoint);
  private cdr = inject(ChangeDetectorRef);

  orders: MaintenanceOrder[] = [];
  filteredOrders: MaintenanceOrder[] = [];
  vehicles: Vehicle[] = [];

  searchTerm = '';
  statusFilter = 'ALL';
  showDialog = false;
  editingOrder: MaintenanceOrder = new MaintenanceOrder();

  ngOnInit(): void {
    this.loadVehicles();
    this.loadOrders();
  }

  loadVehicles(): void {
    this.vehicleApi.getAll().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando vehículos:', err)
    });
  }

  loadOrders(): void {
    this.maintenanceApi.getAll().subscribe({
      next: (data) => {
        console.log('📦 Órdenes recibidas:', data);
        this.orders = data;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando órdenes:', err)
    });
  }

  applyFilters(): void {
    this.filteredOrders = this.orders.filter(o => {
      const matchesSearch = !this.searchTerm ||
        o.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        o.vehicleId.toString().includes(this.searchTerm);
      const matchesStatus = this.statusFilter === 'ALL' || o.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  getVehicleLabel(id: number): string {
    const v = this.vehicles.find(x => x.id === id);
    return v ? `${v.plate} - ${v.brand} ${v.model}` : `#${id}`;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'PENDING': 'Pendiente',
      'IN_PROGRESS': 'En Progreso',
      'COMPLETED': 'Completado'
    };
    return labels[status] || status;
  }

  getTypeLabel(type: string): string {
    return type === 'PREVENTIVE' ? 'Preventivo' : 'Correctivo';
  }

  openCreate(): void {
    const newOrder = new MaintenanceOrder();
    newOrder.scheduledDate = new Date();
    this.editingOrder = newOrder;
    this.showDialog = true;
  }

  openEdit(order: MaintenanceOrder): void {
    this.editingOrder = JSON.parse(JSON.stringify(order));
    this.showDialog = true;
  }

  close(): void {
    this.showDialog = false;
  }

  save(order: MaintenanceOrder): void {
    console.log('💾 save() recibido:', order);
    console.log('💾 ID:', order.id, 'tipo:', typeof order.id);

    if (!order.id || order.id === 0) {
      // CREAR
      this.maintenanceApi.create(order).subscribe({
        next: (created) => {
          console.log('✅ Creado:', created);
          this.loadOrders();
          this.close();
        },
        error: (err) => {
          console.error('❌ Error al crear:', err);
          console.error('Status:', err.status);
          console.error('Body:', err.error);
        }
      });
    } else {
      // ACTUALIZAR
      this.maintenanceApi.update(order.id, order).subscribe({
        next: (updated) => {
          console.log('✅ Actualizado:', updated);
          this.loadOrders();
          this.close();
        },
        error: (err) => {
          console.error('❌ Error al actualizar:', err);
          console.error('Status:', err.status);
          console.error('Body:', err.error);
        }
      });
    }
  }

  delete(id: number): void {
    if (confirm('¿Eliminar esta orden de mantenimiento?')) {
      this.maintenanceApi.delete(id).subscribe({
        next: () => this.loadOrders(),
        error: (err) => console.error('❌ Error al eliminar:', err)
      });
    }
  }
}
