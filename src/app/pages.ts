import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BookingCardComponent } from './shared/components/booking-card.component';
import { EmptyStateComponent } from './shared/components/empty-state.component';
import { HelperCardComponent } from './shared/components/helper-card.component';
import { StatusBadgeComponent } from './shared/components/status-badge.component';

type HelperProfile = {
  id: string;
  name: string;
  role: string;
  skills: string[];
  rating: number;
  price: string;
  image: string;
  bio: string;
};

const HELPER_DIRECTORY: HelperProfile[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    role: 'Childcare Specialist',
    skills: ['First Aid', 'Cooking', 'Toddler Care'],
    rating: 4.8,
    price: 'INR 799/day',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
    bio: '5+ years experience in childcare and toddler routines.',
  },
  {
    id: '2',
    name: 'Anjali Verma',
    role: 'Housekeeping Pro',
    skills: ['Deep Cleaning', 'Laundry'],
    rating: 4.7,
    price: 'INR 699/day',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
    bio: 'Reliable housekeeping support with focus on cleanliness and hygiene.',
  },
  {
    id: '3',
    name: 'Meera Iyer',
    role: 'Infant Nanny',
    skills: ['Infant Care', 'Meal Prep', 'First Aid'],
    rating: 4.9,
    price: 'INR 999/day',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300',
    bio: '7+ years experience in newborn and toddler care.',
  },
  {
    id: '4',
    name: 'Kavita Rao',
    role: 'Senior Nanny',
    skills: ['Night Care', 'First Aid'],
    rating: 4.9,
    price: 'INR 1099/day',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
    bio: 'Expert nanny for night schedules and infant safety.',
  },
  {
    id: '5',
    name: 'Rupa Das',
    role: 'Home Maid',
    skills: ['Cleaning', 'Ironing'],
    rating: 4.6,
    price: 'INR 599/day',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
    bio: 'Daily home support for cleaning and household chores.',
  },
  {
    id: '6',
    name: 'Sneha Kulkarni',
    role: 'Nanny + Tutor',
    skills: ['Homework', 'Meals'],
    rating: 4.8,
    price: 'INR 899/day',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300',
    bio: 'Balanced childcare and homework support for school-going children.',
  },
];

@Component({
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, HelperCardComponent, RouterLink],
  template: `
    <section class="surface-card p-6 sm:p-8 lg:p-10 animate-float overflow-hidden relative">
      <div class="absolute -top-14 -right-14 h-44 w-44 rounded-full bg-[#e8decb] blur-2xl"></div>
      <div class="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-[#dce7d2] blur-2xl"></div>
      <div class="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-6 lg:gap-8 items-start">
        <div>
          <p class="inline-flex items-center gap-2 rounded-full bg-[#eee5d7] border border-[#d6cab3] px-3 py-1 text-xs font-semibold text-[#4a4f43] mb-4">Care that feels like family</p>
          <h1 class="section-title mb-3">Care that feels like <span class="gradient-text">family</span>, found in minutes.</h1>
          <p class="section-subtitle max-w-2xl">CareNest helps families discover verified domestic helpers with transparent plans, strong reliability, and replacement support.</p>

          <div class="max-w-2xl mt-6 hero-search-wrap">
            <span class="material-symbols-outlined hero-search-icon">search</span>
            <input class="hero-search-input" placeholder="Search by city, service, or skill" />
            <button mat-flat-button color="primary" class="hero-search-btn" routerLink="/search">Get Started</button>
          </div>

          <div class="mt-6 grid sm:grid-cols-3 gap-3">
            @for(item of trustStats; track item.label) {
              <div class="rounded-2xl border border-[#e2d9c8] bg-[#f8f3e9] px-4 py-3 shadow-sm">
                <p class="text-xl font-bold text-[#20281f]">{{ item.value }}</p>
                <p class="text-sm text-[#697062]">{{ item.label }}</p>
              </div>
            }
          </div>
        </div>

        <aside class="rounded-3xl border border-[#ddd2be] bg-[#f5efe3] p-5 lg:p-6">
          <h3 class="text-lg font-semibold tracking-tight text-[#1f2a1f]">Why families choose CareNest</h3>
          <div class="mt-4 space-y-3">
            @for(point of highlights; track point.title) {
              <div class="rounded-2xl border border-[#ddd2be] bg-[#f8f2e6] p-3">
                <p class="font-semibold text-[#1f2a1f]">{{ point.title }}</p>
                <p class="text-sm text-[#646b60] mt-1">{{ point.desc }}</p>
              </div>
            }
          </div>
        </aside>
      </div>
    </section>

    <section class="mt-8">
      <div class="flex items-end justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h2 class="text-xl sm:text-2xl font-semibold tracking-tight">Featured Helpers</h2>
          <p class="text-sm text-slate-500">Curated professionals with strong ratings and verified records.</p>
        </div>
        <button mat-stroked-button color="primary" routerLink="/search">View All Helpers</button>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
        <app-helper-card></app-helper-card>
        <app-helper-card [helper]="helpers[0]"></app-helper-card>
        <app-helper-card [helper]="helpers[1]"></app-helper-card>
      </div>
    </section>

    <section class="mt-8 grid md:grid-cols-3 gap-4">
      @for(step of steps; track step.title) {
        <div class="surface-card p-5">
          <span class="text-brand-primary font-bold">{{ step.no }}</span>
          <h3 class="font-semibold mt-2">{{ step.title }}</h3>
          <p class="text-sm text-slate-500">{{ step.desc }}</p>
        </div>
      }
    </section>

    <section class="mt-8">
      <h2 class="text-xl font-semibold tracking-tight mb-4">Flexible Service Plans</h2>
      <div class="grid md:grid-cols-3 gap-4">
        @for(plan of plans; track plan.name) {
          <article class="surface-card p-5 relative overflow-hidden" [class.ring-2]="plan.recommended" [class.ring-indigo-200]="plan.recommended">
            <div class="absolute right-0 top-0 h-16 w-16 rounded-bl-3xl bg-indigo-100/70"></div>
            @if (plan.recommended) {
              <span class="absolute right-3 top-3 rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white">Recommended</span>
            }
            <p class="text-xs uppercase tracking-wide text-slate-400">{{ plan.billing }}</p>
            <h3 class="text-lg font-semibold mt-1">{{ plan.name }}</h3>
            <p class="text-brand-primary text-2xl font-bold mt-2">{{ plan.price }}</p>
            <p class="text-sm text-slate-500 mt-2">{{ plan.description }}</p>
          </article>
        }
      </div>
    </section>

    <section class="mt-8 surface-card p-6 sm:p-7">
      <h2 class="text-xl font-semibold tracking-tight mb-4">What Families Say</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <blockquote class="p-4 rounded-xl bg-slate-50 border border-slate-200">
          "Professional and punctual nanny, highly recommended!"
          <footer class="mt-2 text-sm text-slate-500">- Riya Shah, Mumbai</footer>
        </blockquote>
        <blockquote class="p-4 rounded-xl bg-slate-50 border border-slate-200">
          "Booking flow is super smooth, very trustworthy platform."
          <footer class="mt-2 text-sm text-slate-500">- Aman Gupta, Pune</footer>
        </blockquote>
      </div>
    </section>

    <section class="mt-8 rounded-3xl bg-gradient-to-r from-[#d77842] to-[#bc6133] px-6 py-7 sm:px-8 sm:py-8 text-white">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 class="text-2xl font-semibold tracking-tight">Need reliable home support this week?</h3>
          <p class="mt-1 text-orange-100">Share your service needs and get matched with verified helpers quickly.</p>
        </div>
        <button mat-stroked-button class="!border-white/70 !text-white" routerLink="/booking">Start Booking</button>
      </div>
    </section>
  `,
})
export class HomePageComponent {
  helpers = HELPER_DIRECTORY.filter((helper) => ['2', '3'].includes(helper.id));

  steps = [
    { no: '01', title: 'Search', desc: 'Pick your city and preferred service type.' },
    { no: '02', title: 'Compare', desc: 'View ratings, skills, and verified profiles.' },
    { no: '03', title: 'Book', desc: 'Choose plan and confirm in a few clicks.' },
  ];

  plans = [
    { name: 'Hourly Plan', billing: 'On Demand', price: 'INR 149/hr', description: 'Ideal for quick help during specific hours.', recommended: false },
    { name: 'Monthly Plan', billing: 'Most Popular', price: 'INR 18,999/mo', description: 'Regular support for families with predictable schedules.', recommended: true },
    { name: 'Yearly Plan', billing: 'Best Value', price: 'INR 2,09,999/yr', description: 'Long-term household support with priority replacements.', recommended: false },
  ];

