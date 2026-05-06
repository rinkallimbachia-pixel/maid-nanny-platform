import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../shared/components/sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `<div class="min-h-screen md:flex"><app-sidebar [menu]="menu"></app-sidebar><main class="flex-1 p-3 sm:p-6 bg-slate-50"><router-outlet></router-outlet></main></div>`
})
export class AdminLayoutComponent {
  menu = [
    { label: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
    { label: 'Verify Helpers', icon: 'verified_user', path: '/admin/verify-helpers' },
    { label: 'Bookings', icon: 'calendar_month', path: '/admin/booking-management' },
  ];
}
