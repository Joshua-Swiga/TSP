# Withdrawal Workflow - Quick Reference Guide

## 🎯 Quick Start

### Filter by Status
```tsx
// Index page query parameter
?status=pending    // Show only pending withdrawals
?status=complete   // Show only completed withdrawals
```

### Filter by Amount
```tsx
?min_amount=1000&max_amount=5000   // Amount between $1000 and $5000
```

### Filter by Date Range
```tsx
?start_date=2026-01-01&end_date=2026-01-31   // January 2026
```

### Filter by Email & Flagged
```tsx
?email=john@example.com&flagged=true   // Flagged withdrawals from specific user
```

### Combine Multiple Filters
```tsx
?email=john&status=pending&flagged=true&min_amount=500&max_amount=10000&start_date=2026-01-01&end_date=2026-01-31
```

---

## 📱 Component Usage

### WithdrawalIndex Component
```tsx
<WithdrawalIndex
  withdrawals={withdrawals}      // Array of withdrawal objects
  pagination={pagination}        // Pagination metadata
  filters={filters}              // Current filter values
/>
```

### Props Structure
```tsx
type Withdrawal = {
  id: string;
  uuid: string;
  name: string;                  // User name
  email: string;
  phone: string;
  amount: number;                // Withdrawal amount
  fee: number;
  status: 'Pending' | 'Approved';
  statusRaw: 'pending' | 'complete';
  date: string;
  flagged: boolean;
  transaction_code?: string;
  comments?: string;
  method: string;                // E.g., 'Mpesa'
}

type Pagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;                  // First record on page
  to: number;                    // Last record on page
}

type Filters = {
  email: string;
  status: string;
  flagged: string | null;
  min_amount: string | null;
  max_amount: string | null;
  start_date: string | null;
  end_date: string | null;
}
```

---

## 🔧 Controller Methods

### Get All Withdrawals
```php
GET /pay/wif9A3Qx7mZ2RkL0pJH8WcU6TnS5E4BthdrawkL0pJH8WcU6als

Query Parameters:
- email: string
- status: 'pending' | 'complete'
- flagged: boolean
- min_amount: number
- max_amount: number
- start_date: date (Y-m-d)
- end_date: date (Y-m-d)
- page: number
- per_page: number (default: 15)

Example:
GET /pay/wif9A3Qx7mZ2RkL0pJH8WcU6TnS5E4BthdrawkL0pJH8WcU6als?status=pending&flagged=true&page=1
```

### Get Single Withdrawal
```php
GET /pay/siA6UmdJSTngK7xM2QW9FZP0LrE8H5C4nA6UmdJSTle-wingK7thdrawal-rehdraqet/{id}

Returns:
{
  id: number,
  uuid: string,
  name: string,
  email: string,
  phone: string,
  avatar: string,
  balance: number,
  requested: number,
  fee: number,
  status: string,
  flagged: boolean,
  transaction_code: string | null,
  comments: string | null,
  events: EventTimeline[],
  ...
}
```

### Update Withdrawal
```php
PUT /pay/siA6UmdJSTngK7xM2QW9FZP0LrE8H5C4nA6UmdJSTle-wingK7thdrawal-rehdraqet/{id}

Request Body:
{
  transaction_code: string | null,
  comments: string | null,
  flagged: boolean | null
}

Auto-completion Rule:
- If BOTH transaction_code AND comments provided
  → Status automatically changes to 'complete'
  → Admin ID is recorded

Response:
{
  success: true,
  message: "Withdrawal updated successfully",
  withdrawal: {
    id: number,
    status: string,
    transaction_code: string,
    comments: string,
    flagged: boolean
  }
}
```

### Toggle Flag Status
```php
POST /pay/siA6UmdJSTngK7xM2QW9FZP0LrE8H5C4nA6UmdJSTle-wingK7thdrawal-rehdraqet/{id}/toggle-flag

Response:
{
  success: true,
  flagged: boolean  // New flagged status
}
```

---

## 🗄️ Model Query Scopes

### Using Scopes in Controller
```php
// Get pending withdrawals
withdrawalStructure::pending()->get();

// Get complete withdrawals
withdrawalStructure::complete()->get();

// Get flagged withdrawals
withdrawalStructure::flagged()->get();

// Filter by email
withdrawalStructure::byEmail('john@example.com')->get();

// Filter by amount range
withdrawalStructure::byAmount(1000, 5000)->get();

// Filter by date range
withdrawalStructure::byDateRange($startDate, $endDate)->get();

// Chain multiple scopes
withdrawalStructure::pending()
    ->flagged()
    ->byAmount(500, 10000)
    ->paginate(15);
```

---

## 💾 Database Fields

