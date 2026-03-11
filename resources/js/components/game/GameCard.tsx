import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Eye, Users, DollarSign, Clock, Zap } from 'lucide-react';

type Game = {
    id: string;
    title: string;
    subtitle?: string;
    thumbnail?: string;
    status: 'open' | 'in_progress' | 'finished';
    players: number;
    bet: number;
    viewers?: number;
};

export default function GameCard({ game, onJoin, onWatch }: { game: Game; onJoin?: (g: Game) => void; onWatch?: (g: Game) => void }) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'open':
                return {
                    bg: 'bg-green-100 dark:bg-green-900/30',
                    text: 'text-green-700 dark:text-green-400',
                    icon: <Zap className="w-3 h-3" />,
                    label: 'Open'
                };
            case 'in_progress':
                return {
                    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
                    text: 'text-yellow-700 dark:text-yellow-400',
                    icon: <Clock className="w-3 h-3" />,
                    label: 'Live'
                };
            case 'finished':
                return {
                    bg: 'bg-gray-100 dark:bg-gray-800',
                    text: 'text-gray-700 dark:text-gray-400',
                    icon: <Clock className="w-3 h-3" />,
                    label: 'Finished'
                };
            default:
                return {
                    bg: 'bg-gray-100 dark:bg-gray-800',
                    text: 'text-gray-700 dark:text-gray-400',
                    icon: <Clock className="w-3 h-3" />,
                    label: 'Unknown'
                };
        }
    };

    const statusConfig = getStatusConfig(game.status);

    return (
        <article className="group bg-[#FDFDFC] dark:bg-[#0a0a0a] rounded-3xl overflow-hidden border border-[#19140035] dark:border-[#3E3E3A] shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 hover:scale-[1.02]">
            {/* Game Thumbnail */}
            <div className="relative aspect-video bg-gradient-to-br from-[#19140035] to-[#19140035]/50 dark:from-[#3E3E3A] dark:to-[#3E3E3A]/50 overflow-hidden">
                {game.thumbnail ? (
                    <img 
                        src={game.thumbnail} 
                        alt={game.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-[#19140035]/20 dark:bg-[#3E3E3A]/20 flex items-center justify-center mx-auto mb-3">
                                <Zap className="w-8 h-8 text-[#1b1b18]/40 dark:text-[#EDEDEC]/40" />
                            </div>
                            <p className="text-sm text-[#1b1b18]/60 dark:text-[#EDEDEC]/60">No Preview</p>
                        </div>
                    </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                    <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} backdrop-blur-sm`}>
                        {statusConfig.icon}
                        {statusConfig.label}
                    </div>
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Game Content */}
            <div className="p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-[#1b1b18] dark:text-[#EDEDEC] mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                        {game.title}
                    </h3>
                    <p className="text-sm text-[#1b1b18]/60 dark:text-[#EDEDEC]/60">
                        {game.subtitle || 'Challenge your friends • Real stakes'}
                    </p>
                </div>

                {/* Game Stats */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">{game.players}</div>
                            <div className="text-xs text-[#1b1b18]/60 dark:text-[#EDEDEC]/60">Players</div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">{game.viewers ?? 0}</div>
                            <div className="text-xs text-[#1b1b18]/60 dark:text-[#EDEDEC]/60">Watching</div>
                        </div>
                    </div>
                </div>

                {/* Token Bet */}
                <div className="mb-6 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                            <span className="text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Token Bet</span>
                        </div>
                        <span className="text-lg font-black text-yellow-600 dark:text-yellow-400">{game.bet}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button 
                        onClick={() => onJoin?.(game)} 
                        className="flex-1 bg-[#1b1b18] dark:bg-[#EDEDEC] text-white dark:text-[#1b1b18] hover:bg-[#1b1b18]/90 dark:hover:bg-[#EDEDEC]/90 transition-all duration-200 transform hover:scale-105"
                    >
                        <Play className="w-4 h-4 mr-2" />
                        Join Game
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={() => onWatch?.(game)} 
                        className="border-[#19140035] dark:border-[#3E3E3A] text-[#1b1b18] dark:text-[#EDEDEC] hover:bg-[#19140035]/10 dark:hover:bg-[#3E3E3A]/10 transition-all duration-200"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </article>
    );
}
