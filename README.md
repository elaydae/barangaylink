# 🔐 Demo Accounts

These accounts are provided specifically for the **classroom/project demonstration**.

## 🧑 Resident Demo

```text
Email: demo@bl.com
Password: 123456
Role: Resident
```

After login, the resident demo account should be directed to:

```text
dashboard.html
```

---

## 👨‍💼 Staff/Admin Demo

```text
Email: staff@b.com
Password: 123456
Role: Staff/Admin
```

After login, the staff demo account should be directed to:

```text
staff-dashboard.html
```

---

# 🏘️ BarangayLink

## Barangay Information & E-Services System

> **Stronger Community. Easier Access.**

BarangayLink is a browser-based Barangay Information & E-Services System designed to make common barangay services more accessible, convenient, and organized for residents and barangay staff.

The system allows residents to view available barangay services, check requirements, submit document requests, monitor request status, and review their request history.

Barangay staff and administrators can access a dedicated interface to review incoming requests, approve or reject submissions, provide rejection reasons, and update request statuses.

---

# 📌 Project Overview

BarangayLink aims to provide a simple digital approach to common barangay document-request processes.

Instead of requiring residents to immediately visit the barangay hall for every request, the system provides a browser-based interface where residents can:

- View available services
- Check document requirements
- Submit document requests
- Review information before submission
- Receive a request reference number
- Track request status
- View request history
- Manage their profile
- Access barangay information
- Submit concerns and feedback
- View emergency information

Barangay staff can use the system to:

- View incoming requests
- Review submitted information
- Approve requests
- Reject requests
- Provide rejection reasons
- Update request statuses
- Manage the request-processing workflow

The current version is a **functional frontend prototype** developed for academic purposes.

---

# 🎯 Project Objectives

BarangayLink aims to:

1. Provide residents with easier access to common barangay services.
2. Reduce unnecessary visits and waiting time at the barangay hall.
3. Allow residents to submit document requests through a browser-based interface.
4. Provide clear requirements for each available document.
5. Allow residents to monitor the progress of their requests.
6. Provide barangay staff with an organized request-review workflow.
7. Demonstrate practical browser-based application development.
8. Establish a foundation that can later be connected to a backend and database.

---

# 👥 Target Users

BarangayLink has two primary user roles:

## 🧑 Resident

Residents can:

- Register an account
- Log in
- View their dashboard
- Manage their profile
- View barangay services
- Search and filter available services
- View document requirements
- Submit document requests
- Review request information before submission
- Confirm requests
- Receive request reference numbers
- Track request status
- View request history
- Receive system notifications
- View barangay information
- Submit concerns and feedback
- View emergency information
- Log out

---

## 👨‍💼 Barangay Staff / Admin

Staff/Admin users can:

- Log in using staff credentials
- Access the staff dashboard
- View incoming requests
- View request queues
- Search and filter requests
- Review resident request information
- Approve requests
- Reject requests
- Provide rejection reasons
- Update request statuses
- Manage request processing
- Log out

---

# 📄 Available Barangay Services

The current system focuses on four common barangay document services.

## 1. Barangay Clearance

Allows residents to submit a request for a Barangay Clearance.

## 2. Certificate of Residency

Allows residents to request a certificate confirming their residency.

## 3. Certificate of Indigency

Allows residents to submit a request for a Certificate of Indigency.

## 4. Business Permit

Allows residents or applicants to submit a Business Permit request.

Each service can display its corresponding requirements before the resident proceeds with the request.

---

# 🔄 System Workflow

The main BarangayLink resident workflow follows this process:

