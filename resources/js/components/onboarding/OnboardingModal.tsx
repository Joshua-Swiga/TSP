import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icon';
import { ChevronLeft, ChevronRight, Check, Star, Shield, Coins, Users, MessageCircle, Trophy, Info, Sparkles, Zap, Heart } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function OnboardingModal({ open, onOpenChange }: OnboardingModalProps) {
    const [index, setIndex] = useState(0);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [selectedGameType, setSelectedGameType] = useState<string | null>(null);

    useEffect(() => {
        if (!open) {
            setIndex(0);
            setAgreedToTerms(false);
            setSelectedGameType(null);
        }
    }, [open]);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (!open) return;
            if (e.key === 'Escape') onOpenChange(false);
            if (e.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, slides.length - 1));
            if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0));
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    const next = () => setIndex((i) => Math.min(i + 1, slides.length - 1));
    const prev = () => setIndex((i) => Math.max(i - 1, 0));

    const slides = [
        {
            // key: 'welcome',
            // title: 'Welcome to Play or Pay',
            content: (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="text-center space-y-8">
                    {/* Enhanced Logo with Glow Effect */}
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative mx-auto w-fit">
                        <motion.div 
                            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/40 to-purple-500/40 blur-2xl"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl border border-white/20">
                            <span className="font-black text-4xl tracking-wider">P</span>
                        </div>
                    </motion.div>

                    {/* Main Title with Better Typography */}
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="space-y-3">
                        <div className="flex items-center justify-center gap-2">
                            <motion.div 
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Sparkles className="w-5 h-5 text-purple-600" />
                            </motion.div>
                            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                                Play or Pay
                            </h2>
                            <motion.div 
                                animate={{ rotate: [0, -10, 10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Sparkles className="w-5 h-5 text-purple-600" />
                            </motion.div>
                        </div>
                        <p className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">
                            A game that rewards boldness
                        </p>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                            Answer prompts, skip if you dare, and move tokens. Fair, transparent, and entertaining.
                        </p>
                    </motion.div>

                    {/* Enhanced Game Type Selection with Better Styling */}
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35, duration: 0.5 }} className="pt-4">
                        <p className="text-xs md:text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300 uppercase tracking-widest">Choose Your Game</p>
                        <div className="flex justify-center gap-3 flex-wrap">
                            {['Truth or Dare', 'Would You Rather', 'Never Have I Ever'].map((type, idx) => (
                                <TooltipProvider key={type}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <motion.div
                                                initial={{ y: 10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.4 + idx * 0.08 }}
                                            >
                                                <Button
                                                    onClick={() => setSelectedGameType(type)}
                                                    aria-pressed={selectedGameType === type}
                                                    className={`relative h-10 px-5 text-sm font-semibold transition-all duration-300 border-2 ${
                                                        selectedGameType === type
                                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg scale-105'
                                                            : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-purple-500'
                                                    }`}
                                                    aria-label={`Select ${type}`}
                                                >
                                                    {type}
                                                </Button>
                                            </motion.div>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="bg-gray-900 text-white p-2 rounded-lg">
                                            <p>Experience {type}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                    </motion.div>

                    {/* Enhanced Benefits Grid with Hover Effects */}
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className="grid grid-cols-3 gap-3 mt-6">
                        {[
                            { icon: Coins, title: 'Tokens', desc: 'Move & track', color: 'from-yellow-500 to-orange-500' },
                            { icon: Zap, title: 'Live', desc: 'Real-time play', color: 'from-blue-500 to-cyan-500' },
                            { icon: Trophy, title: 'Rewards', desc: 'Win & track', color: 'from-purple-500 to-pink-500' },
                        ].map((benefit, i) => (
                            <motion.div
                                key={benefit.title}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.55 + i * 0.08 }}
                                className="group cursor-pointer"
                                whileHover={{ y: -4 }}
                            >
                                <div className="relative h-full rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                                    <div className={`relative flex flex-col items-center gap-2`}>
                                        <motion.div 
                                            className={`p-2.5 rounded-xl bg-gradient-to-br ${benefit.color} text-white shadow-lg`}
                                            whileHover={{ rotate: 6, scale: 1.1 }}
                                            transition={{ type: 'spring', stiffness: 200 }}
                                        >
                                            <benefit.icon className="w-5 h-5" />
                                        </motion.div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">{benefit.title}</h3>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">{benefit.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            ),
        },
        {
            key: 'how-it-works',
            // title: 'How It Works',
            content: (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
                    <motion.div initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.4 }} className="text-center">
                        <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Three Steps to Victory
                        </h2>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                            Simple, fair, and exciting gameplay starts here
                        </p>
                    </motion.div>

                    <div className="space-y-3">
                        {[
                            { 
                                value: 'step1', 
                                number: 1, 
                                title: 'Create or Join', 
                                desc: 'Start a room or join friends. Pick your game and set preferences.',
                                icon: Users,
                                color: 'from-blue-500 to-cyan-500',
                                tags: ['Invite Friends', 'Choose Mode', 'Set Rules'] 
                            },
                            { 
                                value: 'step2', 
                                number: 2, 
                                title: 'Answer & React', 
                                desc: 'Face the prompts. Chat live. Keep it smooth and respectful.',
                                icon: MessageCircle,
                                color: 'from-purple-500 to-pink-500',
                                extra: '30 rounds • Live reactions • Real conversations' 
                            },
                            { 
                                value: 'step3', 
                                number: 3, 
                                title: 'Play or Pay', 
                                desc: 'Skip a prompt? Transfer tokens instantly and fairly.',
                                icon: Coins,
                                color: 'from-yellow-500 to-orange-500',
                                extra: 'Instant transfers • Transparent history' 
                            },
                        ].map((step, i) => (
                            <motion.div 
                                key={step.value}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.15 + i * 0.1 }}
                            >
                                <div className="relative group rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 shadow-md hover:shadow-xl">
                                    {/* Accent line on left */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${step.color}`} />
                                    
                                    <div className="p-5">
                                        <div className="flex items-start gap-4 mb-3">
                                            <motion.div 
                                                className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center font-bold shadow-lg flex-shrink-0`}
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                transition={{ type: 'spring', stiffness: 200 }}
                                            >
                                                <step.icon className="w-6 h-6" />
                                            </motion.div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-0.5">
                                                    Step {step.number}: {step.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {step.desc}
                                                </p>
                                            </div>
                                        </div>

                                        {step.tags && (
                                            <motion.div 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2 + i * 0.1 }}
                                                className="flex flex-wrap gap-2"
                                            >
                                                {step.tags.map((tag, idx) => (
                                                    <motion.span
                                                        key={tag}
                                                        initial={{ scale: 0.8, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ delay: 0.22 + idx * 0.05 }}
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${step.color} shadow-md`}
                                                    >
                                                        {tag}
                                                    </motion.span>
                                                ))}
                                            </motion.div>
                                        )}

                                        {step.extra && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.25 + i * 0.1 }}
                                                className={`mt-3 p-3 rounded-lg bg-gradient-to-r ${step.color}/10 border border-gray-300 dark:border-gray-600 flex items-center gap-2`}
                                            >
                                                <Zap className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{step.extra}</span>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Progress Indicator */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center justify-center gap-2 pt-2"
                    >
                        {[1, 2, 3].map((num) => (
                            <motion.div
                                key={num}
                                className="flex items-center"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.4 + num * 0.1 }}
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center text-xs font-bold">
                                    {num}
                                </div>
                                {num < 3 && <div className="w-6 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-1" />}
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            ),
        },
        {
            // key: 'safety',
            // title: 'Play Fair. Play Safe.',
            content: (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
                    {/* Header Section with Icon */}
                    <motion.div initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.4 }} className="text-center">
                        <motion.div 
                            initial={{ scale: 0.8, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg mb-4"
                        >
                            <Shield className="w-10 h-10" />
                        </motion.div>
                        <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                            Fair Play Guarantee
                        </h2>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                            Transparent, respectful, and accountable gameplay for everyone
                        </p>
                    </motion.div>

                    {/* Guidelines with Better Visual Hierarchy */}
                    <motion.div 
                        initial={{ y: 15, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="space-y-3"
                    >
                        {[
                            { 
                                icon: Heart, 
                                title: 'Be Respectful', 
                                desc: 'Keep it appropriate and kind. No harassment or inappropriate content.', 
                                color: 'from-red-500 to-rose-500' 
                            },
                            { 
                                icon: Check, 
                                title: 'Play Fairly', 
                                desc: 'Honest answers and transparent token transfers. No cheating.', 
                                color: 'from-green-500 to-emerald-500' 
                            },
                            { 
                                icon: Zap, 
                                title: 'Be Prompt', 
                                desc: 'Settle tokens when required. Keep the game moving.', 
                                color: 'from-yellow-500 to-orange-500' 
                            },
                            { 
                                icon: Trophy, 
                                title: 'Adults Only', 
                                desc: 'For players 18+ only. Responsible gameplay required.', 
                                color: 'from-purple-500 to-pink-500' 
                            },
                        ].map((rule, i) => (
                            <motion.div
                                key={rule.title}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.25 + i * 0.08 }}
                                className="group"
                            >
                                <div className="relative rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 border-l-4 border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden">
                                    {/* Top colored accent */}
                                    <div className={`absolute top-0 right-0 w-12 h-12 bg-gradient-to-br ${rule.color} opacity-10 rounded-full -mr-4 -mt-4 group-hover:scale-125 transition-transform duration-300`} />
                                    
                                    <div className="relative flex items-start gap-3">
                                        <motion.div 
                                            className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${rule.color} text-white flex items-center justify-center shadow-md flex-shrink-0`}
                                            whileHover={{ rotate: 10, scale: 1.05 }}
                                            transition={{ type: 'spring', stiffness: 200 }}
                                        >
                                            <rule.icon className="w-5 h-5" />
                                        </motion.div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-0.5 text-sm">
                                                {rule.title}
                                            </h3>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                                {rule.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Enhanced Terms Agreement Section */}
                    {/* <motion.div 
                        initial={{ y: 15, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        transition={{ delay: 0.55, duration: 0.4 }}
                        className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-700 p-4"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm">
                                Before You Play
                            </h4>
                        </div>
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="w-5 h-5 rounded accent-blue-600 flex-shrink-0 mt-0.5 cursor-pointer"
                                aria-label="Agree to terms"
                            />
                            <label htmlFor="terms" className="text-sm text-blue-900 dark:text-blue-100 cursor-pointer flex-1 leading-relaxed">
                                <span className="font-semibold">I understand and agree to the guidelines.</span> I'm 18+, I'll play fairly, be respectful, and keep the game fun for everyone.
                            </label>
                        </div>
                    </motion.div> */}
                </motion.div>
            ),
        },
    ];

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="p-0 flex items-center justify-center bg-transparent">
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="onboarding-title"
                    className="bg-white dark:bg-gray-950 rounded-3xl shadow-2xl w-full max-w-2xl m-4 md:m-6 ring-1 ring-gray-200/50 dark:ring-gray-700/50 overflow-hidden border border-gray-200 dark:border-gray-800"
                >
                    {/* Header with Gradient Background */}
                    <SheetHeader className="relative p-6 md:p-8 bg-muted border-b border-border">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-40 dark:opacity-20">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl -mr-20 -mt-20" />
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-200 dark:bg-purple-900 rounded-full blur-3xl -ml-20 -mb-20" />
                        </div>

                        <div className="relative flex items-start justify-between gap-4">
                            <div className="flex-1">
                                {/* <SheetTitle id="onboarding-title" className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {slides[index].title}
                                </SheetTitle> */}
                                <p className="mt-2 text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                                    Step {index + 1} of {slides.length}
                                </p>
                            </div>
                            {/* outer close removed per request */}
                        </div>

                        {/* Enhanced Progress Bar */}
                        <div className="relative mt-5 h-2 w-full rounded-full bg-muted overflow-hidden shadow-inner">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.round(((index + 1) / slides.length) * 100)}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className="h-full bg-primary rounded-full shadow-lg"
                                aria-hidden
                            />
                        </div>
                    </SheetHeader>

                    {/* Content Area */}
                    <div className="p-6 md:p-8 overflow-y-auto max-h-[55vh] scrollbar-hide">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={slides[index].key}
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.35, ease: 'easeOut' }}
                            >
                                {slides[index].content}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Enhanced Footer Navigation */}
                    <div className="px-6 md:px-8 py-5 md:py-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            {/* Left Controls */}
                            <div className="flex items-center gap-3 w-full md:w-auto order-2 md:order-1">
                                <motion.div whileHover={{ x: -2 }} whileTap={{ scale: 0.9 }}>
                                    <Button 
                                        variant="ghost" 
                                        onClick={prev} 
                                        disabled={index === 0} 
                                        aria-label="Previous slide"
                                        className="hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </Button>
                                </motion.div>

                                {index < slides.length - 1 ? (
                                    <motion.div 
                                        whileHover={{ scale: 1.05 }} 
                                        whileTap={{ scale: 0.95 }}
                                        className="flex-1 md:flex-none"
                                    >
                                        <Button 
                                            onClick={next} 
                                            aria-label="Next"
                                            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all duration-150 rounded-lg"
                                        >
                                            Continue
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        whileHover={agreedToTerms ? { scale: 1.05 } : {}} 
                                        whileTap={agreedToTerms ? { scale: 0.95 } : {}}
                                        className="flex-1 md:flex-none"
                                    >
                                        {/* <Button 
                                            onClick={() => onOpenChange(false)} 
                                            disabled={!agreedToTerms}
                                            aria-label="Done"
                                            className="w-full md:w-auto bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 shadow-lg transition-all duration-150 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Start Playing
                                        </Button> */}
                                    </motion.div>
                                )}
                            </div>

                            {/* Center & Right Controls */}
                            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end order-1 md:order-2">
                                {/* Dot Indicators */}
                                <div className="flex items-center gap-2.5">
                                    {slides.map((s, i) => (
                                        <motion.button
                                            key={s.key}
                                            onClick={() => setIndex(i)}
                                            initial={{ scale: 0.8, opacity: 0.5 }}
                                            animate={{ 
                                                scale: i === index ? 1.2 : 1,
                                                opacity: i === index ? 1 : 0.4
                                            }}
                                            whileHover={{ scale: 1, opacity: 0.8 }}
                                            whileTap={{ scale: 0.9 }}
                                            className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                                i === index 
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                                                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
                                            aria-current={i === index ? 'true' : 'false'}
                                            aria-label={`Go to slide ${i + 1}`}
                                        />
                                    ))}
                                </div>

                                {/* Close Button (visible inner control) */}
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => onOpenChange(false)}
                                        aria-label="Close onboarding"
                                        className="border-primary text-primary hover:bg-primary/10 font-semibold rounded-lg"
                                    >
                                        Close
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}