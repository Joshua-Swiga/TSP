import { useState } from 'react';
import {
    ChevronDown,
    HelpCircle,
    Zap,
    Shield,
    Coins,
    Settings,
    Lightbulb,
    Clock,
    Lock,
    Award,
    Mail,
    Phone,
    AlertCircle,
    PlayCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
    id: number;
    title: string;
    description: string;
    category: 'general' | 'gameplay' | 'tokens' | 'account';
    icon: React.ReactNode;
}

export default function FAQ() {
    const [openId, setOpenId] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState<'all' | 'general' | 'gameplay' | 'tokens' | 'account'>('all');

    const categoryConfig = {
        general: { label: 'General', color: 'from-red-500 to-pink-500', icon: HelpCircle },
        gameplay: { label: 'Gameplay', color: 'from-orange-500 to-red-500', icon: Zap },
        tokens: { label: 'Tokens', color: 'from-yellow-500 to-orange-500', icon: Coins },
        account: { label: 'Account', color: 'from-pink-500 to-red-500', icon: Shield },
    };

    const faqItems: FAQItem[] = [
        {
            id: 1,
            title: 'What is Play or Pay?',
            description:
                'Play or Pay is a social gaming platform where you connect with real people in real time. Join fun, interactive games, chat during gameplay, and keep the energy high with challenges and reactions.',
            category: 'general',
            icon: <HelpCircle className="w-5 h-5" />
        },
        {
            id: 2,
            title: 'How do I create or join a game?',
            description:
                'You can create a game in a few taps or join one instantly from the lobby. When creating a game, choose the game type and whether it is public or private.',
            category: 'gameplay',
            icon: <PlayCircle className="w-5 h-5" />
        },
        {
            id: 3,
            title: 'What is the difference between public and private games?',
            description:
                'Public games appear in the lobby and anyone can discover and join them. Private games come with a shareable link—copy it and invite only the people you want in the room.',
            category: 'gameplay',
            icon: <Lock className="w-5 h-5" />
        },
        {
            id: 4,
            title: 'Do games have separate rooms or chats?',
            description:
                'Yes. Each game has its own dedicated space and chat. Only invited or joined players can participate—no outsiders, no interruptions.',
            category: 'gameplay',
            icon: <Zap className="w-5 h-5" />
        },
        {
            id: 5,
            title: 'What are tokens and what do they mean?',
            description:
                'Tokens power the platform and represent real value. Your token balance is always visible so you can track rewards in real time during games.',
            category: 'tokens',
            icon: <Coins className="w-5 h-5" />
        },
        {
            id: 6,
            title: 'How much is 1 token worth?',
            description:
                '1 token equals 1 Kenyan shilling (Ksh). Tokens represent value and move between players based on engagement during games.',
            category: 'tokens',
            icon: <Award className="w-5 h-5" />
        },
        {
            id: 7,
            title: 'Where do tokens come from?',
            description:
                'Tokens move between players, not from the company. Players choose to credit one another during games to reward great answers, effort, creativity, and presence.',
            category: 'tokens',
            icon: <Coins className="w-5 h-5" />
        },
        {
            id: 8,
            title: 'Is it free to join games?',
            description:
                'Yes. Joining games is free, and playing is always optional. Tokens are designed to enhance the experience and act as incentives—not requirements.',
            category: 'general',
            icon: <Lightbulb className="w-5 h-5" />
        },
        {
            id: 9,
            title: 'How do withdrawals work?',
            description:
                'When you withdraw tokens, the platform applies a 20% service fee and the rest is yours. Withdrawals are processed within 48 hours and sent to the mobile number you provide.',
            category: 'tokens',
            icon: <Clock className="w-5 h-5" />
        },
        {
            id: 10,
            title: 'Why is there a 20% service fee?',
            description:
                'The service fee helps maintain the platform, improve performance, and keep everything running smoothly—so games stay fast, stable, and enjoyable.',
            category: 'tokens',
            icon: <Settings className="w-5 h-5" />
        },
        {
            id: 11,
            title: 'How do I create an account and manage my profile?',
            description:
                'Creating an account is free and quick. You control your profile and can update your details at any time from your settings.',
            category: 'account',
            icon: <Shield className="w-5 h-5" />
        },
        {
            id: 12,
            title: 'Can I delete my account?',
            description:
                'Yes. You can delete your account directly from your profile page. No emails, no waiting—your account controls are in your hands.',
            category: 'account',
            icon: <Lock className="w-5 h-5" />
        },
        {
            id: 13,
            title: 'Why might registrations be limited?',
            description:
                'To protect platform capacity and uphold safety standards, registrations may be limited as the community grows. This helps keep gameplay smooth and interactions safer.',
            category: 'account',
            icon: <AlertCircle className="w-5 h-5" />
        },
        {
            id: 14,
            title: 'What are the community guidelines?',
            description:
                'Play or Pay is built on respect. We promote friendly interactions, mutual respect, and healthy conversations. We strictly prohibit bullying, harassment, promoting drugs or substances, and any harmful or abusive behavior.',
            category: 'general',
            icon: <Shield className="w-5 h-5" />
        },
        {
            id: 15,
            title: 'What happens if someone violates the rules?',
            description:
                'Violations can lead to account action—sometimes immediately. Everyone deserves a safe space to interact, so we take safety seriously.',
            category: 'general',
            icon: <AlertCircle className="w-5 h-5" />
        },
        {
            id: 16,
            title: 'How do I contact support?',
            description:
                'You can reach us anytime. Email: playorplayhub@gmail.com. Phone: 0710308048. You can also use the contact form below—responses are typically within 24 hours.',
            category: 'general',
            icon: <Mail className="w-5 h-5" />
        },
        {
            id: 17,
            title: 'How fast will I get a response?',
            description:
                'We aim to respond within 24 hours. Clear communication and real support are part of the Play or Pay experience.',
            category: 'general',
            icon: <Phone className="w-5 h-5" />
        },
    ];

    const filteredItems = activeCategory === 'all' 
        ? faqItems 
        : faqItems.filter(item => item.category === activeCategory);

    return (
        <div className="w-full min-h-screen bg-[#FDFDFC] dark:bg-[#0a0a0a]">
            {/* Decorative Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full animate-pulse" />
                <div className="absolute top-1/2 -left-40 w-96 h-96 bg-pink-500/5 rounded-full animate-pulse delay-1000" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full animate-pulse delay-2000" />
            </div>

            {/* Main Content */}
            <div className="relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="pt-16 md:pt-24 pb-12 px-4 text-center"
                >
                    <div className="max-w-4xl mx-auto">
                        {/* Animated Icon */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="inline-flex items-center justify-center"
                        >
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="p-4 rounded-2xl bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 mb-6"
                            >
                                <HelpCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                            </motion.div>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-5xl md:text-6xl font-black mb-6"
                        >
                            <span className="bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                                Frequently Asked
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                                Questions
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="text-xl text-[#1b1b18]/80 dark:text-[#EDEDEC]/80 max-w-2xl mx-auto leading-relaxed"
                        >
                            Everything you need to know about Play or Pay. Can't find what you're looking for? 
                            <span className="font-semibold text-red-600 dark:text-red-400"> Contact our support team</span>
                        </motion.p>
                    </div>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex justify-center px-4 pb-12"
                >
                    <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
                        {['all', 'general', 'gameplay', 'tokens', 'account'].map((cat) => (
                            <motion.button
                                key={cat}
                                onClick={() => setActiveCategory(cat as any)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 border-2 ${
                                    activeCategory === cat
                                        ? 'bg-[#1b1b18] dark:bg-[#EDEDEC] text-white dark:text-[#1b1b18] border-red-500 dark:border-red-400 shadow-lg'
                                        : 'bg-[#1b1b18] dark:bg-[#EDEDEC] text-white dark:text-[#1b1b18] border-transparent hover:opacity-90'
                                }`}
                            >
                                {cat === 'all' ? 'All Questions' : categoryConfig[cat as keyof typeof categoryConfig]?.label}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="px-4 pb-12"
                >
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 md:p-8 border border-[#19140035] dark:border-[#3E3E3A] backdrop-blur-sm">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <motion.p
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-3xl font-bold text-red-600 dark:text-red-400"
                                >
                                    {filteredItems.length}
                                </motion.p>
                                <p className="text-sm text-[#1b1b18]/80 dark:text-[#EDEDEC]/80 mt-1">Questions</p>
                            </div>
                            <div className="text-center">
                                <motion.p
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.65 }}
                                    className="text-3xl font-bold text-pink-600 dark:text-pink-400"
                                >
                                    4
                                </motion.p>
                                <p className="text-sm text-[#1b1b18]/80 dark:text-[#EDEDEC]/80 mt-1">Categories</p>
                            </div>
                            <div className="text-center">
                                <motion.p
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="text-3xl font-bold text-orange-600 dark:text-orange-400"
                                >
                                    100%
                                </motion.p>
                                <p className="text-sm text-[#1b1b18]/80 dark:text-[#EDEDEC]/80 mt-1">Helpful</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* FAQ Items */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="px-4 pb-12"
                >
                    <div className="max-w-4xl mx-auto space-y-4">
                        <AnimatePresence mode="wait">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item, index) => {
                                    const categoryColor = categoryConfig[item.category].color;
                                    return (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ delay: index * 0.05, duration: 0.3 }}
                                            layout
                                        >
                                            <button
                                                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                                                className="w-full text-left group"
                                            >
                                                <motion.div
                                                    className={`relative overflow-hidden rounded-2xl p-6 md:p-7 border-2 transition-all duration-300 cursor-pointer ${
                                                        openId === item.id
                                                            ? 'bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-300 dark:border-red-500 shadow-xl'
                                                            : 'bg-white dark:bg-[#0a0a0a] border-[#19140035] dark:border-[#3E3E3A] hover:border-red-300 dark:hover:border-red-500 shadow-md hover:shadow-xl dark:shadow-none'
                                                    }`}
                                                    whileHover={{ translateY: -2 }}
                                                >
                                                    {/* Gradient accent line */}
                                                    <div
                                                        className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 ${
                                                            openId === item.id
                                                                ? `bg-gradient-to-b ${categoryColor}`
                                                                : 'bg-gray-300 dark:bg-gray-700 group-hover:bg-red-400 dark:group-hover:bg-red-500'
                                                        }`}
                                                    />

                                                    {/* Top background gradient */}
                                                    {openId === item.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${categoryColor} opacity-5 rounded-full blur-2xl -mr-20 -mt-20`}
                                                        />
                                                    )}

                                                    <div className="relative flex items-start justify-between gap-4">
                                                        <div className="flex items-start gap-4 flex-1">
                                                            {/* Icon */}
                                                            <motion.div
                                                                className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColor} text-white flex items-center justify-center shadow-lg`}
                                                                whileHover={{ rotate: 10, scale: 1.1 }}
                                                                transition={{ type: 'spring', stiffness: 200 }}
                                                            >
                                                                {item.icon}
                                                            </motion.div>

                                                            <div className="flex-1 text-left">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h3
                                                                        className={`font-bold text-lg transition-colors duration-300 ${
                                                                            openId === item.id
                                                                                ? 'text-red-900 dark:text-red-100'
                                                                                : 'text-[#1b1b18] dark:text-[#EDEDEC] group-hover:text-red-600 dark:group-hover:text-red-400'
                                                                        }`}
                                                                    >
                                                                        {item.title}
                                                                    </h3>
                                                                </div>
                                                                <motion.span
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: openId !== item.id ? 1 : 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className={`text-sm ${
                                                                        openId === item.id
                                                                            ? 'hidden'
                                                                            : 'text-[#1b1b18]/80 dark:text-[#EDEDEC]/80'
                                                                    }`}
                                                                >
                                                                    Click to expand
                                                                </motion.span>
                                                            </div>
                                                        </div>

                                                        {/* Chevron */}
                                                        <motion.div
                                                            animate={{ rotate: openId === item.id ? 180 : 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="flex-shrink-0 mt-1"
                                                        >
                                                            <ChevronDown
                                                                className={`w-6 h-6 transition-colors duration-300 ${
                                                                    openId === item.id
                                                                        ? 'text-red-600 dark:text-red-400'
                                                                        : 'text-[#1b1b18]/60 dark:text-[#EDEDEC]/60 group-hover:text-red-600 dark:group-hover:text-red-400'
                                                                }`}
                                                            />
                                                        </motion.div>
                                                    </div>
                                                </motion.div>
                            </button>

                                            {/* Description Content */}
                                            <AnimatePresence>
                                                {openId === item.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                        className="overflow-hidden"
                                                    >
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.1, duration: 0.2 }}
                                                            className={`bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-b-2xl px-6 md:px-7 py-6 md:py-7 border-2 border-t-0 border-[#19140035] dark:border-[#3E3E3A] text-[#1b1b18]/80 dark:text-[#EDEDEC]/80 leading-relaxed`}
                                                        >
                                                            <p className="mb-4">{item.description}</p>
                                                            <div className="flex items-center gap-2 pt-3 border-t border-[#19140035] dark:border-[#3E3E3A]">
                                                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500" />
                                                                <span className="text-sm font-semibold text-red-600 dark:text-red-400">Helpful tip</span>
                                                            </div>
                                                        </motion.div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12"
                                >
                                    <p className="text-[#1b1b18]/80 dark:text-[#EDEDEC]/80 text-lg">No questions found in this category</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Footer CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="px-4 pb-20"
                >
                    <div className="max-w-4xl mx-auto">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 to-pink-600 p-12 md:p-16 text-center shadow-2xl border border-red-400/30">
                            {/* Background decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />

                            <div className="relative z-10">
                                <motion.h2
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="text-4xl md:text-5xl font-black text-white mb-4"
                                >
                                    Still have questions?
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.75 }}
                                    className="text-lg text-red-100 mb-8 max-w-2xl mx-auto"
                                >
                                    Our support team is here to help. Reach out anytime and we'll get back to you as soon as possible.
                                </motion.p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 md:px-10 md:py-5 bg-white text-red-600 font-bold text-lg rounded-xl hover:shadow-2xl transition-all duration-200 shadow-lg"
                                >
                                    Contact Support
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
