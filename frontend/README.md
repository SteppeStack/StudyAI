# StudyAI Frontend

StudyAI is a modern academic workspace for students.

It combines assignments, files, documents, exam preparation, diploma planning, AI Tutor, progress tracking, deadlines, onboarding, and subscription preview in one student-focused platform.

Current status: **MVP / demo-ready frontend** with local fallback mode.

---

## What is StudyAI?

StudyAI is not just another AI chat.

It is an academic productivity workspace where students can manage their study life in one place.

Students usually use many separate tools:

- ChatGPT for study help
- Google Drive for files
- Notion or Notes for tasks
- Calendar apps for deadlines
- Separate documents for exam preparation and diploma work
- Random chats and folders for different subjects

StudyAI brings these workflows together into one structured student workspace.

Product positioning:

```txt
Not just AI chat — an academic workspace for students.
```

---

## Main Features

### Public Landing Page

- Modern SaaS-style landing page
- Product explanation
- Feature overview
- Student and university positioning
- Pricing preview
- Demo-ready call-to-action buttons

### Authentication UI

- Register page with first name and last name
- Login page
- Local profile restore
- Protected route flow through AuthGuard/proxy
- Logout handling

### Dashboard

- First-login onboarding modal
- University, program, study level, and study goal setup
- Quick-start onboarding actions
- Study streak tracking
- Progress tracking
- Completed this week
- Due this week
- Overdue tasks
- Academic deadline grouping:
  - overdue
  - today
  - this week
  - later
- Recent activity from local data
- Quick action cards

### Assignments

- Assignment list
- Assignment detail workspace
- Status, priority, subject, deadline
- Notes/checklist workspace
- Local AI help fallback
- LocalStorage fallback

### Files

- File metadata upload
- Open/delete/analyze fallback actions
- Local demo mode when backend is unavailable
- Safe file type handling
- LocalStorage metadata persistence

### Documents

- Local document workspace
- Create/edit/delete documents
- Templates
- Draft generation fallback
- Essay/report/summary/research-style workflows
- LocalStorage persistence

### Exam Prep

- Create study plans
- Subject, exam date, difficulty, daily study time
- Edit/delete saved plans
- Local study plan generation
- LocalStorage persistence

### Diploma

- Diploma/thesis workspace
- Chapters
- Chapter statuses
- Milestones
- Notes
- Progress calculation
- LocalStorage persistence

### AI Tutor

- AI Tutor interface
- Backend-unavailable fallback
- Local preview response
- Retry button for failed prompts
- Localized loading/error/attach messages

### Settings

- Profile settings
- Language persistence
- Theme persistence
- Local profile updates
- Events for AppShell/topbar refresh

### Subscription / Payment Preview

- Free, Pro, and Premium plan preview
- Monthly/yearly pricing preview
- Selected plan saved locally
- Payment page is preview-only
- No real payment provider connected yet

---

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase client integration
- LocalStorage fallback mode
- Vercel-ready frontend setup

---

## Project Structure

```txt
frontend/
  app/
    page.tsx
    login/
    register/
    dashboard/
    assignments/
    files/
    documents/
    exam-prep/
    diploma/
    ai-tutor/
    settings/
    subscription/
    payment/
    not-found.tsx

  components/
    AppShell.tsx
    AuthGuard.tsx

  lib/
    profile.ts
    studyApi.ts
    supabase.ts
    supabaseClient.ts

  public/
  next.config.ts
  package.json
  README.md
```

---

## Local Development

### 1. Go to the frontend folder

```powershell
cd C:\Users\Ramazan\StudyAI\StudyAI\frontend
```

### 2. Install dependencies

On Windows PowerShell, use:

```powershell
npm.cmd install
```

or normally:

```bash
npm install
```

### 3. Run development server

```powershell
npm.cmd run dev
```

or:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## Build

Before deploying or pushing changes, run:

```powershell
npm.cmd run lint
npm.cmd run build
```

Expected result:

```txt
lint: passed
build: passed
```

---

## Environment Variables

