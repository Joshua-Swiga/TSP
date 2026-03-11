import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';

export default function FilteredGames(props: any) {
    const paginator = props.games ?? { data: [], current_page: 1, last_page: 1, links: [] };
    const games = paginator.data ?? [];

    useEffect(() => {
        console.log('filteredGames prop:', games);
    }, [games]);

    return (
        <AppLayout>
            <Head title="Discover Your Next Adventure" />
            <div className="min-h-screen p-6 bg-background">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-extrabold mb-10 text-foreground tracking-tight">
                        Discover Your Next Adventure
                    </h1>

                    {games.length === 0 ? (
                        <div className="p-8 bg-card border border-border rounded-2xl shadow-sm text-center">
                            <p className="text-lg text-muted-foreground">
                                Hmm… nothing here. Try a new search and unlock your next thrill!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {games.map((game: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="group rounded-2xl overflow-hidden"
                                >
                                    <div className="rounded-2xl p-[1px] bg-gradient-to-b from-primary/30 via-border/40 to-transparent">
                                        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-card border border-border">
                                            <img
                                                src={game.path_to_the_game_image ?? ''}
                                                alt={game.name_of_the_game}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover select-none"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                                <h3 className="font-bold text-lg lg:text-xl text-white tracking-tight line-clamp-1">{game.name_of_the_game}</h3>
                                                <div className="mt-1 flex items-center justify-between text-xs text-white/80">
                                                    <span className="line-clamp-1">Genre: {game.game_name_category ?? 'N/A'}</span>
                                                    <span>Players: {game.number_of_players_allowed ?? 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-card border-x border-b border-border rounded-b-2xl">
                                            <div className="flex items-center justify-between">
                                                <Link
                                                    href={`/games/join?channel_id=${game.channel_id}&game_id=${game.id}`}
                                                    className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold"
                                                >
                                                    Play Now
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination controls */}
                    {paginator.last_page > 1 && (
                        <div className="mt-10 flex items-center justify-center gap-2">
                            {paginator.links &&
                                paginator.links.map((link: any, i: number) => {
                                    const baseClasses =
                                        'px-4 py-2 rounded-full text-sm font-medium';
                                    if (!link.url) {
                                        return (
                                            <button
                                                key={i}
                                                className={`${baseClasses} text-muted-foreground cursor-not-allowed border border-border bg-card`}
                                                disabled
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            ></button>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={`${baseClasses} ${
                                                link.active
                                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                                    : 'border border-border text-foreground bg-card'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