  trustStats = [
    { value: '2,000+', label: 'Verified Helpers' },
    { value: '4.8/5', label: 'Average Family Rating' },
    { value: '30 min', label: 'Average Booking Confirmation' },
  ];

  highlights = [
    { title: '100% Verified Profiles', desc: 'KYC and background verification badges shown before booking.' },
    { title: 'Transparent Pricing', desc: 'Hourly, monthly, and yearly plans with no hidden charges.' },
    { title: 'Quick Replacements', desc: 'Fallback support in case of sudden helper unavailability.' },
  ];
}

@Component({
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatButtonModule, HelperCardComponent, FormsModule],
  template: `
    <section class="mb-4">
      <h1 class="text-4xl sm:text-5xl font-semibold tracking-tight text-[#20271f]">Find the helper your home <span class="gradient-text">deserves</span>.</h1>
      <p class="text-[#60685e] mt-2">Every profile is KYC verified, background checked, and rated by real Indian families.</p>
    </section>

    <div class="grid lg:grid-cols-[300px_1fr] gap-6 items-start">
      <aside class="surface-card p-5 sm:p-6 space-y-4 lg:sticky lg:top-24">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold tracking-tight text-lg text-[#1f2a1f]">Filters</h2>
          <button class="text-xs text-[#496040] font-semibold">Reset</button>
        </div>
        <div class="space-y-3">
          <label class="filter-label" for="service-type">Service Type</label>
          <select id="service-type" class="filter-select" [(ngModel)]="serviceFilter" name="serviceFilter">
            <option value="">All</option>
            <option value="1">Maid</option>
            <option value="2">Nanny</option>
          </select>
        </div>
        <div class="space-y-3">
          <label class="filter-label" for="experience">Experience</label>
          <select id="experience" class="filter-select" [(ngModel)]="minExperience" name="minExperience">
            <option value="">Any</option>
            <option value="1">1+ Years</option>
            <option value="3">3+ Years</option>
          </select>
        </div>
        <div class="space-y-3">
          <label class="filter-label" for="availability">Availability</label>
          <select id="availability" class="filter-select" [(ngModel)]="availability" name="availability">
            <option value="">Any</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
          </select>
        </div>
        <div class="space-y-3">
          <label class="filter-label" for="service-plan">Service Plan</label>
          <select id="service-plan" class="filter-select">
            <option>Hourly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-2 pt-2">
          <button mat-flat-button color="primary" class="w-full" (click)="loadHelpers()">Apply</button>
          <button mat-stroked-button color="primary" class="w-full" (click)="clearFilters()">Clear</button>
        </div>
      </aside>

      <div>
        <div class="surface-card p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
          <p class="text-sm text-[#62695f]"><span class="font-semibold text-[#1f2a1f]">{{ helpers.length }}</span> helpers found in your area</p>
          <div class="flex flex-wrap items-center gap-2 text-sm">
            <span class="text-[#777d72]">Sort by:</span>
            <button class="rounded-full border border-[#cbbfa9] bg-[#ebe3d5] px-3 py-1.5 text-[#2d422f] font-medium">Top Rated</button>
            <button class="rounded-full border border-[#d8ccb7] bg-[#f8f2e6] px-3 py-1.5 text-[#5c6459] font-medium">Lowest Price</button>
          </div>
        </div>

        <section class="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          @for(item of helpers; track item.name) {
            <app-helper-card [helper]="item"></app-helper-card>
          }
        </section>
      </div>
    </div>
  `,
})
export class SearchHelpersPageComponent {
  helpers = HELPER_DIRECTORY.filter((helper) => ['4', '5', '6'].includes(helper.id));
  serviceFilter = '';
  minExperience = '';
  availability = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadHelpers();
  }

  async loadHelpers(): Promise<void> {
    const params = new URLSearchParams();
    if (this.serviceFilter) params.set('serviceId', this.serviceFilter);
    if (this.minExperience) params.set('minExperience', this.minExperience);
    if (this.availability) params.set('availability', this.availability);
    const query = params.toString() ? `?${params.toString()}` : '';

    try {
      const response = await firstValueFrom(this.http.get<{ data: Array<any> }>(`http://localhost:4000/api/helpers${query}`));
      this.helpers = response.data.map((item, index) => ({
        id: String(item.id),
        name: item.full_name,
        role: item.service_name || 'Helper',
        skills: [],
        rating: 4.6,
        price: `INR ${Math.round(item.hourly_rate || 0)}/hr`,
        image: HELPER_DIRECTORY[index % HELPER_DIRECTORY.length]?.image || HELPER_DIRECTORY[0].image,
        bio: item.bio || 'Verified helper profile',
      }));
    } catch {
      this.helpers = HELPER_DIRECTORY.filter((helper) => ['4', '5', '6'].includes(helper.id));
    }
  }

  clearFilters(): void {
    this.serviceFilter = '';
    this.minExperience = '';
    this.availability = '';
    this.loadHelpers();
  }
}

@Component({
  standalone: true,
  imports: [MatButtonModule, StatusBadgeComponent, RouterLink],
  template: `
    <section>
      <button mat-stroked-button color="primary" class="mb-4" (click)="goBack()">
        <span class="material-symbols-outlined text-base mr-1">arrow_back</span>
        Back
      </button>
    </section>
    <section class="surface-card p-6 grid lg:grid-cols-[280px_1fr] gap-6">
      <img [src]="helper.image" [alt]="helper.name" class="w-full h-72 object-cover rounded-2xl" />
      <div>
        <h1 class="text-2xl font-bold tracking-tight">{{ helper.name }} <span class="text-amber-500 text-base">Rating {{ helper.rating }}</span></h1>
        <p class="text-slate-500 mt-2">{{ helper.bio }}</p>
        <div class="flex flex-wrap gap-2 mt-4">
          @for(skill of helper.skills; track skill) {
            <span class="px-3 py-1 bg-slate-100 rounded-full text-sm">{{ skill }}</span>
          }
        </div>
        <div class="mt-4"><app-status-badge label="Active"></app-status-badge></div>
        <div class="mt-4 grid sm:grid-cols-2 gap-3">
          <div class="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">Identity verified</div>
          <div class="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">Police check completed</div>
        </div>
        <div class="mt-6 grid sm:grid-cols-2 gap-3">
          <div class="surface-card p-4"><p class="text-sm text-slate-500">Standard Plan</p><p class="font-bold text-xl text-brand-primary">{{ helper.price }}</p></div>
          <div class="surface-card p-4"><p class="text-sm text-slate-500">Premium Plan</p><p class="font-bold text-xl text-brand-secondary">{{ premiumPrice }}</p></div>
        </div>
        <div class="mt-6">
          <h3 class="font-semibold tracking-tight">Recent Reviews</h3>
          <div class="mt-3 space-y-2 text-sm">
            <div class="rounded-xl border border-slate-200 p-3"><p class="font-medium">Riya Shah</p><p class="text-slate-500">Reliable and punctual. Very caring with kids.</p></div>
            <div class="rounded-xl border border-slate-200 p-3"><p class="font-medium">Nitin Roy</p><p class="text-slate-500">Excellent hygiene and communication.</p></div>
          </div>
        </div>
        <button mat-flat-button color="primary" class="mt-6" [routerLink]="['/booking']" [queryParams]="{ helperId: helper.id }">Book Now</button>
      </div>
    </section>
  `,
})
export class HelperDetailPageComponent {
  helper: HelperProfile = HELPER_DIRECTORY[0];

  constructor(private route: ActivatedRoute, private location: Location) {
    const helperId = this.route.snapshot.paramMap.get('id');
    const selectedHelper = HELPER_DIRECTORY.find((item) => item.id === helperId);
    this.helper = selectedHelper || HELPER_DIRECTORY[0];
  }

  goBack(): void {
    this.location.back();
  }

  get premiumPrice(): string {
    const value = Number(this.helper.price.replace(/[^0-9]/g, '')) + 300;
    return `INR ${value}/day`;
  }
}

