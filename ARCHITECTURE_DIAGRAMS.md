# Payment Feature - Architecture & Flow Diagrams

## 1. User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        DASHBOARD PAGE                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Click Buy      │
                    │  Tokens Button  │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │  Buy Tokens Modal   │
                    │  - Phone Number     │
                    │  - Token Amount     │
                    │  - Save Phone Opt   │
                    └──────────────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │ Submit Form          │
                    │ (Axios POST)         │
                    └──────────────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │ Backend Processes    │
                    │ - Validates data     │
                    │ - Calls Paystack     │
                    │ - Returns reference  │
                    └──────────────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │ Payment Processing   │
                    │ Modal Opens          │
                    │ - Spinner shows      │
                    │ - Polling starts     │
                    └──────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
        ┌─────────┐     ┌─────────┐     ┌──────────┐
        │ Success │     │ Failure │     │ Canceled │
        │ ✓ Check │     │ ✗ Error │     │ Stop &   │
        │ Mark    │     │ Message │     │ Close    │
        │ Message │     │ (10 att)│     │ Modal    │
        └─────────┘     └─────────┘     └──────────┘
```

## 2. State Machine Diagram

```
┌──────────────────────────────────────────────────────┐
│                    PAYMENT STATUS                    │
└──────────────────────────────────────────────────────┘

Initial: paymentStatus = 'pending'

                    ┌─────────────────┐
                    │    PENDING      │
                    │  ◐ Spinner      │
                    │  ◐ Poll 3s      │
                    │  ◐ Attempt #/10 │
                    │  ◐ Cancel btn   │
                    └─────────────────┘
                          │
            ┌─────────────┼─────────────┐
            │             │             │
    Backend │   Cancel    │  Max        │
    Status  │   Clicked   │  Attempts   │
    = true  │             │  Reached    │
            │             │             │
            ▼             ▼             ▼
        ┌────────┐   ┌────────┐   ┌────────┐
        │SUCCESS │   │ CLOSED │   │FAILURE │
        │ ✓ Mark │   │(no UI) │   │✗ Error │
        │ Msg ok │   │        │   │ Msg ok │
        └────────┘   └────────┘   └────────┘
```

## 3. Component Architecture

```
Dashboard
├── Buy Tokens Modal (buyTokensOpen)
│   ├── Phone Input
│   ├── Amount Input
│   ├── Save Phone Checkbox
│   └── Submit Button
│
└── Payment Processing Modal (paymentProcessingOpen)
    │
    ├─ Pending View (paymentStatus = 'pending')
    │   ├── Spinner Animation
    │   │   └── scale: [1, 1.1, 1]
    │   ├── Message Display
    │   │   └── {paymentMessage}
    │   ├── Attempt Counter
    │   │   └── Attempt {pollAttempts} of {maxPollAttempts}
    │   ├── Info Box
    │   │   └── "Complete on your phone..."
    │   └── Cancel Button
    │       └── onClick: closePaymentProcessingModal()
    │
    ├─ Success View (paymentStatus = 'success')
    │   ├── Checkmark Icon (animated)
    │   ├── Success Message
    │   │   └── "Payment Successful!"
    │   ├── Confirmation Text
    │   │   └── "Tokens added to account"
    │   └── Continue Button
    │       └── onClick: handlePaymentSuccess()
    │
    └─ Failure View (paymentStatus = 'failure')
        ├── Error Icon (X)
        ├── Error Message
        │   └── "Payment Not Completed"
        ├── Info Text
        │   └── "10 attempts reached, try again"
        └── Try Again Button
            └── onClick: closePaymentProcessingModal()
```

## 4. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    PAYMENT DATA FLOW                        │
└─────────────────────────────────────────────────────────────┘

USER INPUT
├── phoneNumber: string
└── tokens: number
       │
       ▼
┌─────────────────┐
│ Axios.post()    │
│ /pay/init       │
└─────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  BACKEND RESPONSE                │
├──────────────────────────────────┤
│ {                                │
│   status: true,                  │
│   message: "Complete on phone",  │
│   reference: "PH_xxxxx",         │
│   paystack_response: {...}       │
│ }                                │
└──────────────────────────────────┘
       │
       ├──► setPaymentMessage()
       ├──► setPaymentReference()
       ├──► setPaymentStatus('pending')
       ├──► setPaymentProcessingOpen(true)
       └──► startPaymentPolling(reference)
             │
             ▼
         ┌────────────────────────────────┐
         │ POLLING LOOP (every 3 seconds) │
         │ Axios.get()                    │
         │ /pay/callback?reference=...    │
         └────────────────────────────────┘
             │
             ├─ Response: { status: false } ──► Continue polling
             │
             ├─ Response: { status: true } ───► setPaymentStatus('success')
             │
             └─ 10 attempts reached ────────► setPaymentStatus('failure')
```

## 5. Polling Sequence Diagram

