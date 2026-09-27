# 🏘️ BarangayLink

### Barangay Information & E-Services System

> **Stronger Community. Easier Access.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20BarangayLink-2ea44f?style=for-the-badge)](https://elaydae.github.io/barangaylink/pages/login.html)

BarangayLink is a **browser-based Barangay Information & E-Services System** designed to make common barangay services more accessible, organized, and convenient for residents and barangay staff.

Residents can explore services, review requirements, submit document requests, receive reference numbers, and track request progress through a single web interface. Barangay staff can review, approve, reject, and update resident requests.

> **Project Status:** Functional frontend prototype for academic purposes.

---

## 🌐 Live Demo

**[Open BarangayLink Demo](https://elaydae.github.io/barangaylink/pages/login.html)**

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
Email:    staff@b.com
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
* Provide a foundation for future backend and database integration

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

The current prototype includes four document services:

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

The prototype currently uses:

* `localStorage`
* Client-side state management
* JavaScript-based data processing

This allows the core workflows to be demonstrated without a backend server.

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

# 🧪 Testing

The application is tested around its major user workflows.

### Resident

* Login and registration
* Service selection
* Requirements display
* Request submission
* Form validation
* Request preview
* Reference number generation
* Request tracking
* Request history

### Staff

* Staff login
* Request queue
* Request search/filter
* Request review
* Approval
* Rejection
* Rejection reason
* Status updates

### Interface

* Navigation
* Responsive layouts
* Forms
* Buttons
* Notifications
* Empty states
* Keyboard interaction
* Accessibility

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
| Browser Storage            | ✅ Implemented         |
| Backend                    | 🚧 Future Development |
| MySQL Database             | 🚧 Future Development |
| Production Authentication  | 🚧 Future Development |

---

# 🚧 Future Development

The prototype can later be extended with:

* Java backend integration
* MySQL database
* Secure server-side authentication
* Role-based authorization
* Persistent cloud storage
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

# 🏗️ Future Architecture

```text
┌─────────────────────┐
│      RESIDENT       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    BarangayLink     │
│    Web Interface    │
│     HTML/CSS/JS     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Java Backend     │
│       REST API      │
└──────────┬──────────┘
           │
     ┌─────┼─────┐
     ▼     ▼     ▼
 Auth   Requests  Users
           │
           ▼
┌─────────────────────┐
│    MySQL Database   │
└─────────────────────┘
```

The backend and database architecture represent **future development** and are not currently part of the production implementation.

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

### 🚀 Live Demo

[Open BarangayLink](https://elaydae.github.io/barangaylink/pages/login.html)

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

## 📜 License

This project is an academic project developed for educational purposes.
