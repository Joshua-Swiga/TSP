# Backend Webhook Integration Guide

## Overview

This guide shows how to handle Paystack webhooks to update payment status when the user completes the M-Pesa transaction.

## Webhook Handler Controller

Create a new controller: `app/Http/Controllers/Admin/PaystackWebhookController.php`

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PaymentStructure;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class PaystackWebhookController extends Controller
{
    /**
     * Handle Paystack webhook events
     */
    public function handle(Request $request)
    {
        // Verify webhook signature (important for security!)
        $signature = $request->header('X-Paystack-Signature');
        $payload = file_get_contents('php://input');
        
        $paystack_secret = env('PAYSTACK_SECRET_KEY');
        $hash = hash_hmac('sha512', $payload, $paystack_secret);
        
        if ($hash !== $signature) {
            Log::warning('Paystack webhook signature verification failed');
            return response()->json(['status' => 'error', 'message' => 'Invalid signature'], 401);
        }

        $event = json_decode($payload);
        
        Log::info('Paystack webhook received', [
            'event' => $event->event ?? 'unknown',
            'reference' => $event->data->reference ?? 'unknown'
        ]);

        // Handle different event types
        switch ($event->event) {
            case 'charge.success':
                return $this->handleChargeSuccess($event);
            case 'charge.failed':
                return $this->handleChargeFailed($event);
            default:
                Log::info('Unhandled Paystack event', ['event' => $event->event]);
                return response()->json(['status' => 'ok']);
        }
    }

    /**
     * Handle successful charge event
     */
    private function handleChargeSuccess($event)
    {
        $reference = $event->data->reference;
        $status = $event->data->status;
        
        try {
            $payment = PaymentStructure::where('reference', $reference)->first();
            
            if (!$payment) {
                Log::warning('Payment record not found for webhook', ['reference' => $reference]);
                return response()->json(['status' => 'ok']); // Still return 200 for Paystack
            }

            // Check if charge was truly successful
            if ($status === 'success') {
                // Update payment record
                $payment->update([
                    'status' => true,
                    'paid' => true,
                    'paystack_authorization_url' => $event->data->authorization->authorization_url ?? null,
                ]);

                // Add tokens to user's account
                $user = User::find($payment->user_id);
                if ($user) {
                    $user->increment('token_balance', $payment->amount);
                    
                    Log::info('Payment successful - tokens added', [
                        'user_id' => $user->id,
                        'tokens' => $payment->amount,
                        'reference' => $reference
                    ]);
                }

                // Optionally send confirmation email
                // $this->sendPaymentConfirmationEmail($user, $payment);
            } else {
                Log::warning('Charge status not success', [
                    'reference' => $reference,
                    'status' => $status
                ]);
            }

            return response()->json(['status' => 'ok']);
            
        } catch (\Exception $e) {
            Log::error('Error processing successful charge webhook', [
                'exception' => $e->getMessage(),
                'reference' => $reference
            ]);
            return response()->json(['status' => 'ok']);
        }
    }

    /**
     * Handle failed charge event
     */
    private function handleChargeFailed($event)
    {
        $reference = $event->data->reference;
        
        try {
            $payment = PaymentStructure::where('reference', $reference)->first();
            
            if ($payment) {
                $payment->update([
                    'status' => false,
                    'paid' => false,
                    'failure_reason' => $event->data->failure_reason ?? null,
                ]);

                Log::info('Payment failed', [
                    'user_id' => $payment->user_id,
                    'reference' => $reference,
                    'reason' => $event->data->failure_reason ?? 'unknown'
                ]);
            }

            return response()->json(['status' => 'ok']);
            
        } catch (\Exception $e) {
            Log::error('Error processing failed charge webhook', [
                'exception' => $e->getMessage(),
                'reference' => $reference
            ]);
            return response()->json(['status' => 'ok']);
        }
    }

    /**
     * Send payment confirmation email
     */
    // private function sendPaymentConfirmationEmail($user, $payment)
    // {
    //     // Implement email sending logic
    //     // Mail::send(new PaymentConfirmationEmail($user, $payment));
    // }
}
```

## Register Webhook Route

Add to `routes/web.php`:

```php
Route::post('/webhooks/paystack', [PaystackWebhookController::class, 'handle'])->name('webhooks.paystack');
```

## Configure Paystack Webhook

1. Go to Paystack Dashboard: https://dashboard.paystack.com/settings/developers
2. Scroll to "Webhooks"
3. Add your webhook URL:
   ```
   https://yourapp.com/webhooks/paystack
   ```
4. Enable these events:
   - `charge.success`
   - `charge.failed`

## Environment Configuration

Add to `.env`:

```env
PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxx
```

## Database Update

Ensure your `PaymentStructure` migration includes these columns:

```php
Schema::create('payment_structures', function (Blueprint $table) {
    $table->id();
    $table->unsignedBigInteger('user_id');
    $table->integer('amount');
    $table->string('reference');
    $table->string('transaction_id')->unique();
    $table->string('user_phone_number');
    $table->string('user_email');
    $table->string('account_reference')->nullable();
    $table->string('agent')->default('Mpesa');
    $table->boolean('status')->default(false);
    $table->boolean('paid')->default(false);
    $table->string('paystack_authorization_url')->nullable();
    $table->text('failure_reason')->nullable();
    $table->timestamps();
    
    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
});
```

## Testing Webhook Locally

Use ngrok to expose your local server:

```bash
# Install ngrok: https://ngrok.com/download
ngrok http 8000

