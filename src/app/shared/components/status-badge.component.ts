import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="px-2.5 py-1 rounded-full text-xs font-semibold" [ngClass]="badgeClass">{{ label }}</span>`,
})
export class StatusBadgeComponent {
  @Input() label: 'Active' | 'Pending' | 'Cancelled' | 'Verified' | 'Rejected' = 'Pending';

  get badgeClass(): string {
    if (this.label === 'Active' || this.label === 'Verified') return 'bg-emerald-100 text-emerald-700';
    if (this.label === 'Cancelled' || this.label === 'Rejected') return 'bg-rose-100 text-rose-700';
    return 'bg-amber-100 text-amber-700';
  }
}
