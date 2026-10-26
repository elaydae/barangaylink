# 🏘️ BarangayLink

## Barangay Information & E-Services System

> **Stronger Community. Easier Access.**

[![Local live demo](https://img.shields.io/badge/Local%20Live%20Demo-http%3A%2F%2Flocalhost%3A3000-2ea44f?style=for-the-badge)](http://localhost:3000/)

> **Run locally:** install the dependencies with `npm install`, start the server with `npm start`, then open [http://localhost:3000](http://localhost:3000/) in a browser. The Express server must remain running.

BarangayLink is a **browser-based Barangay Information & E-Services System** designed to make common barangay services more accessible, organized, and convenient for residents and barangay staff.

Residents can explore services, review requirements, submit document requests, receive reference numbers, and track request progress through a single web interface. Barangay staff can review, approve, reject, and update resident requests.

> **Project status:** Academic prototype with an Express-backed document request workflow. It is not production-ready.

## 🚀 How to Download and Run BarangayLink Locally

Follow these steps in Windows using Visual Studio Code. The commands below are for the VS Code PowerShell terminal.

### Step 1: Download the project ZIP file

1. Open the [official BarangayLink GitHub repository](https://github.com/elaydae/barangaylink).
2. Select the green **Code** button, then choose **Download ZIP**.
3. Wait for the ZIP file to finish downloading, then extract it using Windows File Explorer.
4. Confirm that the extracted project folder is named exactly `barangaylink-main`. If Windows gives it another name or adds a suffix such as `-main (1)`, rename the extracted project folder to `barangaylink-main`. Do not rename or change files inside the project.

### Step 2: Open the project in Visual Studio Code

1. Launch Visual Studio Code and open **Terminal → New Terminal**.
2. List the files and folders in the terminal's current location:

   ```powershell
   dir
   ```

3. If `barangaylink-main` appears in the output, enter it:

   ```powershell
   cd barangaylink-main
   ```

   This command works only when the terminal is in the parent directory that contains `barangaylink-main`.

4. If the folder is not listed, first navigate to the location where you extracted the ZIP. For example, if it is in Downloads, run `cd "$HOME\Downloads"`; if it is on the Desktop, run `cd "$HOME\Desktop"`. The correct location depends on where you saved and extracted the ZIP. Run `dir` again there.

### Step 3: Verify the project directory

After entering `barangaylink-main`, run:

```powershell
dir
```

Confirm that `package.json`, `README.md`, and the project files and folders are listed. Before installing dependencies, make sure this is the actual project directory containing `package.json`. If `package.json` is missing, do not continue: return to the parent directory with `cd ..` and locate the correct `barangaylink-main` project folder.

### Step 4: Check Node.js and npm

The project requires **Node.js 18 or later and npm**. Check the installed versions:

```powershell
node -v
npm -v
```

If either command is not recognized, install a compatible current LTS release from [the official Node.js website](https://nodejs.org/). After installation, restart VS Code or open a new terminal, then repeat both checks. If the commands already work, you do not need to reinstall Node.js.

### Step 5: Install the project dependencies

With the terminal in the project directory and `package.json` visible, run:

```powershell
npm install
```

This installs the packages required by the project's existing npm configuration. Wait for the command to finish successfully. If it reports an error, read the message and resolve the issue before continuing; do not assume the installation succeeded.

### Step 6: Start the application

After `npm install` completes successfully, run:

```powershell
npm start
```

This runs the existing `start` script in `package.json` and starts the Express server. Keep this terminal open while using BarangayLink. Closing it or stopping the server makes the local application unavailable.

### Step 7: Open BarangayLink in your browser

After the server starts successfully, open [http://localhost:3000](http://localhost:3000/) in a browser such as Chrome or Edge. Keep the terminal and server running while using the application.

Do not double-click `index.html` to run BarangayLink. Opening an HTML file directly through `file://` does not start Express and prevents backend API requests from working. The local server must be running for the API-backed document request workflow.

If the browser cannot connect, see [Troubleshooting](#troubleshooting).

### Command summary

Run these commands one at a time, in order. The first `dir` checks the current location; `cd barangaylink-main` assumes that location is the folder's parent. The second `dir` verifies the project files. `node -v` and `npm -v` only check installed versions.

```powershell
dir
cd barangaylink-main
dir
node -v
npm -v
npm install
npm start
```

The application startup commands are `npm install` followed by `npm start`. The server must be running before you visit `http://localhost:3000`.

## MMDC Milestone 2: Backend-Supported Request Workflow

### Implemented

- The resident request form sends submissions to the Express API using `fetch()`.
- The server validates required resident fields, email/contact format, available service names, purpose values, and input lengths.
- The server creates unique `BL-YYYY-<UUID>` references and stores request records in `data/requests.json`.
- Resident dashboard, history, and tracking pages and the staff queue/review page read the same backend records.
- Staff status updates and rejection reasons are validated and persisted by the API. The server enforces the existing workflow: pending → review → approved → ready → released; review may instead be rejected.
- Request forms and API-backed views show loading, empty, success, not-found, and network/server error feedback. Submit buttons lock while a submission is in progress.
- Request data is not stored in `localStorage`. Browser storage remains for prototype-only profile prefills, demo role state, concerns, and barangay display preferences.
- Community concerns are a separate prototype workflow stored in the current browser's `localStorage`; they are not sent to the document-request API or synchronized across browsers/devices. A concern's urgency is shown in the review step and staff view.

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

For test commands, coverage, and previously reported results, see [Testing and Milestone 2 Verification](#testing-and-milestone-2-verification). A previously reported live-host probe found that the static GitHub Pages API path returned non-JSON 404/405 responses; the automated suite checks response handling and idempotent retries. No production backend is deployed at the GitHub Pages origin.

### Troubleshooting

- **`cd barangaylink-main` fails:** The terminal may not be in the folder that contains the extracted project, or Windows may have given the folder a different name. Run `dir`, navigate to the extraction location, and check or correct the folder name.
- **`package.json` cannot be found:** The terminal is in the wrong directory or in an outer extraction folder. Return to the parent directory with `cd ..`, locate the actual `barangaylink-main` folder, enter it, and run `dir` again.
- **`node` or `npm` is not recognized:** Install Node.js from [nodejs.org](https://nodejs.org/), then restart VS Code or open a new terminal and check the versions again.
- **`npm install` fails:** Read the npm error and confirm that the terminal is in the project directory containing `package.json` and that Node.js 18 or later is installed. Do not delete files or change dependency versions as a troubleshooting shortcut.
- **`npm start` fails:** Check the terminal output, confirm that `npm install` finished successfully, and verify that `package.json` contains the expected `start` script (`node server.js`).
- **Port 3000 is already in use:** Another process may be using it. Stop that process, or use another available port; this server supports the `PORT` environment variable. In PowerShell, for example, run `$env:PORT=3001; npm start` and open `http://localhost:3001`.
- **The browser cannot connect to `localhost:3000`:** Confirm the server started without errors, leave its terminal running, and check that the browser address is `http://localhost:3000`.
- **Requests fail on GitHub Pages:** GitHub Pages serves only the static frontend and does not run the Express backend. Backend-dependent features require the local server or a separately deployed backend.
- **DevTools shows `file:///api/requests` or a file-origin error:** The page was opened as a local file. Start the server from the project directory and visit `http://localhost:3000` instead.
- **An API error or a page instead of JSON:** Confirm the page and API share the same `http://localhost:<port>` origin and that `GET /api/health` returns `{"data":{"status":"ok"}}`.

### Remaining scope and planned work

**Essential for the Milestone 2 demonstration**

- Verify the resident submission, staff status update, and resident tracking/history flow using the local server before each demonstration.
- Keep the local server running and explain that the demo login and API are not production security.
- Explain that community concerns are local-browser prototype data, unlike backend-persisted document requests.

**Later improvements**

- Add authenticated server-side staff access and resident-owned request filtering before any real deployment.
- Persist community concerns through a separately designed, validated backend workflow if cross-device sharing is required.
- Consider a database only when the course/project requires multiple users or concurrent server processes.
- Decide whether to implement real supporting-document upload and secure storage.
- Split the growing `js/app.js` by responsibility only with regression coverage for every affected page.
- Add browser-level responsive and form-flow automation if the project adopts a browser test runner.

**Too advanced or out of the current project scope**

- Payment processing, PhilSys integration, digital signatures, AI chatbot, multi-barangay administration, and government API integration.

---

## 🌐 Demo Accounts and Previews

The [local application](http://localhost:3000/) is available after you follow the setup steps above. The [GitHub Pages demo](https://elaydae.github.io/barangaylink/index.html) is a static frontend preview only; it does not run Express and cannot submit backend requests.

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

## 🎯 Project Purpose

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

## 👥 User Roles

### 🧑 Resident

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

### 👨‍💼 Barangay Staff / Admin

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

## 📄 Available Services

The frontend catalog currently lists 18 services. Four core examples are:

| Service                      | Purpose                            |
| ---------------------------- | ---------------------------------- |
| **Barangay Clearance**       | Request a barangay clearance       |
| **Certificate of Residency** | Verify barangay residency          |
| **Certificate of Indigency** | Request a certificate of indigency |
| **Business Permit**          | Submit a business permit request   |

Each service can display its requirements before the resident submits a request.

---

## 🔄 Core Workflow

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

## 🖥️ Main Application Pages

### Public

* `index.html` — Landing page
* `pages/login.html` — Resident and staff login
* `pages/register.html` — Resident registration
* `pages/forgot-password.html` — Password-recovery prototype screen
* `pages/forgot-password.html` — Password-recovery prototype screen

### Resident

* `pages/dashboard.html` — Resident overview
* `pages/services.html` — Available services
* `pages/request.html` — Document request process
* `pages/tracking.html` — Request tracking
* `pages/history.html` — Previous requests
* `pages/profile.html` — Resident profile
* `pages/barangay-info.html` — Barangay information
* `pages/concerns.html` — Concerns and feedback
* `pages/emergency.html` — Emergency information

### Staff / Admin

* `pages/staff-dashboard.html` — Staff dashboard and request queue
* `pages/staff-request.html` — Request review and status management

---

## ✨ Key Features

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

## 🎨 Design Approach

BarangayLink uses a **civic-focused interface** built around:

* 🏘️ Community
* 🤝 Accessibility
* 🔐 Trust
* 📋 Simplicity
* 🏛️ Public service

The interface uses consistent navigation, cards, status indicators, responsive layouts, notifications, and visual request tracking to make the application easy to understand and navigate.

---

## ⚙️ Technology

### Frontend

* **HTML5**
* **CSS3**
* **JavaScript**

### Current Data Handling

Document requests use the Express API and persist to `data/requests.json`. Browser `localStorage` remains for non-authoritative prototype data such as demo session state, profile-prefill values, concerns, and barangay display settings.

---

## 📁 Project Structure

```text
barangaylink-main/
├── .vscode/
│   └── settings.json
├── assets/
├── css/
│   └── style.css
├── data/                         # created when request data is first saved
├── js/
│   ├── api.js
│   └── app.js
├── pages/
│   ├── barangay-info.html
│   ├── concerns.html
│   ├── dashboard.html
│   ├── emergency.html
│   ├── forgot-password.html
│   ├── history.html
│   ├── login.html
│   ├── profile.html
│   ├── register.html
│   ├── request.html
│   ├── services.html
│   ├── staff-dashboard.html
│   ├── staff-request.html
│   └── tracking.html
├── test/
│   └── requests.test.js
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

> The structure may change as development continues.

---

## 🧪 Testing and Milestone 2 Verification

Run `npm test` for backend integration, static-page serving, tracking-rendering, and authentication-guard regression checks. Run `npm run check` for JavaScript syntax checks.

**Verified during the 2026-10-26 milestone audit:** `npm test` passed **19 tests, 0 failed**, and `npm run check` passed. Browser checks exercised request creation, staff processing through release, and resident tracking of the updated state; concern urgency appeared as selected in the review and staff view. Responsive viewport checks found no horizontal overflow on the landing page, six resident pages, and three staff pages across tested widths from 320 to 1440 CSS pixels. These browser checks are manual audit evidence, not a committed automated browser suite; native browser zoom at 125% and 150% was not separately exercised. See [the Milestone 2 verification report](./MILESTONE2-VERIFICATION.md) for scope, findings, and limitations.

---

## 📊 Development Status

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
| Browser Storage            | ✅ Profile/demo state and local-only concerns |
| Express Request API        | ✅ Implemented         |
| JSON Request Persistence   | ✅ Implemented         |
| Production Authentication  | 🚧 Planned             |
| Database / Multi-instance  | 🚧 Planned if required |

---

## 🚧 Future Development

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

## 🏗️ Current and Future Architecture

```text
HTML/CSS/JS pages --fetch()--> Express JSON API --atomic JSON-file writes--> data/requests.json
                                      |
                                      +--> request list/detail/status update
```

Authentication, role authorization, resident-level data access, and any production database remain future work.

---

## 🔐 Security Notice

BarangayLink is an **academic prototype** with a browser frontend and an Express request API.

The current client-side authentication and unauthenticated request API are intended only for demonstration. Do not use them with real resident information or deploy the API publicly as a production service.

Community concerns are stored only in browser `localStorage` and are not shared between devices or browsers. Treat that workflow as demonstration data as well.

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

## 🤖 AI-Assisted Development

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

## 👥 Project Team

**BarangayLink** is a group browser-based application project.

* **Ephraim Elayda**
* **Charlene Mae Ignacio**
* **Emilyn Maguad**
* **Kurosh Avendaño**

---

## 🔗 Project Links

### 🚀 Local Live Demo

Follow the [local setup guide](#-how-to-download-and-run-barangaylink-locally), then open **[http://localhost:3000](http://localhost:3000/)**.

Static preview: [GitHub Pages](https://elaydae.github.io/barangaylink/pages/login.html) (backend API unavailable).

### 💻 GitHub Repository

[View BarangayLink on GitHub](https://github.com/elaydae/barangaylink)

---

## 🎓 Academic Purpose

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

## ⚠️ Disclaimer

BarangayLink is an **academic prototype developed for educational purposes**.

It is not an official government system and is not intended for production use without further development, security review, backend implementation, database integration, authentication hardening, privacy controls, and proper authorization.

Demo credentials are provided solely for classroom demonstration.

---

## Developer Maintenance Guide

### Project Structure

- `css/style.css` contains shared colors, layouts, navigation, forms, tables, status indicators, and responsive rules.
- `js/app.js` contains shared page initializers, demo authentication, validation, rendering, and browser-storage logic.
- `js/api.js` centralizes browser requests to the Express JSON API.
- `server.js` serves the application and validates/persists request records in the JSON repository.
- `test/requests.test.js` exercises the request API, persistence, error cases, and static pages.
- `pages/` contains public authentication screens and resident/staff application pages.
- `assets/` contains static imagery used by the landing page and interface.
- `index.html` is the public landing page; `README.md` documents the project.

### Where to Make Changes

- Navigation: update the relevant page header/sidebar markup, shared styles in `css/style.css`, and `initNavigation()` / role-specific menu setup in `js/app.js`.
- Resident services and requests: update `pages/services.html` or `pages/request.html`, the catalog/request handlers in `js/app.js`, and API calls in `js/api.js`.
- Backend requests: update route validation and JSON-file persistence in `server.js`, plus `test/requests.test.js`.
- Staff request processing: update `pages/staff-dashboard.html` or `pages/staff-request.html` and `renderStaffDashboard()` / `initStaffRequest()` in `js/app.js`.
- Visual styling: update shared rules in `css/style.css`; check resident and staff pages because many selectors are shared.
- Demo authentication: update `DEMO_ACCOUNTS`, `initAuth()`, and `enforceAuthentication()` in `js/app.js`. This is only a frontend demonstration, not production authentication.

### Important Browser Data

`js/app.js` currently uses these browser-local keys for non-request prototype data:

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
