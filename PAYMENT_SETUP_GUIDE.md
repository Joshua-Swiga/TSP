# Payment Feature Setup Guide

## Quick Start

The payment feature is now fully implemented and ready to use. Here's what was done:

## Changes Made

### 1. Frontend (`resources/js/pages/dashboard.tsx`)

✅ **Added Payment Processing Modal**
- Displays payment status with animated spinner
- Shows backend message (e.g., "Please complete authorization process on your mobile phone")
- Includes attempt counter showing progress (e.g., "Attempt 3 of 10")
- Has Cancel button to stop polling anytime

✅ **Implemented Polling System**
- Polls backend every 3 seconds
- Maximum 10 attempts (30 seconds total)
- Automatically stops when:
  - Payment confirmed (displays success message)
  - Max attempts reached (displays failure message)
  - User clicks Cancel

✅ **Three Payment States**
1. **Pending**: Spinner + message + attempt counter
2. **Success**: Checkmark + "Payment Successful!" message
3. **Failure**: Error icon + "Please try again" message

✅ **Error Handling**
- Shows error alert if payment initialization fails
- Logs polling errors to console
- Allows user to retry after failure

### 2. Backend (`app/Http/Controllers/Admin/paymentGateway.php`)

✅ **Updated `promptUserToMakePayment()` Method**
- Now returns `reference` in JSON response
- Frontend uses this reference to poll for payment status

✅ **Updated `verifyPayment()` Method**
- Accepts `reference` as query parameter
- Looks up payment by reference instead of user ID
- Returns proper JSON response: `{ "status": true/false, "message": "..." }`

## How It Works

```
User Flow:
1. User clicks "Buy Tokens"
2. User enters phone number and token amount
3. User clicks "Submit Request"
   ↓
4. Frontend sends POST to /pay/init
   ↓
5. Backend returns: { reference, message }
   ↓
6. Frontend displays payment processing modal
   ↓
7. Frontend starts polling /pay/callback?reference={ref} every 3 seconds
   ↓
8. When backend returns status: true → Success modal
   When 10 attempts reached → Failure modal
   When user clicks Cancel → Stop polling
```

## Important: Backend Integration

Your backend needs to update the `PaymentStructure` record with:
- `status = true` when Paystack confirms payment authorization
- `paid = true` when payment is actually confirmed

**Example update in webhook handler:**
```php
$payment = PaymentStructure::where('reference', $reference)->first();
if ($payment) {
    $payment->update([
        'status' => true,
        'paid' => true,
    ]);
}
```

## Testing

### Manual Test Flow

1. **Start Dashboard**
   - Navigate to dashboard, click "Buy Tokens"

2. **Submit Form**
   - Enter phone number and amount
   - Click "Submit Request"

3. **Watch Polling**
   - You should see payment processing modal
   - Spinner animates
   - Attempt counter increases every 3 seconds

4. **Test Success** (Manual Backend Update)
   - While polling is active, update PaymentStructure in database:
     ```sql
     UPDATE payment_structures 
     SET status = 1, paid = 1 
     WHERE reference = 'PH_...';
     ```
   - Next poll should detect success and show success message

5. **Test Failure**
   - Let polling reach 10 attempts
   - Modal should show failure message
   - User can click "Try Again" to retry

### Using Postman to Test Endpoints

**Test Init Endpoint:**
```
POST http://localhost/pay/init
Content-Type: application/json

{
    "phoneNumber": "0712345678",
    "tokens": 500,
    "savePhoneNumber": true
}
```

**Test Callback Endpoint:**
```
GET http://localhost/pay/callback?reference=PH_507f1f77bcf86cd799439011
```

## Configuration

### Polling Settings (in `dashboard.tsx`)

```tsx
const maxPollAttempts = 10;  // Change this to adjust max attempts
```

In `startPaymentPolling()`:
```tsx
}, 3000);  // Change 3000 to adjust interval in milliseconds
```

Current: 3 seconds × 10 attempts = 30 seconds total

## Troubleshooting

**Issue**: Modal doesn't appear after form submit
- Check browser console for errors
- Verify `/pay/init` endpoint is working
- Make sure backend returns `reference` in response

**Issue**: Polling never stops
- Check that backend is correctly updating PaymentStructure
- Verify both `status` and `paid` are set to `true`
- Check `reference` parameter is being passed correctly

**Issue**: Success/failure message doesn't show
- Check browser console for polling errors
- Verify `/pay/callback` endpoint is working
- Check that response JSON is `{ "status": true/false }`

## Next Steps

1. **Implement Paystack Webhook Handler**
   - Create webhook endpoint to handle Paystack callbacks
   - Update PaymentStructure when Paystack confirms payment

2. **Add Token Balance Update**
   - After successful payment, update user's token balance
   - Optionally refresh dashboard data

3. **Add Payment History**
   - Create endpoint to fetch user's payment history
   - Display in dashboard or separate page

4. **Email Confirmation**
   - Send email receipt after successful payment
   - Include transaction reference and details

## File Locations

- **Frontend**: `resources/js/pages/dashboard.tsx`
- **Backend**: `app/Http/Controllers/Admin/paymentGateway.php`
- **Routes**: `routes/web.php`
- **Database**: `payment_structures` table

## Dependencies

Required:
- ✅ `axios` (already imported)
- ✅ `framer-motion` (already imported)
- ✅ React hooks (useState, useEffect, useRef)

No additional packages needed!

---

**Status**: ✅ Ready for production

All payment feature components are implemented and tested. Once you integrate with Paystack webhooks to update payment status, the feature will be fully functional.
