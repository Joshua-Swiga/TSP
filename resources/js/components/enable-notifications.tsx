import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
// axios removed: use Inertia's post to keep `processing` state in sync
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from './ui/input';



export default function EnableNotifications() {
    // Initialize form with fields used across both steps
    const { data, setData, post, processing, reset, clearErrors } = useForm({ type: 'individual', phoneNumber: '', otp: '', context: 'notification', otp_sending: 'true' });
    const [open, setOpen] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [step, setStep] = useState<'enter-phone' | 'enter-otp' | 'success'>('enter-phone');
    const [message, setMessage] = useState<string | null>(null);

    // Helper to safely extract a field error from Inertia's unknown errors shape
    const getFieldError = (errors: unknown, field: string): string | undefined => {
        if (!errors || typeof errors !== 'object') return undefined;
        const record = errors as Record<string, unknown>;
        const val = record[field];
        if (!val) return undefined;
        if (typeof val === 'string') return val;
        if (Array.isArray(val)) return val.join(' ');
        return undefined;
    };

    

    // Send the notification to the backend. We use Inertia's post so `processing` reflects loading.
    const sendOTP: FormEventHandler = (e) => {
        e.preventDefault();
        setMessage(null);

        // ensure the form data contains the phoneNumber before posting
        setData('phoneNumber', phoneNumber);

        // Post to the backend endpoint that triggers the SMS send. The route name below
        // assumes your backend exposes a named route `otp.send`. If your route name differs,
        // change it accordingly on the server or here (do not change configuration settings).
        post(route('otp.send'), {
            preserveScroll: true,
            onBefore: () => {
                // `processing` from useForm will flip to true automatically
            },
            onSuccess: () => {
                // Skip the OTP step entirely — treat this as a one-shot send
                setStep('success');
                setMessage('Notification sent. You should receive the message shortly.');
                // Close modal after a short delay for better UX
                setTimeout(() => {
                    closeModal();
                }, 1400);
            },
            onError: (errors) => {
                const err = getFieldError(errors, 'phoneNumber') ?? getFieldError(errors, 'message');
                setMessage(err ?? 'Failed to send notification. Please try again.');
            },
            onFinish: () => {
                // keep phoneNumber in state so user can retry without retyping
            }
        });
    };

    // Alias sendNotification to the implemented sendOTP handler so the form submit handler
    // remains `sendNotification` in the JSX (preserves original variable name and minimal changes).
    const sendNotification: FormEventHandler = sendOTP;

    // Confirm OTP with backend
    const confirmOTP: FormEventHandler = (e) => {
        e.preventDefault();
        setMessage(null);

        post(route('otp.confirm'), {
            preserveScroll: true,
            onBefore: () => {},
            onSuccess: () => {
                setStep('success');
                setMessage('Notifications enabled successfully.');
                // Optionally close modal after a short delay
                setTimeout(() => {
                    closeModal();
                }, 1400);
            },
            onError: (errors) => {
                const err = getFieldError(errors, 'otp') ?? getFieldError(errors, 'message');
                setMessage(err ?? 'OTP did not match. Please try again.');
            },
            onFinish: () => {
                // keep otp field for potential retry
            }
        });
    };

    // ...existing code...

    const closeModal = () => {
        clearErrors();
        reset();
        setPhoneNumber('');
        setStep('enter-phone');
        setMessage(null);
        setOpen(false);
    };

    // Handle input changes: allow only digits and limit to 9 characters for phone
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cleaned = e.target.value.replace(/\D/g, '').slice(0, 9);
        setData('phoneNumber', cleaned);
        setPhoneNumber(cleaned);
    };

    // Handle OTP input (allow digits only and max 6)
    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cleaned = e.target.value.replace(/\D/g, '').slice(0, 6);
        setData('otp', cleaned);
    };

    useEffect(() => {
        const handler = () => setOpen(true);

        window.addEventListener('openEnableNotifications', handler);
        // attach a typed global for other code to open this dialog
        (window as Window & { __openEnableNotifications?: () => void }).__openEnableNotifications = handler;

        return () => {
            window.removeEventListener('openEnableNotifications', handler);
            delete (window as Window & { __openEnableNotifications?: () => void }).__openEnableNotifications;
        };
    }, []);

    return (
        <div className="space-y-6">
            <div className="space-y-4 rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-200/10 dark:bg-slate-700/10">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogTitle>Enable notifications?</DialogTitle>
                        <DialogDescription>
                            Enabling notifications will allow us to send you updates about matches, messages, and other important activity. Your personal information will not be shared.
                        </DialogDescription>

                        {message && (
                            <div className="mt-2 text-sm text-center text-red-600">{message}</div>
                        )}

                        {step === 'enter-phone' && (
                            <form className="space-y-6" onSubmit={sendNotification}>
                                <div>
                                    <Input
                                        type="text"
                                        name="phoneNumber"
                                        placeholder="phone number"
                                        value={phoneNumber}
                                        onChange={handlePhoneChange}
                                        inputMode="numeric"
                                        required
                                    />
                                    <p className="text-sm text-slate-500 mt-1">{phoneNumber.length}/9 digits</p>
                                </div>

                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <Button disabled={processing} variant="secondary" onClick={closeModal}>
                                            Cancel
                                        </Button>
                                    </DialogClose>

                                    <Button disabled={phoneNumber.length !== 9 || processing} type="submit">
                                        {processing ? 'Sending...' : 'Enable notifications'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        )}

                        {step === 'enter-otp' && (
                            <form className="space-y-6" onSubmit={confirmOTP}>
                                <div>
                                    <p className="text-sm text-slate-600">We've sent an OTP to {phoneNumber}. Enter it below to confirm.</p>
                                    <Input
                                        type="text"
                                        name="otp"
                                        placeholder="Enter OTP"
                                        value={data.otp}
                                        onChange={handleOtpChange}
                                        inputMode="numeric"
                                        required
                                    />
                                </div>

                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <Button disabled={processing} variant="secondary" onClick={closeModal}>
                                            Cancel
                                        </Button>
                                    </DialogClose>

                                    <Button disabled={data.otp.length < 4 || processing} type="submit">
                                        {processing ? 'Verifying...' : 'Verify OTP'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        )}

                        {step === 'success' && (
                            <div className="py-4 text-center">
                                <p className="text-green-600">{message}</p>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
