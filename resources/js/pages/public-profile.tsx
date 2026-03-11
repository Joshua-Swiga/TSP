import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';

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
    const { auth } = usePage<SharedData>().props;
    const [editing, setEditing] = useState(false);

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
    });

    const avatarUrl = auth.user.avatar || auth.user.photo || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgYAm_iJb7fb4qkFqZmXpq_NpLX2WNMfNCQHTfhVlZX942ixI_V3_TAZvX7I3FPONi1By2w8Zq4Pt_qamzdLhCUuhSoG77ytAfmph_L_B1x3O-qzhOdKj0ZTkJTcLhUtW7NuB1P63zqvPBGPD19eYU8qXWZ7rpzE_dzH5qaCro3Chlnx14yMlKXrHATIQ__5BjHmxgpbKc3kr2SYXPPDJmBilF_FKIZadrwnUcpjfQcY0vUzt9FFd6CClsTEZxaVfMIKz0wwE32-sQ';

    // demo metrics (replace with real props when available)
    const totalGames = 120;
    const gamesWon = 30;
    const gamesLost = 90;
    const tokens = 1500;

    // simple animated counters
    const [animatedGames, setAnimatedGames] = useState(0);
    const [animatedWins, setAnimatedWins] = useState(0);
    const [animatedLosses, setAnimatedLosses] = useState(0);
    const [animatedTokens, setAnimatedTokens] = useState(0);

    useEffect(() => {
        // animate counters up quickly
        const duration = 700;
        const start = performance.now();

        function tick(now: number) {
            const t = Math.min(1, (now - start) / duration);
            const ease = 1 - Math.pow(1 - t, 3);
            setAnimatedGames(Math.round(totalGames * ease));
            setAnimatedWins(Math.round(gamesWon * ease));
            setAnimatedLosses(Math.round(gamesLost * ease));
            setAnimatedTokens(Math.round(tokens * ease));
            if (t < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }, [totalGames, gamesWon, gamesLost, tokens]);

    const winRate = totalGames > 0 ? Math.round((gamesWon / totalGames) * 100) : 0;

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

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
                {/* profile hero (gradient) */}
                <div className="relative overflow-hidden rounded-2xl shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 to-rose-600 opacity-90" style={{ mixBlendMode: 'multiply' }} />
                    <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 bg-gradient-to-br from-white/80 to-white/50 dark:from-black/60 dark:to-black/40 rounded-2xl">
                        <div className="relative flex-shrink-0">
                            <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden ring-4 ring-white shadow-xl" style={{ backgroundImage: `url(${avatarUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                                <ProgressRing value={winRate} />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{auth.user.name}</h2>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">@{(auth.user.username || auth.user.handle || (auth.user.email || '').split('@')[0]).toString().replace(/\s+/g, '_')}</p>
                            <p className="text-sm text-gray-700/70 dark:text-white/60 mt-2">Member since {auth.user.created_at ? new Date(auth.user.created_at).toLocaleDateString() : '—'}</p>

                            <div className="mt-4 flex items-center justify-center md:justify-start gap-3">
                                <Button variant="ghost" size="sm" asChild>
                                    <a href={`#/messages/${auth.user.id}`} className="px-4 py-2">Message</a>
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                    <a href={`#/invite/${auth.user.id}`} className="px-4 py-2">Invite</a>
                                </Button>
                            </div>

                            <div className="mt-6 flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="text-xs text-gray-700/80 dark:text-white/80">Win rate</div>
                                    <div className="text-lg font-semibold text-white/90 dark:text-white">{winRate}%</div>
                                </div>
                                <div className="hidden md:block h-8 border-l border-white/20" />
                                <div className="flex items-center gap-3">
                                    <div className="text-xs text-gray-700/80 dark:text-white/80">Tokens</div>
                                    <div className="text-lg font-semibold text-white/90 dark:text-white">{animatedTokens.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-56">
                            <div className="bg-white/60 dark:bg-black/50 rounded-lg p-3 border border-white/20">
                                <div className="text-xs text-gray-700/80 dark:text-white/80">Quick stats</div>
                                <div className="mt-3 grid grid-cols-3 gap-2">
                                    <div className="text-center">
                                        <div className="text-sm font-bold text-gray-900 dark:text-white">{animatedGames}</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-300">Games</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm font-bold text-green-600">{animatedWins}</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-300">Wins</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm font-bold text-red-600">{animatedLosses}</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-300">Losses</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* tabs */}
                <div className="mt-8">
                    <div className="border-b border-primary/20">
                        
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <h3 className="text-xl font-bold text-black dark:text-white mb-4">Stats</h3>
                            <div className="flex items-center gap-3 mb-4 flex-wrap">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-background-dark/80 rounded-full border border-primary/10 shadow-sm">
                                    <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.431L24 9.748l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.596 0 9.748l8.332-1.73z"/></svg>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Top 10 Player</span>
                                </div>

                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-background-dark/80 rounded-full border border-primary/10 shadow-sm">
                                    <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.26L22 9.27l-5 4.73L18.2 22 12 18.27 5.8 22 7 14l-5-4.73 7.1-1.01L12 2z"/></svg>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Achievement: Clutch Wins</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { value: animatedGames, label: 'Total Games' },
                                    { value: animatedWins, label: 'Games Won' },
                                    { value: animatedLosses, label: 'Games Lost' },
                                    { value: animatedTokens, label: 'Tokens Earned', accent: true },
                                ].map((s) => (
                                    <div key={s.label} className="group bg-background-light dark:bg-background-dark border border-primary/20 rounded-lg p-4 text-center transform transition hover:-translate-y-1 hover:shadow-lg">
                                        <p className={`text-3xl font-bold ${s.accent ? 'text-primary' : 'text-black dark:text-white'}`}>{s.value}</p>
                                        <p className="text-sm text-black/60 dark:text-white/60">{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-black dark:text-white mb-4">Recent activity</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[{title:'Won Truth or Dare', opponent:'Liam Harper', date:'2023-08-15', tokens:'+100', result:'Won'}, {title:'Lost Spin the Bottle', opponent:'Olivia Bennett', date:'2023-08-14', tokens:'-50', result:'Lost'}, {title:'Won Never Have I Ever', opponent:'Ethan Walker', date:'2023-08-12', tokens:'+75', result:'Won'}].map((r) => (
                                        <div key={r.title} className="p-4 rounded-xl bg-white dark:bg-background-dark/80 border border-primary/10 shadow-sm hover:shadow-md transition">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{r.title}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">vs {r.opponent} • {r.date}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-sm font-bold ${r.result === 'Won' ? 'text-green-600' : 'text-primary'}`}>{r.tokens}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{r.result}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inline edit panel */}
                {editing && (
                    <div className="mt-6 p-6 bg-white dark:bg-background-dark/80 rounded-xl border border-primary/10">
                        <h3 className="text-lg font-semibold mb-4">Edit profile</h3>
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
                                <Button disabled={processing}>Save</Button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-neutral-600">Saved</p>
                                </Transition>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
