import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar.component';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="page-shell">
      <router-outlet></router-outlet>
    </main>
    <footer class="border-t border-[#ddd2be] bg-[#f5efe4]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid gap-8 md:grid-cols-3 text-sm text-[#5f675d]">
        <div>
          <h3 class="text-2xl font-semibold text-[#1f2a1f]">CareNest</h3>
          <p class="mt-2">Verified maids and nannies for modern Indian families. Transparent pricing, quick replacements, real care.</p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-[0.18em] text-[#8a8f83] mb-2">Company</p>
          <p>About</p>
          <p class="mt-1">Careers</p>
          <p class="mt-1">Press</p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-[0.18em] text-[#8a8f83] mb-2">Support</p>
          <p>Help Center</p>
          <p class="mt-1">Trust & Safety</p>
          <p class="mt-1">Contact</p>
        </div>
      </div>
    </footer>
  `
})
export class UserLayoutComponent {}
