import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './auth.guards';
import { AdminLayoutComponent } from './layouts/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout.component';
import { UserLayoutComponent } from './layouts/user-layout.component';
import {
  AdminDashboardPageComponent,
  BookingManagementPageComponent,
  BookingPageComponent,
  BookingSuccessPageComponent,
  HelperDashboardPageComponent,
  HelperDetailPageComponent,
  HelperProfilePageComponent,
  HomePageComponent,
  ForgotPasswordPageComponent,
  ResetPasswordPageComponent,
  LoginPageComponent,
  RegisterPageComponent,
  SearchHelpersPageComponent,
  UserDashboardPageComponent,
  VerifyHelpersPageComponent,
} from './pages';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginPageComponent },
      { path: 'register', component: RegisterPageComponent },
      { path: 'forgot-password', component: ForgotPasswordPageComponent },
      { path: 'reset-password', component: ResetPasswordPageComponent },
      { path: '', pathMatch: 'full', redirectTo: 'login' },
    ],
  },
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: 'search', component: SearchHelpersPageComponent },
      { path: 'helper/:id', component: HelperDetailPageComponent },
      { path: 'dashboard', component: UserDashboardPageComponent, canActivate: [authGuard, roleGuard('household', 'user')] },
      { path: 'booking', component: BookingPageComponent, canActivate: [authGuard, roleGuard('household', 'user')] },
      { path: 'booking/success', component: BookingSuccessPageComponent, canActivate: [authGuard] },
      { path: 'helper-dashboard', component: HelperDashboardPageComponent, canActivate: [authGuard, roleGuard('helper')] },
      { path: 'helper-profile', component: HelperProfilePageComponent, canActivate: [authGuard, roleGuard('helper')] },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard('admin')],
    children: [
      { path: 'dashboard', component: AdminDashboardPageComponent },
      { path: 'verify-helpers', component: VerifyHelpersPageComponent },
      { path: 'booking-management', component: BookingManagementPageComponent },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: '' },
];
