# Payment Feature - Quick Reference

## 🎯 At a Glance

| Aspect | Details |
|--------|---------|
| **Status** | ✅ Complete - Ready for testing |
| **Frontend** | `resources/js/pages/dashboard.tsx` |
| **Backend** | `app/Http/Controllers/Admin/paymentGateway.php` |
| **Polling Interval** | 3 seconds |
| **Max Attempts** | 10 (total ~30 seconds) |
| **States** | Pending → Success/Failure |
| **Cleanup** | Automatic when component unmounts |

## 📋 Feature List

✅ Payment processing modal with spinner
✅ Backend message display
✅ 3-second polling every attempt
✅ Attempt counter (e.g., "Attempt 3 of 10")
✅ Success message with checkmark
✅ Failure message with error icon
✅ Cancel button (stops polling)
✅ Try again functionality
✅ Proper error handling
✅ TypeScript support
✅ Framer motion animations

## 🔄 User Flow

```
1. Click "Buy Tokens" button
   ↓
2. Enter phone number & amount
   ↓
3. Click "Submit Request"
   ↓
4. See payment processing modal
   ↓
5. Complete transaction on phone
   ↓
6. See success/failure message
```

## 💾 Database Updates Needed

Your backend webhook must update `payment_structures`:

```php
// When Paystack confirms payment:
$payment->update([
    'status' => true,
    'paid' => true,
]);

// Then add tokens to user:
$payment->user->increment('token_balance', $payment->amount);
```

## 🚀 Quick Setup

1. **Frontend is ready** - No additional setup needed
2. **Backend is ready** - Verify routes work with Postman
3. **Next**: Implement Paystack webhook handler (see PAYSTACK_WEBHOOK_INTEGRATION.md)

## 🧪 Quick Test

### Test 1: Payment Initialization
```bash
curl -X POST http://localhost/pay/init \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "0712345678",
    "tokens": 500,
    "savePhoneNumber": true
  }'

# Should return: { status, message, reference }
```

### Test 2: Payment Verification
```bash
curl http://localhost/pay/callback?reference=PH_xxxxx

# Should return: { status, message }
```

### Test 3: Frontend Flow
1. Go to dashboard
2. Click "Buy Tokens"
3. Enter details and submit
4. Watch modal appear
5. Click Cancel or wait for timeout

## ⚙️ Configuration

**To adjust polling in `dashboard.tsx`:**

```tsx
// Line 297 - Change interval
}, 3000);  // milliseconds (3000 = 3 seconds)

// Line 188 - Change max attempts
const maxPollAttempts = 10;
```

**Calculation**: Total time = (maxPollAttempts - 1) × interval
- Current: (10 - 1) × 3 = 27 seconds (first check immediate)

## 🎨 Modal States

### Pending (while polling)
```
[Spinner animation]
Processing Payment
Please complete authorization process on your mobile phone
Attempt 3 of 10
[Cancel button]
```

### Success
```
[Checkmark icon]
Payment Successful!
Your tokens have been added to your account.
[Great! Continue button]
```

### Failure
```
[X icon]
Payment Not Completed
We didn't receive confirmation after 10 attempts.
[Try Again button]
```

## 🔗 Related Files

- **Frontend**: `resources/js/pages/dashboard.tsx`
- **Backend Controller**: `app/Http/Controllers/Admin/paymentGateway.php`
- **Routes**: `routes/web.php` (lines 65-68)
- **Database**: `payment_structures` table
- **Docs**: 
  - PAYMENT_FEATURE_IMPLEMENTATION.md
  - PAYMENT_SETUP_GUIDE.md
  - PAYSTACK_WEBHOOK_INTEGRATION.md

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| Modal doesn't appear | Check console for `/pay/init` errors |
| Polling never stops | Verify backend updates `status` and `paid` to true |
| Reference is null | Ensure backend returns `reference` in response |
| Can't close modal | Check that `stopPaymentPolling()` was called |

## ✨ Key Functions

```tsx
// Start polling with reference
startPaymentPolling(reference: string)

// Stop polling and cleanup
stopPaymentPolling()

// Close modal and reset state
closePaymentProcessingModal()

// Handle successful payment
handlePaymentSuccess()
```

## 🔐 Security

- ✅ CSRF protection (Axios automatic)
- ✅ Backend validates authentication
- ✅ Reference prevents cross-payment issues
- ⚠️ Implement webhook signature verification
- ⚠️ Validate payment amount on backend

## 📊 Performance

- **Modal Load Time**: Instant
- **Polling Overhead**: Minimal (GET request every 3s)
- **Memory**: Properly cleaned up on unmount
- **CPU**: Negligible (async operations)

## 🎯 Success Criteria

- [x] Modal displays with spinner
- [x] Polling works every 3 seconds
- [x] Attempt counter shows progress
- [x] Success state shows when status=true
- [x] Failure state shows after 10 attempts
- [x] Cancel button stops polling
- [x] No errors in console
- [x] TypeScript compilation passes
- [ ] Backend webhook updates payment status
- [ ] Tokens added to user account

## 📞 API Response Examples

**Init Response (Success)**
```json
{
  "status": true,
  "message": "Please complete authorization process on your mobile phone",
  "reference": "PH_507f1f77bcf86cd799439011",
  "paystack_response": {...}
}
```

**Callback Response (Pending)**
```json
{
  "status": false,
  "message": "Payment has not been made"
}
```

**Callback Response (Complete)**
```json
{
  "status": true,
  "message": "Payment has been made"
}
```

## 🚨 Important Notes

1. **Backend must update** `PaymentStructure.status` and `PaymentStructure.paid` when webhook is received
2. **Frontend polls** every 3 seconds for up to 10 attempts
3. **Cancel button** stops polling immediately
4. **No token transfer** happens until backend confirms payment
5. **Axios is required** - Make sure it's imported

## 📈 Next Phase

Once this is working:
1. Implement Paystack webhook handler
2. Add email receipts
3. Create payment history page
4. Add alternate payment methods
5. Implement real-time notifications

---

**Ready to go!** Start testing and integrate the webhook handler.
