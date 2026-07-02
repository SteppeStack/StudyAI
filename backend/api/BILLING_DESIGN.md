# StudyAI Billing API

Payment integration is implemented for Stripe Checkout and webhook handling.

The selected provider is Stripe.

## Current State

Existing Supabase tables:

- `plans`
- `subscriptions`
- `monthly_usage`

Existing plan ids:

- `free`
- `student_premium`
- `teacher`

The frontend must not update `subscriptions` directly.

## Recommended Provider Flow

The provider flow should be:

1. Frontend asks backend to create a checkout session.
2. Backend validates the current user and requested plan.
3. Backend creates a provider checkout session.
4. Frontend redirects the user to provider checkout.
5. Provider calls backend webhook after payment/subscription changes.
6. Backend verifies webhook signature.
7. Backend updates `subscriptions`.
8. Frontend refreshes dashboard/subscription state.

## API

### Create Checkout Session

```http
POST /api/v1/billing/checkout
```

Requires:

```http
Authorization: Bearer USER_ACCESS_TOKEN
```

Request:

```json
{
  "plan_id": "student_premium",
  "success_url": "https://YOUR_FRONTEND/subscription?success=1",
  "cancel_url": "https://YOUR_FRONTEND/subscription?canceled=1"
}
```

Response:

```json
{
  "checkout_url": "https://provider-checkout-url"
}
```

The backend maps:

- `student_premium` -> `STRIPE_STUDENT_PREMIUM_PRICE_ID`
- `teacher` -> `STRIPE_TEACHER_PRICE_ID`

The checkout session includes metadata:

```json
{
  "user_id": "SUPABASE_USER_ID",
  "plan_id": "student_premium"
}
```

### Get Current Subscription

The current implementation can use:

```http
GET /api/v1/dashboard
```

### Billing Webhook

```http
POST /api/v1/billing/webhook
```

No user token. Must verify provider webhook signature.

Webhook should handle:

- subscription updated
- subscription canceled
- checkout completed

Currently handled Stripe event types:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

After `checkout.session.completed`, backend:

1. Cancels the old active/trialing/past_due subscription.
2. Creates the new active subscription with the selected `plan_id`.
3. Stores `provider=stripe`.
4. Stores the Stripe subscription id in `external_reference`.

Repeated checkout events are idempotent by `external_reference`.

## Required Environment Variables

Add these variables only to the backend deployment environment:

```env
PAYMENT_PROVIDER=stripe
PAYMENT_SUCCESS_URL=
PAYMENT_CANCEL_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_STUDENT_PREMIUM_PRICE_ID=
STRIPE_TEACHER_PRICE_ID=
```

Example non-secret values:

```env
PAYMENT_PROVIDER=stripe
PAYMENT_SUCCESS_URL=https://YOUR_FRONTEND_DOMAIN/subscription?success=1
PAYMENT_CANCEL_URL=https://YOUR_FRONTEND_DOMAIN/subscription?canceled=1
```

Secret values must come from Stripe Dashboard:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STUDENT_PREMIUM_PRICE_ID=price_...
STRIPE_TEACHER_PRICE_ID=price_...
```

Never expose `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` in frontend code.

## Stripe Products and Prices Example

Use Stripe Dashboard or Stripe CLI to create two recurring monthly prices.

Currency:

```text
kzt
```

Important:

- Use Stripe's lowercase ISO currency code `kzt`.
- Do not use `tg` as the API currency code.
- Stripe API amounts are sent in the currency's minor unit.

Products:

```text
Product: StudyAI Student Premium
Metadata:
  plan_id=student_premium
Price:
  currency=kzt
  unit_amount=599900
  recurring interval=month
```

```text
Product: StudyAI Teacher Plan
Metadata:
  plan_id=teacher
Price:
  currency=kzt
  unit_amount=1099900
  recurring interval=month
```

Human-readable prices:

```text
student_premium: ₸5,999 / month
teacher: ₸10,999 / month
```

Example Stripe CLI commands:

```powershell
stripe products create `
  --name "StudyAI Student Premium" `
  --metadata "plan_id=student_premium"
```

```powershell
stripe prices create `
  --product prod_STUDENT_PREMIUM_ID `
  --currency kzt `
  --unit-amount 599900 `
  --recurring "interval=month"
```

```powershell
stripe products create `
  --name "StudyAI Teacher Plan" `
  --metadata "plan_id=teacher"
```

```powershell
stripe prices create `
  --product prod_TEACHER_ID `
  --currency kzt `
  --unit-amount 1099900 `
  --recurring "interval=month"
```

After creating prices, copy the returned `price_...` ids into backend env:

```env
STRIPE_STUDENT_PREMIUM_PRICE_ID=price_...
STRIPE_TEACHER_PRICE_ID=price_...
```

## Subscription Update Rules

Backend should be the only writer for subscription changes.

When payment succeeds:

- mark old active/trialing subscription as `canceled` if switching plans;
- create or update active subscription with `plan_id`;
- store provider name in `provider`;
- store provider subscription id in `external_reference`;
- reset or keep usage depending on product decision.

When payment fails:

- mark subscription as `past_due` if provider confirms overdue status.

When subscription is canceled:

- mark subscription as `canceled`;
- optionally create a new `free` subscription.

## Frontend Tasks Later

- Add "Manage subscription" button.
- Call `POST /api/v1/billing/checkout`.
- Redirect to `checkout_url`.
- Show success/cancel state after redirect.
- Refresh `GET /api/v1/dashboard`.
- Handle `past_due`, `canceled`, and `expired` statuses.

## Not Implemented Yet

- Customer portal.
- Refunds.
- Invoices.
