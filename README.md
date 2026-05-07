# MaidNannyPlatform

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.21.

## Project Documentation

- Technical documentation: [Maid & Nanny Service Management Platform](docs/TECHNICAL_DOCUMENTATION.md)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Local API server (SQLite)

This project includes an Express.js backend using a single local SQLite database file (no external DB server).

- Start API: `npm run start:api`
- API with auto-reload: `npm run dev:api`
- Start frontend + API together: `npm run dev`
- Health check: `http://localhost:4000/api/health`
- SQLite file: `backend/data/maid_nanny.sqlite`
- Seed command: `cd backend && npm run seed`

Demo users for login:
- Household: `user@example.com` / `user123`
- Helper: `helper@example.com` / `helper123`
- Admin: `admin@example.com` / `admin123`

### Backend API modules

- JWT auth: `/api/auth/register`, `/api/auth/login`
- Password recovery: `/api/auth/forgot-password`, `/api/auth/reset-password`
- Session security: `/api/auth/refresh`, `/api/auth/logout`
- Helpers: `/api/helpers`, `/api/helpers/:id`, `/api/helpers/me/document`
- Services: `/api/services`
- Bookings: `/api/bookings`, `/api/bookings/me`, `/api/bookings/:id/status`
- Reviews: `/api/reviews`
- Complaints: `/api/complaints`, `/api/complaints/me`
- Attendance: `/api/attendance`, `/api/attendance/booking/:bookingId`
- Leave Requests: `/api/leaves`, `/api/leaves/me`, `/api/leaves/admin`
- Payments: `/api/payments`, `/api/payments/:id/status`, `/api/payments/helpers/me/earnings`
- SOS: `/api/sos`, `/api/sos/admin`, `/api/sos/:id`
- Subscriptions: `/api/subscriptions`, `/api/subscriptions/me`, `/api/subscriptions/:id/status`, `/api/subscriptions/:id/renewal`
- Admin: `/api/admin/helpers/:id/approve`, `/api/admin/helpers/pending`, `/api/admin/bookings`, `/api/admin/users`, `/api/admin/complaints`, `/api/admin/analytics/overview`

Postman collection is available at `backend/postman/Maid-Nanny-Platform.postman_collection.json`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
