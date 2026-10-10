import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../iam/application/auth.service';
import { IncidentApiEndpoint } from '../../../../incident-management/infrastructure/incident-api-endpoint';
import { Incident } from '../../../../incident-management/domain/model/incident.entity';

@Component({
  selector: 'app-my-incidents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-incidents.html',
  styleUrls: ['./my-incidents.css']
})
export class MyIncidentsComponent implements OnInit {
  private auth = inject(AuthService);
  private incidentApi = inject(IncidentApiEndpoint);

  incidents = signal<Incident[]>([]);

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (!user) return;

    this.incidentApi.getAll().subscribe(data => {
      this.incidents.set(data.filter(i => i.driverId === user.id));
    });
  }
}