```text
┌──────────────────────┐
│     Landing Page     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Login / Register   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Resident Dashboard  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    View Services     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Select Document    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  View Requirements   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Complete Request   │
│        Form          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Validate Information│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Preview / Confirm  │
│       Request        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    Submit Request    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Reference Number   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    Track Request     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│     Staff Review     │
└──────────┬───────────┘
           │
      ┌────┴─────┐
      ▼          ▼
┌──────────┐  ┌──────────┐
│ APPROVED │  │ REJECTED │
└────┬─────┘  └────┬─────┘
     │             │
     ▼             ▼
┌────────────┐ ┌───────────────┐
│ Ready for  │ │ Rejection     │
│ Release    │ │ Reason        │
└─────┬──────┘ └───────────────┘
      │
      ▼
┌────────────┐
│  RELEASED  │
└────────────┘
```

---

# 🔁 Request Status Workflow

A document request follows a basic processing workflow:

```text
PENDING
   │
   ▼
UNDER REVIEW
   │
   ├────────────────┐
   │                │
   ▼                ▼
APPROVED         REJECTED
   │                │
   ▼                ▼
READY FOR        REJECTION
RELEASE           REASON
   │
   ▼
RELEASED
```

This workflow provides residents with visibility into the progress of their requests.

---

# 🖥️ Application Pages

## 🌐 Public Pages

### `index.html`

The main landing page of BarangayLink.

Provides an introduction to the system and access to the main application.

### `login.html`

Provides the login interface for:

- Residents
- Staff/Admin

The page also provides the classroom demo credentials.

### `register.html`

Allows new residents to register for an account.

---

# 🧑 Resident Pages

### `dashboard.html`

The resident dashboard provides an overview of:

- Current requests
- Request statistics
- Recent requests
- Quick access to services
- Resident navigation

### `services.html`

Displays the available barangay services.

Residents can browse and search/filter available services.

### `request.html`

Handles the document request process.

The page supports:

- Service selection
- Requirements display
- Request form
- Input validation
- Request preview
- Confirmation
- Submission
- Reference number generation

### `tracking.html`

Allows residents to monitor their submitted requests.

The interface provides a visual request-status timeline.

### `history.html`

Displays previous requests and their status.

Residents can use the page to review their request history.

### `profile.html`

Allows residents to view and manage their profile information.

### `barangay-info.html`

Provides general barangay information for residents.

### `concerns.html`

Provides a section where residents can submit concerns and feedback.

### `emergency.html`

Provides emergency-related information and resources.

---

# 👨‍💼 Staff Pages

### `staff-dashboard.html`

Provides the staff/admin dashboard.

Staff can view:

- Request statistics
- Incoming requests
- Request queue
- Request information
- Filtering and search functions

### `staff-request.html`

Provides the staff-side request review workflow.

Staff can:

- Review resident requests
- Review submitted information
- Approve requests
- Reject requests
- Provide rejection reasons
- Update request status

---

# 🧭 Navigation Structure

## Resident Navigation

```text
☰ BarangayLink

MENU
├── Dashboard
│
SERVICES
├── Services
├── Tracking
└── History
│
COMMUNITY
├── Barangay Information
├── Concerns & Feedback
└── Emergency
│
ACCOUNT
├── Profile
└── Logout
```

---

## Staff/Admin Navigation

```text
☰ BarangayLink

STAFF
├── Staff Dashboard
├── Request Queue
├── Residents / Registry
├── Request Review
└── Logout
```

---

# 🎨 User Interface

BarangayLink uses a civic-focused interface designed around:

- Community
- Accessibility
- Trust
- Simplicity
- Public service

The application includes:

- Consistent sidebar navigation
- Responsive layouts
- Clear buttons and actions
- Cards
- Status indicators
- Toast notifications
- Confirmation dialogs
- Empty states
- Form validation
- Visual request tracking
- Accessibility-oriented interface elements

---

# ⚙️ Technical Implementation

The current version is primarily a **frontend browser-based prototype**.

## Technologies

### Frontend

- HTML5
- CSS3
- JavaScript

### Browser Storage

The current prototype uses:

- `localStorage`
- Client-side state handling
- JavaScript-based data processing

This allows the application to demonstrate its core workflows without requiring a backend server.

---

# 📁 Project Structure