```
Time    Frontend              Backend
────────────────────────────────────────
0s      │
        ├─► POST /pay/init
        │                    Process
        │                    │
        │◄─── Reference + Message
        │
        ├─ Start Polling
        │
3s      ├─► GET /pay/callback?ref=...
        │                    Check status
        │                    → Status: false
        │◄─── { status: false }
        │
6s      ├─► GET /pay/callback?ref=...
        │                    Check status
        │                    → Status: false
        │◄─── { status: false }
        │
9s      ├─► GET /pay/callback?ref=...
        │                    Check status
        │                    → Status: false
        │◄─── { status: false }
        │
12s     ├─► GET /pay/callback?ref=...
        │                    Check status
        │                    → Status: true ✓
        │◄─── { status: true }
        │
        ├─ Show Success Modal
        │
```

## 6. Error Handling Flow

```
┌──────────────────────────────────┐
│    ERROR HANDLING FLOW           │
└──────────────────────────────────┘

Initial Submission Error
├─► /pay/init fails
├─► Catch block triggered
├─► Alert user: "Payment initiation failed"
└─► Reset buyTokensLoading to false

Polling Error (During Loop)
├─► /pay/callback network error
├─► Catch block logged to console
├─► Continue polling (up to max attempts)
├─► If max attempts reached:
│   ├─► Show failure modal
│   └─► User can retry
└─► If user cancels:
    ├─► Stop polling
    └─► Clear interval reference

User Cancel
├─► Cancel button clicked
├─► Call stopPaymentPolling()
├─► Clear interval
├─► Reset state
└─► Close modal

Max Attempts (30 seconds)
├─► 10 attempts completed
├─► Set paymentStatus = 'failure'
├─► Stop polling
├─► Show failure message
└─► User can retry from failure screen
```

## 7. Component Lifecycle

```
Dashboard Component Mounts
│
├─ useState: Initialize payment states
├─ useState: Initialize UI states
├─ useRef: Create pollingIntervalRef
│
└─ useEffect:
   └─ When component unmounts:
      ├─ stopPaymentPolling()
      ├─ clearInterval()
      └─ Reset all state

User Opens Buy Tokens Modal
│
├─ setBuyTokensOpen(true)
├─ Load phone number from user data
├─ Reset form fields
│
└─ Render: Buy Tokens Modal

User Submits Form
│
├─ Event handler triggered
├─ Create payload
├─ axios.post('/pay/init', payload)
│
└─ Response received:
   ├─ Close Buy Tokens Modal
   ├─ Extract reference & message
   ├─ Set payment state
   ├─ Open Payment Processing Modal
   │
   └─ startPaymentPolling(reference)
      └─ Loop until:
         ├─ Status = true (success)
         ├─ Attempts ≥ 10 (failure)
         └─ User cancels (cleanup)
```

## 8. Modal Transitions

```
Pending Modal
└── [Show Spinner + Message + Counter]
    │
    ├─ Backend returns status: true
    │   │
    │   └─► Framer Motion Exit Animation
    │       └─► Success Modal Enters
    │
    ├─ 10 attempts reached
    │   │
    │   └─► Framer Motion Exit Animation
    │       └─► Failure Modal Enters
    │
    └─ User clicks Cancel
        │
        └─► Framer Motion Exit Animation
            └─► Modal Closes


Success Modal
└── [Show Checkmark + Message]
    │
    └─ User clicks "Continue"
       │
       └─► Framer Motion Exit Animation
           └─► Modal Closes
               └─► Reset all state


Failure Modal
└── [Show Error + Message]
    │
    └─ User clicks "Try Again"
       │
       └─► Framer Motion Exit Animation
           └─► Modal Closes
               └─► User can retry from dashboard
```

## 9. API Contract

```
┌─────────────────────────────────────────┐
│       POST /pay/init (Request)          │
├─────────────────────────────────────────┤
│ {                                       │
│   "phoneNumber": "0712345678",         │
│   "tokens": 500,                        │
│   "savePhoneNumber": true               │
│ }                                       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│      POST /pay/init (Response)          │
├─────────────────────────────────────────┤
│ {                                       │
│   "status": true,                       │
│   "message": "Complete on mobile",      │
│   "reference": "PH_507f1f77bcf86cd",   │
│   "paystack_response": {...}            │
│ }                                       │
└─────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  GET /pay/callback?reference=PH_... (Query) │
└──────────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│    GET /pay/callback (Response)         │
├─────────────────────────────────────────┤
│ {                                       │
│   "status": true,       // false until  │
│   "message": "..."      // confirmed    │
│ }                                       │
└─────────────────────────────────────────┘
```

## 10. Timing Diagram

```
Time    Event                   Attempts
────────────────────────────────────────
0s      User submits            -
        /pay/init called        -
        Response received       -
        Polling starts          -

3s      First poll              1
6s      Second poll             2
9s      Third poll              3
12s     Fourth poll             4
15s     Fifth poll              5
18s     Sixth poll              6
21s     Seventh poll            7
24s     Eighth poll             8
27s     Ninth poll              9
30s     Tenth poll              10
        ↓ Failure/Success
        Show result message
```

---

These diagrams provide a comprehensive visual understanding of the payment feature implementation.

For detailed information, refer to the text documentation files.
