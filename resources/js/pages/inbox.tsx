import React, { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { motion } from 'framer-motion';
import { Button } from '@headlessui/react';

// Simple toast component
function Toast({ title, message, onClose }: { title?: string; message: string; onClose?: () => void }) {
    useEffect(() => {
        const id = setTimeout(() => onClose && onClose(), 4000);
        return () => clearTimeout(id);
    }, []);
    return (
        <div className="fixed top-6 right-6 z-50 max-w-sm w-full">
            <div className="flex items-start gap-4 p-4 rounded-lg shadow-lg bg-green-50 ring-1 ring-black/5">
                <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">✓</div>
                <div className="flex-1">
                    {title && <div className="font-semibold text-sm mb-1">{title}</div>}
                    <div className="text-sm">{message}</div>
                </div>
                <button onClick={() => onClose && onClose()} className="text-gray-500">✕</button>
            </div>
        </div>
    );
}

type Game = {
    id: number;
    game_name_category: string;
    name_of_the_game: string;
    path_to_the_game_image: string | null;
    status: boolean;
    number_of_players_allowed: number;
    created_at: string;
    channel_id: number;
};

export default function Inbox() {
    const { props } = usePage<any>();
    const flash = props.flash || {};
    const [toast, setToast] = useState<{ title?: string; message: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'active' | 'ended'>('active');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmTarget, setConfirmTarget] = useState<{ id: number; name?: string } | null>(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const paginated = props.games || null; // Fixed typo/redundancy

    // Normalise data safely
    const games: Game[] = paginated?.data ?? [];
    const pagination = paginated ?? {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: games.length,
        links: [],
        prev_page_url: null,
        next_page_url: null,
    };

    console.log('games', games);

    useEffect(() => {
        if (flash.success) {
            setToast({ title: 'Success', message: flash.success });
        } else if (flash.error) {
            setToast({ title: 'Error', message: flash.error });
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={[{ title: 'Inbox', href: '/inbox' }]}>
            <Head title="Inbox">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
            </Head>
            {toast && <Toast title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
            <div className="flex flex-col min-h-screen bg-background">
                <header className="flex items-center justify-between border-b border-border px-4 sm:px-6 md:px-8 py-4 bg-card shadow-sm">
                    <h1 className="text-2xl font-bold text-foreground">
                        Play<span className="text-primary">or</span>Pay
                    </h1>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="relative w-32 sm:w-64">
                            {/* <input
                                className="w-full rounded-2xl border border-border bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background text-foreground placeholder:text-muted-foreground"
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                <span className="material-symbols-outlined">search</span>
                            </span> */}
                        </div>
                        {/* <Link href="games/game-preferences" className="flex items-center justify-center gap-2 rounded-full bg-primary px-4 sm:px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                            <span className="hidden sm:inline">Create Game</span>
                        </Link> */}
                    </div>
                </header>

                <main className="relative flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6">
                    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                        <div className="absolute -top-24 -right-16 h-56 w-56 rounded-full bg-primary/10 blur-2xl animate-pulse"></div>
                        <div className="absolute top-1/3 -left-20 h-64 w-64 rounded-full bg-red-500/10 blur-3xl animate-pulse [animation-delay:400ms]"></div>
                        <div className="absolute bottom-10 right-1/4 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-2xl animate-pulse [animation-delay:800ms]"></div>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-lg font-semibold text-foreground mb-4">Your games</h2>

                        {/* Tabs */}
                        <div className="mb-6 inline-flex items-center gap-1 rounded-full bg-muted p-1">
                            <button onClick={() => setActiveTab('active')} className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeTab === 'active' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Active</button>
                            <button onClick={() => setActiveTab('ended')} className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeTab === 'ended' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Ended</button>
                        </div>

                        {games.filter(g => activeTab === 'active' ? g.status === true : g.status === false).length === 0 ? (
                            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined">inbox</span>
                                </div>
                                No games found.
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {games.filter(g => activeTab === 'active' ? g.status === true : g.status === false).map((g, idx) => {
                                    const createdAt = g.created_at ? new Date(g.created_at).getTime() : 0;
                                    const isNew = (Date.now() - createdAt) <= 3 * 60 * 1000; // within last 3 minutes

                                    return (
                                        <motion.li
                                            key={g.id}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: Math.min(idx * 0.03, 0.25) }}
                                            className="group"
                                        >
                                            <div className="rounded-2xl p-[1px] bg-gradient-to-b from-primary/30 via-border/40 to-transparent">
                                                <div className={`block p-4 sm:p-5 flex items-center gap-4 rounded-2xl bg-card border border-border shadow-md ${isNew ? 'ring-2 ring-green-400/25 shadow-lg' : ''}`}>
                                                <div className="relative flex-shrink-0">
                                                    <img
                                                        alt={g.name_of_the_game}
                                                        src={g.path_to_the_game_image ?? '/images/default-game.png'}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg object-cover border border-border"
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="truncate flex-1">
                                                            <p className="font-semibold text-base sm:text-lg text-foreground truncate">{g.name_of_the_game}</p>
                                                            <p className="text-xs text-muted-foreground truncate">{g.game_name_category}</p>
                                                        </div>
                                                        <div className="flex flex-col items-end shrink-0">
                                                            <span className={`${"text-sm font-medium"} ${g.status ? 'text-primary' : 'text-muted-foreground'}`}>{g.status ? 'Active' : 'Inactive'}</span>
                                                            <span className="text-xs text-muted-foreground">{new Date(g.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 flex items-center gap-3">
                                                        {
                                                            // only show action buttons for active games
                                                            g.status && (
                                                                <>
                                                                    <a
                                                                        href={`/games/join?game_id=${g.id}&channel_id=${(g as any).channel_id ?? ''}`}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1 text-sm font-medium text-foreground transition"
                                                                    >
                                                                        View
                                                                    </a>
    

                                                                    <Button
                                                                        className="inline-flex items-center gap-2 rounded-md bg-destructive text-destructive-foreground px-3 py-1 text-sm font-medium transition"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setConfirmTarget({ id: g.id, name: g.name_of_the_game });
                                                                            setConfirmOpen(true);
                                                                        }}
                                                                    >
                                                                        End Game
                                                                    </Button>
                                                                </>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.li>
                                    );
                                })}
                            </ul>
                        )}

                        {/* Confirmation modal */}
                        {confirmOpen && confirmTarget && (
                            <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
                                <div className="rounded-2xl border border-border bg-card shadow-2xl max-w-md w-full p-6">
                                    <h3 className="text-lg font-semibold ">End game</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">Are you sure you want to end "{confirmTarget.name}"? This action will mark the game as inactive and cannot be undone.</p>
                                    <div className="mt-6 flex justify-end gap-3">
                                        <button onClick={() => { setConfirmOpen(false); setConfirmTarget(null); }} className="px-4 py-2 rounded-md bg-muted text-foreground">Cancel</button>
                                        <button
                                            onClick={async () => {
                                                setConfirmLoading(true);
                                                const params = new URLSearchParams({ gameID: String(confirmTarget.id) }).toString();
                                                try {
                                                    await router.get(`${route('games.endGame')}?${params}`);
                                                } finally {
                                                    setConfirmLoading(false);
                                                    setConfirmOpen(false);
                                                    setConfirmTarget(null);
                                                }
                                            }}
                                            className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground"
                                            disabled={confirmLoading}
                                        >
                                            {confirmLoading ? 'Ending…' : 'End game'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <nav className="mt-6 flex items-center justify-between" aria-label="Pagination">
                            <div className="text-sm text-muted-foreground">Showing {(pagination.current_page - 1) * pagination.per_page + 1} - {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total}</div>

                            <div className="flex items-center gap-2">
                                <Link
                                    href={pagination.prev_page_url || '#'}
                                    className={`inline-flex items-center px-3 py-2 rounded-md border border-border text-sm font-medium ${!pagination.prev_page_url ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </Link>

                                {pagination.links?.map((link: any, idx: number) => {
                                    if (!link || (link.label.includes('Previous') || link.label.includes('Next'))) return null;
                                    if (!link.url && !link.active) return null;
                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${link.active ? 'bg-primary text-primary-foreground' : 'border border-border text-foreground'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}

                                <Link
                                    href={pagination.next_page_url || '#'}
                                    className={`inline-flex items-center px-3 py-2 rounded-md border border-border text-sm font-medium ${!pagination.next_page_url ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </Link>
                            </div>
                        </nav>

                    </div>
                </main>
            </div>
        </AppLayout>
    );
}