```text
barangaylink/
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── services.html
├── request.html
├── tracking.html
├── history.html
├── profile.html
├── barangay-info.html
├── concerns.html
├── emergency.html
│
├── staff-dashboard.html
├── staff-request.html
│
├── css/
│   └── style.css
│
├── js/
│   └── app.js
│
├── README.md
│
└── BarangayLink-backup.html
```

---

# 🔐 Demo Authentication

The current prototype provides fixed demo accounts for classroom presentation.

## Resident

```text
Email: demo@bl.com
Password: 123456
Role: Resident
```

Successful login should redirect to:

```text
dashboard.html
```

## Staff/Admin

```text
Email: staff@b.com
Password: 123456
Role: Staff/Admin
```

Successful login should redirect to:

```text
staff-dashboard.html
```

---

# ⚠️ Demo Security Notice

The demo credentials are intended **only for academic demonstration purposes**.

The current frontend authentication is not production-grade authentication.

Because the current prototype uses client-side JavaScript and browser storage, credentials and authentication logic should not be considered secure for a real government system.

A production implementation should use:

- Secure server-side authentication
- Password hashing
- Secure sessions or tokens
- Server-side validation
- Role-based authorization
- Database-backed accounts
- HTTPS
- Security logging
- Proper access control

The demo credentials should **never be reused for real accounts**.

---

# 🧪 Application Features

## Authentication

- Resident registration
- Resident login
- Staff/Admin login
- Demo accounts
- Login validation
- Logout
- Session/state handling

---

## Service Discovery

- Barangay service listing
- Service search
- Service filtering
- Service requirements
- Service selection

---

## Document Request

- Service selection
- Dynamic requirements
- Request form
- Form validation
- Request preview
- Request confirmation
- Request submission
- Reference number

---

## Request Tracking

- Request lookup
- Request status
- Visual status timeline
- Status updates

---

## Request History

- Previous requests
- Request information
- Status history
- Filtering

---

## Staff Request Management

- Request queue
- Request search
- Request filtering
- Request review
- Approve request
- Reject request
- Rejection reason
- Status updates

---

## Resident Account

- Resident profile
- Profile editing
- Account information
- Logout

---

## Community Features

- Barangay information
- Concerns and feedback
- Emergency information

---

# ✨ User Experience Features

BarangayLink includes several user experience improvements.

## Form Validation

The system validates important user inputs before allowing actions to proceed.

Examples include:

- Required fields
- Empty fields
- Invalid information
- Incorrect login credentials

---

## Request Preview

Residents can review the information they entered before submitting a request.

This helps reduce incorrect submissions.

---

## Request Reference Number

After a successful request submission, the system generates a request reference number.

The reference number can be used during the request-tracking workflow.

---

## Notifications

The application provides feedback for important actions through notifications/toasts.

Examples include:

- Login success
- Request submission
- Profile update
- Status update
- Validation errors

---

## Confirmation Dialogs

Important actions may require confirmation before proceeding.

This helps reduce accidental actions.

---

## Empty States

When there is no information to display, the application provides appropriate empty-state messages instead of leaving sections blank.

---

## Responsive Design

The interface is designed to work across different screen sizes, including:

- Desktop
- Laptop
- Tablet
- Mobile-sized screens

---

## Accessibility

The application includes accessibility-oriented improvements such as:

- Semantic HTML
- Navigation landmarks
- ARIA labels where appropriate
- Keyboard-friendly interactions
- Focus handling
- Accessible buttons
- Current-page navigation indicators

---

# 🧪 Testing

Testing focuses on the major application workflows.

## Authentication Testing

- Resident login
- Staff login
- Invalid credentials
- Empty login fields
- Logout
- Session behavior

---

## Resident Workflow Testing

- Service selection
- Requirements display
- Request form
- Form validation
- Request preview
- Request submission
- Reference number
- Request tracking
- Request history

---

## Staff Workflow Testing

- Staff dashboard
- Request queue
- Request review
- Approve request
- Reject request
- Rejection reason
- Status updates

