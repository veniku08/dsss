import { Component, OnInit, OnDestroy, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher';
import { AuthService } from '../../../../iam/application/auth.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSwitcherComponent],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent implements OnInit, OnDestroy {
  private auth = inject(AuthService);
  private router = inject(Router);

  user = this.auth.currentUser;
  isManager = () => this.auth.userRole() === 'FLEET_MANAGER';
  isDriver = () => this.auth.userRole() === 'DRIVER';

  breadcrumbTitle = 'Dashboard';

  mobileMenuOpen = signal(false);
  isMobile = signal(window.innerWidth < 768);

  private routerSub?: Subscription;

  private routeTitles: Record<string, string> = {
    '': 'Dashboard',
    'fleet': 'Gestión de flota',
    'incidents': 'Incidencias',
    'inspections': 'Inspecciones',
    'maintenance': 'Mantenimiento',
    'telemetry': 'Operaciones',
    'access': 'Acceso y roles',
    'master-data': 'Tablas maestras',
    'driver': 'Mi panel'
  };

  @HostListener('window:resize')
  onResize(): void {
    const mobile = window.innerWidth < 768;
    this.isMobile.set(mobile);
    if (!mobile) {
      this.mobileMenuOpen.set(false);
    }
  }

  ngOnInit(): void {
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects.split('/')[1] || '';
        this.breadcrumbTitle = this.routeTitles[url] || 'Dashboard';
        this.mobileMenuOpen.set(false);
      });

    const initialUrl = this.router.url.split('/')[1] || '';
    this.breadcrumbTitle = this.routeTitles[initialUrl] || 'Dashboard';
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  logout(): void {
    if (confirm('¿Cerrar sesión?')) {
      this.auth.logout();
    }
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }
}
