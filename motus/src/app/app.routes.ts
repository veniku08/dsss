import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/presentation/components/layout/layout';
import { authGuard, roleGuard } from './iam/infrastructure/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./iam/presentation/views/login/login').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'fleet',
        canActivate: [roleGuard(['FLEET_MANAGER'])],
        loadComponent: () =>
          import('./fleet-management/presentation/views/vehicle-list/vehicle-list')
            .then(m => m.VehicleListComponent)
      },
      {
        path: 'incidents',
        canActivate: [roleGuard(['FLEET_MANAGER'])],
        loadComponent: () =>
          import('./incident-management/presentation/views/incident-list/incident-list')
            .then(m => m.IncidentListComponent)
      },
      {
        path: 'inspections',
        canActivate: [roleGuard(['FLEET_MANAGER'])],
        loadComponent: () =>
          import('./inspection-management/presentation/views/inspection-list/inspection-list')
            .then(m => m.InspectionListComponent)
      },
      {
        path: 'maintenance',
        canActivate: [roleGuard(['FLEET_MANAGER'])],
        loadComponent: () =>
          import('./maintenance-management/presentation/views/maintenance-list/maintenance-list')
            .then(m => m.MaintenanceListComponent)
      },
      {
        path: 'telemetry',
        canActivate: [roleGuard(['FLEET_MANAGER'])],
        loadComponent: () =>
          import('./vehicle-operations/presentation/views/telemetry-list/telemetry-list')
            .then(m => m.TelemetryListComponent)
      },
      {
        path: 'access',
        canActivate: [roleGuard(['FLEET_MANAGER'])],
        loadComponent: () =>
          import('./shared/presentation/views/placeholder/placeholder')
            .then(m => m.PlaceholderComponent)
      },
      {
        path: 'master-data',
        canActivate: [roleGuard(['FLEET_MANAGER'])],
        loadComponent: () =>
          import('./shared/presentation/views/placeholder/placeholder')
            .then(m => m.PlaceholderComponent)
      },
      {
        path: 'driver',
        canActivate: [roleGuard(['DRIVER'])],
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./vehicle-operations/presentation/views/driver-dashboard/driver-dashboard')
                .then(m => m.DriverDashboardComponent)
          },
          {
            path: 'my-vehicle',
            loadComponent: () =>
              import('./vehicle-operations/presentation/views/my-vehicle/my-vehicle')
                .then(m => m.MyVehicleComponent)
          },
          {
            path: 'my-incidents',
            loadComponent: () =>
              import('./vehicle-operations/presentation/views/my-incidents/my-incidents')
                .then(m => m.MyIncidentsComponent)
          },
          {
            path: 'inspection',
            loadComponent: () =>
              import('./inspection-management/presentation/views/inspection-list/inspection-list')
                .then(m => m.InspectionListComponent)
          },
          {
            path: 'incident',
            loadComponent: () =>
              import('./incident-management/presentation/views/incident-list/incident-list')
                .then(m => m.IncidentListComponent)
          },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
      },
      { path: '', redirectTo: 'fleet', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
