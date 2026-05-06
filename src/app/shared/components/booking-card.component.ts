import { Component, Input } from '@angular/core';
import { StatusBadgeComponent } from './status-badge.component';

@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [StatusBadgeComponent],
  templateUrl: './booking-card.component.html'
})
export class BookingCardComponent {
  @Input() booking: { id: string; helper: string; date: string; status: 'Active' | 'Pending' | 'Cancelled' } = {
    id: 'BK-4311',
    helper: 'Nisha Patel',
    date: '28 Apr 2026',
    status: 'Pending'
  };
}
