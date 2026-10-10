import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { TelemetryApiEndpoint } from '../../../infrastructure/telemetry-api-endpoint';
import { TelemetryRecord } from '../../../domain/model/telemetry-record.entity';
import { DialogComponent } from '../../../../shared/presentation/components/dialog/dialog';
import { TelemetryFormComponent } from '../../components/telemetry-form/telemetry-form';

@Component({
  selector: 'app-telemetry-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe,
    DialogComponent,
    TelemetryFormComponent
  ],
  templateUrl: './telemetry-list.html',
  styleUrls: ['./telemetry-list.css']
})
export class TelemetryListComponent implements OnInit {
  records: TelemetryRecord[] = [];
  filteredRecords: TelemetryRecord[] = [];
  searchTerm = '';
  showDialog = false;
  editingRecord: TelemetryRecord = new TelemetryRecord();

  constructor(private telemetryApi: TelemetryApiEndpoint) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.telemetryApi.getAll().subscribe(data => {
      this.records = data;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredRecords = this.records.filter(r => {
      return !this.searchTerm || r.vehicleId.toString().includes(this.searchTerm);
    });
  }

  openCreate(): void {
    const newRecord = new TelemetryRecord();
    newRecord.timestamp = new Date();
    this.editingRecord = newRecord;
    this.showDialog = true;
  }

  openEdit(record: TelemetryRecord): void {
    this.editingRecord = JSON.parse(JSON.stringify(record));
    this.showDialog = true;
  }

  close(): void {
    this.showDialog = false;
  }

  save(record: TelemetryRecord): void {
    if (record.id === 0) {
      this.telemetryApi.create(record).subscribe(() => {
        this.load();
        this.close();
      });
    } else {
      this.telemetryApi.update(record.id, record).subscribe(() => {
        this.load();
        this.close();
      });
    }
  }

  delete(id: number): void {
    if (confirm('¿Eliminar este registro de telemetría?')) {
      this.telemetryApi.delete(id).subscribe(() => this.load());
    }
  }

  getFuelClass(level: number): string {
    if (level < 20) return 'danger';
    if (level < 50) return 'warning';
    return 'success';
  }

  getTempClass(temp: number): string {
    if (temp > 100) return 'danger';
    if (temp > 90) return 'warning';
    return 'success';
  }
}
