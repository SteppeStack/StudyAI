# Frontend blockers

## Blocker 1: Cross-device profile sync

Frontend task:
- Keep the student's full name/profile synchronized after registration and login across devices.

Need from backend/user:
- Confirm whether profile data should be persisted through a backend profile endpoint or direct Supabase `profiles` table updates from the frontend.

Why blocked:
- The frontend can save `displayName` locally and pass signup metadata to Supabase Auth, but durable profile synchronization requires an approved backend/Supabase contract and policies.

Suggested next action:
- Provide a frontend-safe profile read/update contract or approve direct Supabase `profiles` access with RLS.

## Blocker 2: Assignment file attachments

Frontend task:
- Link files directly to an assignment detail workspace.

Need from backend/user:
- Confirm the assignment-to-file relationship contract or provide an endpoint/table policy for linked files.

Why blocked:
- File upload/list endpoints exist, but the frontend does not have a confirmed assignment attachment relationship to persist links safely.

Suggested next action:
- Add/document an assignment attachments contract, then connect the detail page's Linked files section.

## Blocker 3: Production API authorization and RLS guarantees

Frontend task:
- Treat protected workspace data as genuinely private, not only hidden by frontend routing.

Need from backend/user:
- Backend must validate Supabase JWT on every protected API request.
- Backend must derive `user_id` from the token and never trust `user_id` from request bodies.
- Supabase RLS must be enabled for user-owned tables.
- Storage policies must prevent users from reading other users' files.

Why blocked:
- `AuthGuard` and `proxy.ts` are frontend UX protection only. Real authorization must happen in backend and Supabase policies.

Suggested next action:
- Audit backend dependencies/auth and Supabase RLS/storage policies before production deployment.

## Blocker 4: Production abuse and secret handling

Frontend task:
- Safely expose AI, file, and payment workflows to real users.

Need from backend/user:
- API must rate-limit AI/file operations.
- CORS must allow only trusted frontend origins in production.
- Service role key must stay backend-only.
- Payment secrets must stay backend-only.
- Backend must return safe error messages without stack traces in production.

Why blocked:
- These protections require backend configuration, deployment settings, or provider secrets that must never be handled in frontend code.

Suggested next action:
- Add production backend hardening checklist and environment-specific CORS/rate-limit configuration.

## Blocker 5: Content Security Policy decision

Frontend task:
- Add a production CSP without breaking Next.js, Supabase Auth, local dev, or future file previews.

Need from backend/user:
- Confirm production domains for frontend, API, Supabase, storage, analytics, and payment provider.

Why blocked:
- A strict CSP can break Next.js dev/runtime or external Supabase/payment/storage calls if domains are not finalized.

Suggested next action:
- Define production origins and add a tested CSP during deployment hardening.
