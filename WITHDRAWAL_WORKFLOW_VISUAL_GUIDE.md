# Withdrawal Workflow - Visual Feature Guide

## 🎨 UI Components Overview

### Index Page Layout

```
┌────────────────────────────────────────────────────────────────┐
│  Withdrawals                              [New request] Button  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ 🔍 Search email  │  │ Search  │  │ Filters │ × │ Clear   │ │
│  └──────────────────┘  └─────────┘  └─────────┘  └─────────┘ │
│                                                                │
│  [IF ADVANCED FILTERS OPEN]                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Status         │ Flagged        │ Min Amount │ Max Amount │  │
│  │ [ All ]        │ [ All ]        │ [      ]   │ [       ]  │  │
│  │                                                           │  │
│  │ Start Date     │ End Date                                │  │
│  │ [        ]     │ [        ]                              │  │
│  │                                                           │  │
│  │ [Apply Filters] [Reset]                                 │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  Showing 1 to 15 of 42 withdrawals                            │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Applicant         │ Amount      │ Status  │ Actions    │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ John Smith        │ $1,250.00   │ ⚠️ Pending    │ View ▶ │  │
│  │ john@example.com  │ Fee: $12.50 │            │        │  │
│  │ +1 (555) 123-4567│             │            │        │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ Jane Doe          │ $3,500.00   │ ✅ Approved  │ View ▶ │  │
│  │ jane@example.com  │ Fee: $35.00 │ 🚩 Flagged  │        │  │
│  │ +1 (555) 987-6543│             │            │        │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ [more rows...]                                         │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  Page 1 of 3  [◄ Previous] [1] [2] [3] [Next ►]              │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

### Detail Page Layout

```
┌────────────────────────────────────────────────────────────────┐
│  ◄ Back  |  Withdrawal Detail                                  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ✅ Withdrawal updated successfully                           │
│                                                                │
│  [LEFT COLUMN - 2/3 WIDTH]          [RIGHT COLUMN - 1/3]    │
│  ┌──────────────────────────────┐  ┌──────────────────┐     │
│  │      User Card               │  │    Applicant     │     │
│  │    ┌─────────────┐           │  │                  │     │
│  │    │      A      │           │  │  [Avatar]        │     │
│  │    │   (Blue)    │           │  │  John Smith      │     │
│  │    └─────────────┘           │  │  john@ex.com     │     │
│  │    John Smith                │  │  📅 Jan 20, 2026│     │
│  │    john@example.com          │  │  [KYC] [MFA]     │     │
│  │    +1 (555) 123-4567        │  │                  │     │
│  │    ┌─────────────────┐      │  └──────────────────┘     │
│  │    │Avail Balance    │      │  ┌──────────────────┐     │
│  │    │  $24,500.00     │      │  │ Risk & Compliance│     │
│  │    └─────────────────┘      │  │                  │     │
│  └──────────────────────────────┘  │ Fraud: ✅ Passed │     │
│                                     │ Velocity: ✅ OK  │     │
│  ┌──────────────────────────────┐  │ Blacklist: ✅ OK │     │
│  │ Requested │ Processing Fee   │  └──────────────────┘     │
│  │ $12,450   │ $12.50 (red)     │  ┌──────────────────┐     │
│  └──────────────────────────────┘  │ Status & Actions │     │
│                                     │                  │     │
│  ┌──────────────────────────────┐  │ Status:          │     │
│  │ Technical Metadata           │  │ ⚠️ [Pending]     │     │
│  │ TX_ID: TRX-9920-X88         │  │                  │     │
│  │ IP: 192.168.1.104           │  │ [🚩 Flag Review] │     │
│  │ Fingerprint: SHA256:7B:44   │  │                  │     │
│  │ Auth Status: ✅ VERIFIED_MFA │  └──────────────────┘     │
│  └──────────────────────────────┘                            │
│                                                                │
│  ┌──────────────────────────────┐                            │
│  │ History Overview             │                            │
│  │  ● Application Verified      │                            │
│  │    Today, 09:41 AM • System  │                            │
│  │  │                            │                            │
│  │  ● Security Checks Passed    │                            │
│  │    Today, 09:38 AM • AI      │                            │
│  │  │                            │                            │
│  │  ● Request Initiated         │                            │
│  │    Today, 09:30 AM • Mobile  │                            │
│  └──────────────────────────────┘                            │
│                                                                │
│  ┌──────────────────────────────┐                            │
│  │ Administrative Actions       │                            │
│  │                              │                            │
│  │ Transaction Code:            │                            │
│  │ [________________]           │                            │
│  │                              │                            │
│  │ Administrative Remarks:      │                            │
│  │ ┌────────────────────────┐  │                            │
│  │ │                        │  │                            │
│  │ │                        │  │                            │
│  │ │                        │  │                            │
│  │ └────────────────────────┘  │                            │
│  │                              │                            │
│  │ [✓ Complete Process]         │                            │
│  └──────────────────────────────┘                            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Filter Panel Visualization

