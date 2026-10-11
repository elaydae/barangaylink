# 🏘️ BarangayLink

### Barangay Information & E-Services System

> **Stronger Community. Easier Access.**

[![Local Live Demo](https://img.shields.io/badge/Local%20Live%20Demo-http%3A%2F%2Flocalhost%3A3000-2ea44f?style=for-the-badge)](http://localhost:3000)

> **Run locally:** use `npm install` and `npm start`, then open **[http://localhost:3000](http://localhost:3000)**. This local demo requires the Express server to be running; do not open the HTML files directly.

BarangayLink is a **browser-based Barangay Information & E-Services System** designed to make common barangay services more accessible, organized, and convenient for residents and barangay staff.

Residents can explore services, review requirements, submit document requests, receive reference numbers, and track request progress through a single web interface. Barangay staff can review, approve, reject, and update resident requests.

> **Project Status:** Academic prototype with an Express-backed document request workflow. It is not production-ready.

## MMDC Milestone 2: Backend-Supported Request Workflow

### Implemented

- The resident request form sends submissions to the Express API using `fetch()`.
- The server validates required resident fields, email/contact format, available service names, purpose values, and input lengths.
- The server creates unique `BL-YYYY-<UUID>` references and stores request records in `data/requests.json`.
- Resident dashboard, history, and tracking pages and the staff queue/review page read the same backend records.
- Staff status updates and rejection reasons are validated and persisted by the API. The server enforces the existing workflow: pending → review → approved → ready → released; review may instead be rejected.
- Request forms and API-backed views show loading, empty, success, not-found, and network/server error feedback. Submit buttons lock while a submission is in progress.
- Request data is not stored in `localStorage`. Browser storage remains for prototype-only profile prefills, demo role state, concerns, and barangay display preferences.

### Local installation and startup

Requires Node.js 18 or later and npm. If Node.js/npm are not installed, install the current Node.js LTS release from [nodejs.org](https://nodejs.org/), then open a new VS Code terminal. In VS Code, change to the project folder containing `package.json` (the inner `barangaylink-main` directory) and run:

```sh
npm install
npm start
```

Open **http://localhost:3000**. Do not open `index.html` or `pages/request.html` from File Explorer: `file://` pages cannot call this API. The frontend explicitly detects that case and directs you to the local HTTP address.

The server uses port 3000 by default. If it is already occupied, stop the other process or choose an available port, for example `$env:PORT=3001; npm start` in PowerShell, then open `http://localhost:3001`. The server reports invalid port values and port-in-use errors.

GitHub Pages cannot run this Express backend: a live `GET /api/requests` probe returned HTML 404, and `POST /api/requests` returned a non-JSON HTTP 405 from its edge server. Those requests never reach Express or its storage. Public online submissions require separately deploying the backend and pointing the frontend at it; this repository does not configure such a deployment. The demo login is client-side only.

### API

All successful responses use `{ "data": ... }`. Errors use `{ "error": { "code": "...", "message": "...", "fields": {} } }` where field details apply.

| Method | Endpoint | Result |
| --- | --- | --- |
| `GET` | `/api/health` | Server connection status |
| `GET` | `/api/requests` | Request collection, newest first |
| `GET` | `/api/requests/:reference` | One request; `404` if unknown |
| `POST` | `/api/requests` | Create a validated request; returns `201`, or `200` when replaying the same `Idempotency-Key` |
| `PATCH` | `/api/requests/:reference/status` | Update an allowed status; returns `409` for an invalid transition |

Example submission:

```json
{
  "name": "Resident Name",
  "address": "12 Sample Street",
  "contact": "0917-123-4567",
  "email": "resident@example.com",
  "document": "Barangay Clearance",
  "purpose": "Employment"
}
```

Example status update:

```json
{
  "status": "rejected",
  "rejectionReason": "Please provide proof of residence."
}
```

`POST` returns `400` with field errors for missing or invalid values. Rejection requires a reason. The API also returns structured `404` errors for unknown references.

The frontend sends an `Idempotency-Key` for each request attempt and reuses it for retries, so a response interrupted after persistence does not create another record. The key is stored with the server record and excluded from API responses.

### Persistence and limitations

Requests are stored in a JSON array at `data/requests.json`; the server creates the file on first use and serializes writes within the running process. The file is ignored by Git. The frontend blocks a second in-flight form submission and reuses a stable idempotency key after an ambiguous response. This is a lightweight single-instance academic storage method, not a database, multi-process locking solution, backup strategy, or production data store. Existing browser-only demo request rows were removed rather than imported as false records. Supporting-document upload is not implemented; the optional file input is not sent to the server.

There is no server-side login, authentication, authorization, or resident ownership filtering. In this prototype, resident history lists all stored requests and request reads/status updates are available to anyone who can reach the API; client-side role checks are only for demonstration navigation. Do not enter real resident or confidential information or deploy this API publicly.

### Tests and verification

Run the automated API and application-serving tests and syntax checks with:

```sh
npm test
npm run check
```

The test suite covers health/connectivity, valid and concurrent submissions, duplicate retry idempotency, field and malformed-body validation, unknown references/routes, status transition validation and resident/staff read consistency, persistence after recreating the server, frontend network/unexpected-response handling, serving existing application pages, and serving the browser module entry point and feature modules. `npm run check` also syntax-checks each browser module.

**Verified for the JavaScript modularization:** `npm run check` passed; `npm test` passed all 17 tests. Browser smoke checks loaded the landing page, resident login/request/dashboard, staff dashboard/review, and concerns page without page errors. No request was submitted during these browser checks.

**Verified for the previous API response fix:** live-host probes confirmed the static GitHub Pages API path returns non-JSON 404/405 responses; the automated suite checks the response handling and idempotent retry behavior. Re-run the commands above after changes. No production backend is deployed at the GitHub Pages origin.

### Troubleshooting

- **DevTools shows `file:///api/requests` or a file-origin 403:** the page was opened as a local file. Run `npm start` from the folder containing `package.json` and open `http://localhost:3000`.
- **“Port 3000 is already in use”:** close the process using that port or run with another available `PORT`.
- **An API error or a page instead of JSON:** confirm the page and API share the same `http://localhost:<port>` origin and that `GET /api/health` returns `{"data":{"status":"ok"}}`.
- **GitHub Pages submission does not work:** GitHub Pages only serves static assets; deploy an API separately before enabling public submissions.

### Planned next steps

- Add authenticated server-side staff access and resident-owned request filtering.
- Consider a database only when the course/project requires multiple users or concurrent server processes.
- Decide whether to implement real supporting-document upload and secure storage.
- Add browser-level responsive and form-flow automation if the project adopts a browser test runner.

---

## 🌐 Local Live Demo

**[Open BarangayLink at http://localhost:3000](http://localhost:3000)** after starting the server with `npm start`.

The [GitHub Pages demo](https://elaydae.github.io/barangaylink/index.html) is a static frontend preview only. It does not run Express and cannot submit backend requests.

### Demo Accounts

#### 🧑 Resident

```text
Email:    demo@bl.com
Password: 123456
Role:     Resident
```

**Dashboard:** `pages/dashboard.html`

#### 👨‍💼 Staff / Admin

```text
Email:    staff@bl.com
Password: 123456
Role:     Staff/Admin
```

**Dashboard:** `pages/staff-dashboard.html`

> ⚠️ These credentials are for classroom demonstration only and must not be used for real accounts.

---

# 🎯 Project Purpose

BarangayLink aims to provide a simple digital interface for common barangay services while demonstrating practical browser-based application development.

### The system aims to:

* Provide easier access to barangay services
* Display clear document requirements
* Allow residents to submit document requests
* Provide request reference numbers
* Allow residents to track request status
* Organize staff request processing
* Demonstrate responsive web application development
* Provide a foundation for future authentication and database integration

---

# 👥 User Roles

## 🧑 Resident

Residents can:

* Register and log in
* Manage their profile
* Browse barangay services
* Search and filter services
* View document requirements
* Submit document requests
* Preview and confirm requests
* Receive request reference numbers
* Track request status
* View request history
* View barangay information
* Submit concerns and feedback
* Access emergency information

## 👨‍💼 Barangay Staff / Admin

Staff can:

* Log in to the staff dashboard
* View incoming requests
* Search and filter requests
* Review resident information
* Approve requests
* Reject requests
* Provide rejection reasons
* Update request status
* Manage the request-processing workflow

---

# 📄 Available Services

The frontend catalog currently lists 18 services. Four core examples are:

| Service                      | Purpose                            |
| ---------------------------- | ---------------------------------- |
| **Barangay Clearance**       | Request a barangay clearance       |
| **Certificate of Residency** | Verify barangay residency          |
| **Certificate of Indigency** | Request a certificate of indigency |
| **Business Permit**          | Submit a business permit request   |

Each service can display its requirements before the resident submits a request.

---

# 🔄 Core Workflow

```text
Resident
   │
   ▼
Login / Register
   │
   ▼
Resident Dashboard
   │
   ▼
Browse Services
   │
   ▼
Select Document
   │
   ▼
View Requirements
   │
   ▼
Complete Request
   │
   ▼
Preview & Confirm
   │
   ▼
Submit Request
   │
   ▼
Reference Number
   │
   ▼
Track Request
   │
   ▼
Staff Review
   │
   ├──────────────┐
   ▼              ▼
APPROVED       REJECTED
   │              │
   ▼              ▼
READY FOR      Rejection
RELEASE         Reason
   │
   ▼
RELEASED
```

### Request Status

```text
PENDING
   ↓
UNDER REVIEW
   ├──→ APPROVED → READY FOR RELEASE → RELEASED
   │
   └──→ REJECTED → REJECTION REASON
```

---

# 🖥️ Main Application Pages

### Public

* `index.html` — Landing page
* `login.html` — Resident and staff login
* `register.html` — Resident registration

### Resident

* `dashboard.html` — Resident overview
* `services.html` — Available services
* `request.html` — Document request process
* `tracking.html` — Request tracking
* `history.html` — Previous requests
* `profile.html` — Resident profile
* `barangay-info.html` — Barangay information
* `concerns.html` — Concerns and feedback
* `emergency.html` — Emergency information

### Staff / Admin

* `staff-dashboard.html` — Staff dashboard and request queue
* `staff-request.html` — Request review and status management

---

# ✨ Key Features

### Authentication

* Resident registration
* Resident login
* Staff/Admin login
* Demo accounts
* Login validation
* Logout
* Client-side session/state handling

### Service Discovery

* Service listing
* Search
* Filtering
* Requirements display

### Document Requests

* Request forms
* Input validation
* Dynamic requirements
* Request preview
* Request confirmation
* Reference number generation

### Request Tracking

* Request status
* Visual status timeline
* Request history
* Status updates

### Staff Management

* Request queue
* Request search and filtering
* Request review
* Approve / reject workflow
* Rejection reasons

### User Experience

* Responsive design
* Toast notifications
* Confirmation dialogs
* Empty states
* Form validation
* Keyboard-friendly interactions
* Accessibility-oriented interface elements

---

# 🎨 Design Approach

BarangayLink uses a **civic-focused interface** built around:

* 🏘️ Community
* 🤝 Accessibility
* 🔐 Trust
* 📋 Simplicity
* 🏛️ Public service

The interface uses consistent navigation, cards, status indicators, responsive layouts, notifications, and visual request tracking to make the application easy to understand and navigate.

---

# ⚙️ Technology

### Frontend

* **HTML5**
* **CSS3**
* **JavaScript**

### Current Data Handling

Document requests use the Express API and persist to `data/requests.json`. Browser `localStorage` remains for non-authoritative prototype data such as demo session state, profile-prefill values, concerns, and barangay display settings.

---

# 📁 Project Structure

```text
barangaylink/
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
├── js/
│   └── app.js
│
├── pages/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── services.html
│   ├── request.html
│   ├── tracking.html
│   ├── history.html
│   ├── profile.html
│   ├── barangay-info.html
│   ├── concerns.html
│   ├── emergency.html
│   ├── staff-dashboard.html
│   └── staff-request.html
│
└── assets/
    └── ...
```

> The structure may change as development continues.

---

# 🧪 Testing and Milestone 2 Verification

Run `npm test` for backend integration and static-page serving checks. Run `npm run check` for JavaScript syntax checks. Current verification: **16 tests passed, 0 failed**, and syntax checks passed. `npm install` completed successfully; `npm audit --omit=dev --audit-level=high` reported zero vulnerabilities. Coverage includes API health, valid and duplicate submissions, field validation, unknown IDs, status transitions and consistency, restart persistence, file-origin/network/unexpected-response handling, static page serving, and blocking access to the JSON data file. Local server checks confirmed the homepage and assets load at `http://localhost:3000`, a browser request is sent to `http://localhost:3000/api/requests`, invalid input returns JSON `400 VALIDATION_ERROR`, and both the browser request and API test request remained retrievable after restarting the server. Resident history and staff queue both displayed the browser-submitted record. These are manual and automated checks; no automated browser test suite is configured.

---

# 📊 Development Status

| Area                       | Status                |
| -------------------------- | --------------------- |
| Project Concept & Scope    | ✅ Completed           |
| HTML Structure             | ✅ Completed           |
| CSS / UI Design            | ✅ Completed           |
| Resident Interface         | ✅ Implemented         |
| Staff Interface            | ✅ Implemented         |
| Navigation                 | ✅ Implemented         |
| Authentication Prototype   | ✅ Implemented         |
| Service Listing            | ✅ Implemented         |
| Document Requests          | ✅ Implemented         |
| Request Tracking           | ✅ Implemented         |
| Request History            | ✅ Implemented         |
| Staff Request Management   | ✅ Implemented         |
| Profile Management         | ✅ Implemented         |
| Responsive Design          | ✅ Implemented         |
| Accessibility Improvements | ✅ Implemented         |
| Browser Storage            | ✅ Prototype-only data |
| Express Request API        | ✅ Implemented         |
| JSON Request Persistence   | ✅ Implemented         |
| Production Authentication  | 🚧 Planned             |
| Database / Multi-instance  | 🚧 Planned if required |

---

# 🚧 Future Development

The prototype can later be extended with:

* Secure server-side authentication
* Server-side role-based authorization
* Database-backed multi-user persistence, if required
* Secure supporting-document storage
* Additional barangay services
* Staff reports and analytics
* Advanced document management
* Improved notification system

### Current Scope Exclusions

The current project does not include:

* Online payment gateway
* PhilSys integration
* Multi-barangay management
* Digital signatures
* AI chatbot
* Government API integration
* Advanced identity verification
* Full mobile application

---

# 🏗️ Current and Future Architecture

```text
HTML/CSS/JS pages --fetch()--> Express JSON API --atomic JSON-file writes--> data/requests.json
                                      |
                                      +--> request list/detail/status update
```

Authentication, role authorization, resident-level data access, and any production database remain future work.

---

# 🔐 Security Notice

BarangayLink is currently a **frontend academic prototype**.

The current client-side authentication and browser storage are intended only for demonstration and should not be used for real government records.

A production implementation would require:

* Server-side authentication
* Password hashing
* Secure sessions/tokens
* Server-side validation
* Role-based authorization
* Database-backed accounts
* HTTPS
* Security logging
* Proper access controls
* Privacy and data protection measures

---

# 🤖 AI-Assisted Development

AI tools, including **GitHub Copilot and ChatGPT**, were used as development assistance for:

* Code suggestions
* Debugging
* HTML/CSS/JavaScript improvements
* UI/UX refinement
* Feature implementation guidance
* Documentation
* Testing suggestions
* Git/GitHub workflow guidance

All AI-assisted suggestions were reviewed, tested, modified, and incorporated by the development team where appropriate.

The development team remains responsible for the final implementation, testing, and project output.

---

# 👥 Project Team

**BarangayLink** is a group browser-based application project.

* **Ephraim Elayda**
* **Charlene Mae Ignacio**
* **Emilyn Maguad**
* **Kurosh Avendaño**

---

# 🔗 Project Links

### 🚀 Local Live Demo

Start the local server with `npm start`, then open **[http://localhost:3000](http://localhost:3000)**.

Static preview: [GitHub Pages](https://elaydae.github.io/barangaylink/pages/login.html) (backend API unavailable).

### 💻 GitHub Repository

[View BarangayLink on GitHub](https://github.com/elaydae/barangaylink)

---

# 🎓 Academic Purpose

BarangayLink was developed as an **academic browser-based application project**.

The project demonstrates:

* HTML5
* CSS3
* JavaScript
* Responsive web design
* UI/UX design
* Form handling
* Client-side validation
* Browser storage
* User workflows
* Role-based interfaces
* Request processing
* Status tracking
* Git and GitHub
* Application testing
* Team collaboration
* Project scope management

---

# ⚠️ Disclaimer

BarangayLink is an **academic prototype developed for educational purposes**.

It is not an official government system and is not intended for production use without further development, security review, backend implementation, database integration, authentication hardening, privacy controls, and proper authorization.

Demo credentials are provided solely for classroom demonstration.

---

## Developer Maintenance Guide

### Project Structure

- `css/style.css` contains shared colors, layouts, navigation, forms, tables, status indicators, and responsive rules.
- `js/app.js` is the compatibility entry point; it dynamically loads the browser ES-module bootstrap in `js/modules/app.mjs`.
- `js/modules/data.mjs` owns the shared service catalog, browser-local prototype storage, and small shared display utilities.
- `js/modules/navigation.mjs` handles the shared sidebar, logout, demo role redirects, and public navigation.
- `js/modules/resident.mjs` handles resident service browsing, request submission, dashboard, tracking, and history.
- `js/modules/staff.mjs` handles the staff request queue, review details, and request-status updates.
- `js/modules/community.mjs` handles resident/staff community concerns and staff-only shared-page behavior.
- `js/modules/account.mjs` handles demo login/registration, profile editing, barangay details, and phone formatting.
- `js/api.js` centralizes browser requests to the Express JSON API.
- `server.js` serves the application and validates/persists request records in the JSON repository.
- `test/requests.test.js` exercises the request API, persistence, error cases, and static pages.
- `pages/` contains public authentication screens and resident/staff application pages.
- `assets/` contains static imagery used by the landing page and interface.
- `index.html` is the public landing page; `README.md` documents the project.

All feature modules use explicit ES-module imports and exports. HTML pages keep their existing `js/app.js` script reference, so no page-specific script tag migration is required. The entry module waits for DOM readiness, then calls the shared initializers; page-specific initializers safely return when their DOM hooks are absent. API-backed pages still load `js/api.js` before the app entry, and request operations continue to use the existing same-origin Express API and JSON-file persistence.

### Where to Make Changes

- Navigation: update the relevant page header/sidebar markup, shared styles in `css/style.css`, and `js/modules/navigation.mjs`.
- Resident services and requests: update `pages/services.html` or `pages/request.html`, the catalog/request handlers in `js/modules/resident.mjs`, and API calls in `js/api.js`.
- Backend requests: update route validation and JSON-file persistence in `server.js`, plus `test/requests.test.js`.
- Staff request processing: update `pages/staff-dashboard.html` or `pages/staff-request.html` and `js/modules/staff.mjs`.
- Visual styling: update shared rules in `css/style.css`; check resident and staff pages because many selectors are shared.
- Demo authentication: update `DEMO_ACCOUNTS` and `initAuth()` in `js/modules/data.mjs` and `js/modules/account.mjs`, plus `enforceAuthentication()` in `js/modules/navigation.mjs`. This is only a frontend demonstration, not production authentication.

### Important Browser Data

`js/modules/data.mjs` uses these browser-local keys for non-request prototype data:

- `barangaylink.profile` -> resident name, address, contact, and email used to prefill requests.
- `barangaylink.auth` -> demo identity (`email`, `role`, `name`) used for navigation and presentation.
- `barangaylink.concerns` -> concern records with ID, type/title, location, description, urgency, reporter, anonymity, submitter, reported date, and status; resident entries can also have contact/address.
- `barangaylink.barangayInfo` -> barangay profile, population, office/contact, and location fields.

Requests are stored by the server in `data/requests.json`, not duplicated in browser storage. Browser-local values can be edited by their user and are not suitable for real credentials or sensitive production records.

### Before Modifying Shared Code

Review these workflows after a shared change:

- Resident login and staff login
- Navigation and logout
- Request creation and validation
- Request tracking and history
- Staff request review, status updates, approval, and rejection reason
- Concern submission and staff status update
- Profile and barangay information editing

### Current Limitations

- The request backend is an academic single-instance Express/JSON-file implementation, not a production service or database.
- Demo authentication and role checks run in client-side JavaScript and are not secure.
- Request API endpoints do not authenticate callers or enforce resident ownership; resident history currently lists all stored requests. Do not expose this demo publicly or enter real resident data.
- Supporting documents are not uploaded or persisted.

### Future Architecture

```text
HTML + CSS + JavaScript
          |
Authenticated Express API
          |
Database and secure document storage (only if required)
```

Implement authentication, authorization, resident-scoped reads, and stronger persistence before using the system with real residents or deploying it publicly.

---

## 📜 License

This project is an academic project developed for educational purposes.
