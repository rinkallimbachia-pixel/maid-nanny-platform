import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { I18nService } from '../../i18n.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnDestroy {
  isLoggedIn = false;
  userName = '';
  userRole: 'household' | 'helper' | 'admin' | 'user' | '' = '';
  private routerSubscription: Subscription;

  constructor(private router: Router, private i18n: I18nService, private http: HttpClient) {
    this.syncSession();
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.syncSession());
  }

  t(key: string): string {
    return this.i18n.t(key);
  }

  setLanguage(language: 'en' | 'hi'): void {
    this.i18n.setLanguage(language);
  }

  get language(): 'en' | 'hi' {
    return this.i18n.getLanguage();
  }

  get initials(): string {
    if (!this.userName) return 'U';
    return this.userName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }

  logout(): void {
    const refreshToken = localStorage.getItem('careNestRefreshToken');
    if (refreshToken) {
      this.http.post('http://localhost:4000/api/auth/logout', { refreshToken }).subscribe({ error: () => undefined });
    }
    localStorage.removeItem('careNestAuth');
    localStorage.removeItem('careNestToken');
    localStorage.removeItem('careNestRefreshToken');
    this.syncSession();
    this.router.navigateByUrl('/');
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  private syncSession(): void {
    const raw = localStorage.getItem('careNestAuth');
    if (!raw) {
      this.isLoggedIn = false;
      this.userName = '';
      this.userRole = '';
      return;
    }

    try {
      const parsed = JSON.parse(raw) as { fullName?: string; role?: 'household' | 'helper' | 'admin' | 'user' };
      this.userName = parsed.fullName?.trim() || 'User';
      this.userRole = parsed.role || '';
      this.isLoggedIn = true;
    } catch {
      this.isLoggedIn = false;
      this.userName = '';
      this.userRole = '';
    }
  }
}