Create a `.env.local` file inside `frontend/`.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
NEXT_PUBLIC_STUDYAI_API_URL=http://127.0.0.1:8000
```

For production, `NEXT_PUBLIC_STUDYAI_API_URL` should point to the deployed backend API.

---

## Important Security Notes

Frontend environment variables are public.

Never put these in the frontend:

```txt
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
GEMINI_API_KEY
DATABASE_URL
STRIPE_SECRET_KEY
PAYMENT_SECRET
JWT_SECRET
```

Only public client-side variables should use the `NEXT_PUBLIC_` prefix.

The frontend must not contain:

- service role keys
- private AI keys
- payment secrets
- database credentials
- token/session console logs
- raw Authorization header logs

---

## LocalStorage Fallback Mode

Many StudyAI modules currently work in frontend-only demo mode using localStorage.

This allows the MVP to work even when backend endpoints are unavailable.

Current localStorage keys include:

```txt
studyai-local-assignments
studyai-assignment-workspace-{id}
studyai-local-files
studyai-local-documents
studyai-exam-prep-form
studyai-exam-prep-saved
studyai-diploma-form
studyai-diploma-chapters
studyai-subscription-preview
studyai-settings-profile
studyai-display-name
displayName
```

This is useful for demo and local testing, but it is not a replacement for production backend storage.

---

## Demo Flow

Recommended manual test flow:

```txt
1. Open landing page
2. Register with first name and last name
3. Complete dashboard onboarding
4. Create an assignment
5. Open assignment detail page
6. Add notes/checklist
7. Upload file metadata
8. Create a document draft
9. Create an exam preparation plan
10. Create/update diploma progress
11. Try AI Tutor fallback
12. Select subscription preview plan
13. Open payment preview
14. Logout
15. Try opening protected route and confirm redirect to login
```

---

## Backend Integration Needed

The frontend is ready for MVP/demo, but production requires backend integration.

### Auth and Security

Backend should provide:

- Supabase JWT validation on every protected API endpoint
- `user_id` must be derived from JWT, not from request body
- RLS policies for all user-owned tables
- Secure CORS for production
- Rate limits for AI and file operations
- Safe production error responses without raw stack traces

---

## Profile Sync

Current frontend profile data is mostly local.

Needed fields:

```txt
first_name
last_name
display_name
university
program
study_level
study_goal
language
theme
```

Backend should allow the same profile to sync across devices.

---

## Assignments API

Needed endpoints:

```txt
GET /assignments
GET /assignments/{id}
POST /assignments
PATCH /assignments/{id}
DELETE /assignments/{id}
POST /assignments/{id}/generate-help
```

Recommended assignment shape:

```txt
id
user_id
title
subject
description
deadline
status
priority
created_at
updated_at
```

Assignment workspace also needs a backend contract for:

```txt
notes
checklist items
AI help result/history
progress
attachments
```

---

## Files API

Needed endpoints:

```txt
GET /files
POST /files/upload
DELETE /files/{id}
GET /files/{id}/signed-url
POST /files/{id}/analyze
```

Backend requirements:

- Store real files in Supabase Storage or backend storage
- Save metadata in database
- Check file owner before every action
- Signed URLs must be generated only for the file owner
- Storage policies must prevent access to other users' files

---

## Documents API

Needed endpoints:

```txt
GET /documents
GET /documents/{id}
POST /documents
PATCH /documents/{id}
DELETE /documents/{id}
POST /documents/generate
```

Recommended document fields:

```txt
id
user_id
type
title
topic
language
tone
content
created_at
updated_at
```

---

## Exam Prep API

Needed endpoints:

```txt
GET /exam-prep
GET /exam-prep/{id}
POST /exam-prep
PATCH /exam-prep/{id}
DELETE /exam-prep/{id}
POST /exam-prep/generate
```

Recommended fields:

```txt
id
user_id
subject
exam_date
difficulty
daily_time
topics
generated_plan
progress
created_at
updated_at
```

---

## Diploma API

Needed endpoints:

```txt
GET /diploma
GET /diploma/{id}
POST /diploma
PATCH /diploma/{id}
DELETE /diploma/{id}
POST /diploma/generate-structure
PATCH /diploma/{id}/chapters/{chapterId}
```

Recommended fields:

```txt
id
user_id
title
topic
field
supervisor
deadline
chapters
chapter_statuses
notes
milestones
progress
created_at
updated_at
```

---

## Dashboard API

Recommended endpoint:

```txt
GET /dashboard
```

Should return:

```txt
assignments stats
files stats
documents stats
exam prep stats
diploma progress
recent activity
deadlines
study streak
completed this week
due this week
overdue count
subscription/usage limits
```

---

## AI Tutor API

Needed backend support:

```txt
chat endpoint
chat history
retry/error contract
usage limits
rate limits
file/context attachment contract
```

Important:

- AI keys must stay backend-only
- Frontend should never contain AI provider secrets
- Backend should enforce plan limits and rate limits

---

## Subscription / Payment

Current frontend is preview-only.

Production backend should add:

```txt
plans endpoint
current subscription endpoint
checkout session endpoint
payment webhook
usage limit enforcement
```

Payment secrets must stay backend-only.

---

## Vercel Deployment

Recommended Vercel settings:

```txt
Root Directory: frontend
Framework: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: default Next.js
```

Required frontend environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
NEXT_PUBLIC_STUDYAI_API_URL=...
```

Do not add backend secrets to Vercel frontend variables.

---

## Current Status

StudyAI frontend is currently:

```txt
MVP-ready
demo-ready
frontend-only fallback capable
backend integration pending
payment preview-only
```

Latest reported frontend build status:

```txt
npm.cmd run lint: passed
npm.cmd run build: passed
```

---

## Roadmap

### Short-term

- Manual QA
- Landing page final polish
- README/screenshots
- Vercel deployment
- Demo video
- Closed testing with students

### Backend Integration

- Real profile sync
- Real assignments storage
- Real files storage
- Real documents storage
- Real exam prep storage
- Real diploma storage
- Real dashboard data
- Real AI Tutor backend
- Rate limits and usage limits
- Subscription/payment backend

### Later

- University pilot mode
- Admin dashboard
- Analytics
- Team/classroom features
- Better AI personalization
- Mobile app version

---

## Product Positioning

StudyAI is an academic workspace for students.

It combines:

```txt
AI Tutor
Assignments
Files
Documents
Exam Prep
Diploma planning
Dashboard progress
Deadlines
Study streak
Subscription preview
```

into one structured learning environment.

StudyAI is designed to help students reduce academic chaos, prepare faster, and keep their study work organized in one place.