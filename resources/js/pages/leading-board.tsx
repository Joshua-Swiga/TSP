import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icon';
import { Search, ChevronDown, User, Star } from 'lucide-react';

type Player = {
    id: string;
    name: string;
    avatar: string;
    gamesWon: number;
    credit: number;
    online: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Leaderboard', href: '/leading-board' },
];

const SAMPLE_PLAYERS: Player[] = [
    { id: '1', name: 'Sophia', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-kz3dXzzTINbGxivODnrFpaPdXmUsIXKQgU2G7kSpiJ-Ckm0RJ_hIpIg5OzhagH9pqors5QY9Nj-UVtyzGkDqueCrroHGrmfqBaJwa4Vpre3iaDM6EaQVCogJu1HRsCHLBPCykK7HkmjuZQEFoBo6R3sfiA_7pRbVnBH_OTy7npKnMK62pk9_ogUJnR8Aa61tQtJ_9qqmzyMLGyHpXBNcpufo8k3EhUVHwSvw9YU3PcPBVYSmH1i5F9UnL-qPf5I9Ho8KFJGwQWq5', gamesWon: 150, credit: 5000, online: true },
    { id: '2', name: 'Ethan', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFhhWx6G1k_gGXTTB2LSsnKoAnl0Hw3PzSVYyZbptyWEdTDyLO9je8dloivKDhf_hhXuuMqLMQh27SeOTN54wbwR-K24WZCpibPDmJ4OcTZVsNBxuVQaNgAsGk6sOGebtv5ufdJGYxRaMxkbeT1G_Hez6Hce3fIuOWwsbmNTzgYCvrNvPzHEMXZjpE6ZKZ0DtqSIWE6BAckFSwbo9c7CVbMHla3BFcIuupR9-IJSgP_rZJA4B6SZdnd29-thu2IYp9pQOkAgeo708h', gamesWon: 120, credit: 4000, online: false },
    { id: '3', name: 'Olivia', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8iJWKfAS4r5YLFn3dM-3GqKX-ZICieOV2_yQPKfnniMTt6my4d-ZvCi3RQAPW5_Cdp-5woyu6Ojzlk6wenGWbdFgxmU1Yu9mjP9XciLX1araRs7y0Q1xMtMdjj3sAjC5AokiOwV97lJJoW865V3yeMYFF5gjnZbhAdp9DR-ggYfhzwKf-RltItPkrUBS5IB0feppL61GJXNLzdw6KFuAYGotaN6uID7OHuBg1ewOLvbShE6LHkvfP4JUnuHiZzW1cW_4v34CITSnU', gamesWon: 100, credit: 3500, online: true },
];

export default function LeadingBoard() {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');
    const [sortBy, setSortBy] = useState<'gamesWon' | 'credit'>('gamesWon');
    const [ascending, setAscending] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const players = useMemo(() => {
        let list = SAMPLE_PLAYERS.slice();
        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter((p) => p.name.toLowerCase().includes(q));
        }
        if (statusFilter !== 'all') {
            list = list.filter((p) => (statusFilter === 'online' ? p.online : !p.online));
        }
        list.sort((a, b) => {
            const aVal = sortBy === 'gamesWon' ? a.gamesWon : a.credit;
            const bVal = sortBy === 'gamesWon' ? b.gamesWon : b.credit;
            return ascending ? aVal - bVal : bVal - aVal;
        });
        return list;
    }, [query, statusFilter, sortBy, ascending]);

    function onRequestGame(p: Player) {
        // temporary client-side feedback — in a real app you'd call the backend
        alert(`Game request sent to ${p.name}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leaderboard" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3"><Star className="text-yellow-500" /> Leaderboard</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">See who's topping the charts. Filter, search and challenge players from here.</p>
                </div>

                {/* Top 3 hero */}
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {players.slice(0, 3).map((p, idx) => (
                        <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl shadow-sm bg-white dark:bg-background-dark/80 border border-gray-100 dark:border-gray-800 transform transition hover:-translate-y-1">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 ring-4 ring-white dark:ring-gray-900">
                                        <img src={p.avatar} alt={p.name} className="h-16 w-16 object-cover" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white rounded-full h-7 w-7 flex items-center justify-center text-sm font-semibold shadow-md">{idx === 0 ? '1' : idx === 1 ? '2' : '3'}</div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="text-lg font-semibold text-gray-900 dark:text-white">{p.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{p.gamesWon} wins • {p.credit.toLocaleString()} credits</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{idx === 0 ? 'Champion' : idx === 1 ? 'Runner-up' : '3rd'}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="rounded-xl border border-primary/10 dark:border-primary/20 bg-white dark:bg-background-dark/80 p-6 mb-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filter Opponents</h3>
                    <div className="flex items-center justify-between mb-4 sm:hidden">
                        <div className="text-sm text-gray-600 dark:text-gray-300">Filters</div>
                        <Button variant="default" size="sm" onClick={() => setShowFilters((s) => !s)}>{showFilters ? 'Hide' : 'Show'} Filters</Button>
                    </div>

                    <div className={showFilters ? 'block sm:block' : 'hidden sm:block'}> 
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                            <div className="relative">
                                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name" className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 pr-10 bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary/30" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><Search className="h-4 w-4" /></span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 bg-background-light dark:bg-background-dark focus:outline-none">
                                <option value="all">All</option>
                                <option value="online">Online</option>
                                <option value="offline">Offline</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort by</label>
                            <div className="flex gap-2">
                                <button onClick={() => setSortBy('gamesWon')} className={`px-3 py-2 rounded-lg ${sortBy === 'gamesWon' ? 'bg-primary text-white' : 'bg-transparent border border-gray-200 dark:border-gray-700'}`}>Games Won</button>
                                <button onClick={() => setSortBy('credit')} className={`px-3 py-2 rounded-lg ${sortBy === 'credit' ? 'bg-primary text-white' : 'bg-transparent border border-gray-200 dark:border-gray-700'}`}>Credit</button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Direction</label>
                            <button onClick={() => setAscending((s) => !s)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">Toggle <ChevronDown className={`inline-block ml-2 transform ${ascending ? '-rotate-180' : ''}`} /></button>
                        </div>
                        </div>
                    </div>
                </div>
                {/* Desktop table */}
                <div className="hidden sm:block overflow-hidden rounded-xl border border-primary/10 dark:border-primary/20 bg-white dark:bg-background-dark/80 shadow">
                    <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
                        <thead className="bg-background-light/50 dark:bg-background-dark/20">
                            <tr>
                                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Player</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Games Won</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Credit</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                                <th className="relative py-3.5 pl-3 pr-4 sm:pr-6" />
                            </tr>
                        </thead>

                        <tbody className="bg-white dark:bg-background-dark/80 divide-y divide-gray-50 dark:divide-gray-800">
                            {players.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                                                <img src={p.avatar} className="h-10 w-10 object-cover" alt={p.name} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">{p.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{p.gamesWon}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{p.credit.toLocaleString()}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {p.online ? (
                                            <span className="inline-flex items-center rounded-full bg-green-100/80 dark:bg-green-900/50 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">● Online</span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-gray-100/80 dark:bg-gray-700/50 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-300">Offline</span>
                                        )}
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                                        <Button variant="default" size="sm" onClick={() => onRequestGame(p)}>Request Game</Button>
                                        <Button variant="ghost" size="sm" asChild>
                                            <a href={`#/profile/${p.id}`} className="inline-flex">View Profile</a>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile cards */}
                <div className="sm:hidden mt-4 space-y-3">
                    {players.map((p) => (
                        <div key={p.id} className="p-4 bg-white dark:bg-background-dark/80 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transform transition hover:-translate-y-1 hover:shadow-lg">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                                        <img src={p.avatar} className="h-12 w-12 object-cover" alt={p.name} />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">{p.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{p.gamesWon} wins • {p.credit.toLocaleString()} credits</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{p.online ? 'Online' : 'Offline'}</div>
                                </div>
                            </div>

                            <div className="mt-3 flex gap-2">
                                <Button variant="default" size="sm" onClick={() => onRequestGame(p)} className="flex-1">Request</Button>
                                <Button variant="ghost" size="sm" asChild>
                                    <a href={`#/profile/${p.id}`} className="inline-flex">Profile</a>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
