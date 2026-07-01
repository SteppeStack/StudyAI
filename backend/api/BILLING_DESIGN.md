# StudyAI Billing Backend Design

Payment integration is not implemented yet because the payment provider has not been chosen.

This document defines the backend design that should be implemented when a provider is selected.

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

Use a trusted payment provider such as Stripe, Paddle, Lemon Squeezy, or another provider supported in the deployment region.

The provider flow should be:

1. Frontend asks backend to create a checkout session.
2. Backend validates the current user and requested plan.
3. Backend creates a provider checkout session.
4. Frontend redirects the user to provider checkout.
5. Provider calls backend webhook after payment/subscription changes.
6. Backend verifies webhook signature.
7. Backend updates `subscriptions`.
8. Frontend refreshes dashboard/subscription state.

## Future API

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

- subscription created
- subscription renewed
- subscription updated
- subscription canceled
- payment failed

## Required Environment Variables

Provider-specific names will be decided later. A Stripe-like setup would need:

```env
PAYMENT_PROVIDER=stripe
PAYMENT_SECRET_KEY=
PAYMENT_WEBHOOK_SECRET=
PAYMENT_SUCCESS_URL=
PAYMENT_CANCEL_URL=
```

Never expose payment secret keys in frontend code.

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

- Real checkout session creation.
- Provider webhook verification.
- Customer portal.
- Refunds.
- Invoices.