### Collapsed State
```
┌─────────────────────────────────────────────────────────┐
│ 🔍 Search email [______________] [Search] [⚙️ Filters] [×]│
└─────────────────────────────────────────────────────────┘
```

### Expanded State
```
┌─────────────────────────────────────────────────────────┐
│ 🔍 Search email [______________] [Search] [⚙️ Filters] [×]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Status         Flagged        Min Amount  Max A.  │  │
│  │ ┌─────────────┐ ┌──────────┐ ┌────────┐ ┌──────┐ │  │
│  │ │ All ▼       │ │ All ▼    │ │   $0   │ │999999│ │  │
│  │ │ Pending     │ │ Flagged  │ └────────┘ └──────┘ │  │
│  │ │ Complete    │ │ Not Flag │                     │  │
│  │ └─────────────┘ └──────────┘                     │  │
│  │                                                  │  │
│  │ Start Date           End Date                    │  │
│  │ ┌──────────────┐  ┌──────────────┐              │  │
│  │ │ YYYY-MM-DD   │  │ YYYY-MM-DD   │              │  │
│  │ └──────────────┘  └──────────────┘              │  │
│  │                                                  │  │
│  │ [Apply Filters]  [Reset]                        │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Status Badge Colors

### Index Table Status Display
```
Pending Transaction:
┌────────────────────────────────────┐
│ ⚠️  Pending  │  🚩 Flagged (if set) │
│ Yellow/Gold │  Red                 │
└────────────────────────────────────┘

Completed Transaction:
┌────────────────────────────────────┐
│ ✅ Approved  │                      │
│ Green       │                      │
└────────────────────────────────────┘

Or with Flag:
┌────────────────────────────────────┐
│ ✅ Approved  │  🚩 Flagged          │
│ Green       │  Red                 │
└────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

### Filter & Pagination Flow
```
┌──────────────────────────────────────────────┐
│ User Action                                  │
│ (Select filters, search, click page)        │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ Filter State Updated (React State)           │
│ - email, status, flagged, min/max, dates    │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ Router.get(route, {filters, page})          │
│ Sends query parameters to backend           │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ Controller.withdrawals(Request $request)     │
│ - Builds query with scopes                  │
│ - Applies all filters                       │
│ - Paginates results                         │
│ - Transforms data for React                 │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ Inertia Response                             │
│ - withdrawals[]                             │
│ - pagination metadata                       │
│ - current filters                           │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ Component Renders                            │
│ - Table with filtered data                  │
│ - Updated pagination                        │
│ - Filter state preserved                    │
└──────────────────────────────────────────────┘
```

---

## 📝 Form Submission Flow

```
┌─────────────────────────────────────────────┐
│ Admin Fills Form:                           │
│ 1. Transaction Code: "TRX-12345-ABC"        │
│ 2. Comments: "Verified and processed"      │
│ 3. [Click Complete Process]                │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ Form Validation (Client-side)               │
│ - Checks fields are not empty               │
│ - Validates data format                     │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ Send PUT Request                            │
│ PUT /pay/.../id                             │
│ Headers: CSRF Token, Content-Type: JSON     │
│ Body: {                                     │
│   transaction_code: "TRX-12345-ABC",       │
│   comments: "Verified and processed",      │
│   flagged: false                           │
│ }                                           │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ Controller.updateWithdrawal()                │
│ - Validates authentication                  │
│ - Validates withdrawal exists               │
│ - Updates record with new data              │
│ - **Auto-checks:** If BOTH code AND         │
│   comments provided →                       │
│   Status = 'complete'                       │
│   Admin ID = auth()->id()                   │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ Return Success Response                     │
│ {                                           │
│   success: true,                           │
│   message: "Withdrawal updated...",        │
│   withdrawal: {updated data}               │
│ }                                           │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ React Component Handles Response             │
│ - Shows success feedback message            │
│ - setIsSubmitting(false)                    │
│ - Waits 1.5 seconds                         │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ Auto-redirect to Index                      │
│ router.get(route('pay.withdrawals'))       │
│ - Takes admin back to list                  │
│ - Shows updated withdrawal                  │
│ - Filters are preserved                     │
└─────────────────────────────────────────────┘
```

