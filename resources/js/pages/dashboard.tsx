import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion'; // Assuming framer-motion is installed for smooth animations
import { usePage } from '@inertiajs/react';
import { useMemo, useState, useEffect, type FormEvent, useRef } from 'react';
import axios from 'axios';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const gameOptions = [
    {
        title: 'Truth or Dare',
        description: 'Classic game, new twists.',
        imageUrl: 'https://pub-c5b607f049b640249ac60ba3c1dbee7b.r2.dev/play-or-pay-images/pexels-aog-pixels-263452684-14005908.jpg',
    },
    {
        title: 'Would You Rather',
        description: 'Choices, challenges, and fun!',
        imageUrl: 'https://pub-c5b607f049b640249ac60ba3c1dbee7b.r2.dev/play-or-pay-images/pexels-foundertips-3827436.jpg',
    },
    {
        title: 'Never Have I Ever',
        description: 'Spill the tea or take a sip!',
        imageUrl: 'https://pub-c5b607f049b640249ac60ba3c1dbee7b.r2.dev/play-or-pay-images/pexels-rob-ruth-1406909-34437076.jpg',
    },
];

const activeUsers = [
    {
        name: 'User 1',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnwKiMerrVmnJKgPCZ_mcwbGwo88CWNAmpL61Kt4HK37hBkSHQHLbJ8LIzWRGoJ-nv0mIgdQovlO29Znst9oay7FqB8TJr1uBQoiXwLG-CHmsja65S46cQEGY1ZVibwFukPa7lqSJZBr0j1mnci67j7y2tmIcSIVOrmFl8_JP9bubN3aANgbWTJu2jnQG-SZ6gPaNx1iGGpEwPuITRCAs86j021JhXKVyIXMSe-BXcuBmM2g0JcprTk6zmYfh73d83hbrxVK4ic-EP',
    },
    {
        name: 'User 2',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg5aYy2HvvC3SvHvNtaDhthiJ3iuf-dybqkGn9uHPdoAGR_bPfr2n3AppJEg-eSvfECgaOlwEaZhgZyououyJfwVbYmHidcSajlAffCh0L-RhXqszIjM9y6dNpYnF5eE-eBHAXIWgy2ptoU1Nv0j5FotKFr2gxvVsbtApi3QcG-ewhtK9w9IwYWbVaEYdBHBGjMMNAf9maXD04dTF_UdPWH2x_hergnyUzydbAgP-TNU6F500LZbSPdvpbTt3WOeJOwIwGV8FD0JjP',
    },
    {
        name: 'User 3',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWjiUyKTI9LuY-3-k9BCK1pOfKDWX_dtJwshKfPBKSpmUGVjiUtqfycNM-fopSdYU5aPX6C-yw_Oica17rWExNALSEPqz3iAIrjJP6tfoOMMwS_59JDRqz3VUjS-KIf_U0Ua8f-B6zU0yF9AM5baagXYt8UwY0rLRcOmHq_30WRth2ghilKBCDGm56zXbClJOY5N9_UwGDOjw6F_l3wBUrEbTUVocE1i0hsPPzvk3upKWe5HiSP5JW9agmaN-BwEbhzzJsOD9v5R8e',
    },
    {
        name: 'User 4',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-Qw2eML9O2TUWNMqXrcKv8ZS3M0f1Plb0QxLEZlyeH7ZlcQJlVXc8FDc5Rlz5n95i6CIdmgNTzIsmJhZX8pE35_XGxVa4fzyrlLiHyUie916JS_BwiuvqyckBFQXxyh76JW-JLG-r1aESdBGBDPLFSwn8PiNiTZn6qx8mTx-PRuINwI3y4iqfQJcHzIkWA7s1HlIWqIa7V_LDQ6a__9rbBGfR2eN-7sxRnHss1VsSi654WUfnlgUHHY08B_g4ASv9NX68jlod1QEQ',
    },
    {
        name: 'User 5',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxvxS-tS-1AKoCXGpqUUSe-O6UIQvbnTHZYnvMN76xQv9P0hCOBKVqeQbfu9lOGJLzdDalH0I4gOh8OI_fQnhm3wkVPkiq5lwMDPEPzOZu1AnWImCmN0kjpY92psAmb96K8iCcEoeUWPXvaJck9ElLhSS0sF70hc22GjMMXEsz_rBQ-oEoJ0hb3x6SQBxUfYJ_VLIiW7Z_4C_T92PkCmPxwVMD7o5SyfwEpn_yUkXa1HfvHCXzxrILxr42pTjemXnMd8nB0NehBjiw',
    },
];

