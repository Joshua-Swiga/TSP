import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icon';
import { Frown, Repeat, Share2, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Game', href: '/games' },
    { title: 'You lost', href: '/game-lost' },
];

export default function GameLost() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(t);
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Match result" />

            <div className="min-h-screen flex items-start justify-center py-12 px-6">
                <div className="w-full max-w-4xl">
                    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/95 to-white/90 dark:from-background-dark/90 dark:to-background-dark/80 border border-gray-100 dark:border-gray-800 shadow-xl p-8 transition-transform duration-500 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
                        <div className="flex items-center gap-6">
                            <div className="flex-shrink-0">
                                <div className="w-28 h-28 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center ring-1 ring-red-100 dark:ring-red-800">
                                    <Icon iconNode={Frown} className="h-12 w-12 text-red-600" />
                                </div>
                            </div>

                            <div className="flex-1">
                                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">Tough luck — you lost this one</h1>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">That was a close match. Don't be discouraged — take it as a sign to come back stronger. Try answering the next round with more passion and confidence.</p>

                                <div className="mt-4 text-sm text-gray-500">Hey — you also made a connection! At least you made a friend while playing. 🎉</div>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 shadow-sm">
                                <div className="text-xs text-gray-500">What to improve</div>
                                <div className="mt-2 font-semibold">Be bolder</div>
                                <div className="text-xs text-gray-400 mt-1">Answer with more passion — it helps in persuasion mini-games and social rounds.</div>
                            </div>
                            <div className="p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 shadow-sm">
                                <div className="text-xs text-gray-500">Quick tip</div>
                                <div className="mt-2 font-semibold">Read the room</div>
                                <div className="text-xs text-gray-400 mt-1">Use humor and short confident replies to sway the score.</div>
                            </div>
                            <div className="p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 shadow-sm">
                                <div className="text-xs text-gray-500">Silver lining</div>
                                <div className="mt-2 font-semibold">New friend</div>
                                <div className="text-xs text-gray-400 mt-1">You connected with Sophia — follow up and rematch soon.</div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center gap-3">
                            <Button asChild>
                                <Link href="/play" className="inline-flex items-center gap-2">
                                    <Icon iconNode={Repeat} className="h-4 w-4" /> Play again
                                </Link>
                            </Button>

                            <Button variant="ghost">
                                <span className="inline-flex items-center gap-2"><Icon iconNode={Share2} className="h-4 w-4" /> Share result</span>
                            </Button>

                            <div className="ml-auto text-sm text-gray-500">Feeling social? <span className="inline-flex items-center gap-1 text-primary"><Icon iconNode={Heart} className="h-4 w-4" /> Say hi to Sophia</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .confetti{ display:none }
            `}</style>
        </AppLayout>
    );
}
