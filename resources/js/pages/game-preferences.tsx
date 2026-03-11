import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import clsx from 'clsx';
import { CheckCircle, Zap, Users, Heart, Shield, User, Globe } from 'lucide-react';

export default function GamePreferences() {
    const [ageRange, setAgeRange] = useState<number>(45);
    const [numberOfPlayers, setPlayers] = useState<number>(0);
    const [isPrivateChannel, setIsPrivateChannel] = useState<boolean>(false);
    const [interestedIn, setInterestedIn] = useState<string | null>(null);
    const [opponentGender, setOpponentGender] = useState<string | null>(null);
    const [showToast, setShowToast] = useState<boolean>(false);
    const { data, setData, post, processing } = useForm({
        name_of_the_game: 'Truth or Dare',
        game_name_category: 'Party',
        status: 1,
        number_of_players_allowed: 1,
        gender_of_intrest: 'all',
    });

    // Effect: When numberOfPlayers changes to/from 1, update privacy and toast
    useEffect(() => {
        if (numberOfPlayers === 1) {
            setIsPrivateChannel(true);
            setShowToast(true);
            // Auto-dismiss toast after 4 seconds
            const timer = setTimeout(() => setShowToast(false), 4000);
            return () => clearTimeout(timer);
        } else {
            setShowToast(false);
        }
    }, [numberOfPlayers]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name_of_the_game: data.name_of_the_game,
            game_name_category: data.game_name_category,
            number_of_players_allowed: numberOfPlayers,
            interested_in: interestedIn ?? 'all',
            gender_of_intrest: opponentGender ?? data.gender_of_intrest ?? 'all',
            age_range: ageRange,
            is_private_channel: isPrivateChannel,
        };

        router.post(route('games.store'), payload);
    };

    const optionClasses = (checked: boolean) =>
        clsx(
            "flex items-center justify-center space-x-2 cursor-pointer p-3 border rounded-xl text-sm font-semibold transition-all duration-200 transform",
            checked
                ? "bg-gradient-to-br from-primary/10 to-primary/5 border-primary text-primary shadow-lg scale-[1.03]"
                : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:scale-[1.01]"
        );

    return (
        <AppLayout breadcrumbs={[{ title: 'Game Preferences', href: '/game-preferences' }]}>
            {/* Toast Notification */}
            {showToast && (
                <motion.div
                    className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700 rounded-xl px-5 py-4 shadow-lg backdrop-blur-sm">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <p className="text-sm font-medium text-green-800 dark:text-green-100">
                            Since you're the only player, this game will be private and won't appear in the lobby.
                        </p>
                    </div>
                </motion.div>
            )}

            <motion.div
                className="flex min-h-screen relative items-center justify-center py-12 px-4"
                style={{
                    backgroundImage: `url('https://pub-c5b607f049b640249ac60ba3c1dbee7b.r2.dev/play-or-pay-images/pexels-nadezhda-diskant-4165924-5878828.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Professional premium overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/75 backdrop-blur-sm"></div>
                
                <main className="relative z-10 w-full max-w-5xl">
                    <motion.div
                        className="overflow-hidden rounded-3xl bg-white/98 dark:bg-zinc-900/98 shadow-2xl border border-white/30 dark:border-zinc-800/50 backdrop-blur-xl"
                        initial={{ scale: 0.85, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Left side - Header & Info */}
                            <motion.div
                                className="hidden lg:flex flex-col justify-center items-start p-12 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 relative overflow-hidden"
                                initial={{ opacity: 0, x: -40 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -ml-16 -mb-16"></div>

                                <motion.div
                                    className="relative z-10"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                >
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-3 bg-gradient-to-br from-primary to-primary/60 rounded-xl">
                                            <Zap className="h-6 w-6 text-white" />
                                        </div>
                                        <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                                            Game<br />Preferences
                                        </h1>
                                    </div>

                                    <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-12 leading-relaxed max-w-sm">
                                        Customize your experience and find the perfect match for an unforgettable game.
                                    </p>

                                    {/* Info cards */}
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 mt-1">
                                                <Heart className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-zinc-900 dark:text-white">Perfect Matching</p>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Find players that match your interests</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 mt-1">
                                                <Users className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-zinc-900 dark:text-white">Flexible Groups</p>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Play solo or with up to 5 friends</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 mt-1">
                                                <Shield className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-zinc-900 dark:text-white">Privacy Control</p>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Share publicly or with a private link</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 pt-2 border-t border-zinc-200/50 dark:border-zinc-700/50">
                                            <div className="flex-shrink-0 mt-1">
                                                <Globe className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-zinc-900 dark:text-white mb-2">Game Visibility</p>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-primary font-bold">📢</span>
                                                        <div>
                                                            <p className="font-medium text-zinc-900 dark:text-white">Public Games</p>
                                                            <p className="text-zinc-500 dark:text-zinc-400">Listed on lobby for anyone to join</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-primary font-bold">🔗</span>
                                                        <div>
                                                            <p className="font-medium text-zinc-900 dark:text-white">Private Games</p>
                                                            <p className="text-zinc-500 dark:text-zinc-400">Get shareable links for your friends only</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Right side - Form */}
                            <div className="p-8 lg:p-12">
                                <motion.div
                                    className="space-y-6"
                                    initial={{ opacity: 0, x: 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    {/* Header for mobile */}
                                    <div className="lg:hidden mb-8">
                                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Game Preferences</h2>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Customize your experience</p>
                                    </div>

                                    <form className="space-y-6" onSubmit={submit}>
                                        {/* Interested In */}
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <Heart className="h-4 w-4 text-primary" />
                                                </div>
                                                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">I am interested in</label>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['Men', 'Women', 'Everyone'].map((label) => {
                                                    const value = label === 'Everyone' ? 'all' : (label === 'Men' ? 'man' : 'woman');
                                                    return (
                                                        <motion.button
                                                            key={label}
                                                            type="button"
                                                            onClick={() => setInterestedIn(value)}
                                                            className={clsx(
                                                                "py-2 px-3 rounded-lg text-xs font-semibold border transition-all duration-200",
                                                                interestedIn === value
                                                                    ? "bg-gradient-to-r from-primary to-primary/80 text-white border-primary shadow-lg"
                                                                    : "border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-primary/50 hover:bg-primary/5"
                                                            )}
                                                            aria-pressed={interestedIn === value}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <input className="sr-only" name="sex" type="radio" value={value} aria-hidden />
                                                            <span>{label}</span>
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>

                                        {/* Category */}
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <Zap className="h-4 w-4 text-primary" />
                                                </div>
                                                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Game Type</label>
                                            </div>
                                            <div className="grid grid-cols-1 gap-2">
                                                {['Truth or Dare', 'Never Have I Ever', 'Would You Rather'].map((game) => (
                                                    <motion.label
                                                        key={game}
                                                        className={clsx(
                                                            "py-3 px-4 rounded-lg text-sm font-semibold border transition-all duration-200 cursor-pointer block text-center",
                                                            data.name_of_the_game === game
                                                                ? "bg-gradient-to-r from-primary to-primary/80 text-white border-primary shadow-lg"
                                                                : "border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-primary/50 hover:bg-primary/5"
                                                        )}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <input
                                                            className="sr-only"
                                                            name="game"
                                                            type="radio"
                                                            value={game}
                                                            onChange={(e) => setData('name_of_the_game', e.currentTarget.value)}
                                                            checked={data.name_of_the_game === game}
                                                        />
                                                        <span>{game}</span>
                                                    </motion.label>
                                                ))}
                                            </div>
                                        </motion.div>
                                        {/* Players */}
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <Users className="h-4 w-4 text-primary" />
                                                </div>
                                                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Number of Players</label>
                                            </div>
                                            <select
                                                id="number-of-players"
                                                value={numberOfPlayers}
                                                onChange={(e) => {
                                                    const v = Number(e.target.value);
                                                    setPlayers(v);
                                                    setData('number_of_players_allowed', v);
                                                    if (v === 1) {
                                                        setIsPrivateChannel(true);
                                                    }
                                                }}
                                                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2 px-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            >
                                                {[1,2,3,4,5].map(n => (
                                                    <option key={n} value={n}>{n} player{n>1 ? 's' : ''}</option>
                                                ))}
                                            </select>
                                        </motion.div>


                                        {/* Gender Identity */}
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <User className="h-4 w-4 text-primary" />
                                                </div>
                                                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Opponent(s) Gender</label>
                                            </div>
                                            <select
                                                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2 px-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                id="gender"
                                                name="gender"
                                                value={opponentGender ?? data.gender_of_intrest ?? 'all'}
                                                onChange={(e) => {
                                                    const normalized = e.currentTarget.value;
                                                    setOpponentGender(normalized);
                                                    setData('gender_of_intrest', normalized);
                                                }}
                                            >
                                                <option value="all">Any</option>
                                                <option value="man">Man</option>
                                                <option value="woman">Woman</option>
                                                <option value="non-binary">Non-binary</option>
                                                <option value="transgender">Transgender</option>
                                            </select>
                                        </motion.div>

                                        {/* Age Range */}
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.65 }}>
                                            <div className="flex items-center justify-between mb-4">
                                                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Age Range</label>
                                                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg">
                                                    <span className="text-xs text-zinc-500">18</span>
                                                    <span className="text-sm font-bold text-primary">—</span>
                                                    <span className="text-sm font-bold text-primary">{ageRange}</span>
                                                </div>
                                            </div>
                                            <input
                                                className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                                id="age-range"
                                                max="99"
                                                min="18"
                                                type="range"
                                                value={ageRange}
                                                onChange={(e) => setAgeRange(Number(e.target.value))}
                                            />
                                        </motion.div>

                                        
                                        {/* Privacy */}
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.75 }}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <Shield className="h-4 w-4 text-primary" />
                                                </div>
                                                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Privacy Setting</label>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <motion.label
                                                    className={clsx(
                                                        "py-3 px-3 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer text-center",
                                                        !isPrivateChannel
                                                            ? "bg-gradient-to-r from-primary to-primary/80 text-white border-primary shadow-lg"
                                                            : "border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-primary/50 hover:bg-primary/5",
                                                        numberOfPlayers === 1 && "opacity-50 cursor-not-allowed"
                                                    )}
                                                    whileHover={numberOfPlayers > 1 ? { scale: 1.05 } : {}}
                                                    whileTap={numberOfPlayers > 1 ? { scale: 0.95 } : {}}
                                                >
                                                    <input 
                                                        className="sr-only" 
                                                        type="radio" 
                                                        name="privacy" 
                                                        value="public" 
                                                        checked={!isPrivateChannel} 
                                                        onChange={() => numberOfPlayers > 1 && setIsPrivateChannel(false)}
                                                        disabled={numberOfPlayers === 1}
                                                    />
                                                    <span>Public</span>
                                                </motion.label>
                                                <motion.label
                                                    className={clsx(
                                                        "py-3 px-3 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer text-center",
                                                        isPrivateChannel
                                                            ? "bg-gradient-to-r from-primary to-primary/80 text-white border-primary shadow-lg"
                                                            : "border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-primary/50 hover:bg-primary/5"
                                                    )}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <input 
                                                        className="sr-only" 
                                                        type="radio" 
                                                        name="privacy" 
                                                        value="private" 
                                                        checked={isPrivateChannel} 
                                                        onChange={() => setIsPrivateChannel(true)}
                                                    />
                                                    <span>Private</span>
                                                </motion.label>
                                            </div>
                                            {numberOfPlayers === 1 && (
                                                <motion.div 
                                                    className="mt-3 p-3 bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg"
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                >
                                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                                        <span className="font-semibold">Single player games are automatically private</span> and won't appear in the lobby.
                                                    </p>
                                                </motion.div>
                                            )}
                                        </motion.div>

                                        {/* Buttons */}
                                        <motion.div className="pt-6 space-y-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.85 }}>
                                            <motion.button
                                                className="w-full py-3 px-4 rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-primary via-primary to-primary/80 hover:shadow-xl hover:shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-zinc-900 transition-all"
                                                type="submit"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {processing ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Saving...
                                                    </span>
                                                ) : (
                                                    'Find a Match'
                                                )}
                                            </motion.button>
                                            <motion.button
                                                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                type="button"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <a href="/lobby">Find a Game in the Lobby</a>
                                            </motion.button>
                                        </motion.div>
                                    </form>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </motion.div>
        </AppLayout>
    );
}
