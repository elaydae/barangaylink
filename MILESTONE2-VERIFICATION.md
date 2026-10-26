# BarangayLink Milestone 2 Verification

**Audit date:** 2026-10-26
**Purpose:** Record implementation evidence, confirmed defects and fixes, test results, and prioritized next steps. This is an evidence-based project review, not an official course grade.

## Executive summary

BarangayLink has a working prototype for public landing/login navigation and the document-request lifecycle. The Express API validates and persists document requests as JSON; the resident and staff pages use that API for submission, review, status updates, history, and tracking. The root route serves the existing landing page, and `/index.html` serves the same page.

This audit fixed confirmed defects in request tracking status presentation, concern-report failure handling and repeat submission, public forgot-password navigation, and responsive layouts. Regression tests were added for tracking, concern storage failure, forgot-password access, and the landing-page routes/navigation. The final automated run passed 19 tests, and syntax checks passed.

Important prototype limitations remain: the demo role check is client-side, the request API does not authenticate users or enforce resident ownership, and community concerns are stored only in browser `localStorage` rather than the request API. These features are not suitable for real resident data or public production deployment.

## Scope and evidence

The review used the current source, automated tests, local HTTP checks, and browser-based workflow/responsive checks. No workflow worksheet or rubric document was found in the checkout. Therefore, the rubric mapping below uses common project criteria and does not claim to reproduce mentor comments or assign an official score. Specific mentor feedback not available in the repository is not invented here.

## Findings and disposition

| Area | Evidence / confirmed issue | Disposition |
|---|---|---|
| Landing-page routing | `GET /` and `GET /index.html` both serve the existing public landing page. The home page provides distinct resident and staff/admin login options that link to the existing shared, role-aware login flow. | Explicit root serving and login labels are in place; root and index route checks pass. |
| Resident/staff navigation | Both roles use the existing login page; no new authentication architecture or login page was introduced. Existing profile, dashboard, request, history, tracking, and staff pages remain served at their established URLs. | Preserved. Do not describe the client-side role selection as security enforcement. |
| Request status tracking | The tracking timeline did not consistently map API statuses to their displayed stages, including terminal rejection. | Fixed mapping for pending, review, approved, ready, released, and rejected; regression test added. |
| Concern submission failures | A browser-storage write failure could be presented as a successful concern submission and could publish an update event despite the failed save. | Storage writes now surface failure; failed saves do not publish the success/update event. Regression coverage added. |
| Repeated concern submission | A user could trigger duplicate submission while the first save was still processing. | Submission is guarded against repeat attempts. Repeated browser interaction was not conclusively verified because the automation click timed out; see limitations. |
| Forgot-password access | The demo authentication guard treated the forgot-password page as protected, interrupting its intended public access. | The recovery page is public while protected pages continue to use the login redirect. Regression test and direct browser navigation check pass. |
| Responsive layouts | Landing navigation and staff layouts could overflow at narrower viewport widths; long request-detail values could also force horizontal expansion. | Landing navigation wraps, staff layouts/grid tracks adapt, and long detail values wrap. Responsive viewport sweeps found no horizontal overflow in the tested pages and widths. |
| Document-request API | The Express API validates request input, reports structured errors, supports idempotent creation, validates status transitions, and persists records to JSON. | Automated API integration tests pass; a browser-driven resident-to-staff-to-resident lifecycle reached `released`. |
| Community-concern storage | Concerns are a separate prototype feature in browser `localStorage`, not part of the Express document-request API. | Limitation is documented. Data is not shared across browsers/devices or persisted by the server. |
| Production security/privacy | Demo role checks run client-side; request endpoints do not authenticate users, authorize staff, or filter requests by resident ownership. | Not addressed by this prototype audit because it would change the security architecture. Treat as a release blocker before handling real data or public deployment. |

## Rubric-oriented assessment