---

## Interface Testing

- Navigation
- Sidebar
- Responsive layout
- Buttons
- Forms
- Notifications
- Empty states
- Accessibility
- Keyboard interaction

---

# 🔄 Development Workflow

BarangayLink follows a progressive browser-based application development workflow:

```text
Planning
   │
   ▼
Requirements
   │
   ▼
HTML Structure
   │
   ▼
CSS / UI Design
   │
   ▼
JavaScript Interactions
   │
   ▼
Feature Development
   │
   ▼
Integration
   │
   ▼
Testing
   │
   ▼
Refinement
   │
   ▼
GitHub Repository
   │
   ▼
GitHub Pages Demo
```

This approach allows the team to establish the application's structure before implementing more complex interactions.

---

# 📈 Development Progress

| Development Area | Status |
|---|---|
| Project Concept | ✅ Completed |
| Project Scope | ✅ Completed |
| HTML Structure | ✅ Completed |
| CSS/UI Design | ✅ Completed |
| Resident Interface | ✅ Implemented |
| Staff Interface | ✅ Implemented |
| Navigation | ✅ Implemented |
| Resident Authentication | ✅ Prototype |
| Staff Authentication | ✅ Prototype |
| Demo Accounts | ✅ Implemented |
| Service Listing | ✅ Implemented |
| Service Search/Filter | ✅ Implemented |
| Requirements Display | ✅ Implemented |
| Document Request Workflow | ✅ Implemented |
| Form Validation | ✅ Implemented |
| Request Preview | ✅ Implemented |
| Request Reference Number | ✅ Implemented |
| Request Tracking | ✅ Implemented |
| Request History | ✅ Implemented |
| Profile Management | ✅ Implemented |
| Staff Request Queue | ✅ Implemented |
| Staff Request Review | ✅ Implemented |
| Approve/Reject Workflow | ✅ Implemented |
| Rejection Reason | ✅ Implemented |
| Status Updates | ✅ Implemented |
| Notifications | ✅ Implemented |
| Confirmation Dialogs | ✅ Implemented |
| Empty States | ✅ Implemented |
| Responsive Design | ✅ Implemented |
| Accessibility Improvements | ✅ Implemented |
| Barangay Information | ✅ Implemented |
| Concerns & Feedback | ✅ Implemented |
| Emergency Information | ✅ Implemented |
| Backend | 🚧 Future Development |
| MySQL Database | 🚧 Future Development |
| Production Authentication | 🚧 Future Development |

---

# 🏗️ Future System Architecture

The current project is structured as a frontend prototype that can later be connected to a backend and database.

```text
                    ┌───────────────────┐
                    │      RESIDENT     │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │   BarangayLink    │
                    │   Web Interface   │
                    │ HTML/CSS/JS       │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │    Java Backend   │
                    │     REST/API      │
                    └─────────┬─────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
       ┌────────────┐ ┌─────────────┐ ┌─────────────┐
       │Authentication│ │Request      │ │User/Profile │
       │& Authorization│ │Processing  │ │Management   │
       └────────────┘ └─────────────┘ └─────────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │   MySQL Database  │
                    └─────────┬─────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
                 ▼                         ▼
        ┌─────────────────┐       ┌─────────────────┐
        │ Request Records │       │ Resident/Staff  │
        │ & Status History│       │ Records         │
        └─────────────────┘       └─────────────────┘
```

---

# 🗄️ Possible Future Database Structure

A future backend implementation could include the following database entities.

## Residents

```text
resident_id
name
address
contact_number
email
date_registered
```

## Staff

```text
staff_id
name
role
contact_information
```

## Document Types

```text
document_type_id
name
description
requirements
```

## Requests

```text
request_id
resident_id
document_type_id
status
date_requested
date_updated
handled_by
```

## Request History

```text
history_id
request_id
status
timestamp
updated_by
```

These are potential future database structures and are not currently implemented as a production database.

---

# 🚧 Future Development

Possible future improvements include:

