import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-helper-card',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './helper-card.component.html'
})
export class HelperCardComponent {
  @Input() helper = {
    id: '1',
    name: 'Priya Sharma',
    role: 'Childcare Specialist',
    skills: ['First Aid', 'Cooking', 'Toddler Care'],
    rating: 4.8,
    price: 'INR 799/day',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300'
  };
}
