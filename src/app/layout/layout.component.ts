import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { User } from '@core/models/user.model';
import { I18nService, Language } from '@shared/services/i18n.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-layout',
  template: `
    <div class="layout-container" [dir]="currentLanguage === 'ar' ? 'rtl' : 'ltr'">
      <div class="sidebar" [class.collapsed]="sidebarCollapsed">
        <div class="sidebar-header">
          <h2>Rental Dashboard</h2>
          <button 
            pButton 
            icon="pi pi-bars"
            class="p-button-text sidebar-toggle"
            (click)="toggleSidebar()"
          ></button>
        </div>

        <p-menu [model]="menuItems" [style]="{width: '100%', border: 'none'}"></p-menu>

        <div class="sidebar-footer">
          <div class="language-switcher">
            <button 
              pButton 
              [label]="currentLanguage === 'en' ? 'عربي' : 'English'"
              class="p-button-text"
              (click)="toggleLanguage()"
            ></button>
          </div>
          <div class="user-info">
            <p>{{ currentUser?.username }}</p>
            <small>{{ currentUser?.role }}</small>
          </div>
          <button 
            pButton 
            label="{{ i18n.translate('auth.logout') }}"
            icon="pi pi-sign-out"
            class="p-button-text w-full"
            (click)="logout()"
          ></button>
        </div>
      </div>

      <div class="main-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    .sidebar {
      width: 280px;
      background: #2c3e50;
      color: white;
      display: flex;
      flex-direction: column;
      transition: width 0.3s;
      overflow: hidden;
    }

    .sidebar.collapsed {
      width: 80px;
    }

    .sidebar-header {
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sidebar-header h2 {
      margin: 0;
      font-size: 1.2rem;
      white-space: nowrap;
    }

    .sidebar-toggle {
      color: white !important;
    }

    .sidebar-footer {
      margin-top: auto;
      padding: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .language-switcher {
      margin-bottom: 1rem;
    }

    .user-info {
      padding: 0.5rem 0;
      margin-bottom: 0.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .user-info p {
      margin: 0;
      font-weight: 500;
    }

    .user-info small {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.85rem;
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      background: #f5f5f5;
    }

    ::ng-deep .p-menu {
      background: transparent;
      border: none;
    }

    ::ng-deep .p-menu .p-menuitem-link {
      color: rgba(255, 255, 255, 0.8);
      padding: 1rem 1.5rem;
    }

    ::ng-deep .p-menu .p-menuitem-link:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    ::ng-deep .p-menu .p-menuitem-link.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .w-full {
      width: 100%;
    }
  `]
})
export class LayoutComponent implements OnInit {
  currentUser: User | null = null;
  currentLanguage: Language = 'en';
  sidebarCollapsed = false;
  menuItems: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.currentLanguage = this.i18n.getCurrentLanguage();
    this.buildMenu();
    
    this.i18n.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
      this.buildMenu();
    });
  }

  buildMenu(): void {
    this.menuItems = [
      {
        label: this.i18n.translate('dashboard.title'),
        icon: 'pi pi-home',
        routerLink: '/dashboard',
        command: () => this.router.navigate(['/dashboard'])
      },
      {
        label: this.i18n.translate('brands.title'),
        icon: 'pi pi-building',
        routerLink: '/brands',
        command: () => this.router.navigate(['/brands'])
      },
      {
        label: this.i18n.translate('activities.title'),
        icon: 'pi pi-briefcase',
        routerLink: '/activities',
        command: () => this.router.navigate(['/activities'])
      },
      {
        label: this.i18n.translate('rentals.title'),
        icon: 'pi pi-file',
        routerLink: '/rentals',
        command: () => this.router.navigate(['/rentals'])
      },
      {
        label: this.i18n.translate('financial.title'),
        icon: 'pi pi-chart-bar',
        routerLink: '/financial',
        command: () => this.router.navigate(['/financial'])
      },
      {
        label: this.i18n.translate('reports.title'),
        icon: 'pi pi-file-export',
        routerLink: '/reports',
        command: () => this.router.navigate(['/reports'])
      }
    ];
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage === 'en' ? 'ar' : 'en';
    this.i18n.setLanguage(newLang);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