### request_withdrawals Table
```
id                                  INTEGER (PRIMARY KEY)
user_id                            INTEGER (FOREIGN KEY → users)
user_that_processed_the_request    INTEGER (FOREIGN KEY → users, NULLABLE)
status                             STRING (default: 'pending')
method                             STRING (nullable)
amount                             DECIMAL(10,2)
currency                           STRING(3)
uuid                               STRING (unique)
transaction_code                   STRING (nullable)
comments                           TEXT (nullable)
fee                                STRING
flagged                            BOOLEAN (default: false)
created_at                         TIMESTAMP
updated_at                         TIMESTAMP
```

---

## 🎨 Status Colors (React)

```tsx
// Pending status
className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800"

// Complete/Approved status
className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800"

// Flagged status
className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800"
```

---

## 📋 State Management (React)

### Filter State Hook
```tsx
const [activeFilters, setActiveFilters] = useState({
  email: '',
  status: '',
  flagged: null,
  min_amount: null,
  max_amount: null,
  start_date: null,
  end_date: null,
});
```

### Update Withdrawal Form
```tsx
const [transactionCode, setTransactionCode] = useState('');
const [comments, setComments] = useState('');
const [isFlagged, setIsFlagged] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [feedback, setFeedback] = useState<Feedback | null>(null);
```

---

## ✅ Validation Rules

### Transaction Code
- Required when completing a withdrawal
- Max length: 255 characters
- No specific format required

### Comments
- Required when completing a withdrawal
- Max length: 1000 characters
- Internal admin notes

### Amount
- Must be positive decimal
- Stored as DECIMAL(10,2) in database

### Date Range
- Format: YYYY-MM-DD
- End date must be >= start date

---

## 🔄 Form Submission Flow

```
┌──────────────────────────────┐
│  Admin fills form             │
│  - Transaction Code           │
│  - Comments                   │
│  - Flag checkbox (optional)   │
└──────────────┬────────────────┘
               │
               ▼
┌──────────────────────────────┐
│  Click "Complete Process"     │
│  - Form validated             │
│  - setIsSubmitting = true     │
└──────────────┬────────────────┘
               │
               ▼
┌──────────────────────────────┐
│  PUT request sent             │
│  - transaction_code           │
│  - comments                   │
│  - flagged                    │
└──────────────┬────────────────┘
               │
               ▼
┌──────────────────────────────┐
│  Backend processes:           │
│  - Updates withdrawal record  │
│  - IF both fields filled:     │
│    → status = 'complete'      │
│    → Record admin ID          │
└──────────────┬────────────────┘
               │
               ▼
┌──────────────────────────────┐
│  Response with success        │
│  - Show feedback message      │
│  - setIsSubmitting = false    │
│  - After 1.5s: redirect       │
└──────────────────────────────┘
```

---

## 🐛 Debugging Tips

### Check Withdrawal Status
```php
$withdrawal = withdrawalStructure::find($id);
echo $withdrawal->status;              // 'pending' or 'complete'
echo $withdrawal->transaction_code;    // Transaction code or null
echo $withdrawal->comments;            // Comments or null
echo $withdrawal->flagged;             // true or false
```

### Check Admin Who Processed
```php
$withdrawal = withdrawalStructure::with('processedBy')->find($id);
echo $withdrawal->processedBy->name;   // Admin name who processed
```

### Check Timestamps
```php
echo $withdrawal->created_at;  // When withdrawal was requested
echo $withdrawal->updated_at;  // When it was last modified
```

---

## 🚀 Common Operations

### Mark As Complete Without Comments (Not Recommended)
```php
// This WON'T auto-complete because comments is null
$withdrawal->transaction_code = 'TRX-123';
// Need to also set comments
$withdrawal->comments = 'Processed and verified';
$withdrawal->save();
```

### Force Status to Complete
```php
// This will complete withdrawal regardless
$withdrawal->status = 'complete';
$withdrawal->user_that_processed_the_request = auth()->id();
$withdrawal->save();
```

### Bulk Flag All Pending Over Amount
```php
withdrawalStructure::pending()
    ->where('amount', '>', 5000)
    ->update(['flagged' => true]);
```

---

## 📞 Support & References

**File Locations:**
- Controller: `app/Http/Controllers/Admin/paymentGateway.php`
- Model: `app/Models/withdrawalStructure.php`
- Index Page: `resources/js/pages/withdrawalIndex.tsx`
- Detail Page: `resources/js/pages/singleWithdrawalView.tsx`
- Routes: `routes/web.php`
- Migration: `database/migrations/2026_01_19_212248_request_withdrawal.php`

**Documentation:**
- Full guide: `WITHDRAWAL_WORKFLOW_IMPLEMENTATION.md`
- This guide: `WITHDRAWAL_WORKFLOW_QUICK_REFERENCE.md`
