# Payment Feature Implementation

## Overview

The payment feature has been fully implemented on the frontend with the following capabilities:

- **Payment Initialization Modal**: Users enter phone number and token amount
- **Payment Processing Modal**: Shows payment status with spinner while polling backend
- **Automatic Polling**: Checks payment status every 3 seconds
- **Success Handling**: Displays success message when payment is confirmed
- **Failure Handling**: Shows failure message after 10 failed attempts
- **Cancel Functionality**: Users can cancel the process at any time

## Frontend Changes

### 1. Modified File: `resources/js/pages/dashboard.tsx`

#### New Imports
```tsx
import { useRef } from 'react';
import axios from 'axios';
```

#### New State Variables
```tsx
// Payment processing modal state
const [paymentProcessingOpen, setPaymentProcessingOpen] = useState<boolean>(false);
const [paymentMessage, setPaymentMessage] = useState<string>('');
const [paymentReference, setPaymentReference] = useState<string>('');
const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failure'>('pending');
const [pollAttempts, setPollAttempts] = useState<number>(0);
const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
const maxPollAttempts = 10;
```

#### New Functions

**`handleBuyTokensSubmit()`**
- Handles form submission from the buy tokens modal
- Uses Axios to POST to `/pay/init` endpoint
- Receives payment reference and message from backend
- Opens payment processing modal
- Starts polling for payment status

**`startPaymentPolling(reference: string)`**
- Polls `/pay/callback?reference={reference}` every 3 seconds
- Checks if `result.status === true` (payment confirmed)
- Stops polling when:
  - Payment confirmed (success)
  - 10 attempts reached (failure)
  - User cancels (via cleanup function)

**`stopPaymentPolling()`**
- Clears the polling interval
- Called when payment completes, fails, or user cancels

**`closePaymentProcessingModal()`**
- Closes the payment processing modal
- Stops polling
- Resets all payment-related state

**`handlePaymentSuccess()`**
- Called when payment is successful
- Closes the modal
- Can be extended for additional logic (refresh balance, etc.)

#### Cleanup Effect
```tsx
useEffect(() => {
    return () => {
        stopPaymentPolling();
    };
}, []);
```
Ensures polling is cleaned up when component unmounts.

#### New Payment Processing Modal

The modal has three states:

1. **Pending State**
   - Shows spinner with pulsing animation
   - Displays payment message from backend
   - Shows attempt counter (e.g., "Attempt 3 of 10")
   - Includes helpful text about completing transaction on phone
   - Cancel button to stop polling

2. **Success State**
   - Shows checkmark icon with animation
   - Displays "Payment Successful!" message
   - "Continue" button to close modal

3. **Failure State**
   - Shows X icon in red
   - Displays "Payment Not Completed" message
   - Explains max attempts were reached
   - "Try Again" button to retry

## Backend Changes

### 1. Modified File: `app/Http/Controllers/Admin/paymentGateway.php`

#### Updated `promptUserToMakePayment()` Method
- Now returns `reference` in the JSON response for both success paths
- Ensures frontend has reference to use for polling

```php
return response()->json([
    'status' => true,
    'message' => 'Please complete authorization process on your mobile phone',
    'reference' => $reference,
]);
```

#### Updated `verifyPayment()` Method
- Changed to accept `reference` as a query parameter
- Looks up payment record using the reference (not user ID)
- Returns proper JSON response for polling

```php
public function verifyPayment(Request $request){
    $reference = $request->query('reference');
    
    if (!$reference) {
        return response()->json([
            'status' => false,
            'message' => 'Reference is required'
        ], 400);
    }

    $payment = PaymentStructure::where('reference', $reference)->first();
    
    // Check if payment status has been updated
    if ($payment->status == true && $payment->paid == true){
        return response()->json([
            'status' => true,
            'message' => 'Payment has been made'
        ]);
    }else{
        return response()->json([
            'status' => false,
            'message' => 'Payment has not been made'
        ]);
    }
}
```

## API Endpoints

### POST `/pay/init`
**Request:**
```json
{
    "phoneNumber": "0712345678",
    "tokens": 500,
    "savePhoneNumber": true
}
```

**Response (Success):**
```json
{
    "status": true,
    "message": "Please complete authorization process on your mobile phone",
    "reference": "PH_507f1f77bcf86cd799439011",
    "paystack_response": {...}
}
```

### GET `/pay/callback?reference={reference}`
**Response (Pending):**
```json
{
    "status": false,
    "message": "Payment has not been made"
}
```

**Response (Completed):**
```json
{
    "status": true,
    "message": "Payment has been made"
}
```

## Polling Logic

1. User submits phone number and token amount
2. Frontend sends POST request to `/pay/init`
3. Backend initiates M-Pesa payment and returns reference
4. Frontend displays payment processing modal with spinner
5. Frontend starts polling `/pay/callback?reference={reference}` every 3 seconds
6. Polling continues until:
   - Backend returns `status: true` (success) → Show success message
   - 10 attempts made (30 seconds) → Show failure message
   - User clicks Cancel → Stop polling and close modal
7. User sees appropriate success/failure message

## Error Handling

- **Payment Initiation Error**: Shows alert with error message
- **Polling Error**: Logs error to console and continues polling
- **Max Attempts Reached**: Shows failure message, user can try again
- **User Cancellation**: Stops polling cleanly without errors

## Important Notes

1. **Reference Storage**: Make sure your backend updates the `PaymentStructure` record with:
   - `status = true` when payment is authorized
   - `paid = true` when payment is confirmed

2. **CSRF Token**: Axios automatically includes CSRF token from meta tags

3. **Polling Duration**: 
   - Interval: 3 seconds
   - Max attempts: 10
   - Total time: ~30 seconds

4. **UI/UX Features**:
   - Smooth animations for all modal transitions
   - Spinner with pulsing background
   - Attempt counter for transparency
   - Clear success/failure states
   - Accessible markup with ARIA attributes

## Testing the Feature

1. Navigate to Dashboard
2. Click "Buy Tokens" button
3. Enter phone number and token amount
4. Click "Submit Request"
5. Observe payment processing modal with spinner
6. Check backend logs to update payment status manually (for testing)
7. Verify success or failure message appears after polling

## Future Enhancements

1. Add retry logic with exponential backoff
2. Implement WebSocket for real-time payment updates
3. Add payment history modal
4. Support multiple payment providers
5. Add payment receipt generation
6. Implement bank transfer as alternative payment method