| Criterion | Assessment | Evidence / remaining gap |
|---|---|---|
| Functional requirements | **Demonstrable prototype** | Landing/login navigation and document-request lifecycle are implemented. Concern reporting is a separate local-browser prototype workflow. |
| Backend/API and persistence | **Good prototype coverage** | Request API has validation, explicit errors, idempotency, transition checks, and restart persistence tests. JSON persistence is appropriate for this prototype, not a substitute for multi-user production storage. |
| Frontend/API integration | **Demonstrable with regression coverage** | Request workflows call the API; tracking now renders persisted states accurately. Automated browser-level workflow coverage is not configured. |
| Responsive behavior | **Improved and checked at sampled widths** | No horizontal overflow found in tested pages at widths from 320 through 1440 CSS pixels. Native browser zoom at 125%/150% was not separately toggled. |
| Accessibility | **Partially assessed** | Responsive layout and visible navigation were reviewed. This audit did not complete a formal screen-reader, keyboard-only, contrast, or WCAG conformance review. |
| Security and privacy | **Prototype only / production gap** | Client-side demo roles and unauthenticated, unowned request records are not suitable for real resident information. |
| Maintainability and testability | **Automated core checks; frontend remains concentrated** | API/client checks and targeted rendering/auth regressions exist. `js/app.js` still contains multiple page/workflow responsibilities; split only with dedicated regression coverage. |
| Documentation and scope | **Updated for current evidence** | README now states test results, local-only concern storage, demo-security limitations, and Essential/Later/Too Advanced scope. No workflow worksheet was available to update. |

## Changes included in this audit

- `server.js` — serves the existing landing page explicitly at `/`, while preserving API and static-file handling.
- `index.html` — distinguishes resident and staff/admin login choices while using the existing login flow.
- `js/app.js` — corrects tracking-stage mapping; reports concern-storage failures without false success events; prevents repeat concern submission; keeps forgot-password public.
- `css/style.css` — wraps landing navigation and adapts staff layouts and long detail values for smaller widths.
- `test/requests.test.js` — adds regression coverage for landing routes/login links, tracking outcomes, failed concern storage, and forgot-password access.
- `README.md` — documents current verification, prototype storage/security boundaries, and project scope categories.
- `MILESTONE2-VERIFICATION.md` — this audit record.

## Verification results

### Automated checks

| Command | Result |
|---|---|
| `npm test` | **Passed:** 19 tests, 0 failures. Coverage includes API health, creation/idempotency, validation and malformed/oversized bodies, 404 behavior, status transitions, restart persistence, API-client failures and response handling, tracking outcomes, failed concern storage, forgot-password/auth redirects, static pages, and protection of JSON data files. |
| `npm run check` | **Passed:** syntax checks for `server.js`, `js/api.js`, and `js/app.js`. |

### HTTP route checks

The existing local server on port 3000 returned HTTP 200 for each of the following:

| URL | Result |
|---|---|
| `http://localhost:3000/` | 200; final path `/` |
| `http://localhost:3000/index.html` | 200; final path `/index.html` |
| `http://localhost:3000/pages/login.html` | 200 |
| `http://localhost:3000/pages/profile.html` | 200 |
| `http://localhost:3000/pages/staff-dashboard.html` | 200 |
| `http://localhost:3000/api/health` | 200 |

The landing page was also opened in the browser and showed the BarangayLink public landing view. Automated static-page checks cover the existing application pages and the resident/staff login choices.

### Browser workflow and responsive checks

- A browser-driven request workflow submitted a resident request, processed it in the staff view through review, approval, ready, and release, then showed **Released** in resident tracking/history. API health responded, and no browser console errors were captured during that workflow.
- The concern form showed the selected urgency in the review and staff views. A forced browser-storage failure did not show success; a subsequent successful save appeared in the staff concern view.
- Landing-page responsiveness was checked at 320, 390, 768, 853, 1024, and 1440 CSS pixels.
- Six resident pages and three staff pages were checked from 320 to 1440 CSS pixels; the latest staff sweep covered 24 page/viewport combinations. No horizontal overflow was observed in the checked pages.
- These are manual browser audit checks, not a committed end-to-end browser test suite. Narrow viewport checks approximate reduced effective viewport space; actual browser zoom at 125% and 150% was not separately tested.

