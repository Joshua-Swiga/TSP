<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Withdrawal Request - {{ $withdrawal->uuid }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            background-color: #f5f5f5;
        }
        
        .container {
            width: 100%;
            max-width: 900px;
            margin: 0 auto;
            background-color: white;
            padding: 40px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
        }
        
        .header h1 {
            color: #1e40af;
            font-size: 28px;
            margin-bottom: 5px;
        }
        
        .header p {
            color: #666;
            font-size: 14px;
        }
        
        .reference {
            text-align: center;
            margin-bottom: 30px;
            padding: 15px;
            background-color: #f0f9ff;
            border-left: 4px solid #2563eb;
        }
        
        .reference-label {
            font-size: 12px;
            color: #666;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .reference-value {
            font-size: 18px;
            color: #1e40af;
            font-weight: bold;
            margin-top: 5px;
            font-family: 'Courier New', monospace;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section-title {
            background-color: #1e40af;
            color: white;
            padding: 10px 15px;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 15px;
        }
        
        .row {
            display: flex;
            margin-bottom: 12px;
        }
        
        .col {
            flex: 1;
        }
        
        .col.half {
            flex: 0 0 48%;
            margin-right: 4%;
        }
        
        .col.half:nth-child(2n) {
            margin-right: 0;
        }
        
        .field-label {
            font-size: 12px;
            color: #666;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 4px;
        }
        
        .field-value {
            font-size: 14px;
            color: #333;
            line-height: 1.5;
        }
        
        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .status-complete {
            background-color: #ecfdf5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }
        
        .status-pending {
            background-color: #fef3c7;
            color: #92400e;
            border: 1px solid #fcd34d;
        }
        
        .amount-section {
            background-color: #f0f9ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .amount-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
        }
        
        .amount-row.total {
            border-top: 2px solid #2563eb;
            padding-top: 10px;
            margin-top: 15px;
            font-weight: 700;
            font-size: 16px;
        }
        
        .comments-box {
            background-color: #fafafa;
            padding: 15px;
            border-left: 4px solid #2563eb;
            border-radius: 4px;
            font-size: 13px;
            line-height: 1.6;
            min-height: 60px;
        }
        
        .comments-box.empty {
            color: #999;
            font-style: italic;
        }
        
        .processed-by {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 4px;
            margin-top: 20px;
            border-left: 4px solid #6b7280;
        }
        
        .processed-by-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .processed-by-value {
            font-size: 14px;
            color: #333;
            font-weight: 500;
        }
        
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #666;
            font-size: 11px;
        }
        
        .timestamp {
            color: #999;
            font-size: 12px;
            margin-top: 15px;
        }
        
        .flag-notice {
            background-color: #fee2e2;
            color: #991b1b;
            padding: 12px;
            border-radius: 4px;
            margin-top: 15px;
            border-left: 4px solid #dc2626;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Withdrawal Request</h1>
            <p>Official Document</p>
        </div>
        
        <!-- Reference Number -->
        <div class="reference">
            <div class="reference-label">Request ID</div>
            <div class="reference-value">{{ $withdrawal->uuid }}</div>
        </div>
        
        <!-- Applicant Information -->
        <div class="section">
            <div class="section-title">Applicant Information</div>
            <div class="row">
                <div class="col half">
                    <div class="field-label">Full Name</div>
                    <div class="field-value">{{ $user->name ?? 'N/A' }}</div>
                </div>
                <div class="col half">
                    <div class="field-label">Email Address</div>
                    <div class="field-value">{{ $user->email ?? 'N/A' }}</div>
                </div>
            </div>
            <div class="row">
                <div class="col half">
                    <div class="field-label">Phone Number</div>
                    <div class="field-value">{{ $user->phone ?? 'N/A' }}</div>
                </div>
                <div class="col half">
                    <div class="field-label">Account Balance</div>
                    <div class="field-value">₦{{ number_format((float)($user->balance ?? 0), 2) }}</div>
                </div>
            </div>
        </div>
        
        <!-- Withdrawal Details -->
        <div class="section">
            <div class="section-title">Withdrawal Details</div>
            
            <div class="amount-section">
                <div class="amount-row">
                    <span>Requested Amount:</span>
                    <span><strong>₦{{ number_format((float)$withdrawal->requested, 2) }}</strong></span>
                </div>
                <div class="amount-row">
                    <span>Processing Fee:</span>
                    <span><strong>₦{{ number_format((float)$withdrawal->fee, 2) }}</strong></span>
                </div>
                <div class="amount-row total">
                    <span>Net Amount (to be paid):</span>
                    <span>₦{{ number_format((float)$withdrawal->requested - (float)$withdrawal->fee, 2) }}</span>
                </div>
            </div>
            
            <div class="row">
                <div class="col half">
                    <div class="field-label">Withdrawal Method</div>
                    <div class="field-value">{{ ucfirst($withdrawal->method ?? 'Bank Transfer') }}</div>
                </div>
                <div class="col half">
                    <div class="field-label">Status</div>
                    <div class="field-value">
                        <span class="status-badge {{ $withdrawal->status === 'complete' ? 'status-complete' : 'status-pending' }}">
                            {{ $withdrawal->status === 'complete' ? 'Completed' : 'Pending' }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Request Timeline -->
        <div class="section">
            <div class="section-title">Request Timeline</div>
            <div class="row">
                <div class="col half">
                    <div class="field-label">Submitted Date</div>
                    <div class="field-value">{{ $withdrawal->created_at->format('M d, Y \a\t h:i A') ?? 'N/A' }}</div>
                </div>
                <div class="col half">
                    <div class="field-label">Last Updated</div>
                    <div class="field-value">{{ $withdrawal->updated_at->format('M d, Y \a\t h:i A') ?? 'N/A' }}</div>
                </div>
            </div>
        </div>
        
        <!-- Processing Notes -->
        @if ($withdrawal->comments)
        <div class="section">
            <div class="section-title">Processing Notes & Transaction Code</div>
            <div class="comments-box">
                {!! nl2br(e($withdrawal->comments)) !!}
            </div>
        </div>
        @endif
        
        <!-- Processed By Information -->
        @if ($withdrawal->status === 'complete' && $processedBy)
        <div class="processed-by">
            <div class="processed-by-label">Processed By</div>
            <div class="processed-by-value">{{ $processedBy->name ?? 'Administrator' }}</div>
            @if ($processedBy->email)
                <div class="field-label" style="margin-top: 8px;">Email</div>
                <div class="field-value">{{ $processedBy->email }}</div>
            @endif
        </div>
        @endif
        
        <!-- Flag Notice -->
        @if ($withdrawal->flagged)
        <div class="flag-notice">
            ⚠️ This request has been flagged for review. Please contact support for more information.
        </div>
        @endif
        
        <!-- Footer -->
        <div class="footer">
            <p>This is an official document of the Play or Pay platform.</p>
            <p style="margin-top: 10px;">Generated on: {{ now()->format('M d, Y \a\t h:i A') }}</p>
            <p class="timestamp">For inquiries, please contact our support team.</p>
        </div>
    </div>
</body>
</html>