## Backend Integration

Connect the frontend to a Java backend to provide server-side processing and authentication.

## MySQL Database

Replace browser-only storage with persistent database storage.

## Improved Authentication

Implement secure server-side authentication and role-based authorization.

## Additional Barangay Services

Add more document types and barangay services as required.

## Notification System

Provide improved notifications for request status changes.

## Staff Reporting

Add reporting and analytics features for barangay staff.

## Document Management

Implement more advanced document processing and management.

---

# 🚫 Current Scope Exclusions

The following features are outside the current project scope:

- Online payment gateway
- PhilSys integration
- Multi-barangay management
- Complex automated document generation
- Digital signatures
- AI chatbot
- Full government API integration
- Advanced identity verification
- Enterprise cloud infrastructure
- Full mobile application

These features may be considered for future versions if the project requirements expand.

---

# 🌐 GitHub Repository

BarangayLink source code is hosted on GitHub.

**Repository:**

https://github.com/elaydae/barangaylink

---

# 🌍 GitHub Pages

The project can be demonstrated through GitHub Pages.

**Website:**

https://elaydae.github.io/barangaylink/

The project uses GitHub's free `github.io` address and does **not require a custom domain** for the academic demonstration.

---

# 📚 Academic Purpose

BarangayLink was developed as an academic browser-based application project.

The project demonstrates concepts including:

- HTML5
- CSS3
- JavaScript
- Responsive web design
- User interface design
- Form handling
- Client-side validation
- Browser storage
- User workflows
- Role-based interfaces
- Request processing
- Status tracking
- User experience design
- Git and GitHub
- Application testing
- Team collaboration
- Project scope management

---

# 🤖 AI-Assisted Development

AI tools, including GitHub Copilot and ChatGPT, were used as development assistance during the project.

AI assistance was used for activities such as:

- Code suggestions
- Debugging
- HTML/CSS/JavaScript improvements
- Feature implementation guidance
- UI/UX refinement
- Documentation
- Testing suggestions
- Git/GitHub workflow guidance

AI-generated suggestions were reviewed, evaluated, tested, modified, and incorporated by the development team where appropriate.

The development team remains responsible for the final application, implementation decisions, testing, and project output.

---

# 👥 Project Team

BarangayLink is developed as a group browser-based application project.

### Team Members

- **Ephraim Elayda**
- **Charlene Mae Ignacio**
- **Emilyn Maguad**
- **Kurosh Avendaño**

---

# 📋 Project Scope Summary

| Category | Current Status |
|---|---|
| Resident Interface | ✅ Implemented |
| Staff/Admin Interface | ✅ Implemented |
| Resident Login | ✅ Prototype |
| Staff Login | ✅ Prototype |
| Document Requests | ✅ Implemented |
| Requirements | ✅ Implemented |
| Request Tracking | ✅ Implemented |
| Request History | ✅ Implemented |
| Staff Review | ✅ Implemented |
| Approval/Rejection | ✅ Implemented |
| Profile Management | ✅ Implemented |
| Community Pages | ✅ Implemented |
| Responsive UI | ✅ Implemented |
| Accessibility Improvements | ✅ Implemented |
| Browser Storage | ✅ Implemented |
| Backend | 🚧 Future |
| MySQL Database | 🚧 Future |
| Production Authentication | 🚧 Future |
| Online Payment | ❌ Out of Scope |
| PhilSys Integration | ❌ Out of Scope |
| AI Chatbot | ❌ Out of Scope |
| Multi-Barangay Management | ❌ Out of Scope |

---

# ⚠️ Disclaimer

BarangayLink is an **academic browser-based prototype** developed for educational purposes.

It is not an official government system and is not intended for production use without further development, security review, backend implementation, database integration, authentication hardening, privacy controls, and proper authorization mechanisms.

The demo credentials included in this README are intentionally provided for classroom demonstration and should not be used for real accounts.

---

# 📜 License

This project is an academic project developed for educational purposes.
