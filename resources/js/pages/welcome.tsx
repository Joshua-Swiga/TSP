import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 3000);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            <Head title="Play or Pay Hub - Where Curiosity Meets Mischief">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                {/* Preload important hero images to improve LCP */}
                <link rel="preload" href="/home-page/texting/pexels-cottonbro-6593743.jpg" as="image" />
                <link rel="preload" href="/home-page/texting/pexels-alexander-suhorucov-6457556.jpg" as="image" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
                <meta name="description" content="Challenge friends to daring games. Complete the challenge or pay the price. Join the ultimate social gaming platform where stakes are real and fun is guaranteed." />
                <style>{`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    @keyframes fadeInLeft {
                        from {
                            opacity: 0;
                            transform: translateX(-30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    @keyframes fadeInRight {
                        from {
                            opacity: 0;
                            transform: translateX(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    @keyframes scaleIn {
                        from {
                            opacity: 0;
                            transform: scale(0.9);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                    @keyframes slideInUp {
                        from {
                            opacity: 0;
                            transform: translateY(50px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    @keyframes float {
                        0%, 100% {
                            transform: translateY(0px);
                        }
                        50% {
                            transform: translateY(-10px);
                        }
                    }
                    @keyframes shimmer {
                        0% {
                            background-position: -200% 0;
                        }
                        100% {
                            background-position: 200% 0;
                        }
                    }
                    .animate-fade-in-up {
                        animation: fadeInUp 0.8s ease-out forwards;
                    }
                    .animate-fade-in-left {
                        animation: fadeInLeft 0.8s ease-out forwards;
                    }
                    .animate-fade-in-right {
                        animation: fadeInRight 0.8s ease-out forwards;
                    }
                    .animate-scale-in {
                        animation: scaleIn 0.6s ease-out forwards;
                    }
                    .animate-slide-in-up {
                        animation: slideInUp 1s ease-out forwards;
                    }
                    .animate-float {
                        animation: float 3s ease-in-out infinite;
                    }
                    .animate-shimmer {
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                        background-size: 200% 100%;
                        animation: shimmer 2s infinite;
                    }
                    .delay-200 { animation-delay: 0.2s; }
                    .delay-400 { animation-delay: 0.4s; }
                    .delay-600 { animation-delay: 0.6s; }
                    .delay-800 { animation-delay: 0.8s; }
                    .delay-1000 { animation-delay: 1s; }
                    .delay-1200 { animation-delay: 1.2s; }
                `}</style>
            </Head>
            <div className="min-h-screen bg-[#FDFDFC] dark:bg-[#0a0a0a] relative overflow-hidden">
                {loading && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center bg-gradient-to-b from-white/30 to-gray-100/30 dark:from-black/60 dark:to-black/70"
                         style={{
                             // apply a very strong backdrop blur to hide underlying content
                             backdropFilter: 'blur(20px)',
                             WebkitBackdropFilter: 'blur(20px)',
                         }}
                    >
                        <div className="flex flex-col items-center gap-6 p-6">
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center shadow-2xl">
                                <svg className="animate-spin h-12 w-12 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Play or Pay Hub</h3>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">Preparing your playground — just a moment</p>
                            </div>
                        </div>
                    </div>
                )}
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full animate-pulse"></div>
                    <div className="absolute top-1/2 -left-40 w-96 h-96 bg-pink-500/5 rounded-full animate-pulse delay-1000"></div>
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full animate-pulse delay-2000"></div>
                </div>
                {/* Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#19140035] dark:bg-[#0a0a0a]/90 dark:border-[#3E3E3A] transition-all duration-500 ease-out">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 animate-fade-in-up">
                                    <h1 className="text-2xl font-bold text-[#1b1b18] dark:text-[#EDEDEC] transition-all duration-700 ease-out">
                                        Play or Pay Hub
                                    </h1>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 animate-fade-in-up delay-200">
                            {auth.user ? (
                                <>
                                    <Link
                                        href={route('FAQ')}
                                        className="text-[#1b1b18] dark:text-[#EDEDEC] font-medium transition-all duration-300 ease-out hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        FAQ
                                    </Link>
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-[#1b1b18] rounded-full shadow-lg transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-xl"
                                    >
                                        <span className="material-symbols-outlined mr-2 text-lg transition-transform duration-300">dashboard</span>
                                        Dashboard
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route('FAQ')}
                                        className="text-[#1b1b18] dark:text-[#EDEDEC] font-medium transition-all duration-300 ease-out hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        FAQ
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="text-[#1b1b18] dark:text-[#EDEDEC] font-medium transition-all duration-300 ease-out hover:text-red-600 dark:hover:text-red-400"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-[#1b1b18] rounded-full shadow-lg transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-xl"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="pt-20">
                    <section className="relative overflow-hidden">
                        {/* Background Image */}
                        <div className="absolute inset-0 z-0">
                            <img 
                                    src="/home-page/texting/pexels-cottonbro-6593743.jpg" 
                                    alt="Friends texting and laughing" 
                                    width={1920}
                                    height={1080}
                                    loading="eager"
                                    decoding="async"
                                    className="w-full h-full object-cover opacity-10 dark:opacity-5 transition-all duration-1000 ease-out"
                                />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FDFDFC]/95 via-[#FDFDFC]/80 to-transparent dark:from-[#0a0a0a]/95 dark:via-[#0a0a0a]/80"></div>
                        </div>
                        
                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                            <div className="grid lg:grid-cols-2 gap-8 items-center">
                                {/* Left Column - Content */}
                                <div className="text-center lg:text-left">
                                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#19140035] text-[#1b1b18] dark:bg-[#3E3E3A] dark:text-[#EDEDEC] text-sm font-semibold mb-6 animate-fade-in-up">
                                        <span className="material-symbols-outlined mr-2 text-lg animate-float">local_fire_department</span>
                                        Dare to Play?
                                    </div>
                                    
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1b1b18] dark:text-[#EDEDEC] leading-tight mb-4 animate-fade-in-up delay-200">
                                        Because Good Vibes Should 
                                        {' '}
                                        <span className="text-red-600 dark:text-red-400 relative">
                                            Pay Rent
                                            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-shimmer"></div>
                                        </span>{' '}
                                    </h1>
                                    
                                    <p className="text-lg md:text-xl text-[#1b1b18]/80 dark:text-[#EDEDEC]/80 mb-6 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-in-up delay-400">
                                        
                                        Challenge friends to hilarious, daring, or risqué games. Create or join them easily. Each game includes questions. Users text, interact, and answer. Opponents award tokens for good responses. Tokens can be withdrawn. 
                                        <span className="font-semibold text-[#1b1b18] dark:text-[#EDEDEC]"> One token equals one Kenyan shilling. </span>
                                    </p>
                                    
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-in-up delay-600">
                                        <Link
                                            href={route('register')}
                                            className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-[#1b1b18] dark:bg-[#EDEDEC] dark:text-[#1b1b18] rounded-2xl shadow-2xl transition-all duration-500 ease-out transform hover:scale-105 hover:shadow-3xl"
                                        >
                                            <span className="material-symbols-outlined mr-3 text-xl transition-transform duration-300 group-hover:rotate-12">play_arrow</span>
                                        Ready? She's Waiting
                                            <span className="material-symbols-outlined ml-3 text-xl transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
                                        </Link>
                                        <a 
                                            href="FAQ" 
                                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC] bg-white dark:bg-[#0a0a0a] rounded-2xl border-2 border-[#19140035] dark:border-[#3E3E3A] transition-all duration-500 ease-out hover:border-red-300 dark:hover:border-red-600 hover:text-red-600 dark:hover:text-red-400"
                                        >
                                            <span className="material-symbols-outlined mr-3 text-xl">help_outline</span>
                                            See How It Works
                                        </a>
                                    </div>
                                    
                                    {/* Social Proof */}
                                    <div className="mt-12 flex items-center justify-center lg:justify-start space-x-8 text-sm text-[#1b1b18]/60 dark:text-[#EDEDEC]/60 animate-fade-in-up delay-800">
                                        <div className="flex items-center">
                                            <div className="flex -space-x-2">
                                                <img className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0a0a0a] shadow-lg transition-transform duration-300 hover:scale-110" src="/home-page/anonymous/pexels-sebastiaan9977-1480690.jpg" alt="User" />
                                                <img className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0a0a0a] shadow-lg transition-transform duration-300 hover:scale-110 delay-100" src="/home-page/texting/pexels-ketut-subiyanto-4909267.jpg" alt="User" />
                                                <img className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0a0a0a] shadow-lg transition-transform duration-300 hover:scale-110 delay-200" src="/home-page/texting/pexels-ketut-subiyanto-4909462.jpg" alt="User" />
                                            </div>
                                            <span className="ml-3 font-medium">10,000+ active players</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="material-symbols-outlined mr-2 text-green-500 animate-pulse">verified</span>
                                            {/* <span className="font-medium">Trusted & Secure</span> */}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Right Column - Visual */}
                                <div className="relative animate-fade-in-right delay-400">
                                    <div className="relative z-10">
                                        <img 
                                                src="https://pub-c5b607f049b640249ac60ba3c1dbee7b.r2.dev/play-or-pay-images/pexels-soner-ozcan-1462621-16045198.jpg" 
                                                alt="Friends playing games on phone" 
                                                width={1200}
                                                height={720}
                                                loading="eager"
                                                decoding="async"
                                                className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-3xl shadow-2xl transition-all duration-700 ease-out hover:shadow-3xl"
                                            />
                                        <div className="absolute -top-6 -right-6 bg-white dark:bg-[#0a0a0a] rounded-2xl p-4 shadow-xl animate-scale-in delay-1000">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                                <span className="text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Time To Play</span>
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-6 -left-6 bg-[#1b1b18] dark:bg-[#EDEDEC] text-white dark:text-[#1b1b18] rounded-2xl p-4 shadow-xl animate-scale-in delay-1200">
                                            <div className="flex items-center space-x-2">
                                                <span className="material-symbols-outlined text-xl animate-float">emoji_events</span>
                                                <span className="text-sm font-bold">Not another app — a lifestyle upgrade</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="py-24 bg-white dark:bg-[#0a0a0a]" id="features">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-20 animate-fade-in-up">
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#19140035] text-[#1b1b18] dark:bg-[#3E3E3A] dark:text-[#EDEDEC] text-sm font-semibold mb-6">
                                    <span className="material-symbols-outlined mr-2 text-lg animate-float">star</span>
                                    Why Choose Us?
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-[#1b1b18] dark:text-[#EDEDEC] mb-6">
                                    You Love Having Fun, 
                                    {' '}
                                    <span className="text-red-600 dark:text-red-400 relative">
                                        We Pay you for It
                                        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-shimmer"></div>
                                    </span>
                                </h2>
                                <p className="text-xl text-[#1b1b18]/80 dark:text-[#EDEDEC]/80 max-w-3xl mx-auto leading-relaxed">
                                    This isn’t just a game. You play, you tease, you collect — tokens on tap
                                </p>
                            </div>
                            
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {/* Feature 1 */}
                                <div className="group relative bg-white dark:bg-[#0a0a0a] rounded-3xl p-8 shadow-lg border border-[#19140035] dark:border-[#3E3E3A] transition-all duration-700 ease-out transform hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up delay-200">
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-900/10 dark:to-pink-900/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-[#1b1b18] dark:bg-[#EDEDEC] text-white dark:text-[#1b1b18] mx-auto mb-6 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-3">
                                        <span className="material-symbols-outlined text-4xl">swords</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-[#1b1b18] dark:text-[#EDEDEC] mb-4 text-center">Challenge Anyone</h3>
                                        <p className="text-[#1b1b18]/80 dark:text-[#EDEDEC]/80 text-center leading-relaxed">
                                            Challenge anyone, Stay anonymous, play public or private, meet new people, answer daring questions, and earn—your game, your rules.
                                        </p>
                                        <div className="mt-6 flex justify-center">
                                            {/* <img 
                                                src="/home-page/texting/pexels-laura-tancredi-7065081.jpg" 
                                                alt="People challenging each other" 
                                                className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-[#0a0a0a] shadow-lg transition-transform duration-300 hover:scale-110"
                                            /> */}
                                        </div>
                                    </div>
                                </div>

                                {/* Feature 2 */}
                                <div className="group relative bg-white dark:bg-[#0a0a0a] rounded-3xl p-8 shadow-lg border border-[#19140035] dark:border-[#3E3E3A] transition-all duration-700 ease-out transform hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up delay-400">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-red-50/50 dark:from-orange-900/10 dark:to-red-900/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-[#1b1b18] dark:bg-[#EDEDEC] text-white dark:text-[#1b1b18] mx-auto mb-6 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-3">
                                        <span className="material-symbols-outlined text-4xl">local_fire_department</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-[#1b1b18] dark:text-[#EDEDEC] mb-4 text-center">Spicy or Sweet</h3>
                                        <p className="text-[#1b1b18]/80 dark:text-[#EDEDEC]/80 text-center leading-relaxed">
                                            Play naughty, flirt freely, and watch the sparks fly
                                        </p>
                                        <div className="mt-6 flex justify-center">
                                            <div className="flex space-x-2">
                                                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                                                <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse delay-200"></div>
                                                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse delay-400"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Feature 3 */}
                                <div className="group relative bg-white dark:bg-[#0a0a0a] rounded-3xl p-8 shadow-lg border border-[#19140035] dark:border-[#3E3E3A] transition-all duration-700 ease-out transform hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up delay-600">
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-[#1b1b18] dark:bg-[#EDEDEC] text-white dark:text-[#1b1b18] mx-auto mb-6 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-3">
                                        <span className="material-symbols-outlined text-4xl">paid</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-[#1b1b18] dark:text-[#EDEDEC] mb-4 text-center">Play or Pay Hub</h3>
                                        <p className="text-[#1b1b18]/80 dark:text-[#EDEDEC]/80 text-center leading-relaxed">
                                            Collect tokens from the crowd — 1 token = 1 Ksh. Outsmart, outplay, outlaugh
                                        </p>
                                        <div className="mt-6 flex justify-center">
                                            {/* <img 
                                                src="/home-page/tokens/pexels-karoldach-325154.jpg" 
                                                alt="Token economy" 
                                                className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-[#0a0a0a] shadow-lg transition-transform duration-300 hover:scale-110"
                                            /> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* How It Works Section */}
                    <section className="py-24 bg-[#FDFDFC] dark:bg-[#0a0a0a]" id="how-it-works">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-20 animate-fade-in-up">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#19140035] text-[#1b1b18] dark:bg-[#3E3E3A] dark:text-[#EDEDEC] text-sm font-semibold mb-6">
                            <span className="material-symbols-outlined mr-2 text-lg animate-float">help_outline</span>
                            How It Works
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-[#1b1b18] dark:text-[#EDEDEC] mb-6">
                            Three Simple Steps to{' '}
                            <span className="text-red-600 dark:text-red-400 relative">
                            Mayhem
                            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-shimmer"></div>
                            </span>
                        </h2>

                        <p className="text-xl text-[#1b1b18]/80 dark:text-[#EDEDEC]/80 max-w-3xl mx-auto leading-relaxed">
                            Your gateway to bold dares, real stakes, and unforgettable chaos. Here’s how the madness unfolds.
                        </p>
                        </div>

                        <div className="relative">
                        {/* Connection Line */}
                        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#19140035] via-red-200 to-[#19140035] dark:from-[#3E3E3A] dark:via-red-800 dark:to-[#3E3E3A] transform -translate-y-1/2 animate-fade-in-up delay-400"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
                            
                            {/* Step 1 */}
                            <div className="relative group animate-fade-in-up delay-200">
                            <div className="relative z-10 bg-white dark:bg-[#0a0a0a] rounded-3xl p-8 shadow-xl border border-[#19140035] dark:border-[#3E3E3A] transition-all duration-700 ease-out transform hover:-translate-y-2 hover:shadow-2xl">
                                <div className="text-center">
                                <div className="relative flex items-center justify-center mb-8">
                                    <div className="absolute h-32 w-32 rounded-full bg-red-100/50 dark:bg-red-900/20 transition-all duration-500 ease-out group-hover:scale-110"></div>
                                    <div className="relative z-10 flex items-center justify-center h-24 w-24 rounded-full bg-[#1b1b18] dark:bg-[#EDEDEC] text-white dark:text-[#1b1b18] text-4xl font-black transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6">
                                    1
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-[#1b1b18] dark:text-[#EDEDEC] mb-4">Create a Challenge</h3>
                                <p className="text-[#1b1b18]/80 dark:text-[#EDEDEC]/80 leading-relaxed mb-6">
                                    Pick your vibe — public for meeting random players, or private for your crew only. Set the tone with bold, flirty, or hilarious questions. Keep it personal, keep it anonymous — the best challenges always are.
                                </p>
                                </div>
                            </div>
                            </div>

                            {/* Step 2 */}
                            <div className="relative group animate-fade-in-up delay-400">
                            <div className="relative z-10 bg-white dark:bg-[#0a0a0a] rounded-3xl p-8 shadow-xl border border-[#19140035] dark:border-[#3E3E3A] transition-all duration-700 ease-out transform hover:-translate-y-2 hover:shadow-2xl">
                                <div className="text-center">
                                <div className="relative flex items-center justify-center mb-8">
                                    <div className="absolute h-32 w-32 rounded-full bg-orange-100/50 dark:bg-orange-900/20 transition-all duration-500 ease-out group-hover:scale-110"></div>
                                    <div className="relative z-10 flex items-center justify-center h-24 w-24 rounded-full bg-[#1b1b18] dark:bg-[#EDEDEC] text-white dark:text-[#1b1b18] text-4xl font-black transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6">
                                    2
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-[#1b1b18] dark:text-[#EDEDEC] mb-4">Play the Game</h3>
                                <p className="text-[#1b1b18]/80 dark:text-[#EDEDEC]/80 leading-relaxed mb-6">
                                    Answer questions, tease, flirt, and react. Call out bluffers, keep the banter alive, and make every move count. Every clever response is noticed, every daring action has stakes.
                                </p>
                                </div>
                            </div>
                            </div>

                            {/* Step 3 */}
                            <div className="relative group animate-fade-in-up delay-600">
                            <div className="relative z-10 bg-white dark:bg-[#0a0a0a] rounded-3xl p-8 shadow-xl border border-[#19140035] dark:border-[#3E3E3A] transition-all duration-700 ease-out transform hover:-translate-y-2 hover:shadow-2xl">
                                <div className="text-center">
                                <div className="relative flex items-center justify-center mb-8">
                                    <div className="absolute h-32 w-32 rounded-full bg-green-100/50 dark:bg-green-900/20 transition-all duration-500 ease-out group-hover:scale-110"></div>
                                    <div className="relative z-10 flex items-center justify-center h-24 w-24 rounded-full bg-[#1b1b18] dark:bg-[#EDEDEC] text-white dark:text-[#1b1b18] text-4xl font-black transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6">
                                    3
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-[#1b1b18] dark:text-[#EDEDEC] mb-4">Cash In the Consequences</h3>
                                <p className="text-[#1b1b18]/80 dark:text-[#EDEDEC]/80 leading-relaxed mb-6">
                                    Tokens come from the other players — 1 token = 1 Ksh. Whether someone backs out or rises to the challenge, every move has value. Play smart, charm your way through, and cash in on your chaos.
                                </p>
                                </div>
                            </div>
                            </div>

                        </div>
                        </div>
                    </div>
                    </section>

                    {/* Social Proof Section */}
                    <section className="py-24 bg-white dark:bg-[#0a0a0a]">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16 animate-fade-in-up">
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#19140035] text-[#1b1b18] dark:bg-[#3E3E3A] dark:text-[#EDEDEC] text-sm font-semibold mb-6">
                                    <span className="material-symbols-outlined mr-2 text-lg animate-float">verified</span>
                                    Trusted by Thousands
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-[#1b1b18] dark:text-[#EDEDEC] mb-6">
                                    Join the{' '}
                                    <span className="text-red-600 dark:text-red-400 relative">
                                        Revolution
                                        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-shimmer"></div>
                                    </span>
                                </h2>
                                <p className="text-xl text-[#1b1b18]/80 dark:text-[#EDEDEC]/80 max-w-3xl mx-auto leading-relaxed">
                                    See what our community is saying about their Play or Pay experience.
                                </p>
                            </div>
                            
                            <div className="grid md:grid-cols-3 gap-8 mb-16 animate-fade-in-up delay-200">
                                {/* Stats */}
                                <div className="text-center">
                                    <div className="text-5xl font-black text-red-600 mb-2 animate-scale-in delay-400">10K+</div>
                                    <div className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC] mb-1">Active Players</div>
                                    <div className="text-[#1b1b18]/60 dark:text-[#EDEDEC]/60">And growing daily</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-5xl font-black text-pink-600 mb-2 animate-scale-in delay-600">50K+</div>
                                    <div className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC] mb-1">Tokens Transfared</div>
                                    <div className="text-[#1b1b18]/60 dark:text-[#EDEDEC]/60">With real stakes</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-5xl font-black text-purple-600 mb-2 animate-scale-in delay-800">98%</div>
                                    <div className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC] mb-1">Satisfaction Rate</div>
                                    <div className="text-[#1b1b18]/60 dark:text-[#EDEDEC]/60">Users love it</div>
                                </div>
                            </div>
                            
                            {/* Testimonials */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <div className="bg-[#FDFDFC] dark:bg-[#0a0a0a] rounded-3xl p-8 border border-[#19140035] dark:border-[#3E3E3A] transition-all duration-500 ease-out transform hover:-translate-y-1 hover:shadow-xl animate-fade-in-up delay-400">
                                    <p className="text-[#1b1b18]/80 dark:text-[#EDEDEC]/80 italic">
                                        "This app changed how I interact with friends. The challenges are seductive, the stakes make everything more exciting — and the rewards have genuinely helped me cover my bills."
                                    </p>
                                    <div className="flex text-yellow-400 mt-4">
                                        {'★'.repeat(5)}
                                    </div>
                                </div>
                                
                                <div className="bg-[#FDFDFC] dark:bg-[#0a0a0a] rounded-3xl p-8 border border-[#19140035] dark:border-[#3E3E3A] transition-all duration-500 ease-out transform hover:-translate-y-1 hover:shadow-xl animate-fade-in-up delay-600">
                                    <p className="text-[#1b1b18]/80 dark:text-[#EDEDEC]/80 italic">
                                        "Finally, a way to make hanging out with friends more interesting. The token system is genius — and turning those tokens into real money for my bills? Game-changer."
                                    </p>
                                    <div className="flex text-yellow-400 mt-4">
                                        {'★'.repeat(5)}
                                    </div>
                                </div>
                                
                                <div className="bg-[#FDFDFC] dark:bg-[#0a0a0a] rounded-3xl p-8 border border-[#19140035] dark:border-[#3E3E3A] transition-all duration-500 ease-out transform hover:-translate-y-1 hover:shadow-xl animate-fade-in-up delay-800">
                                    <p className="text-[#1b1b18]/80 dark:text-[#EDEDEC]/80 italic">
                                        "I've gained more tokens than I can count. What started as fun ended up helping me pay actual bills — addictive in the best way possible."
                                    </p>
                                    <div className="flex text-yellow-400 mt-4">
                                        {'★'.repeat(5)}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* Enhanced CTA Section */}
                    <section className="relative overflow-hidden bg-[#1b1b18] dark:bg-[#EDEDEC]">
                        <div className="absolute inset-0">
                            <img 
                                src="/home-page/texting/pexels-cottonbro-6593743.jpg" 
                                alt="Background" 
                                className="w-full h-full object-cover opacity-10 dark:opacity-5 transition-all duration-1000 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-[#1b1b18]/95 via-[#1b1b18]/90 to-[#1b1b18]/95 dark:from-[#EDEDEC]/95 dark:via-[#EDEDEC]/90 dark:to-[#EDEDEC]/95"></div>
                        </div>
                        
                        <div className="relative z-10 max-w-4xl mx-auto text-center py-24 px-4 sm:px-6">
                            <div className="mb-8 animate-fade-in-up">
                                <span className="material-symbols-outlined text-6xl text-white/80 dark:text-[#1b1b18]/80 mb-4 animate-float">emoji_events</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white dark:text-[#1b1b18] mb-6 leading-tight animate-fade-in-up delay-200">
                                Enough Talk.{' '}
                                <span className="text-yellow-300 dark:text-yellow-600 relative">
                                    Time for Action.
                                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-shimmer"></div>
                                </span>
                            </h2>
                            <p className="text-xl md:text-2xl text-white/80 dark:text-[#1b1b18]/80 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-400">
                                Your friends are waiting. The challenges are ready. The only thing missing is you. 
                                <span className="font-bold text-white dark:text-[#1b1b18]">Stop hesitating.</span>
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-600">
                                <Link
                                    href={route('register')}
                                    className="group inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-[#1b1b18] dark:text-white bg-white dark:bg-[#1b1b18] rounded-2xl shadow-2xl transition-all duration-500 ease-out transform hover:scale-105 hover:shadow-3xl"
                                >
                                    <span className="material-symbols-outlined mr-3 text-2xl transition-transform duration-300 group-hover:animate-bounce">rocket_launch</span>
                                Join the Fray
                                    <span className="material-symbols-outlined ml-3 text-2xl transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
                                </Link>
                                <div className="text-white/80 dark:text-[#1b1b18]/80 text-sm">
                                    <div className="flex items-center justify-center space-x-2">
                                        <span className="material-symbols-outlined text-lg animate-pulse">security</span>
                                        <span>100% Secure & Anonymous</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-fade-in-up delay-800">
                                <div>
                                    <div className="text-3xl font-black text-white dark:text-[#1b1b18] mb-2 animate-scale-in delay-1000">24/7</div>
                                    <div className="text-white/60 dark:text-[#1b1b18]/60">Always Active</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-white dark:text-[#1b1b18] mb-2 animate-scale-in delay-1200">Free</div>
                                    <div className="text-white/60 dark:text-[#1b1b18]/60">To Start</div>
                                </div>
                                {/* <div>
                                    <div className="text-3xl font-black text-white dark:text-[#1b1b18] mb-2 animate-scale-in delay-1000">Instant</div>
                                    <div className="text-white/60 dark:text-[#1b1b18]/60">Payments</div>
                                </div> */}
                                <div>
                                    <div className="text-3xl font-black text-white dark:text-[#1b1b18] mb-2 animate-scale-in delay-1200">Local</div>
                                    <div className="text-white/60 dark:text-[#1b1b18]/60">Community</div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Enhanced Footer */}
                <footer className="bg-[#1b1b18] dark:bg-[#EDEDEC] text-white dark:text-[#1b1b18]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="grid md:grid-cols-4 gap-8 mb-12 animate-fade-in-up">
                            {/* Brand */}
                            <div className="md:col-span-2">
                                <h3 className="text-3xl font-bold text-white dark:text-[#1b1b18] mb-4 animate-fade-in-left">
                                    Play or Pay Hub
                                </h3>
                                <p className="text-white/80 dark:text-[#1b1b18]/80 mb-6 max-w-md leading-relaxed">
                                    The ultimate platform for daring challenges and real stakes. Where friendships are tested and legends are born.
                                </p>
                                <div className="flex space-x-4">
                                    <a href="#" className="text-white/60 dark:text-[#1b1b18]/60 hover:text-white dark:hover:text-[#1b1b18] transition-all duration-300 ease-out transform hover:scale-110">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                        </svg>
                                    </a>
                                    <a href="#" className="text-white/60 dark:text-[#1b1b18]/60 hover:text-white dark:hover:text-[#1b1b18] transition-all duration-300 ease-out transform hover:scale-110">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                                        </svg>
                                    </a>
                                    <a href="#" className="text-white/60 dark:text-[#1b1b18]/60 hover:text-white dark:hover:text-[#1b1b18] transition-all duration-300 ease-out transform hover:scale-110">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            
                            {/* Quick Links */}
                            <div className="animate-fade-in-up delay-200">
                                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                                <ul className="space-y-2">
                                    <li><a href="#features" className="text-white/60 dark:text-[#1b1b18]/60 hover:text-white dark:hover:text-[#1b1b18] transition-all duration-300 ease-out">Features</a></li>
                                    <li><a href="#how-it-works" className="text-white/60 dark:text-[#1b1b18]/60 hover:text-white dark:hover:text-[#1b1b18] transition-all duration-300 ease-out">How It Works</a></li>
                                    <li><a href="#" className="text-white/60 dark:text-[#1b1b18]/60 hover:text-white dark:hover:text-[#1b1b18] transition-all duration-300 ease-out">Pricing</a></li>
                                    <li><a href="#" className="text-white/60 dark:text-[#1b1b18]/60 hover:text-white dark:hover:text-[#1b1b18] transition-all duration-300 ease-out">Safety</a></li>
                                </ul>
                            </div>
                            
                            {/* Support */}
                            <div className="animate-fade-in-up delay-400">
                                <h4 className="text-lg font-semibold mb-4">Support</h4>
                                <ul className="space-y-2">
                                    <li><a href="#" className="text-white/60 dark:text-[#1b1b18]/60 hover:text-white dark:hover:text-[#1b1b18] transition-all duration-300 ease-out">Help Center</a></li>
                                    <li><a href="#" className="text-white/60 dark:text-[#1b1b18]/60 hover:text-white dark:hover:text-[#1b1b18] transition-all duration-300 ease-out">Contact Us</a></li>
                                    <li><a href="#" className="text-white/60 dark:text-[#1b1b18]/60 hover:text-white dark:hover:text-[#1b1b18] transition-all duration-300 ease-out">Privacy Policy</a></li>
                                    <li><a href="#" className="text-white/60 dark:text-[#1b1b18]/60 hover:text-white dark:hover:text-[#1b1b18] transition-all duration-300 ease-out">Terms of Service</a></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="border-t border-white/20 dark:border-[#1b1b18]/20 pt-8 animate-fade-in-up delay-600">
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <p className="text-white/60 dark:text-[#1b1b18]/60 text-sm">
                                    © 2024 Play or Pay Hub. All rights reserved. Made with ❤️ for daredevils everywhere.
                                </p>
                                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                                    <span className="text-white/60 dark:text-[#1b1b18]/60 text-sm">Secure & Anonymous</span>
                                    <div className="flex items-center space-x-1">
                                        <span className="material-symbols-outlined text-green-500 text-sm animate-pulse">verified</span>
                                        <span className="text-white/60 dark:text-[#1b1b18]/60 text-sm">SSL Encrypted</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>

                {/* End converted template */}
            </div>
        </>
    );
}
