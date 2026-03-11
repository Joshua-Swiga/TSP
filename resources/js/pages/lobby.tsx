import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState, useEffect } from 'react';
import GameCard from '@/components/game/GameCard';
import LobbyFilters from '@/components/game/LobbyFilters';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Users, Zap, TrendingUp, Clock, Filter, RefreshCw } from 'lucide-react';

type Game = React.ComponentProps<typeof GameCard>['game'] & { channelId?: string | null };

// Helper to map server-side game record to the GameCard shape
function mapServerGame(g: any): Game {
    return {
        id: String(g.id),
        title: g.name_of_the_game || g.title || 'Game',
        subtitle: g.game_name_category || undefined,
        thumbnail: g.path_to_the_game_image || undefined,
        // include channel id so client can send it when joining
        channelId: g.channel_id ?? null,
        // ensure status is one of 'open' | 'in_progress' | 'finished'
        status:
            g.status === 'open' || g.status === 'in_progress' || g.status === 'finished'
                ? g.status
                : 'open',
        players: g.number_of_players_allowed ?? 0,
        // DB doesn't include bet/viewers — provide sensible defaults
        bet: (g.bet ?? 0) as number,
        viewers: g.viewers ?? 0,
    };
}

export default function Lobby() {
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState<'all' | 'open' | 'in_progress' | 'finished'>('all');
    const [loading, setLoading] = useState(false);
    const [joiningId, setJoiningId] = useState<string | null>(null);
    const [joinError, setJoinError] = useState<string | null>(null);

    // Get server-provided games from Inertia props
    const { props } = usePage<any>();

    // If server attached an error (e.g., questions not found), show it in the banner
    useEffect(() => {
        const pageError = props.error ?? null;
        if (pageError) setJoinError(String(pageError));
    }, [props.error]);
    console.log('props', props)
    const paginator = props.games ?? null;
    const serverGames = Array.isArray(paginator?.data) ? (paginator.data as any[]) : (paginator ?? []);
    console.log('serverGames', paginator)
    const initialFilters = props.filters ?? {};

    // Fallback MOCK if server didn't provide games
    const MOCK: Game[] = Array.from({ length: 8 }).map((_, i) => ({
        id: String(i + 1),
        title: `Quick Match ${i + 1}`,
        subtitle: i % 2 === 0 ? 'Casual • 3 rounds' : 'Ranked • 5 rounds',
        thumbnail: undefined,
        status: i % 3 === 0 ? 'open' : i % 3 === 1 ? 'in_progress' : 'finished',
        players: Math.floor(Math.random() * 6) + 1,
        bet: (Math.floor(Math.random() * 50) + 5) * 10,
        viewers: Math.floor(Math.random() * 20),
    }));

    const mappedServerGames: Game[] = serverGames.map(mapServerGame);

    const allGames = mappedServerGames;

    const games = useMemo(() => {
        const q = query.trim().toLowerCase();
        return allGames.filter(
            (g: Game) =>
                (status === 'all' ? true : g.status === status) &&
                (!q || g.title.toLowerCase().includes(q) || (g.subtitle || '').toLowerCase().includes(q))
        );
    }, [query, status, allGames]);

    function onJoin(g: Game) {
    if (joiningId) return;
    setJoiningId(String(g.id));

    // Build query params
    const queryParams = new URLSearchParams({
        game_id: String(g.id),
        channel_id: String((g as any).channelId ?? ''),
    }).toString();

    router.get(`${route('games.join')}?${queryParams}`, {}, {
        onError: (errors) => {
            // Show a professional inline error instead of alert
            setJoinError('We are currently experiencing an issue joining that game. Please try a different game.');
        },
        onFinish: () => {
            // Allow retry
            setJoiningId(null);
        },
    });
}


    function onWatch(g: Game) {
        alert(`Watching ${g.title}`);
    }

    // Function to handle refresh (toggle loading for demo; in production, fetch new data via Inertia router)
    const handleRefresh = () => {
        setLoading(true);
        // Simulate refresh delay
        setTimeout(() => setLoading(false), 1500);
    };

    return (
        <AppLayout>
            <Head title="Games Lobby" />

            <div className="min-h-screen bg-[#FDFDFC] dark:bg-[#0a0a0a]">
                {/* Hero Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#1b1b18] via-[#1b1b18]/95 to-[#1b1b18]/90 dark:from-[#EDEDEC] dark:via-[#EDEDEC]/95 dark:to-[#EDEDEC]/90">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-pink-500/10"></div>
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center animate-fade-in-up">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 dark:bg-[#1b1b18]/10 backdrop-blur-sm mb-6">
                                <Zap className="w-8 h-8 text-white dark:text-[#1b1b18]" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white dark:text-[#1b1b18] mb-4">
                                Games{' '}
                                <span className="text-red-400 dark:text-red-600 relative">
                                    Lobby
                                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-shimmer"></div>
                                </span>
                            </h1>
                            <p className="text-xl text-white/80 dark:text-[#1b1b18]/80 max-w-3xl mx-auto leading-relaxed">
                                Enter the arena where challenges come alive. Join live games, create your own, or watch the action unfold.
                                <span className="font-semibold text-white dark:text-[#1b1b18]"> Every game has real stakes.</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                    {/* Action Bar */}
                    <div className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-400">
                        {/* Centered Create button — full width on small screens, fixed larger width on bigger screens */}
                        <div className="w-full sm:w-auto flex justify-center">
                            <Button asChild className="w-full sm:w-64 md:w-72 lg:w-80 px-6 py-3 rounded-2xl shadow-lg bg-[#1b1b18] dark:bg-[#EDEDEC] text-white dark:text-[#1b1b18] transition-transform transform hover:-translate-y-0.5 active:translate-y-0 duration-200">
                                <a href="game-preferences" className="flex items-center justify-center gap-2 font-semibold">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Game
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Enhanced Filters */}
                    <div className="mb-8 animate-fade-in-up delay-600">
                        <LobbyFilters
                            query={query}
                            setQuery={setQuery}
                            status={status}
                            setStatus={setStatus}
                            initialFilters={initialFilters}
                        />
                    </div>

                    {/* Enhanced Error Banner */}
                    {joinError && (
                        <div className="mb-8 animate-fade-in-up delay-800">
                            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl border border-red-200 dark:border-red-800 p-6 flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-red-500 text-white flex items-center justify-center flex-shrink-0">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-red-800 dark:text-red-200">Unable to join game</p>
                                        <p className="mt-2 text-red-700 dark:text-red-100">{joinError}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setJoinError(null)} 
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold transition-colors duration-200"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Games Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-fade-in-up delay-1000">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-80 bg-[#FDFDFC] dark:bg-[#0a0a0a] rounded-3xl border border-[#19140035] dark:border-[#3E3E3A] animate-pulse shadow-lg"
                                />
                            ))}
                        </div>
                    ) : games.length === 0 ? (
                        <div className="animate-fade-in-up delay-1000">
                            <div className="relative overflow-hidden bg-gradient-to-br from-[#FDFDFC] to-[#F5F5F3] dark:from-[#1a1a18] dark:to-[#0f0f0d] rounded-3xl border border-[#19140012] dark:border-[#3E3E3A]/40 shadow-lg">
                                {/* Decorative background elements */}
                                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-pink-500/5 dark:from-red-500/10 dark:via-transparent dark:to-pink-500/10"></div>
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 dark:bg-red-500/5 rounded-full blur-3xl"></div>
                                
                                {/* Content */}
                                <div className="relative px-6 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24 flex flex-col items-center justify-center text-center">
                                    {/* Icon */}
                                    <div className="mb-8 inline-flex items-center justify-center">
                                        <div className="relative w-32 h-32">
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/10 to-pink-500/10 dark:from-red-500/20 dark:to-pink-500/20 animate-pulse"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Zap className="w-16 h-16 text-[#1b1b18] dark:text-[#EDEDEC]" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Heading */}
                                    <h2 className="text-3xl sm:text-4xl font-black text-[#1b1b18] dark:text-[#EDEDEC] mb-4">
                                        No Games Available
                                    </h2>

                                    {/* Subheading */}
                                    <p className="text-lg text-[#1b1b18]/70 dark:text-[#EDEDEC]/70 max-w-2xl mb-6">
                                        There are no public games at the moment. Be the first to create one and invite others to play!
                                    </p>

                                    {/* Secondary message */}
                                    <p className="text-sm sm:text-base text-[#1b1b18]/60 dark:text-[#EDEDEC]/60 max-w-lg mb-10 leading-relaxed">
                                        Create a <span className="font-semibold">public game</span> to let anyone join, or start a <span className="font-semibold">private game</span> for you and your friends.
                                    </p>

                                    {/* Action buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto sm:justify-center">
                                        <Button asChild className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95">
                                            <Link href="game-preferences" className="flex items-center justify-center gap-2">
                                                <Plus className="h-5 w-5" />
                                                Create Game
                                            </Link>
                                        </Button>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-fade-in-up delay-1000">
                            {games.map((g, index) => (
                                <div key={g.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                    <GameCard
                                        game={g}
                                        onJoin={onJoin}
                                        onWatch={onWatch}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Enhanced Pagination */}
                    {paginator && (
                        <div className="mt-12 flex items-center justify-center gap-3 animate-fade-in-up delay-1200">
                            {paginator.current_page > 1 && (
                                <Button 
                                    variant="outline" 
                                    asChild 
                                    size="sm"
                                    className="border-[#19140035] dark:border-[#3E3E3A] text-[#1b1b18] dark:text-[#EDEDEC]"
                                >
                                    <Link href={`?page=${paginator.current_page - 1}`}>Previous</Link>
                                </Button>
                            )}

                            <div className="flex items-center gap-2">
                                {Array.from({ length: Math.min(paginator.last_page, 5) }).map((_, idx) => {
                                    const pageNum = idx + 1;
                                    const active = pageNum === paginator.current_page;
                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={active ? 'default' : 'outline'}
                                            size="sm"
                                            asChild
                                            className={active 
                                                ? "bg-[#1b1b18] dark:bg-[#EDEDEC] text-white dark:text-[#1b1b18]" 
                                                : "border-[#19140035] dark:border-[#3E3E3A] text-[#1b1b18] dark:text-[#EDEDEC]"
                                            }
                                        >
                                            <Link href={`?page=${pageNum}`}>{pageNum}</Link>
                                        </Button>
                                    );
                                })}
                            </div>

                            {paginator.current_page < paginator.last_page && (
                                <Button 
                                    variant="outline" 
                                    asChild 
                                    size="sm"
                                    className="border-[#19140035] dark:border-[#3E3E3A] text-[#1b1b18] dark:text-[#EDEDEC]"
                                >
                                    <Link href={`?page=${paginator.current_page + 1}`}>Next</Link>
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}