---

## 🚩 Flag Toggle Flow

```
Before Flag Toggle:
┌──────────────────┐
│ 🚩 Flag for Review│  flagged = false
└──────────────────┘
        │
        │ Click button
        ▼
[Loading...]
        │
        │ POST request
        ▼
Controller toggles: true
        │
        ▼
After Flag Toggle:
┌──────────────────┐
│ 🚩 Unflag       │  flagged = true (now red)
└──────────────────┘

Success message shows
Flag status updates in UI
Can now filter by this flag
```

---

## 📱 Responsive Behavior

### Mobile View (< 768px)
```
┌─────────────────────┐
│ Withdrawals         │
│ [New request]       │
├─────────────────────┤
│ 🔍 [search]         │
│ [Filters ▼]         │
│ Showing 1-15 of 42  │
├─────────────────────┤
│ John Smith          │
│ john@ex.com         │
│ $1,250 | Pending    │
│ [View ▶]            │
├─────────────────────┤
│ Jane Doe            │
│ jane@ex.com         │
│ $3,500 | Approved   │
│ [View ▶]            │
├─────────────────────┤
│ [◄] [1][2][3] [►]   │
└─────────────────────┘
```

### Tablet View (768px - 1024px)
```
Half-width columns visible
Filters show in 2-column layout
Table shows all columns except some details
```

### Desktop View (> 1024px)
```
Full 7-column layout
Advanced filter panel 4-column
All details visible
Optimal spacing
```

---

## 🎨 Color Scheme

```
Status Colors:
┌─────────────────────────────────┐
│ Pending:   bg-yellow-100        │
│            text-yellow-800      │
│ ────────────────────────────   │
│ Complete:  bg-emerald-100       │
│            text-emerald-800     │
│ ────────────────────────────   │
│ Flagged:   bg-red-100           │
│            text-red-800         │
└─────────────────────────────────┘

Component Colors:
├─ Primary Button: bg-primary
├─ Hover State: opacity-90
├─ Input Border: border-input
├─ Muted BG: bg-muted
├─ Card BG: bg-card
└─ Text: text-muted-foreground
```

---

## 📊 Pagination Display

### At Page 1
```
Page 1 of 3  [◄ Previous] [1] [2] [3] [Next ►]
             (disabled)           (active)

Results: 1-15 of 42 withdrawals
```

### At Page 2
```
Page 2 of 3  [◄ Previous] [1] [2] [3] [Next ►]
             (active)      (active)

Results: 16-30 of 42 withdrawals
```

### At Page 3 (Last)
```
Page 3 of 3  [◄ Previous] [1] [2] [3] [Next ►]
                                 (active) (disabled)

Results: 31-42 of 42 withdrawals
```

---

## ✨ Interactive Elements

### Search Bar
- Real-time input
- Enter key triggers search
- Email partial match
- Clears on filter clear

### Filter Dropdowns
- Status: All, Pending, Complete
- Flagged: All, Flagged, Not Flagged
- Both show current selection

### Date Pickers
- HTML5 date input
- Format: YYYY-MM-DD
- Can pick range
- Both required for filtering

### Amount Inputs
- Number type
- Min and max values
- Can enter decimals
- Validates positive values

### Action Buttons
- View Detail (in table)
- Submit Form (in detail)
- Apply Filters (in filter panel)
- Clear Filters (conditional)
- Toggle Flag (in detail)
- Back Button (navigation)

---

## 🔍 Empty States

### No Withdrawals
```
┌─────────────────────────────────┐
│ Withdrawals                     │
│ ────────────────────────────    │
│                                │
│  No withdrawals found matching │
│  your filters.                 │
│                                │
└─────────────────────────────────┘
```

### No Search Results
```
Same as above when:
- Email doesn't match any users
- Filters return zero results
- Date range has no transactions
```

---

**Visual Guide Complete** ✅  
All UI layouts, flows, and interactions documented.