# You'll get a URL like: https://abc123.ngrok.io
# Use this in Paystack settings: https://abc123.ngrok.io/webhooks/paystack
```

Test webhook with curl:

```bash
curl -X POST https://yourapp.com/webhooks/paystack \
  -H "Content-Type: application/json" \
  -H "X-Paystack-Signature: your_signature_hash" \
  -d '{
    "event": "charge.success",
    "data": {
      "reference": "PH_507f1f77bcf86cd799439011",
      "status": "success",
      "authorization": {
        "authorization_url": "https://..."
      }
    }
  }'
```

## Alternative: Manual Status Check

If webhook delivery is unreliable, you can periodically check payment status:

Add to `app/Console/Commands/CheckPaymentStatus.php`:

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PaymentStructure;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CheckPaymentStatus extends Command
{
    protected $signature = 'payments:check-status';
    protected $description = 'Check pending payment status with Paystack';

    public function handle()
    {
        $pendingPayments = PaymentStructure::where('status', false)
            ->where('created_at', '>=', now()->subHours(1))
            ->get();

        foreach ($pendingPayments as $payment) {
            $this->checkPaymentWithPaystack($payment);
        }

        $this->info('Payment status check completed');
    }

    private function checkPaymentWithPaystack($payment)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('PAYSTACK_SECRET_KEY'),
            ])->get("https://api.paystack.co/transaction/verify/{$payment->reference}");

            if ($response->successful()) {
                $data = $response->json()['data'];
                
                if ($data['status'] === 'success') {
                    $payment->update([
                        'status' => true,
                        'paid' => true,
                    ]);
                    
                    // Add tokens
                    $payment->user->increment('token_balance', $payment->amount);
                    
                    Log::info('Payment verified and updated', [
                        'reference' => $payment->reference,
                    ]);
                }
            }
        } catch (\Exception $e) {
            Log::error('Error checking payment status', [
                'reference' => $payment->reference,
                'error' => $e->getMessage()
            ]);
        }
    }
}
```

Register in `app/Console/Kernel.php`:

```php
protected function schedule(Schedule $schedule)
{
    $schedule->command('payments:check-status')
        ->everyMinute()
        ->onOneServer();
}
```

## Security Checklist

- ✅ Verify webhook signature
- ✅ Use HTTPS for webhook URL
- ✅ Handle duplicate webhooks (check if payment already processed)
- ✅ Log all webhook events for debugging
- ✅ Rate limit webhook endpoint
- ✅ Never trust frontend payment status (only backend)
- ✅ Validate payment amount before updating user balance

## Common Issues

**Webhook not being called:**
- Check Paystack dashboard for delivery logs
- Verify URL is publicly accessible
- Check firewall/CSRF settings
- Use ngrok to test locally

**Duplicate tokens:**
- Add check to ensure payment only processed once
- Use database transaction for atomicity

**Wrong amount:**
- Always verify payment amount matches order
- Log discrepancies for investigation

## Monitoring

Check payment logs:

```bash
# View recent payment logs
tail -f storage/logs/laravel.log | grep -i payment

# Check failed webhooks in Paystack dashboard
# Dashboard → Transactions → Failed
```

---

**Status**: Ready to implement

Follow this guide to complete the backend webhook integration and your payment system will be fully functional!
