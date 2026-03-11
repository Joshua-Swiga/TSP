import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ChangeEvent, FormEventHandler, useEffect, useState } from 'react';
import axios, { Axios }from 'axios';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import AppLayout from '@/layouts/app-layout';
import { Gamepad2, Coins } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    email: string;
}

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const page = usePage<SharedData>();
    const { auth, gamesPlayed, totalTokensEarned } = page.props;
    const [editing, setEditing] = useState(false);

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
    });

    // Use backend-provided metrics when available
    const totalGames = Number(gamesPlayed ?? 0);
    const tokens = Number(auth.user.tokens);

    // simple animated counters
    const [animatedGames, setAnimatedGames] = useState(0);
    const [animatedTokens, setAnimatedTokens] = useState(0);
    const [withdrawOpen, setWithdrawOpen] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawError, setWithdrawError] = useState<string | null>(null);
    const [submittingWithdraw, setSubmittingWithdraw] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    useEffect(() => {
        // animate counters up quickly
        const duration = 700;
        const start = performance.now();

        function tick(now: number) {
            const t = Math.min(1, (now - start) / duration);
            const ease = 1 - Math.pow(1 - t, 3);
            setAnimatedGames(Math.round(totalGames * ease));
            setAnimatedTokens(Math.round(tokens * ease));
            if (t < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }, [totalGames, tokens]);

    useEffect(() => {
        if (toastMessage) {
            const timeout = setTimeout(() => setToastMessage(null), 4000);
            return () => clearTimeout(timeout);
        }
    }, [toastMessage]);

    const handleWithdrawAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        setWithdrawAmount(event.target.value);
        setWithdrawError(null);
    };

    const resetWithdrawState = () => {
        setWithdrawAmount('');
        setWithdrawError(null);
        setSubmittingWithdraw(false);
    };

    const handleWithdrawDialogChange = (open: boolean) => {
        setWithdrawOpen(open);
        if (!open) {
            resetWithdrawState();
        }
    };

    const parsedWithdrawAmount = Number(withdrawAmount);
    const isValidNumber = !Number.isNaN(parsedWithdrawAmount) && parsedWithdrawAmount > 0;
    const netAmount = isValidNumber ? Math.max(parsedWithdrawAmount * 0.8, 0) : 0;

    const handleWithdrawSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        const amount = Number(withdrawAmount);
        if (Number.isNaN(amount) || amount <= 0) {
            setWithdrawError('Enter a valid withdrawal amount.');
            return;
        }

        if (amount < 500) {
            setWithdrawError('Minimum withdrawal is 500 tokens.');
            return;
        }

        if (amount > tokens) {
            setWithdrawError('You cannot withdraw more than your available tokens.');
            return;
        }

        setSubmittingWithdraw(true);

        setTimeout(() => {
            setSubmittingWithdraw(false);
            axios.post('/pay/withdraw', {
                    phoneNumber: 'John',
                    tokens: formattedNetAmount,
                })
                .then((response: any) => {
                    console.log(response.data)
                    console.log(
                        'phoneNumber',
                        tokens 
                
                    )
                    setToastMessage('Your withdrawal request has been submitted and will be processed soon.');
            
                })
                .catch((error: any) => {
                    console.error(error)
                    setToastMessage('An error occurred while processing your withdrawal request.');
            })

            
            handleWithdrawDialogChange(false);
        }, 1000);
    };

    const formattedNetAmount = new Intl.NumberFormat().format(Math.floor(netAmount));
    const formattedTokens = new Intl.NumberFormat().format(tokens);

    function Toast({ message }: { message: string }) {
        return (
            <div className="fixed top-6 right-6 z-50 max-w-sm w-full">
                <div className="flex items-start gap-3 p-4 rounded-lg shadow-lg bg-green-50 ring-1 ring-black/5">
                    <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">✓</div>
                    <div className="flex-1 text-sm text-foreground">{message}</div>
                    <button onClick={() => setToastMessage(null)} className="text-gray-500 text-sm">
                        ✕
                    </button>
                </div>
            </div>
        );
    }

    // Small inline progress ring component
    function ProgressRing({ radius = 28, stroke = 6, value = 0 }: { radius?: number; stroke?: number; value: number }) {
        const normalizedRadius = radius - stroke * 0.5;
        const circumference = normalizedRadius * 2 * Math.PI;
        const strokeDashoffset = circumference - (value / 100) * circumference;

        return (
            <svg height={radius * 2} width={radius * 2} className="block">
                <defs>
                    <linearGradient id="g1" x1="0%" x2="100%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ec1313" />
                    </linearGradient>
                </defs>
                <circle stroke="#1118271A" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
                <circle
                    stroke="url(#g1)"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={`${circumference} ${circumference}`}
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 600ms ease' }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="text-xs font-semibold fill-current text-gray-900 dark:text-white" style={{ fontSize: 10 }}>{value}%</text>
            </svg>
        );
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            {toastMessage && <Toast message={toastMessage} />}

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
                {/* profile hero (gradient) */}
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 to-rose-600 opacity-90" style={{ mixBlendMode: 'multiply' }} />
                    <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 bg-gradient-to-br from-white/80 to-white/50 dark:from-black/60 dark:to-black/40 rounded-2xl">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-primary flex items-center justify-center text-2xl md:text-3xl font-bold text-primary-foreground shadow-md">
                                {auth.user.name[0].toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">{auth.user.name}</h2>
                                <p className="text-sm font-semibold text-muted-foreground mt-1">@{(auth.user.username || auth.user.handle || (auth.user.email || '').split('@')[0]).toString().replace(/\s+/g, '_')}</p>
                                <p className="text-sm text-muted-foreground mt-1">Member since {auth.user.created_at ? new Date(auth.user.created_at).toLocaleDateString() : '—'}</p>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-4 mt-4 md:mt-0">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <Coins className="h-5 w-5 text-white" />
                                    <div className="text-sm text-white/80">Tokens</div>
                                    <div className="text-lg font-semibold text-white">{animatedTokens.toLocaleString()}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button onClick={() => setEditing((s) => !s)} className="px-5 py-2 font-semibold rounded-full text-sm bg-white text-primary hover:bg-white/90 transition-colors">
                                    {editing ? 'Close' : 'Edit Profile'}
                                </Button>
                                <Dialog open={withdrawOpen} onOpenChange={handleWithdrawDialogChange}>
                                    <DialogTrigger asChild>
                                        <Button className="px-5 py-2 font-semibold rounded-full text-sm bg-white text-primary hover:bg-white/90 transition-colors">
                                            Withdraw Tokens
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Withdraw tokens</DialogTitle>
                                            <DialogDescription>Enter the number of tokens you would like to withdraw. You currently have {formattedTokens} tokens available.</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="withdraw-amount">Amount</Label>
                                                <Input
                                                    id="withdraw-amount"
                                                    type="number"
                                                    min={500}
                                                    step={50}
                                                    inputMode="numeric"
                                                    value={withdrawAmount}
                                                    onChange={handleWithdrawAmountChange}
                                                    placeholder="Enter amount (min 500)"
                                                    disabled={submittingWithdraw}
                                                />
                                                <InputError className="mt-2" message={withdrawError || undefined} />
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Net amount after 20% fee: <span className="font-semibold text-foreground">{isValidNumber ? formattedNetAmount : '—'} tokens</span>
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    type="submit"
                                                    disabled={submittingWithdraw}
                                                    className="bg-primary text-primary-foreground"
                                                >
                                                    {submittingWithdraw ? 'Submitting…' : 'Submit withdrawal'}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inline edit panel */}
                <Transition
                    show={editing}
                    enter="transition ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <div className="mt-6 p-6 bg-card rounded-xl border border-border shadow-md">
                        <h3 className="text-lg font-semibold mb-4 text-foreground">Edit profile</h3>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />
                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoComplete="username"
                                    placeholder="Email address"
                                />
                                <InputError className="mt-2" message={errors.email} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing} className="bg-primary text-primary-foreground">Save</Button>
                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-muted-foreground">Saved</p>
                                </Transition>
                            </div>
                        </form>
                    </div>
                </Transition>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-bold text-foreground mb-4">Stats</h3>
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                            {[
                                { value: animatedGames, label: 'Total Games', icon: <Gamepad2 className="h-8 w-8 mx-auto text-primary" /> },
                                { value: animatedTokens, label: 'Available tokens', icon: <Coins className="h-8 w-8 mx-auto text-primary" />, accent: true },
                            ].map((s) => (
                                <div
                                    key={s.label}
                                    className="group bg-card border border-border rounded-xl p-6 text-center shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                                >
                                    {s.icon}
                                    <p className={`text-4xl font-bold mt-2 ${s.accent ? 'text-primary' : 'text-foreground'}`}>{s.value}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-1">
                        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                            <h4 className="text-sm font-semibold text-foreground">Account</h4>
                            <p className="text-xs text-muted-foreground mt-2">Email</p>
                            <div className="text-sm font-medium text-foreground">{auth.user.email}</div>

                            {/* <div className="mt-6">
                                <h4 className="text-sm font-semibold text-foreground">Appearance</h4>
                                <div className="mt-2">
                                    <AppearanceToggleDropdown />
                                </div>
                            </div> */}
                            <div className="mt-6">
                                <h4 className="text-sm font-semibold text-foreground text-red-600">Danger Zone</h4>
                                <div className="mt-2">
                                    <DeleteUser />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}