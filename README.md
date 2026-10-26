# 🏘️ BarangayLink

### Barangay Information & E-Services System

> **Stronger Community. Easier Access.**

**BarangayLink** is a browser-based barangay information and e-services application developed as an academic Web Systems project. Residents can browse barangay services, view requirements, submit document requests, receive reference numbers, and track request progress. Barangay staff can review requests, approve or reject them, and update their status.

> **Project status:** Academic prototype — MMDC Milestone 2: Backend-Supported Web Application. **Not an official government system or a production-ready service.** Use sample data only.

**Repository:** https://github.com/elaydae/barangaylink

## 📑 Contents

- [Project Overview](#-project-overview)
- [Getting Started](#-getting-started)
- [Demo Accounts](#-demo-accounts)
- [Features and User Roles](#-features-and-user-roles)
- [Document Request Workflow](#-document-request-workflow)
- [Technology and Project Structure](#-technology-and-project-structure)
- [API Reference](#-api-reference)
- [Testing and QA](#-testing-and-qa)
- [Limitations and Security](#-limitations-and-security)
- [Developer Maintenance](#-developer-maintenance)
- [Future Improvements](#-future-improvements)
- [Team and AI Assistance](#-team-and-ai-assistance)

## 📖 Project Overview

The project aims to simplify access to commonly requested barangay information and services and provide a shared workflow for resident document requests and staff processing.

For **Milestone 2**, the frontend document request workflow is connected to an **Express.js backend**. Request data is validated on the server and saved to a local JSON file, allowing records to remain available after browser refreshes and local server restarts.

The application is intended for **local classroom demonstration**. A static GitHub Pages preview, if used, does **not** run the Express API and cannot process real backend requests.

## 🚀 Getting Started

### Prerequisites

- Node.js **18 or later**
- npm (included with Node.js)
- A terminal (for example, the VS Code terminal)

### Run locally

1. Download or clone the repository.
2. Open a terminal in the folder that contains **`package.json`**.
3. Run:

   ```bash
   npm install
   npm start
   ```

4. Open **http://localhost:3000** in your browser.

> **Important:** Do not double-click `index.html` or open the pages using `file://`. The request workflow needs the Express API at the same local HTTP origin.

To use another port:

**PowerShell**

```powershell
$env:PORT=3001; npm start
```

**macOS/Linux**

```bash
PORT=3001 npm start
```

Then open `http://localhost:3001`.

### Other commands

| Command | Purpose |
| --- | --- |
| `npm test` | Run the automated tests |
| `npm run check` | Check JavaScript syntax |

On Windows PowerShell, if execution policy prevents `npm` from running, the group's QA review successfully used `npm.cmd test` and `npm.cmd run check` instead.

## 👥 Demo Accounts

These are **client-side demonstration accounts**, not secure server accounts.

| Role | Email | Password | Destination |
| --- | --- | --- | --- |
| Resident | `juan.delacruz@gmail.com` | `123456` | `pages/dashboard.html` |
| Staff/Admin | `barangay.staff@gmail.com` | `123456` | `pages/staff-dashboard.html` |

> The QA worksheet includes screenshots/observations using older demo addresses (`demo@bl.com` and `staff@bl.com`). The table above reflects the current `DEMO_ACCOUNTS` in `js/app.js`. Confirm these values again if the team later changes the code.

## ✨ Features and User Roles

### Resident

- Use the prototype registration and login screens.
- Browse the service catalog and its categories; view service requirements.
- Enter and review a document request before submission.
- Receive a request reference number and track its status.
- View request history and dashboard information.
- View and update prototype profile details.
- Read barangay and emergency information.
- Submit concerns and feedback using the browser-based prototype feature.

### Barangay Staff/Admin

- Open the staff dashboard and request queue.
- Search and filter requests.
- Review submitted resident/request details.
- Advance requests through permitted statuses or reject with a reason.

### Services

The catalog currently contains **18 services**, including Barangay Clearance, Certificate of Residency, Certificate of Indigency, and Business Permit. The catalog displays service descriptions and requirements.

### Important distinction

**Document requests** use the Express backend and its JSON-file storage. **Demo login/profile information, concerns, and barangay display preferences** use browser storage in this prototype. They are not equivalent to secured, server-managed resident accounts.

## 🔄 Document Request Workflow

```text
Resident selects service and checks requirements
                      |
                      v
           Completes request form
                      |
                      v
             Preview and confirm
                      |
                      v
           Submit to Express API
                      |
                      v
             Reference number
                      |
                      v
             PENDING REVIEW
                      |
                      v
              UNDER REVIEW
               /         \
              v           v
          APPROVED      REJECTED
              |         (reason required)
              v
       READY FOR RELEASE
              |
              v
           RELEASED
```

The backend enforces the transitions `pending → review → approved → ready → released`, with `review → rejected` as the rejection path. Invalid status jumps are rejected.

### Backend-supported behavior

- Request form sends data to the Express API through `fetch()` and `js/api.js`.
- The backend validates required information, formats, permitted service/purpose values, and input lengths.
- Successful submissions receive unique `BL-YYYY-<UUID>`-style reference numbers.
- Requests are written to `data/requests.json`, which is created when needed and ignored by Git.
- Resident request views and staff request views read the same backend request records.
- Status changes and rejection reasons are validated by the server.
- The interface includes loading, validation, empty, not-found, and network/server-error feedback.
- Submissions use an `Idempotency-Key` to avoid duplicate creation when the same attempt is retried.

## ⚙️ Technology and Project Structure

| Layer | Technology / location |
| --- | --- |
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express 5 (`server.js`) |
| Frontend API client | `js/api.js` |
| Document request storage | JSON file (`data/requests.json`) |
| Automated testing | Node.js built-in test runner |
| Demo browser state | Browser `localStorage` |

```text
barangaylink/
├── index.html                 # Public landing page
├── README.md
├── package.json              # Dependencies and npm scripts
├── package-lock.json
├── server.js                 # Express API and application server
├── css/
│   └── style.css             # Shared styling
├── js/
│   ├── api.js                # Frontend request API client
│   └── app.js                # Frontend page logic and demo state
├── pages/                    # Public, resident, and staff pages
├── assets/images/            # Application imagery
├── test/
│   └── requests.test.js      # Automated tests
└── data/requests.json        # Created at runtime; not tracked by Git
```

## 🔌 API Reference

Successful responses use `{ "data": ... }`; errors use `{ "error": { "code": "...", "message": "...", "fields": {} } }` where applicable.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Check server connection |
| `GET` | `/api/requests` | List requests, newest first |
| `GET` | `/api/requests/:reference` | Retrieve one request (404 if unknown) |
| `POST` | `/api/requests` | Create a validated request (`201`), or return existing request for a repeated idempotency key (`200`) |
| `PATCH` | `/api/requests/:reference/status` | Apply an allowed status update; invalid transitions return `409` |

**Example request submission**

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

**Example rejection update**

```json
{
  "status": "rejected",
  "rejectionReason": "Please provide proof of residence."
}
```

Invalid submissions return structured validation errors rather than creating a request. Unknown references return 404 errors. A rejection requires a reason.

## 🧪 Testing and QA

### Automated tests and syntax checks

Run these commands from the repository folder:

```bash
npm test
npm run check
```

The team's **MO-IT161 Web Systems Group QA Review** records the following results for the tested version:

| Verification | Recorded result |
| --- | --- |
| Automated tests | **16 passed, 0 failed** (`QA-086`) |
| JavaScript syntax checks | **Passed** (`QA-087`) |
| Request persistence after restarting server | **Passed** (`QA-080`) |
| Staff status progression and rejection validation | **Passed** (`QA-075`, `QA-076`) |
| Tracking, history, and dashboard consistency | **Passed** (`QA-061`) |
| API health and request endpoints | **Passed** (`QA-077`–`QA-079`) |

The automated suite covers API availability, valid/invalid request data, duplicate-retry idempotency, status transitions, JSON persistence, unexpected API responses, and static-page serving.

### QA boundaries

- **GitHub Pages API availability (`QA-040`): Blocked by the hosting environment** because static hosting does not run Express. This is a documented deployment limitation, not proof that local request handling failed.
- **Manual double-submit and interrupted-response retry (`QA-050`, `QA-051`): Blocked/not reproduced manually.** The corresponding protection is tested programmatically; do not present these as manually verified.
- The QA worksheet records both **Pass** and **Not Applicable** outcomes. For example, mobile public-page testing was treated as outside the agreed desktop-only scope (`QA-010`), although some resident/staff screens were checked at narrow width (`QA-084`). Do not claim complete mobile-browser testing.

Tests should be rerun after further code changes; the recorded results describe the version tested in the QA worksheet.

## 🔐 Limitations and Security

BarangayLink is an educational prototype. **Do not enter real resident information or deploy this API publicly in its current form.**

- Authentication and role-based navigation are managed on the client side; there is **no server-side authentication or authorization**.
- Request API access is not restricted to an authenticated resident or staff member. Resident history may display **all stored requests**, not only the current resident's requests.
- Request records are saved to one local JSON file, not a multi-user production database or a backup system.
- Supporting-document uploads are not implemented: the optional file input is not uploaded to the backend.
- GitHub Pages can serve a frontend preview but **cannot run this Express backend**.
- Online payment, PhilSys integration, multi-barangay management, digital signatures, and government API integration are outside the present scope.

A real deployment would require server-side authentication, authorization, resident-specific access control, secure storage, HTTPS, and privacy protections.

## 🛠️ Developer Maintenance

| Change needed | Where to look |
| --- | --- |
| Shared layout/styles | `css/style.css` |
| Frontend behavior, demo login, page initialization | `js/app.js` |
| Browser-to-server request handling | `js/api.js` |
| API validation, request status rules, JSON persistence | `server.js` |
| Request/staff page markup | `pages/request.html`, `pages/staff-dashboard.html`, `pages/staff-request.html` |
| Automated behavior checks | `test/requests.test.js` |

**Keep service definitions in sync:** the frontend service catalog and backend allowed service names must agree, or a displayed service may fail backend validation.

Browser-storage keys used for prototype-only data include `barangaylink.profile`, `barangaylink.auth`, `barangaylink.concerns`, and `barangaylink.barangayInfo`. Request records are stored on the server instead.

### Troubleshooting

| Problem | Suggested check |
| --- | --- |
| `file://` or `/api/requests` errors | Start the server and open `http://localhost:3000` |
| Port 3000 already in use | Close the other process or set another `PORT` |
| `Cannot find module 'express'` | Run `npm install` in the `package.json` folder |
| API returns HTML or an unexpected response | Check the frontend/API origin and open `http://localhost:3000/api/health` |
| Requests fail on GitHub Pages | Use the local Express server; the static preview does not host the API |

## 🚧 Future Improvements

Items for future consideration—not current features—include:

- Secure server-side authentication and role-based authorization.
- Resident-specific request access.
- Database-backed storage if the project moves beyond a single local process.
- Secure supporting-document upload and storage.
- More complete browser-based testing and other future enhancements as project requirements evolve.

## 👥 Team and AI Assistance

**Project Team**

- Ephraim Elayda
- Charlene Mae Ignacio
- Emilyn Maguad
- Kurosh Avendaño

**AI-assisted development:** GitHub Copilot, ChatGPT, and Claude were used as development aids for code suggestions, debugging, interface refinement, documentation, and testing suggestions. The development team is responsible for reviewing, adapting, and validating the submitted work.

---

**Academic disclaimer:** BarangayLink is an academic Web Systems prototype, not an official barangay or government service. Demo accounts and sample data are intended for classroom use only.
