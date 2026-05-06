# Technical Documentation
## Maid & Nanny Service Management Platform

Comprehensive implementation document for a web platform that connects households with verified domestic helpers (maid, babysitter, nanny). This version is written as an execution-ready guide for local development and phased delivery.

This single file includes both PRD-level requirements and technical implementation details.

---

## 1) Product Context

### 1.1 Problem Statement
Households frequently hire through informal channels and face:
- Missing background verification
- Unreliable attendance and service quality
- Non-standard pricing and unclear plans
- Poor communication and weak accountability
- Manual and time-consuming follow-up

### 1.2 Vision
Build a trusted digital platform where households can search, compare, book, and review verified helpers with transparent service plans.

### 1.3 Product Benchmark Reference
The platform concept and service domain are aligned with market patterns seen in Helper4U (maid, nanny, babysitter and other domestic help categories).

---

## 2) Objectives

### 2.1 Primary Objectives
- Digitize end-to-end helper discovery and booking
- Ensure helper trust via verification workflows
- Support flexible plans: hourly, monthly, yearly
- Improve transparency in booking status and service history

### 2.2 Secondary Objectives
- Maintain helper performance records and reliability insights
- Enable user ratings and feedback loops
- Keep architecture scalable for multi-city expansion

---

## 3) Scope

### 3.1 In Scope (Phase 1)
- Responsive web application (desktop + mobile browser)
- Role-based access: household, helper, admin
- Listings and profile pages for maid, babysitter, nanny
- Booking request and lifecycle management
- Service plan management (hourly/monthly/yearly)
- Verification document upload and admin approval flow
- Admin dashboard for operations and KPIs

### 3.2 Out of Scope (Phase 1)
- Native Android/iOS applications
- Payroll processing and salary disbursement
- GPS real-time tracking
- In-app emergency/SOS workflows

---

## 4) Stakeholders and Roles

- Household User: discovers and books helpers
- Helper (Maid/Babysitter/Nanny): manages profile, availability, and bookings
- Admin: verifies helpers, resolves disputes, monitors operations
- Platform Owner: business KPIs, city expansion, policy decisions

---

## 5) Functional Requirements

## 5.1 Household Features
- Register, login, forgot password
- Create/edit household profile (family details, location, preferences)
- Browse and search helpers
- Filter by:
  - Service type
  - Experience level
  - Availability slot
  - Price range
  - Service plan type
  - Verification status
- View helper profile:
  - Skills and experience
  - Verification badge
  - Ratings and reviews
  - Plan pricing
- Create booking request with selected plan and schedule
- View booking history and active service status
- Submit rating/review after service completion

## 5.2 Helper Features
- Register and create helper profile
- Upload identity and verification documents
- Set service categories and preferred plans
- Manage availability calendar/slots
- Accept/reject incoming booking requests
- View assigned jobs and history
- View earnings summary (read-only in Phase 1)

## 5.3 Admin Features
- Verify/reject helper profiles and documents
- Manage users, helpers, service categories, and plans
- Monitor booking funnel (requested/accepted/completed/cancelled)
- Handle complaints and dispute records
- Access analytics dashboard and reports

---

## 6) Non-Functional Requirements

### 6.1 Performance
- Target page load under 3 seconds (production profile)
- API response targets:
  - Read endpoints: <= 500 ms (p95)
  - Create/update endpoints: <= 800 ms (p95)

### 6.2 Security
- Secure authentication with JWT + refresh token
- Role-based authorization (household/helper/admin)
- Encrypt sensitive personal data at rest
- Secure document storage with access controls
- Rate limit auth and booking endpoints

### 6.3 Usability
- Simple and mobile-friendly interface
- Clear role-based navigation
- Form validation with actionable error messages

### 6.4 Reliability
- Booking state transitions must be audit-logged
- Soft delete strategy for regulatory and dispute traceability

### 6.5 Scalability
- Multi-city support with location-based helper discovery
- Service category extensibility without schema rewrite

---

## 7) Suggested Technology Stack

### 7.1 Frontend
- Angular 18+ (current project)
- Angular Material + Tailwind CSS
- RxJS for async UI state management

### 7.2 Backend
- Node.js + Express.js
- REST API architecture
- Background jobs (BullMQ/Agenda optional in later phase)

### 7.3 Database
- PostgreSQL (recommended for transactional booking consistency)
- Redis (optional cache/session/rate-limiting)

### 7.4 Storage & Deployment
- Document/object storage: AWS S3 or equivalent
- Frontend hosting: Vercel/Netlify
- Backend hosting: AWS/Render/Railway

---

## 8) System Modules

- Authentication & Authorization
- User Profile Management
- Helper Profile & Verification
- Catalog/Search & Filters
- Booking & Plan Engine
- Review & Rating
- Admin Operations
- Reporting & Analytics
- Notifications (email/SMS/WhatsApp in future phase)