## Limitations and remaining risks

1. **Do not use with real resident data or deploy publicly as-is.** Demo authentication is client-side, and the API does not authenticate or authorize request access or enforce resident ownership.
2. **Concerns are local-only.** Concern records use the current browser's `localStorage`; they are not server-backed, cross-device, or shared across browsers.
3. **Browser automation is incomplete.** Core request lifecycle was exercised manually. Automated browser tests are not configured; the duplicate-concern interaction could not be conclusively verified because a browser automation click timed out.
4. **Accessibility and zoom are not fully certified.** No complete screen-reader, keyboard-only, contrast, WCAG, or native 125%/150% zoom audit was performed.
5. **No workflow worksheet or rubric file was present.** This report does not fabricate one or assign official rubric scores.
6. **JSON persistence is prototype-oriented.** Multi-user deployment, concurrency, backup, retention, and operational recovery need a deliberate storage design.

## Prioritized next steps

Owners are intentionally left as placeholders for the project team. Acceptance criteria and verification methods make each item actionable.

| Priority | Work item / owner | Dependencies | Acceptance criteria | Verification method |
|---|---|---|---|---|
| P0 before production | Add server-side authentication, staff authorization, and resident ownership checks. **Owner:** TBD | Identity/session design; API authorization policy | Unauthenticated access is rejected; only authorized staff can change statuses; residents can access only their own records; role checks cannot be bypassed by editing browser state. | API authorization tests for anonymous, resident, staff, and cross-resident access; security review before release. |
| P0 before production | Define data protection, retention, and operational recovery for resident records. **Owner:** TBD | Production hosting and storage decision | Data access, backups, retention/deletion, and recovery are documented and implemented without exposing persistence files as static assets. | Deployment configuration review; backup/restore exercise; access-control tests. |
| P1 prototype reliability | Add browser-level workflow automation for landing/login, request submission, staff transition, tracking/history, and concern submission/retry. **Owner:** TBD | Select/approve browser test runner | Repeatable browser test validates visible results, duplicate-submit prevention, storage failure feedback, and no console errors. | Run in CI or documented local command at desktop and narrow viewport sizes. |
| P1 feature decision | Decide whether concerns remain local-only or become a backend feature. **Owner:** TBD | Product/course requirement; if server-backed, API and authorization design | If local-only, UI/docs clearly label scope and data loss/sharing limits. If server-backed, concerns have validated API persistence and authorized staff review. | Verify browser behavior across reloads; if backend-backed, API tests and cross-session browser test. |
| P2 accessibility | Complete keyboard, screen-reader, contrast, focus, and native zoom review. **Owner:** TBD | Browser/assistive-technology test environment | Key tasks can be completed without a mouse; focus is visible; labels and status updates are announced; text/layout remain usable at 125% and 150% zoom. | Manual keyboard/screen-reader checklist plus automated accessibility scan; record and resolve findings. |
| P2 maintainability | Split `js/app.js` by cohesive responsibility only when regression coverage is available. **Owner:** TBD | Browser-level tests and agreed module boundaries | Each page/workflow retains behavior and loads only needed modules; no broad rewrite or duplicated shared logic. | Run full tests and browser workflows after each incremental extraction. |
| P3 scope-controlled | Keep payment processing, PhilSys integration, digital signatures, AI chatbot, multi-barangay administration, and government API integrations out of the current milestone unless explicitly required. **Owner:** TBD | Explicit project approval and revised scope | No advanced integration is added without a documented requirement, privacy/security review, and acceptance criteria. | Scope review with mentor/project owner before implementation. |

## Scope classification

- **Essential for demonstration:** verify resident request submission, staff processing, and resident tracking/history before presenting; explain that demo login is not production security and concern records are local-only.
- **Later improvements:** server-side authentication/ownership controls, shared concern persistence if required, deliberate production storage, automated browser coverage, and carefully tested frontend modularization.
- **Too advanced or outside current scope unless explicitly requested:** payment processing, PhilSys integration, digital signatures, AI chatbot, multi-barangay administration, and government API integrations.
