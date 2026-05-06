import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <main class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-4 sm:p-6">
      <section class="max-w-6xl mx-auto min-h-[88vh] grid lg:grid-cols-2 gap-6 items-center">
        <div class="hidden lg:block rounded-3xl p-9 bg-slate-900 text-white relative overflow-hidden">
          <div class="absolute -top-16 -right-14 h-56 w-56 rounded-full bg-indigo-500/30 blur-2xl"></div>
          <div class="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-500/20 blur-2xl"></div>
          <div class="relative">
            <a routerLink="/" class="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold">
              <span class="material-symbols-outlined text-[18px]">shield_lock</span>
              CareNest
            </a>
            <h2 class="mt-8 text-4xl font-bold leading-tight tracking-tight">Safe hiring for homes that need trusted care.</h2>
            <p class="mt-4 text-slate-300 max-w-md">Connect with verified maids and nannies, manage bookings, and track service quality from one dashboard.</p>
            <ul class="mt-8 space-y-3 text-sm text-slate-200">
              <li class="flex items-center gap-2"><span class="material-symbols-outlined text-base text-emerald-300">verified</span>Verified helper profiles</li>
              <li class="flex items-center gap-2"><span class="material-symbols-outlined text-base text-emerald-300">calendar_month</span>Flexible booking plans</li>
              <li class="flex items-center gap-2"><span class="material-symbols-outlined text-base text-emerald-300">insights</span>Service history and reliability insights</li>
            </ul>
          </div>
        </div>

        <div class="w-full max-w-xl mx-auto">
          <router-outlet></router-outlet>
        </div>
      </section>
    </main>
  `
})
export class AuthLayoutComponent {}