@Component({
  standalone: true,
  imports: [MatButtonModule, RouterLink, StatusBadgeComponent, EmptyStateComponent, FormsModule],
  template: `
    <section class="grid gap-6">
      <div class="rounded-3xl bg-gradient-to-r from-[#f2ddc7] via-[#f4efdf] to-[#dbe8d2] p-6 sm:p-7 text-[#1e2a1f] border border-[#ddd2be]">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-[#6d7369] text-sm uppercase tracking-[0.16em]">Household Dashboard</p>
            <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">Welcome back, <span class="gradient-text">{{ userName }}</span>.</h1>
            <p class="text-[#646b60] mt-2">A quiet view of who is helping at home this week - confirmations, status, and your plan all in one place.</p>
          </div>
          <div class="flex gap-2">
            <button mat-flat-button color="primary" routerLink="/booking">Book new service</button>
            <button mat-stroked-button color="primary" routerLink="/search">View plans</button>
          </div>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="surface-card p-5">
          <p class="text-sm text-slate-500">Active Bookings</p>
          <p class="text-3xl font-bold text-brand-primary mt-1">{{ activeCount }}</p>
          <p class="text-xs text-emerald-600 mt-1">Accepted by helper</p>
        </div>
        <div class="surface-card p-5">
          <p class="text-sm text-slate-500">Pending Requests</p>
          <p class="text-3xl font-bold text-brand-secondary mt-1">{{ pendingCount }}</p>
          <p class="text-xs text-amber-600 mt-1">Waiting for helper confirmation</p>
        </div>
        <div class="surface-card p-5">
          <p class="text-sm text-slate-500">Rejected</p>
          <p class="text-3xl font-bold text-slate-900 mt-1">{{ rejectedCount }}</p>
          <p class="text-xs text-slate-500 mt-1">Declined by helper</p>
        </div>
        <div class="surface-card p-5">
          <p class="text-sm text-slate-500">Total Bookings</p>
          <p class="text-3xl font-bold text-slate-900 mt-1">{{ bookings.length }}</p>
          <p class="text-xs text-slate-500 mt-1">All requests created by you</p>
        </div>
      </div>

      <div class="surface-card p-5 sm:p-6 lg:p-7">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold tracking-tight text-lg">Booking History</h2>
          <button class="text-sm text-indigo-600 font-semibold" routerLink="/booking">View all</button>
        </div>
        @if (bookings.length === 0) {
          <app-empty-state title="No bookings yet" description="Create your first booking from search page."></app-empty-state>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full min-w-[640px] text-sm">
              <thead>
                <tr class="text-left text-slate-500 border-b">
                  <th class="py-2">Booking ID</th>
                  <th>Service Date</th>
                  <th>Status</th>
                  <th>Confirmed By</th>
                  <th>Review</th>
                </tr>
              </thead>
              <tbody>
                @for(item of bookings; track item.id) {
                  <tr class="border-b">
                    <td class="py-3">#{{ item.id }}</td>
                    <td>{{ item.service_date }}</td>
                    <td><app-status-badge [label]="statusBadge(item.status)"></app-status-badge></td>
                    <td>{{ getConfirmedBy(item.status) }}</td>
                    <td>
                      @if (canReview(item)) {
                        <button class="text-indigo-600 font-semibold text-xs" (click)="openReview(item.id)">Add Review</button>
                      } @else {
                        <span class="text-xs text-slate-400">Not available</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      @if (selectedReviewBookingId) {
        <form class="surface-card p-5 space-y-3" (ngSubmit)="submitReview()">
          <h3 class="font-semibold">Submit Review for Booking #{{ selectedReviewBookingId }}</h3>
          <div class="grid sm:grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="filter-label" for="review-rating">Rating</label>
              <select id="review-rating" class="booking-field booking-select" name="rating" [(ngModel)]="reviewRating">
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="filter-label" for="review-comment">Comment</label>
              <input id="review-comment" class="booking-field" name="comment" [(ngModel)]="reviewComment" />
            </div>
          </div>
          @if (reviewMessage) {
            <p class="text-xs text-emerald-600">{{ reviewMessage }}</p>
          }
          @if (reviewError) {
            <p class="text-xs text-rose-500">{{ reviewError }}</p>
          }
          <div class="flex gap-2">
            <button mat-flat-button color="primary" type="submit">Submit</button>
            <button mat-stroked-button color="primary" type="button" (click)="closeReview()">Cancel</button>
          </div>
        </form>
      }

      <div class="surface-card p-6 bg-gradient-to-r from-[#0f2b1f] to-[#2f5d3a] text-white border-0">
        <h2 class="font-semibold tracking-tight mb-3">Who confirmed where?</h2>
        <p class="text-sm text-green-100">Pending means the helper has not replied yet. Once they confirm from their dashboard, status updates to Accepted or Declined automatically.</p>
      </div>

      <div class="surface-card p-6">
        <h2 class="font-semibold tracking-tight mb-3">My Subscriptions</h2>
        @if (subscriptions.length === 0) {
          <p class="text-sm text-slate-500">No active subscriptions yet.</p>
        } @else {
          <div class="space-y-2 text-sm">
            @for(sub of subscriptions; track sub.id) {
              <div class="rounded-lg border border-slate-200 p-3">
                #{{ sub.id }} - {{ sub.plan_type }} - {{ sub.status }} - Renewal: {{ sub.renewal_enabled ? 'On' : 'Off' }}
                <div class="mt-2 flex gap-2">
                  <button mat-button color="primary" (click)="updateSubscription(sub.id, 'paused')">Pause</button>
                  <button mat-button color="warn" (click)="updateSubscription(sub.id, 'cancelled')">Cancel</button>
                  <button mat-button color="primary" (click)="toggleRenewal(sub.id, !sub.renewal_enabled)">
                    {{ sub.renewal_enabled ? 'Disable Renewal' : 'Enable Renewal' }}
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class UserDashboardPageComponent {
  userName = 'User';
  bookings: Array<{ id: number; service_date: string; status: string; helper_id?: number }> = [];
  selectedReviewBookingId: number | null = null;
  reviewRating = 5;
  reviewComment = '';
  reviewMessage = '';
  reviewError = '';
  subscriptions: Array<{ id: number; plan_type: string; status: string; renewal_enabled: number }> = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const auth = localStorage.getItem('careNestAuth');
    if (auth) {
      try {
        this.userName = (JSON.parse(auth) as { fullName?: string }).fullName || 'User';
      } catch {
        this.userName = 'User';
      }
    }
    void this.loadBookings();
    void this.loadSubscriptions();
  }

  get activeCount(): number {
    return this.bookings.filter((b) => b.status === 'accepted').length;
  }

  get pendingCount(): number {
    return this.bookings.filter((b) => b.status === 'pending').length;
  }

  get rejectedCount(): number {
    return this.bookings.filter((b) => b.status === 'rejected').length;
  }

  getConfirmedBy(status: string): string {
    if (status === 'accepted' || status === 'rejected') return 'Helper';
    return 'Pending - not confirmed';
  }

  statusBadge(status: string): 'Active' | 'Pending' | 'Cancelled' | 'Verified' | 'Rejected' {
    if (status === 'accepted') return 'Active';
    if (status === 'rejected') return 'Rejected';
    if (status === 'completed') return 'Verified';
    return 'Pending';
  }

  canReview(item: { status: string }): boolean {
    return item.status === 'accepted' || item.status === 'completed';
  }

  openReview(bookingId: number): void {
    this.selectedReviewBookingId = bookingId;
    this.reviewMessage = '';
    this.reviewError = '';
  }

  closeReview(): void {
    this.selectedReviewBookingId = null;
    this.reviewComment = '';
    this.reviewRating = 5;
  }

  async submitReview(): Promise<void> {
    const token = localStorage.getItem('careNestToken');
    if (!token || !this.selectedReviewBookingId) return;
    const booking = this.bookings.find((item) => item.id === this.selectedReviewBookingId);
    if (!booking?.helper_id) {
      this.reviewError = 'Helper reference missing for this booking.';
      return;
    }
    this.reviewError = '';
    this.reviewMessage = '';
    try {
      await firstValueFrom(
        this.http.post(
          'http://localhost:4000/api/reviews',
          {
            bookingId: this.selectedReviewBookingId,
            helperId: booking.helper_id,
            rating: Number(this.reviewRating),
            comment: this.reviewComment.trim(),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      this.reviewMessage = 'Review submitted successfully.';
      await this.loadBookings();
      this.closeReview();
    } catch {
      this.reviewError = 'Review submit failed. It may already exist.';
    }
  }

  private async loadBookings(): Promise<void> {
    const token = localStorage.getItem('careNestToken');
    if (!token) return;
    try {
      const response = await firstValueFrom(
        this.http.get<{ data: Array<{ id: number; service_date: string; status: string; helper_id?: number }> }>(
          'http://localhost:4000/api/bookings/me',
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      this.bookings = response.data;
    } catch {
      this.bookings = [];
    }
  }

  private async loadSubscriptions(): Promise<void> {
    const token = localStorage.getItem('careNestToken');
    if (!token) return;
    try {
      const response = await firstValueFrom(
        this.http.get<{ data: Array<{ id: number; plan_type: string; status: string; renewal_enabled: number }> }>(
          'http://localhost:4000/api/subscriptions/me',
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      this.subscriptions = response.data;
    } catch {
      this.subscriptions = [];
    }
  }

  async updateSubscription(id: number, status: 'active' | 'paused' | 'cancelled'): Promise<void> {
    const token = localStorage.getItem('careNestToken');
    if (!token) return;
    try {
      await firstValueFrom(
        this.http.patch(
          `http://localhost:4000/api/subscriptions/${id}/status`,
          { status },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await this.loadSubscriptions();
    } catch {
      // Silent fail for demo.
    }
  }

  async toggleRenewal(id: number, renewalEnabled: boolean): Promise<void> {
    const token = localStorage.getItem('careNestToken');
    if (!token) return;
    try {
      await firstValueFrom(
        this.http.patch(
          `http://localhost:4000/api/subscriptions/${id}/renewal`,
          { renewalEnabled },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await this.loadSubscriptions();
    } catch {
      // Silent fail for demo.
    }
  }
}

@Component({
  standalone: true,
  imports: [MatButtonModule, RouterLink, FormsModule],
  template: `
    <section class="grid lg:grid-cols-[0.95fr_1.05fr] gap-6 items-start">
      <div class="surface-card p-6 sm:p-7">
        <p class="text-xs uppercase tracking-[0.2em] text-[#808578]">Booking Summary</p>
        <h2 class="text-2xl font-semibold tracking-tight mt-2 text-[#1f2a1f]">{{ helperName }}</h2>
        <p class="text-[#5f675d] mt-1">{{ helperMeta }}</p>

        <div class="mt-5 rounded-2xl border border-[#2e5f3a] bg-gradient-to-r from-[#11402b] to-[#2b5f3b] p-4 text-white">
          <p class="text-sm text-green-100 font-medium">Selected Plan</p>
          <p class="text-xl font-bold mt-1">{{ selectedPlanLabel }} - {{ selectedPlanPriceLabel }}</p>
          <p class="text-sm text-green-100 mt-1">{{ helperBio }}</p>
        </div>

        <div class="mt-5 grid sm:grid-cols-2 gap-3">
          <div class="rounded-xl border border-slate-200 p-3">
            <p class="text-xs uppercase tracking-wide text-slate-400">Expected Start</p>
            <p class="font-semibold mt-1">Tomorrow, 9:00 AM</p>
          </div>
          <div class="rounded-xl border border-slate-200 p-3">
            <p class="text-xs uppercase tracking-wide text-slate-400">Support Type</p>
            <p class="font-semibold mt-1">At Home Service</p>
          </div>
        </div>
      </div>

      <form class="surface-card p-6 sm:p-7 space-y-4" (ngSubmit)="onConfirmBooking()">
        <h3 class="text-xl font-semibold tracking-tight">Confirm Service Details</h3>
        @if (!canCreateBooking) {
          <p class="text-xs text-amber-600">
            Booking is available for household users only. Please login with household account.
          </p>
        }

        <div class="space-y-2">
          <label class="filter-label" for="booking-date">Select Date</label>
          <input id="booking-date" type="date" class="booking-field" name="startDate" [(ngModel)]="startDate" />
        </div>

        <div class="space-y-2">
          <label class="filter-label" for="booking-plan">Select Plan</label>
          <select id="booking-plan" class="booking-field booking-select" name="planType" [(ngModel)]="planType">
            <option value="hourly">Hourly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="filter-label" for="special-notes">Special Notes</label>
          <textarea id="special-notes" rows="4" class="booking-field booking-textarea" placeholder="Any childcare, cleaning, or timing instructions" name="notes" [(ngModel)]="notes"></textarea>
        </div>

        @if (errorMessage) {
          <p class="text-xs text-rose-500">{{ errorMessage }}</p>
        }
        <button type="submit" mat-flat-button color="primary" class="w-full !h-12 !rounded-full !font-semibold" [disabled]="isSubmitting || !canCreateBooking">
          {{ isSubmitting ? 'Submitting...' : 'Confirm Booking' }}
        </button>
      </form>
    </section>
  `,
})
export class BookingPageComponent {
  startDate = '';
  planType: 'hourly' | 'monthly' | 'yearly' = 'monthly';
  notes = '';
  errorMessage = '';
  isSubmitting = false;
  currentUserRole: 'household' | 'helper' | 'admin' | 'user' | '' = '';
  selectedHelperId: number | null = null;
  helperName = 'Select a helper first';
  helperMeta = 'Choose helper from search to see real profile details.';
  helperBio = 'Helper details will appear here once selected.';
  helperRates = { hourly: 0, monthly: 0, yearly: 0 };

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const raw = localStorage.getItem('careNestAuth');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { role?: 'household' | 'helper' | 'admin' | 'user' };
        this.currentUserRole = parsed.role || '';
      } catch {
        this.currentUserRole = '';
      }
    }
    void this.loadHelperSummary();
  }

  get canCreateBooking(): boolean {
    return this.currentUserRole === 'household' || this.currentUserRole === 'user';
  }

  get selectedPlanPriceLabel(): string {
    if (this.planType === 'hourly') return `INR ${this.helperRates.hourly}/hr`;
    if (this.planType === 'yearly') return `INR ${this.helperRates.yearly}/year`;
    return `INR ${this.helperRates.monthly}/month`;
  }

  get selectedPlanLabel(): string {
    if (this.planType === 'hourly') return 'Hourly';
    if (this.planType === 'yearly') return 'Yearly';
    return 'Monthly';
  }

  private async loadHelperSummary(): Promise<void> {
    const helperIdParam = this.route.snapshot.queryParamMap.get('helperId');
    const helperId = helperIdParam ? Number(helperIdParam) : NaN;

    try {
      if (!Number.isNaN(helperId) && helperId > 0) {
        const helper = await firstValueFrom(this.http.get<any>(`http://localhost:4000/api/helpers/${helperId}`));
        this.applyHelperDetails(helper);
        return;
      }

      const list = await firstValueFrom(
        this.http.get<{ data: Array<any> }>('http://localhost:4000/api/helpers?verifiedOnly=true')
      );
      if (list.data.length > 0) {
        this.applyHelperDetails(list.data[0]);
      }
    } catch {
      // Keep fallback text on API failure.
    }
  }

  private applyHelperDetails(helper: any): void {
    this.selectedHelperId = Number(helper.id);
    this.helperName = helper.full_name || helper.name || 'Helper';
    this.helperMeta = `${helper.service_name || 'Service'} • ${helper.experience_years || 0}+ years • ${helper.verification_status || 'pending'}`;
    this.helperBio = helper.bio || 'Verified helper profile.';
    this.helperRates = {
      hourly: Number(helper.hourly_rate || 0),
      monthly: Number(helper.monthly_rate || 0),
      yearly: Number(helper.yearly_rate || 0),
    };
  }

  async onConfirmBooking(): Promise<void> {
    const token = localStorage.getItem('careNestToken');
    if (!token) {
      this.errorMessage = 'Please login first to create booking.';
      await this.router.navigateByUrl('/auth/login');
      return;
    }
    if (!this.canCreateBooking) {
      this.errorMessage = 'Only household users can create booking. Login with household@example.com.';
      return;
    }

    if (!this.startDate) {
      this.errorMessage = 'Please select booking date.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      let helperId = this.selectedHelperId;
      if (!helperId) {
        const helperList = await firstValueFrom(
          this.http.get<{ total: number; data: Array<{ id: string }> }>(
            'http://localhost:4000/api/helpers?verifiedOnly=true'
          )
        );
        helperId = Number(helperList.data[0]?.id);
      }
      if (!helperId) {
        this.errorMessage = 'No helper available for booking right now.';
        return;
      }

      const bookingResponse = await firstValueFrom(
        this.http.post(
          'http://localhost:4000/api/bookings',
          {
            helperId,
            serviceDate: this.startDate,
            notes: this.notes.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      );
      const bookingId = Number((bookingResponse as { id?: string | number })?.id);
      if (bookingId && helperId) {
        await firstValueFrom(
          this.http.post(
            'http://localhost:4000/api/subscriptions',
            {
              bookingId,
              helperId,
              planType: this.planType,
              startDate: this.startDate,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        );
      }

      localStorage.setItem(
        'careNestLastBooking',
        JSON.stringify({
          id: (bookingResponse as { id?: string })?.id || '',
          startDate: this.startDate,
          planType: this.planType,
        })
      );
      await this.router.navigateByUrl('/booking/success');
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 403) {
          this.errorMessage = 'Access denied. Booking allowed only for household role.';
        } else {
          const apiMessage =
            (error.error as { message?: string; errors?: Array<{ message?: string }> })?.message ||
            (error.error as { errors?: Array<{ message?: string }> })?.errors?.[0]?.message;
          this.errorMessage = apiMessage || 'Booking failed. Ensure API is running and login as household user.';
        }
      } else {
        this.errorMessage = 'Booking failed. Please try again.';
      }
    } finally {
      this.isSubmitting = false;
    }
  }
}

@Component({
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  template: `
    <section class="surface-card p-8 sm:p-10 text-center max-w-2xl mx-auto">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <span class="material-symbols-outlined text-3xl">check_circle</span>
      </div>
      <h1 class="mt-5 text-3xl font-bold tracking-tight text-slate-900">Booking Confirmed</h1>
      <p class="mt-2 text-slate-500">
        Your request has been submitted successfully. Helper will review and accept soon.
      </p>
      @if (bookingId) {
        <div class="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          <span class="font-medium">Booking ID:</span>
          <span class="font-semibold">{{ bookingId }}</span>
        </div>
      }

      <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button mat-flat-button color="primary" routerLink="/dashboard">Go to Dashboard</button>
        <button mat-stroked-button color="primary" routerLink="/booking">Book Another</button>
        <button mat-stroked-button color="primary" (click)="payNow()" [disabled]="!bookingId">Create Payment</button>
        <button mat-stroked-button color="warn" (click)="raiseSos()" [disabled]="!bookingId">SOS</button>
      </div>
    </section>
  `,
})
export class BookingSuccessPageComponent {
  bookingId = '';

  constructor(private http: HttpClient) {
    const raw = localStorage.getItem('careNestLastBooking');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { id?: string };
      this.bookingId = parsed.id ?? '';
    } catch {
      this.bookingId = '';
    }
  }

  async payNow(): Promise<void> {
    const token = localStorage.getItem('careNestToken');
    if (!token || !this.bookingId) return;
    try {
      await firstValueFrom(
        this.http.post(
          'http://localhost:4000/api/payments',
          {
            bookingId: Number(this.bookingId),
            amount: 1600,
            method: 'upi',
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
    } catch {
      // Ignore payment failure in demo flow.
    }
  }

  async raiseSos(): Promise<void> {
    const token = localStorage.getItem('careNestToken');
    if (!token || !this.bookingId) return;
    try {
      await firstValueFrom(
        this.http.post(
          'http://localhost:4000/api/sos',
          { bookingId: Number(this.bookingId), note: 'Emergency support required.' },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
    } catch {
      // Ignore SOS failure in demo flow.
    }
  }
}

@Component({
  standalone: true,
  imports: [MatButtonModule, StatusBadgeComponent, EmptyStateComponent, FormsModule],
  template: `
    <section>
      <h1 class="text-2xl font-bold mb-4">Helper Dashboard</h1>
      <div class="grid sm:grid-cols-2 gap-4 mb-6">
        <div class="surface-card p-5"><p class="text-sm text-slate-500">Pending Jobs</p><p class="text-3xl font-bold text-brand-primary">{{ pendingBookings.length }}</p></div>
        <div class="surface-card p-5"><p class="text-sm text-slate-500">Accepted Jobs</p><p class="text-3xl font-bold text-brand-secondary">{{ acceptedBookings.length }}</p></div>
        <div class="surface-card p-5 sm:col-span-2"><p class="text-sm text-slate-500">Total Earnings (Paid)</p><p class="text-3xl font-bold text-emerald-600">INR {{ totalEarnings }}</p></div>
      </div>

      <h2 class="font-semibold mb-3">Job Requests (Confirm Here)</h2>
      @if (bookings.length === 0) {
        <app-empty-state title="No assigned bookings" description="New user bookings will appear here for helper confirmation."></app-empty-state>
      } @else {
        <div class="space-y-3">
          @for(item of bookings; track item.id) {
            <div class="surface-card p-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p class="font-semibold">Booking #{{ item.id }}</p>
                  <p class="text-sm text-slate-500">Date: {{ item.service_date }}</p>
                </div>
                <app-status-badge [label]="statusBadge(item.status)"></app-status-badge>
              </div>
              @if (item.status === 'pending') {
                <div class="mt-3 flex gap-2">
                  <button mat-flat-button color="primary" (click)="updateBooking(item.id, 'accepted')">Accept</button>
                  <button mat-stroked-button color="warn" (click)="updateBooking(item.id, 'rejected')">Reject</button>
                </div>
              }
            </div>
          }
        </div>
      }

      <div class="surface-card p-5 mt-6">
        <h2 class="font-semibold tracking-tight mb-3">Confirmation Log</h2>
        <p class="text-sm text-slate-600">Accepted or rejected action here is what the user sees as "Confirmed By Helper".</p>
      </div>

      <div class="surface-card p-5 mt-6">
        <h2 class="font-semibold tracking-tight mb-3">Attendance Marker</h2>
        <div class="flex flex-wrap items-end gap-2">
          <input type="date" class="booking-field !w-auto" name="attendanceDate" [(ngModel)]="attendanceDate" />
          <select class="booking-field booking-select !w-auto" name="attendanceStatus" [(ngModel)]="attendanceStatus">
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="absent">Absent</option>
          </select>
          <button mat-flat-button color="primary" (click)="markAttendance()">Mark For First Active Booking</button>
        </div>
      </div>

      <form class="surface-card p-5 mt-6 space-y-2" (ngSubmit)="requestLeave()">
        <h2 class="font-semibold tracking-tight">Leave Request</h2>
        <div class="grid sm:grid-cols-3 gap-2">
          <input type="date" class="booking-field" name="leaveFrom" [(ngModel)]="leaveFrom" />
          <input type="date" class="booking-field" name="leaveTo" [(ngModel)]="leaveTo" />
          <input class="booking-field" placeholder="Reason" name="leaveReason" [(ngModel)]="leaveReason" />
        </div>
        <button mat-stroked-button color="primary" type="submit">Submit Leave</button>
      </form>
    </section>
  `,
})
export class HelperDashboardPageComponent {
  bookings: Array<{ id: number; service_date: string; status: 'pending' | 'accepted' | 'rejected' }> = [];
  totalEarnings = 0;
  attendanceDate = '';
  attendanceStatus: 'present' | 'absent' | 'late' = 'present';
  leaveFrom = '';
  leaveTo = '';
  leaveReason = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    void this.loadBookings();
    void this.loadEarnings();
  }

  get pendingBookings(): Array<{ id: number; service_date: string; status: 'pending' | 'accepted' | 'rejected' }> {
    return this.bookings.filter((item) => item.status === 'pending');
  }

  get acceptedBookings(): Array<{ id: number; service_date: string; status: 'pending' | 'accepted' | 'rejected' }> {
    return this.bookings.filter((item) => item.status === 'accepted');
  }

  statusBadge(status: 'pending' | 'accepted' | 'rejected'): 'Active' | 'Pending' | 'Cancelled' | 'Verified' | 'Rejected' {
    if (status === 'accepted') return 'Active';
    if (status === 'rejected') return 'Rejected';
    return 'Pending';
  }

  async updateBooking(id: number, status: 'accepted' | 'rejected'): Promise<void> {
    const token = localStorage.getItem('careNestToken');
    if (!token) return;
    try {
      await firstValueFrom(
        this.http.patch(
          `http://localhost:4000/api/bookings/${id}/status`,
          { status },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await this.loadBookings();
    } catch {
      // Silent fail to keep UI simple.
    }
  }

  async markAttendance(): Promise<void> {
    const token = localStorage.getItem('careNestToken');
    const targetBooking = this.bookings.find((item) => item.status === 'accepted') || this.bookings[0];
    if (!token || !targetBooking || !this.attendanceDate) return;
    try {
      await firstValueFrom(
        this.http.post(
          'http://localhost:4000/api/attendance',
          {
            bookingId: targetBooking.id,
            date: this.attendanceDate,
            status: this.attendanceStatus,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
    } catch {
      // Keep helper dashboard simple.
    }
  }

  async requestLeave(): Promise<void> {
    const token = localStorage.getItem('careNestToken');
    if (!token || !this.leaveFrom || !this.leaveTo || !this.leaveReason.trim()) return;
    try {
      await firstValueFrom(
        this.http.post(
          'http://localhost:4000/api/leaves',
          { fromDate: this.leaveFrom, toDate: this.leaveTo, reason: this.leaveReason.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      this.leaveReason = '';
    } catch {
      // Keep helper dashboard simple.
    }
  }

  private async loadBookings(): Promise<void> {
    const token = localStorage.getItem('careNestToken');
    if (!token) return;
    try {
      const response = await firstValueFrom(
        this.http.get<{ data: Array<{ id: number; service_date: string; status: 'pending' | 'accepted' | 'rejected' }> }>(
          'http://localhost:4000/api/bookings/me',
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      this.bookings = response.data;
    } catch {
      this.bookings = [];
    }
  }

  private async loadEarnings(): Promise<void> {
    const token = localStorage.getItem('careNestToken');
    if (!token) return;
    try {
      const response = await firstValueFrom(
        this.http.get<{ totalPaid: number }>('http://localhost:4000/api/payments/helpers/me/earnings', {
          headers: { Authorization: `Bearer ${token}` },
        })
      );
      this.totalEarnings = Math.round(response.totalPaid || 0);
    } catch {
      this.totalEarnings = 0;
    }
  }
}

@Component({
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <section class="surface-card p-6">
      <h1 class="text-2xl font-bold mb-4">Helper Profile</h1>
      <form class="grid md:grid-cols-2 gap-4">
        <mat-form-field appearance="outline"><mat-label>Full Name</mat-label><input matInput value="Meera Iyer" /></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Phone</mat-label><input matInput value="+91 98765 43210" /></mat-form-field>
        <mat-form-field appearance="outline" class="md:col-span-2"><mat-label>Skills</mat-label><input matInput value="Infant Care, First Aid, Meal Prep" /></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Experience</mat-label><input matInput value="7 years" /></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Preferred Plan</mat-label><input matInput value="Monthly / Yearly" /></mat-form-field>
        <div class="md:col-span-2 border border-dashed border-slate-300 rounded-xl p-4 text-center text-slate-500">Upload Documents (UI only)</div>
        <div class="md:col-span-2 grid sm:grid-cols-3 gap-3 text-sm">
          <div class="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">ID Proof Submitted</div>
          <div class="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-700">Police Verification Pending</div>
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700">Address Proof Submitted</div>
        </div>
        <button mat-flat-button color="primary" class="md:col-span-2">Save Profile</button>
      </form>
    </section>
  `,
})
export class HelperProfilePageComponent { }

@Component({
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <section>
      <h1 class="text-2xl font-bold tracking-tight mb-4">Admin Dashboard</h1>
      <div class="grid md:grid-cols-3 gap-4 mb-6">
        <div class="surface-card p-5"><p class="text-sm text-slate-500">Registered Households</p><p class="text-3xl font-bold">{{ metrics.households }}</p></div>
        <div class="surface-card p-5"><p class="text-sm text-slate-500">Verified Helpers</p><p class="text-3xl font-bold">{{ metrics.verifiedHelpers }}</p></div>
        <div class="surface-card p-5"><p class="text-sm text-slate-500">Bookings</p><p class="text-3xl font-bold">{{ metrics.totalBookings }}</p></div>
      </div>
      <div class="grid lg:grid-cols-2 gap-4 mb-6">
        <div class="surface-card p-6">
          <h2 class="font-semibold tracking-tight">Operational KPIs</h2>
          <ul class="mt-3 space-y-2 text-sm text-slate-600">
            <li>Booking Completion Rate: <span class="font-semibold text-slate-900">{{ metrics.bookingCompletionRate }}%</span></li>
            <li>Monthly Active Users: <span class="font-semibold text-slate-900">{{ metrics.monthlyActiveUsers }}</span></li>
            <li>Customer Satisfaction: <span class="font-semibold text-slate-900">{{ metrics.customerSatisfaction }} / 5</span></li>
            <li>Cancellation Ratio: <span class="font-semibold text-slate-900">{{ metrics.cancellationRatio }}%</span></li>
          </ul>
        </div>
        <div class="surface-card p-6">
          <h2 class="font-semibold tracking-tight">Complaints and Disputes</h2>
          <div class="mt-3 space-y-2 text-sm">
            @for(complaint of complaints; track complaint.id) {
              <div class="rounded-lg border border-slate-200 p-3">
                #{{ complaint.id }} - BK{{ complaint.booking_id }} - {{ complaint.issue }}
                <span class="font-semibold" [class.text-amber-600]="complaint.status === 'in_review'" [class.text-rose-600]="complaint.status === 'open'" [class.text-emerald-600]="complaint.status === 'resolved'">
                  {{ complaint.status }}
                </span>
                @if (complaint.status !== 'resolved') {
                  <button mat-button color="primary" (click)="markResolved(complaint.id)">Mark Resolved</button>
                }
              </div>
            }
          </div>
        </div>
      </div>
      <div class="surface-card p-6 h-60 flex items-center justify-center text-slate-400">Analytics chart placeholder (Phase 1 frontend)</div>

      <div class="grid lg:grid-cols-2 gap-4 mt-6">
        <div class="surface-card p-6">
          <h2 class="font-semibold tracking-tight">Leave Requests</h2>
          <div class="mt-3 space-y-2 text-sm">
            @for(leave of leaveRequests; track leave.id) {
              <div class="rounded-lg border border-slate-200 p-3">
                {{ leave.helper_name }}: {{ leave.from_date }} to {{ leave.to_date }} ({{ leave.status }})
                @if (leave.status === 'pending') {
                  <button mat-button color="primary" (click)="reviewLeave(leave.id, 'approved')">Approve</button>
                  <button mat-button color="warn" (click)="reviewLeave(leave.id, 'rejected')">Reject</button>
                }
              </div>
            }
          </div>
        </div>

        <div class="surface-card p-6">
          <h2 class="font-semibold tracking-tight">SOS Alerts</h2>
          <div class="mt-3 space-y-2 text-sm">
            @for(alert of sosAlerts; track alert.id) {
              <div class="rounded-lg border border-rose-200 bg-rose-50 p-3">
                Booking #{{ alert.booking_id }} - {{ alert.note || 'Emergency alert' }} ({{ alert.status }})
                @if (alert.status !== 'resolved') {
                  <button mat-button color="primary" (click)="resolveSos(alert.id)">Resolve</button>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AdminDashboardPageComponent {
  metrics = {
    households: 0,
    verifiedHelpers: 0,
    totalBookings: 0,
    bookingCompletionRate: 0,
    customerSatisfaction: 0,
    monthlyActiveUsers: 0,
    cancellationRatio: 0,
  };
  complaints: Array<{ id: number; booking_id: number; issue: string; status: 'open' | 'in_review' | 'resolved' }> = [];
  leaveRequests: Array<{ id: number; helper_name: string; from_date: string; to_date: string; status: string }> = [];
  sosAlerts: Array<{ id: number; booking_id: number; note: string; status: string }> = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    void this.loadDashboardData();
  }

  async markResolved(id: number): Promise<void> {
    const token = localStorage.getItem('careNestToken');
    if (!token) return;
    try {
      await firstValueFrom(
        this.http.patch(
          `http://localhost:4000/api/admin/complaints/${id}/resolve`,
          { status: 'resolved', resolutionNotes: 'Resolved by admin dashboard action.' },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await this.loadDashboardData();
    } catch {
      // Keep UI stable on failure.
    }
  }

  async reviewLeave(id: number, status: 'approved' | 'rejected'): Promise<void> {
    const token = localStorage.getItem('careNestToken');
    if (!token) return;
    try {
      await firstValueFrom(
        this.http.patch(
          `http://localhost:4000/api/leaves/${id}`,
          { status },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await this.loadDashboardData();
    } catch {
      // Ignore refresh error.
    }
  }

  async resolveSos(id: number): Promise<void> {
    const token = localStorage.getItem('careNestToken');
    if (!token) return;
    try {
      await firstValueFrom(
        this.http.patch(
          `http://localhost:4000/api/sos/${id}`,
          { status: 'resolved' },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await this.loadDashboardData();
    } catch {
      // Ignore refresh error.
    }
  }

  private async loadDashboardData(): Promise<void> {
    const token = localStorage.getItem('careNestToken');
    if (!token) return;
    try {
      type AnalyticsResponse = {
        households: number;
        verifiedHelpers: number;
        totalBookings: number;
        bookingCompletionRate: number;
        customerSatisfaction: number;
        monthlyActiveUsers: number;
        cancellationRatio: number;
      };
      const [analytics, complaints, leaves, sos] = await Promise.all([
        firstValueFrom(
          this.http.get<{ data: AnalyticsResponse }>('http://localhost:4000/api/admin/analytics/overview', {
            headers: { Authorization: `Bearer ${token}` },
          })
        ),
        firstValueFrom(
          this.http.get<{ data: Array<{ id: number; booking_id: number; issue: string; status: 'open' | 'in_review' | 'resolved' }> }>(
            'http://localhost:4000/api/admin/complaints',
            { headers: { Authorization: `Bearer ${token}` } }
          )
        ),
        firstValueFrom(
          this.http.get<{ data: Array<{ id: number; helper_name: string; from_date: string; to_date: string; status: string }> }>(
            'http://localhost:4000/api/leaves/admin',
            { headers: { Authorization: `Bearer ${token}` } }
          )
        ),
        firstValueFrom(
          this.http.get<{ data: Array<{ id: number; booking_id: number; note: string; status: string }> }>(
            'http://localhost:4000/api/sos/admin',
            { headers: { Authorization: `Bearer ${token}` } }
          )
        ),
      ]);
      this.metrics = analytics.data;
      this.complaints = complaints.data.slice(0, 6);
      this.leaveRequests = leaves.data.slice(0, 6);
      this.sosAlerts = sos.data.slice(0, 6);
    } catch {
      this.metrics = {
        households: 0,
        verifiedHelpers: 0,
        totalBookings: 0,
        bookingCompletionRate: 0,
        customerSatisfaction: 0,
        monthlyActiveUsers: 0,
        cancellationRatio: 0,
      };
      this.complaints = [];
      this.leaveRequests = [];
      this.sosAlerts = [];
    }
  }
}

@Component({
  standalone: true,
  imports: [StatusBadgeComponent],
  template: `
    <section class="surface-card p-4 sm:p-6 overflow-x-auto">
      <h1 class="text-2xl font-bold tracking-tight mb-4">Verify Helpers</h1>
      <table class="w-full min-w-[760px] text-sm">
        <thead>
          <tr class="text-left text-slate-500 border-b"><th class="py-2">Name</th><th>Service Type</th><th>City</th><th>Documents</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          @for(row of rows; track row.id) {
            <tr class="border-b">
              <td class="py-3">{{ row.name }}</td>
              <td>{{ row.service }}</td>
              <td>{{ row.city }}</td>
              <td>{{ row.documents }}</td>
              <td><app-status-badge [label]="row.status"></app-status-badge></td>
              <td class="space-x-2 whitespace-nowrap">
                <button class="outline-btn" (click)="updateStatus(row.id, 'approved')">Approve</button>
                <button class="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-600" (click)="updateStatus(row.id, 'rejected')">Reject</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </section>
  `,
})
export class VerifyHelpersPageComponent {
  rows: Array<{ id: number; name: string; service: string; city: string; documents: string; status: 'Pending' | 'Verified' | 'Rejected' }> = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    void this.loadPendingHelpers();
  }

  async updateStatus(helperId: number, status: 'approved' | 'rejected'): Promise<void> {
    const token = localStorage.getItem('careNestToken');
    if (!token) return;
    try {
      await firstValueFrom(
        this.http.patch(
          `http://localhost:4000/api/admin/helpers/${helperId}/approve`,
          { status },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await this.loadPendingHelpers();
    } catch {
      // Keep UI silent on failure.
    }
  }

  private async loadPendingHelpers(): Promise<void> {
    const token = localStorage.getItem('careNestToken');
    if (!token) return;
    try {
      const response = await firstValueFrom(
        this.http.get<{ data: Array<{ id: number; full_name: string; service_name: string; city: string; document_path: string | null; verification_status: string }> }>(
          'http://localhost:4000/api/admin/helpers/pending',
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      this.rows = response.data.map((item) => ({
        id: item.id,
        name: item.full_name,
        service: item.service_name || 'Unassigned',
        city: item.city || 'Unknown',
        documents: item.document_path ? 'Submitted' : 'Pending Upload',
        status: item.verification_status === 'approved' ? 'Verified' : item.verification_status === 'rejected' ? 'Rejected' : 'Pending',
      }));
    } catch {
      this.rows = [];
    }
  }
}

@Component({
  standalone: true,
  imports: [StatusBadgeComponent, EmptyStateComponent],
  template: `
    <section class="surface-card p-4 sm:p-6 overflow-x-auto">
      <h1 class="text-2xl font-bold tracking-tight mb-4">Booking Management</h1>
      <table class="w-full min-w-[640px] text-sm">
        <thead>
          <tr class="text-left text-slate-500 border-b"><th class="py-2">Booking ID</th><th>User</th><th>Helper</th><th>Status</th></tr>
        </thead>
        <tbody>
          @for(b of bookings; track b.id) {
            <tr class="border-b">
              <td class="py-3">{{ b.id }}</td>
              <td>{{ b.user }}</td>
              <td>{{ b.helper }}</td>
              <td><app-status-badge [label]="statusBadge(b.status)"></app-status-badge></td>
            </tr>
          }
        </tbody>
      </table>
      <div class="mt-4 grid md:grid-cols-2 gap-4">
        <app-empty-state title="Need advanced controls?" description="Integrate actions here later without changing the visual layout."></app-empty-state>
        <div class="surface-card p-5">
          <h3 class="font-semibold tracking-tight">Phase 1 Compliance Notes</h3>
          <ul class="mt-3 space-y-2 text-sm text-slate-600">
            <li>Attendance tracking is summary-only in current version.</li>
            <li>No payroll automation included.</li>
            <li>No GPS tracking in phase 1 scope.</li>
          </ul>
        </div>
      </div>
    </section>
  `,
})
export class BookingManagementPageComponent {
  bookings: Array<{ id: number; user: string; helper: string; status: string }> = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    void this.loadAdminBookings();
  }

  statusBadge(status: string): 'Active' | 'Pending' | 'Cancelled' | 'Verified' | 'Rejected' {
    if (status === 'accepted') return 'Active';
    if (status === 'rejected') return 'Rejected';
    return 'Pending';
  }

  private async loadAdminBookings(): Promise<void> {
    const token = localStorage.getItem('careNestToken');
    if (!token) return;
    try {
      const response = await firstValueFrom(
        this.http.get<{ data: Array<{ id: number; user_id: number; helper_id: number; status: string }> }>(
          'http://localhost:4000/api/admin/bookings',
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      this.bookings = response.data.map((item) => ({
        id: item.id,
        user: `User #${item.user_id}`,
        helper: `Helper #${item.helper_id}`,
        status: item.status,
      }));
    } catch {
      this.bookings = [];
    }
  }
}

@Component({
  standalone: true,
  imports: [MatButtonModule, RouterLink, FormsModule],
  template: `
    <section class="surface-card p-8 sm:p-9 lg:p-10">
      <p class="text-xs uppercase tracking-[0.2em] text-slate-400 mb-3">Secure Sign In</p>
      <h1 class="text-3xl font-bold tracking-tight mb-1">Welcome Back</h1>
      <p class="text-slate-500 mb-6">Log in to access your bookings, subscriptions, and service history.</p>
      <form class="space-y-4" (ngSubmit)="onLogin()">
        <div class="space-y-2">
          <label class="filter-label" for="login-email">Email</label>
          <input id="login-email" type="email" class="booking-field" placeholder="you@example.com" name="email" [(ngModel)]="email" />
        </div>
        <div class="space-y-2">
          <label class="filter-label" for="login-password">Password</label>
          <div class="relative">
            <input
              id="login-password"
              [type]="showPassword ? 'text' : 'password'"
              class="booking-field !pr-12"
              placeholder="Enter your password"
              name="password"
              [(ngModel)]="password"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              (click)="showPassword = !showPassword"
              [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
            >
              <span class="material-symbols-outlined text-[20px]">
                {{ showPassword ? 'visibility_off' : 'visibility' }}
              </span>
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 text-slate-600"><input type="checkbox" class="h-4 w-4 rounded border-slate-300" /> Remember me</label>
          <a routerLink="/auth/forgot-password" class="text-indigo-600 font-semibold no-underline hover:underline">Forgot password?</a>
        </div>
        <p class="text-xs text-slate-500">Demo login: <span class="font-medium">admin&#64;example.com / admin123</span></p>
        @if (errorMessage) {
          <p class="text-xs text-rose-500">{{ errorMessage }}</p>
        }
        <button type="submit" mat-flat-button color="primary" class="w-full !h-12 !rounded-xl !font-semibold" [disabled]="isSubmitting">
          {{ isSubmitting ? 'Logging in...' : 'Login' }}
        </button>
        <p class="text-sm text-center text-slate-500">New to CareNest? <a routerLink="/auth/register" class="text-indigo-600 font-semibold no-underline hover:underline">Create an account</a></p>
      </form>
    </section>
  `,
})
export class LoginPageComponent {
  email = '';
  password = '';
  showPassword = false;
  errorMessage = '';
  isSubmitting = false;

  constructor(private router: Router, private http: HttpClient) {}

  async onLogin(): Promise<void> {
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter email and password.';
      return;
    }

    if (this.password.trim().length < 4) {
      this.errorMessage = 'Password is too short.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      const response = await firstValueFrom(
        this.http.post<{
          token: string;
          refreshToken: string;
          user: { fullName: string; email: string; role: 'household' | 'helper' | 'admin' };
        }>('http://localhost:4000/api/auth/login', {
          email: this.email.trim().toLowerCase(),
          password: this.password.trim(),
        })
      );

      localStorage.setItem('careNestAuth', JSON.stringify(response.user));
      localStorage.setItem('careNestToken', response.token);
      localStorage.setItem('careNestRefreshToken', response.refreshToken);
      await this.router.navigateByUrl('/dashboard');
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        this.errorMessage = 'Invalid email or password. Try admin@example.com / admin123.';
      } else {
        this.errorMessage =
          'Login failed. Check credentials or start API server with npm run start:api.';
      }
    } finally {
      this.isSubmitting = false;
    }
  }
}

@Component({
  standalone: true,
  imports: [MatButtonModule, RouterLink, FormsModule],
  template: `
    <section class="surface-card p-8 sm:p-9 lg:p-10">
      <p class="text-xs uppercase tracking-[0.2em] text-slate-400 mb-3">Password Recovery</p>
      <h1 class="text-3xl font-bold tracking-tight mb-1">Forgot your password?</h1>
      <p class="text-slate-500 mb-6">Enter your email and we will send reset instructions.</p>
      <form class="space-y-4" (ngSubmit)="onRequestReset()">
        <div class="space-y-2">
          <label class="filter-label" for="forgot-email">Email</label>
          <input id="forgot-email" type="email" class="booking-field" placeholder="you@example.com" name="email" [(ngModel)]="email" />
        </div>
        @if (message) {
          <p class="text-xs text-emerald-600">{{ message }}</p>
        }
        @if (errorMessage) {
          <p class="text-xs text-rose-500">{{ errorMessage }}</p>
        }
        <button mat-flat-button color="primary" class="w-full !h-12 !rounded-xl !font-semibold" [disabled]="isSubmitting">
          {{ isSubmitting ? 'Sending...' : 'Send Reset Link' }}
        </button>
        <p class="text-sm text-center text-slate-500">Remembered password? <a routerLink="/auth/login" class="text-indigo-600 font-semibold no-underline hover:underline">Back to login</a></p>
      </form>
    </section>
  `,
})
export class ForgotPasswordPageComponent {
  email = '';
  message = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(private http: HttpClient) {}

  async onRequestReset(): Promise<void> {
    if (!this.email.trim()) {
      this.errorMessage = 'Please enter your email.';
      return;
    }
    this.errorMessage = '';
    this.message = '';
    this.isSubmitting = true;
    try {
      const response = await firstValueFrom(
        this.http.post<{ message: string; resetToken?: string }>('http://localhost:4000/api/auth/forgot-password', {
          email: this.email.trim().toLowerCase(),
        })
      );
      this.message = response.resetToken
        ? `${response.message} Demo reset token: ${response.resetToken}. Open /auth/reset-password to set a new password.`
        : response.message;
    } catch {
      this.errorMessage = 'Could not generate reset token. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }
}

@Component({
  standalone: true,
  imports: [MatButtonModule, RouterLink, FormsModule],
  template: `
    <section class="surface-card p-8 sm:p-9 lg:p-10">
      <p class="text-xs uppercase tracking-[0.2em] text-slate-400 mb-3">Set New Password</p>
      <h1 class="text-3xl font-bold tracking-tight mb-1">Reset Password</h1>
      <p class="text-slate-500 mb-6">Enter reset token from forgot-password screen and set your new password.</p>
      <form class="space-y-4" (ngSubmit)="onReset()">
        <div class="space-y-2">
          <label class="filter-label" for="reset-token">Reset Token</label>
          <input id="reset-token" class="booking-field" name="token" [(ngModel)]="token" />
        </div>
        <div class="space-y-2">
          <label class="filter-label" for="new-password">New Password</label>
          <input id="new-password" type="password" class="booking-field" name="newPassword" [(ngModel)]="newPassword" />
        </div>
        @if (message) {
          <p class="text-xs text-emerald-600">{{ message }}</p>
        }
        @if (errorMessage) {
          <p class="text-xs text-rose-500">{{ errorMessage }}</p>
        }
        <button mat-flat-button color="primary" class="w-full !h-12 !rounded-xl !font-semibold" [disabled]="isSubmitting">
          {{ isSubmitting ? 'Updating...' : 'Update Password' }}
        </button>
        <p class="text-sm text-center text-slate-500">Back to <a routerLink="/auth/login" class="text-indigo-600 font-semibold no-underline hover:underline">Login</a></p>
      </form>
    </section>
  `,
})
export class ResetPasswordPageComponent {
  token = '';
  newPassword = '';
  message = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(private http: HttpClient, private router: Router) {}

  async onReset(): Promise<void> {
    if (!this.token.trim() || this.newPassword.trim().length < 6) {
      this.errorMessage = 'Token and min 6 character password required.';
      return;
    }
    this.errorMessage = '';
    this.message = '';
    this.isSubmitting = true;
    try {
      await firstValueFrom(
        this.http.post('http://localhost:4000/api/auth/reset-password', {
          token: this.token.trim(),
          newPassword: this.newPassword.trim(),
        })
      );
      this.message = 'Password reset successful. Redirecting to login...';
      setTimeout(() => void this.router.navigateByUrl('/auth/login'), 1000);
    } catch {
      this.errorMessage = 'Reset failed. Token may be invalid or expired.';
    } finally {
      this.isSubmitting = false;
    }
  }
}

@Component({
  standalone: true,
  imports: [MatButtonModule, RouterLink, FormsModule],
  template: `
    <section class="surface-card p-8 sm:p-9 lg:p-10">
      <p class="text-xs uppercase tracking-[0.2em] text-slate-400 mb-3">Create Account</p>
      <h1 class="text-3xl font-bold tracking-tight mb-1">Join CareNest</h1>
      <p class="text-slate-500 mb-6">Register as household user, helper, or admin.</p>
      <form class="space-y-4" (ngSubmit)="onRegister()">
        <div class="space-y-2">
          <label class="filter-label" for="register-name">Full Name</label>
          <input id="register-name" class="booking-field" name="fullName" [(ngModel)]="fullName" />
        </div>
        <div class="space-y-2">
          <label class="filter-label" for="register-email">Email</label>
          <input id="register-email" type="email" class="booking-field" name="email" [(ngModel)]="email" />
        </div>
        <div class="space-y-2">
          <label class="filter-label" for="register-role">Role</label>
          <select id="register-role" class="booking-field booking-select" name="role" [(ngModel)]="role">
            <option value="household">User (Household)</option>
            <option value="helper">Helper (Maid / Babysitter / Nanny)</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="filter-label" for="register-password">Password</label>
          <input id="register-password" type="password" class="booking-field" name="password" [(ngModel)]="password" />
        </div>
        @if (errorMessage) {
          <p class="text-xs text-rose-500">{{ errorMessage }}</p>
        }
        <button type="submit" mat-flat-button color="primary" class="w-full !h-12 !rounded-xl !font-semibold" [disabled]="isSubmitting">
          {{ isSubmitting ? 'Creating account...' : 'Register' }}
        </button>
      </form>
    </section>
  `,
})
export class RegisterPageComponent {
  fullName = '';
  email = '';
  role: 'household' | 'helper' | 'admin' = 'household';
  password = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(private router: Router, private http: HttpClient) {}

  async onRegister(): Promise<void> {
    if (!this.fullName.trim() || !this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    if (this.password.trim().length < 4) {
      this.errorMessage = 'Password must be at least 4 characters.';
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    try {
      const response = await firstValueFrom(
        this.http.post<{
          token: string;
          refreshToken: string;
          user: { fullName: string; email: string; role: 'household' | 'helper' | 'admin' };
        }>('http://localhost:4000/api/auth/register', {
          fullName: this.fullName.trim(),
          email: this.email.trim().toLowerCase(),
          password: this.password.trim(),
          role: this.role,
          city: 'Surat',
        })
      );

      localStorage.setItem('careNestAuth', JSON.stringify(response.user));
      localStorage.setItem('careNestToken', response.token);
      localStorage.setItem('careNestRefreshToken', response.refreshToken);
      await this.router.navigateByUrl('/dashboard');
    } catch {
      this.errorMessage =
        'Registration failed. Email may already exist or API server is not running.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