function GameCard({ title, description, imageUrl, href, index = 0 }: { title: string; description: string; imageUrl: string; href?: string; index?: number }) {
    return (
        <motion.div
            className="group relative rounded-2xl cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
        >
            <div className="rounded-2xl p-[1px] bg-gradient-to-b from-primary/30 via-border/40 to-transparent">
                <div className="relative overflow-hidden rounded-2xl bg-card border border-border shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl will-change-transform">
                    {href ? (
                        <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                            <div className="relative">
                                <img
                                    src={imageUrl}
                                    alt={title}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full aspect-[4/5] object-cover select-none"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                <div className="pointer-events-none absolute bottom-0 left-0 p-6">
                                    <h3 className="font-bold text-xl text-white drop-shadow-sm">{title}</h3>
                                    <p className="text-white/80 text-sm">{description}</p>
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <div className="relative">
                            <img
                                src={imageUrl}
                                alt={title}
                                loading="lazy"
                                decoding="async"
                                className="w-full aspect-[4/5] object-cover select-none"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                            <div className="pointer-events-none absolute bottom-0 left-0 p-6">
                                <h3 className="font-bold text-xl text-white drop-shadow-sm">{title}</h3>
                                <p className="text-white/80 text-sm">{description}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function ActiveUserAvatar({ name, avatar }: { name: string; avatar: string }) {
    return (
        <motion.div
            className="rounded-full size-12 border-2 border-border ring-0 overflow-hidden bg-card"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            title={name}
        >
            <img
                src={avatar}
                alt={name}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
            />
        </motion.div>
    );
}

function StatCard({
    label,
    value,
    icon,
    trend,
    accent = 'from-emerald-500/15 to-emerald-600/10',
}: {
    label: string;
    value: string;
    icon: string; // material symbol name
    trend?: string;
    accent?: string;
}) {
    return (
        <motion.div
            className={`relative overflow-hidden rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{ duration: 0.5 }}
        >
            <div className={`pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${accent}`}></div>
            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl md:text-3xl font-bold text-foreground">{value}</span>
                        {trend ? <span className="text-xs md:text-sm text-muted-foreground">{trend}</span> : null}
                    </div>
                </div>
                <span className="material-symbols-outlined text-primary text-2xl md:text-3xl">{icon}</span>
            </div>
        </motion.div>
    );
}

export default function Dashboard() {
    const page = usePage();
    const auth = (page.props && (page.props as any).auth) || null;
    const user = auth?.user ?? null;
    const userName = user?.name ?? 'Player';
    const userTokens = (user && (user.tokens ?? user.token_balance ?? user.balance)) ?? 1500;
    // generate random stats once per render (not exceeding 120)
    const stats = useMemo(() => {
        const rand = (max: number) => Math.floor(Math.random() * (max + 1));
        const activeGames = rand(120);
        const friendsOnline = rand(120);
        const trendActive = `${Math.random() < 0.5 ? '+' : '-'}${rand(10)} today`;
        const trendFriends = `now`;
        return { activeGames, friendsOnline, trendActive, trendFriends };
    }, []);

    // Terms & Conditions modal state (persist acceptance in localStorage)
    const [termsOpen, setTermsOpen] = useState<boolean>(false);
    const [buyTokensOpen, setBuyTokensOpen] = useState<boolean>(false);
    const [buyTokensLoading, setBuyTokensLoading] = useState<boolean>(false);
    const [phoneNumber, setPhoneNumber] = useState<string>(user?.phone_number ?? '');
    const [tokenAmount, setTokenAmount] = useState<string>('500');
    const [savePhoneNumber, setSavePhoneNumber] = useState<boolean>(false);

    // Payment processing modal state
    const [paymentProcessingOpen, setPaymentProcessingOpen] = useState<boolean>(false);
    const [paymentMessage, setPaymentMessage] = useState<string>('');
    const [paymentReference, setPaymentReference] = useState<string>('');
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failure'>('pending');
    const [pollAttempts, setPollAttempts] = useState<number>(0);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const maxPollAttempts = 10;
    useEffect(() => {
        try {
            const accepted = localStorage.getItem('play_or_pay_terms_accepted');
            if (!accepted) setTermsOpen(true);
        } catch (err) {
            // if localStorage is unavailable, still show the modal
            setTermsOpen(true);
        }
    }, []);

    function agreeToTerms() {
        try {
            localStorage.setItem('play_or_pay_terms_accepted', String(Date.now()));
        } catch (err) {
            // ignore storage errors
        }
        setTermsOpen(false);
    }

    // Loading overlay state: show for 3s on first render to give smooth vibe
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(t);
    }, []);
    useEffect(() => {
        if (user?.phone_number) {
            setPhoneNumber(user.phone_number);
        }
    }, [user]);

    // Cleanup polling interval on component unmount
    useEffect(() => {
        return () => {
            stopPaymentPolling();
        };
    }, []);

    function openBuyTokensModal() {
        setTokenAmount('500');
        setBuyTokensOpen(true);
        setSavePhoneNumber(false);
        if (user?.phone_number) {
            setPhoneNumber(user.phone_number);
        }
    }

    function closeBuyTokensModal() {
        if (!buyTokensLoading) {
            setBuyTokensOpen(false);
        }
    }

    async function handleBuyTokensSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setBuyTokensLoading(true);

        const payload: { phoneNumber: string; tokens: number; savePhoneNumber?: boolean } = {
            phoneNumber: phoneNumber.trim(),
            tokens: Number(tokenAmount) || 0,
        };

        if (!user?.phone_number) {
            payload.savePhoneNumber = savePhoneNumber;
        }

        console.log('Buy Tokens submission:', payload);

        try {
            const response = await axios.post('/pay/init', payload);
            const data = response.data;

            // Close the buy tokens modal and show payment processing modal
            setBuyTokensOpen(false);
            setBuyTokensLoading(false);
            
            // Extract payment data from response
            const message = data?.message || 'Processing payment...';
            const reference = data?.reference || '';
            
            setPaymentMessage(message);
            setPaymentReference(reference);
            setPaymentStatus('pending');
            setPollAttempts(0);
            setPaymentProcessingOpen(true);
            
            // Start polling for payment status
            if (reference) {
                startPaymentPolling(reference);
            }
        } catch (error: any) {
            console.error('Buy Tokens submission error:', error);
            setBuyTokensLoading(false);
            
            // Optionally show error message to user
            const errorMessage = error.response?.data?.message || 'Payment initiation failed. Please try again.';
            alert(errorMessage);
        }
    }

    function startPaymentPolling(reference: string) {
        let attempts = 0;
        
        pollingIntervalRef.current = setInterval(async () => {
            attempts++;
            setPollAttempts(attempts);

            try {
                const response = await axios.get(`/pay/callback?reference=${reference}`);
                const result = response.data;

                if (result.status === true) {
                    // Payment successful
                    setPaymentStatus('success');
                    stopPaymentPolling();
                    return;
                }

                if (attempts >= maxPollAttempts) {
                    // Max attempts reached - payment failed
                    setPaymentStatus('failure');
                    stopPaymentPolling();
                }
            } catch (error) {
                console.error('Payment polling error:', error);

                if (attempts >= maxPollAttempts) {
                    setPaymentStatus('failure');
                    stopPaymentPolling();
                }
            }
        }, 3000); // Poll every 3 seconds
    }

    function stopPaymentPolling() {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
    }

    function closePaymentProcessingModal() {
        setPaymentProcessingOpen(false);
        stopPaymentPolling();
        setPaymentStatus('pending');
        setPollAttempts(0);
        setPaymentMessage('');
        setPaymentReference('');
    }

    function handlePaymentSuccess() {
        closePaymentProcessingModal();
        // You can add additional logic here like refreshing user balance
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
            </Head>

            <div className="flex min-h-screen bg-background">
                {termsOpen && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-6" role="dialog" aria-modal="true" aria-labelledby="terms-heading">
                        <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-md bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-white shadow">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h1 id="terms-heading" className="text-2xl font-bold text-gray-900 dark:text-gray-100">Terms and Conditions</h1>
                                    <p className="mt-1 text-sm text-muted-foreground">Please read carefully. You must agree to continue using Play or Pay.</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="max-h-[55vh] overflow-auto pr-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300" style={{ whiteSpace: 'pre-wrap' }}>
                                    {`Play or Pay (“the Platform”) is an interactive entertainment service created solely for recreational use. By accessing or using this Platform, users (“Players”) agree to comply with these Terms and Conditions in full. Users are permitted to participate in online games, interact within game-based categories, and share experiences respectfully. The exchange or solicitation of personal contact information, including phone numbers, emails, or physical addresses, is strictly prohibited. The sale or promotion of merchandise, services, or external content within the Platform is not allowed. Any involvement in human trafficking, sexual exploitation, harassment, discrimination, hate speech, or any illegal activity will result in immediate account termination and may be reported to relevant authorities. The Company enforces a zero-tolerance policy and assumes no liability for individual user actions. The Platform may incorporate a token-based system used solely for in-game interactions and engagement. All token transfers are voluntary and based on mutual consent between users. The Company will not initiate, reverse, or interfere with token transactions without express consent from both parties and disclaims responsibility for any losses, misunderstandings, or disputes arising therefrom. In cases of token disputes, users are encouraged to contact support, whose decisions shall be final. The Company reserves the right to suspend or terminate accounts that violate these Terms, at its sole discretion and without prior notice. Upon termination, access to tokens, messages, and privileges shall be revoked. The Company, its directors, and affiliates shall not be liable for any damages, losses, or consequences resulting from the use or misuse of the Platform, including but not limited to misconduct by users, token-related disputes, or service interruptions. Users acknowledge that participation is voluntary and at their own risk. The Platform is provided “as is” and “as available,” without any warranties, express or implied. The Company may amend these Terms at any time without notice, and continued use constitutes acceptance of such revisions. These Terms are governed by the laws of Kenya, and any disputes shall fall under the exclusive jurisdiction of its courts. For assistance, complaints, or inquiries, users may contact the Company at [Insert Official Email].`}
                                </div>

                                <div className="mt-6 flex justify-center gap-4">
                                    <button className="px-4 py-2 rounded-md bg-gray-100 text-sm text-gray-700 hover:bg-gray-200" onClick={() => { /* inert - must agree to proceed */ }}>Close</button>
                                    <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold text-sm shadow" onClick={agreeToTerms}>I agree</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-black/30 to-black/10 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-lg">
                                <svg className="animate-spin h-10 w-10 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                            </div>
                            <div className="text-white text-sm">Warming up the arena…</div>
                        </div>
                    </div>
                )}
                <main className="relative flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                        <div className="absolute -top-24 -right-16 h-56 w-56 rounded-full bg-primary/10 blur-2xl animate-pulse"></div>
                        <div className="absolute top-1/3 -left-20 h-64 w-64 rounded-full bg-red-500/10 blur-3xl animate-pulse [animation-delay:400ms]"></div>
                        <div className="absolute bottom-10 right-1/4 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-2xl animate-pulse [animation-delay:800ms]"></div>
                    </div>
                    {/* Header Section */}
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 max-w-7xl mx-auto w-full">
                        <div>
                             <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-3">Welcome back, {userName}!</h1>
                            <div className="relative inline-block mt-1">
                                <div className="h-1 w-full bg-gradient-to-r from-primary to-pink-500 rounded-full" />
                                <motion.div
                                    className="absolute -top-[2px] left-0 h-[6px] w-12 rounded-full bg-white/70"
                                    animate={{ x: [0, 140, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                />
                            </div>
                            <p className="text-muted-foreground text-base md:text-lg mt-4">The stage is set. Time to play.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <motion.div
                                className="flex items-center gap-2 bg-card px-4 md:px-6 py-2 md:py-3 rounded-full border border-border transition-all duration-300 hover:shadow-lg"
                                whileHover={{ scale: 1.05 }}
                            >
                                <span className="material-symbols-outlined text-primary text-xl md:text-2xl">toll</span>
                                <span className="font-bold text-lg md:text-xl">
                                    {Number(userTokens).toLocaleString()}
                                </span>
                            </motion.div>
                            <motion.button
                                type="button"
                                className="bg-primary text-primary-foreground font-bold py-2 md:py-3 px-6 md:px-8 rounded-full hover:bg-primary/90 transition-all duration-300 flex items-center gap-2 text-base md:text-lg shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-80 disabled:cursor-not-allowed"
                                whileHover={buyTokensLoading ? undefined : { scale: 1.05 }}
                                onClick={openBuyTokensModal}
                                disabled={buyTokensLoading}
                            >
                                {buyTokensLoading ? (
                                    <>
                                        <svg className="h-5 w-5 animate-spin text-primary-foreground" viewBox="0 0 24 24" role="presentation">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-lg md:text-xl">shopping_cart</span>
                                        Buy Tokens
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </header>

                    {/* KPI Section */}
                    <section className="mb-8 max-w-7xl mx-auto w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            <StatCard label="Active Games" value={String(stats.activeGames)} icon="stadia_controller" trend={stats.trendActive} accent="from-sky-500/15 to-sky-600/10" />
                            <StatCard label="Friends Online" value={String(stats.friendsOnline)} icon="group" trend={stats.trendFriends} accent="from-fuchsia-500/15 to-fuchsia-600/10" />
                        </div>
                    </section>

                    {/* Start a New Game Section */}
                    <section className="mb-8 max-w-7xl mx-auto w-full">
                        <h4 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                            Click to Explore:
                        </h4>
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
                            initial="hidden"
                            animate="visible"
                            variants={{ hidden: {}, visible: {} }}
                        >
                            {gameOptions.map((game, index) => {
                                // Use a query parameter 'game' which the controller expects (avoids 404 on an extra path segment)
                                const query = encodeURIComponent(game.title);
                                const href = `/games/filtered-games?game=${query}`;
                                console.log('href:', href);
                                return <GameCard key={index} {...game} href={href} index={index} />;
                            })}
                        </motion.div>
                    </section>

                    {/* Lobby Section */}
                    <motion.section
                        className="bg-gradient-to-br from-red-500/20 to-red-600/20 dark:from-red-900/50 dark:to-red-800/30 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center mb-8 max-w-7xl mx-auto w-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <h2 className="text-2xl md:text-3xl font-extrabold mb-3 text-red-800 dark:text-white">Enter the Lobby</h2>
                        <p className="text-red-700/80 dark:text-red-200 mb-6 max-w-md text-base md:text-lg">The arena awaits. Find an opponent and prove your mettle. Players are waiting.</p>
                        <motion.button
                            className="bg-primary text-primary-foreground font-bold py-3 md:py-4 px-8 md:px-10 rounded-full transition-all duration-300 flex items-center justify-center gap-3 text-lg md:text-xl shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="material-symbols-outlined">
                                play_arrow
                            </span>
                            <Link href="games/game-preferences">Create A Game</Link>
                        </motion.button>
                    </motion.section>

                    {/* Active Users Section */}
                    <section className="max-w-7xl mx-auto w-full">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">Active Users</h2>
                        <div className="flex -space-x-2 md:-space-x-3 overflow-hidden">
                            {activeUsers.map((user, index) => (
                                <ActiveUserAvatar key={index} {...user} />
                            ))}
                        </div>
                    </section>
                </main>

                <AnimatePresence>
                    {buyTokensOpen && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            role="dialog"
                            aria-modal="true"
                        >
                            <motion.div
                                className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl border border-border"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                role="document"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-foreground">Buy Tokens</h2>
                                        <p className="text-sm text-muted-foreground mt-1">Enter your details to top up your balance.</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                        onClick={closeBuyTokensModal}
                                        aria-label="Close buy tokens form"
                                        disabled={buyTokensLoading}
                                    >
                                        <span className="material-symbols-outlined text-2xl">close</span>
                                    </button>
                                </div>

                                <form className="mt-6 space-y-4" onSubmit={handleBuyTokensSubmit}>
                                    <div className="space-y-2">
                                        <label htmlFor="phoneNumber" className="text-sm font-medium text-foreground">
                                            Phone Number
                                        </label>
                                        <input
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(event) => setPhoneNumber(event.target.value)}
                                            placeholder="e.g. +254712345678"
                                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                            required
                                            disabled={buyTokensLoading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="tokenAmount" className="text-sm font-medium text-foreground">
                                            Number of Tokens
                                        </label>
                                        <input
                                            id="tokenAmount"
                                            name="tokenAmount"
                                            type="number"
                                            min={1}
                                            value={tokenAmount}
                                            onChange={(event) => setTokenAmount(event.target.value)}
                                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                            required
                                            disabled={buyTokensLoading}
                                        />
                                    </div>

                                    {!user?.phone_number && (
                                        <label className="flex items-center gap-3 rounded-lg border border-dashed border-border/70 bg-background px-3 py-2 text-sm text-muted-foreground">
                                            <input
                                                type="checkbox"
                                                className="size-4 rounded border-border text-primary focus:ring-primary"
                                                checked={savePhoneNumber}
                                                onChange={(event) => setSavePhoneNumber(event.target.checked)}
                                                disabled={buyTokensLoading}
                                            />
                                            Save phone number
                                        </label>
                                    )}

                                    <motion.button
                                        type="submit"
                                        className="w-full flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3 font-semibold shadow-md transition-all duration-300 hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-80 disabled:cursor-not-allowed"
                                        whileHover={buyTokensLoading ? undefined : { scale: 1.02 }}
                                        whileTap={buyTokensLoading ? undefined : { scale: 0.98 }}
                                        disabled={buyTokensLoading}
                                    >
                                        {buyTokensLoading ? (
                                            <>
                                                <svg className="h-5 w-5 animate-spin text-primary-foreground" viewBox="0 0 24 24" role="presentation">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-lg">send</span>
                                                Submit Request
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {paymentProcessingOpen && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            role="dialog"
                            aria-modal="true"
                        >
                            <motion.div
                                className="w-full max-w-md rounded-2xl bg-card p-8 shadow-2xl border border-border"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                role="document"
                            >
                                {paymentStatus === 'pending' && (
                                    <motion.div
                                        className="text-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="flex justify-center mb-6">
                                            <motion.div
                                                className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                <svg className="h-8 w-8 animate-spin text-primary" viewBox="0 0 24 24" role="presentation">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                                </svg>
                                            </motion.div>
                                        </div>

                                        <h2 className="text-xl font-semibold text-foreground mb-2">Processing Payment</h2>
                                        <p className="text-sm text-muted-foreground mb-4">{paymentMessage}</p>

                                        <div className="text-xs text-muted-foreground mb-4">
                                            Attempt {pollAttempts} of {maxPollAttempts}
                                        </div>

                                        <motion.button
                                            type="button"
                                            className="w-full rounded-full bg-red-500/80 hover:bg-red-500 text-white py-2 font-semibold text-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                            onClick={closePaymentProcessingModal}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Cancel
                                        </motion.button>
                                    </motion.div>
                                )}

                                {paymentStatus === 'success' && (
                                    <motion.div
                                        className="text-center"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                    >
                                        <motion.div
                                            className="flex justify-center mb-6"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 flex items-center justify-center">
                                                <motion.svg
                                                    className="h-8 w-8 text-emerald-600"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ duration: 0.5, delay: 0.2 }}
                                                >
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </motion.svg>
                                            </div>
                                        </motion.div>

                                        <h2 className="text-2xl font-bold text-emerald-600 mb-2">Payment Successful!</h2>
                                        <p className="text-sm text-muted-foreground mb-6">Your tokens have been added to your account.</p>

                                        <motion.button
                                            type="button"
                                            className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 font-semibold text-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                            onClick={handlePaymentSuccess}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Great! Continue
                                        </motion.button>
                                    </motion.div>
                                )}

                                {paymentStatus === 'failure' && (
                                    <motion.div
                                        className="text-center"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                    >
                                        <div className="flex justify-center mb-6">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500/30 to-red-600/20 flex items-center justify-center">
                                                <svg className="h-8 w-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>

                                        <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Not Completed</h2>
                                        <p className="text-sm text-muted-foreground mb-6">Please try again or contact support.</p>

                                        <motion.button
                                            type="button"
                                            className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-semibold text-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                            onClick={closePaymentProcessingModal}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Try Again
                                        </motion.button>
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AppLayout>
    );
}