---

## 9) High-Level User Flow

1. Household visits platform and registers/logs in
2. Searches helper by type/location/availability/plan
3. Reviews profile and verification details
4. Selects plan and submits booking request
5. Helper accepts/rejects request
6. Booking gets scheduled and service is delivered
7. Household posts feedback and rating
8. Admin monitors exceptions, complaints, and KPIs

---

## 10) Data Requirements

## 10.1 Core Entities
- users
- helpers
- helper_documents
- services
- service_plans
- bookings
- booking_status_logs
- reviews
- complaints
- cities

## 10.2 Entity Snapshot (Example Fields)

### users
- id (UUID)
- full_name
- phone
- email
- password_hash
- role (household/helper/admin)
- city_id
- created_at, updated_at

### helpers
- id (UUID)
- user_id (FK users)
- service_type (maid/babysitter/nanny)
- experience_years
- bio
- availability_json
- verification_status (pending/approved/rejected)
- avg_rating
- reliability_score

### service_plans
- id
- helper_id
- plan_type (hourly/monthly/yearly)
- price
- duration_notes
- active

### bookings
- id
- household_user_id
- helper_id
- service_plan_id
- start_date
- end_date
- status (requested/accepted/rejected/completed/cancelled)
- address_text
- notes

### reviews
- id
- booking_id
- household_user_id
- helper_id
- rating (1..5)
- comment

---

## 11) API Contract (Draft)

### 11.1 Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

### 11.2 Household
- `GET /api/v1/helpers`
- `GET /api/v1/helpers/:id`
- `POST /api/v1/bookings`
- `GET /api/v1/bookings/me`
- `POST /api/v1/reviews`

### 11.3 Helper
- `PUT /api/v1/helpers/me/profile`
- `POST /api/v1/helpers/me/documents`
- `PUT /api/v1/helpers/me/availability`
- `GET /api/v1/helpers/me/bookings`
- `PATCH /api/v1/bookings/:id/decision` (accept/reject)

### 11.4 Admin
- `GET /api/v1/admin/helpers/pending`
- `PATCH /api/v1/admin/helpers/:id/verify`
- `GET /api/v1/admin/bookings`
- `GET /api/v1/admin/analytics/overview`
- `POST /api/v1/admin/complaints/:id/resolve`

---

## 12) Booking Lifecycle (State Machine)

- `requested` -> `accepted` -> `completed`
- `requested` -> `rejected`
- `requested` -> `cancelled`
- `accepted` -> `cancelled`

Rules:
- Only helper can accept/reject `requested` booking.
- Household can cancel before service start.
- Completion can be triggered by helper/admin (with audit log).

---

## 13) UI/UX Requirements

- Mobile-first responsive design
- Accessible forms, labels, and contrast ratios
- Role-based dashboard cards and quick actions
- Search and filter with clear chips/reset controls
- Booking timeline/status indicators

---

## 14) KPIs and Success Metrics

- Registered households
- Verified helpers
- Booking request to completion conversion rate
- Helper reliability score
- Average rating and CSAT
- Monthly active users (MAU)
- Booking cancellation ratio

---

## 15) Assumptions and Constraints

### Assumptions
- Helpers submit genuine documents
- Households provide accurate job requirements
- Admin moderation remains active and timely

### Constraints
- Fixed timeline and budget
- Phase 1 is web-only
- Advanced automation deferred to future phases

---

## 16) Phase-Wise Delivery Plan

### Phase 1 (Current)
- Frontend with role-based modules and mock data
- Local demo-ready flows for listing, booking, verification, admin view

### Phase 2
- Backend APIs + database integration
- Real authentication, booking persistence, review storage

### Phase 3
- Payments, attendance, advanced notifications, multilingual support

---

## 17) Deliverables

- Functional responsive web app (household/helper/admin journeys)
- Admin dashboard and moderation panels
- Technical documentation (this file)
- Deployment-ready frontend build and run instructions

---

## 18) Local Development Notes

For this Angular project:
1. Install dependencies: `npm install`
2. Run app locally: `npm start`
3. Build for production: `npm run build`

Current implementation status:
- Frontend flows and role screens available
- Backend/database integration pending (planned Phase 2)

---

## 19) Risk Register (Initial)

- Verification fraud risk -> strict admin review + document audit trail
- Helper no-show risk -> reliability score + cancellation history
- Data privacy risk -> encryption + access control + minimal data exposure
- Scale risk -> pagination, index strategy, cache for heavy listing endpoints

---

## 20) Future Enhancements

- Online payment and subscription billing
- Attendance and leave tracking
- SOS emergency workflow
- Mobile apps (Android/iOS)
- AI-assisted helper recommendations

---

## 21) Reference

- Helper4U service-domain benchmark: https://helper4u.in/

