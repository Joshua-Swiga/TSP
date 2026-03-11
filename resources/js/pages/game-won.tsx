import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icon';
import { Trophy, Share2, Repeat } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
	{ title: 'Game', href: '/games' },
	{ title: 'You won', href: '/game-won' },
];

export default function GameWon() {
	const reward = 250; // tokens awarded for this example
	const [count, setCount] = useState(0);
	const [celebrate, setCelebrate] = useState(true);
	const animRef = useRef<number | null>(null);

	useEffect(() => {
		// simple count-up animation
		const duration = 1200;
		const start = performance.now();
		function step(now: number) {
			const t = Math.min((now - start) / duration, 1);
			const eased = 1 - Math.pow(1 - t, 3); // ease out cubic
			setCount(Math.floor(eased * reward));
			if (t < 1) animRef.current = requestAnimationFrame(step);
		}
		animRef.current = requestAnimationFrame(step);
		// stop confetti after a short while
		const confettiTimer = setTimeout(() => setCelebrate(false), 3000);
		return () => {
			if (animRef.current) cancelAnimationFrame(animRef.current);
			clearTimeout(confettiTimer);
		};
	}, []);

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="You won!" />

			<div className="min-h-screen flex items-start justify-center py-12 px-6">
				<div className="w-full max-w-4xl">
					<div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/95 to-white/80 dark:from-background-dark/90 dark:to-background-dark/70 border border-gray-100 dark:border-gray-800 shadow-2xl p-8">
						{/* confetti */}
						{celebrate && (
							<div className="pointer-events-none absolute inset-0">
								{Array.from({ length: 14 }).map((_, i) => {
									const left = 6 + (i * 6) % 88;
									const delay = (i % 6) * 120;
									const hue = (i * 55) % 360;
									return (
										<span
											key={i}
											style={{ left: `${left}%`, animationDelay: `${delay}ms`, background: `hsl(${hue} 90% 60%)` }}
											className="confetti block absolute top-0 h-3 w-2 rounded-sm transform-gpu"
										/>
									);
								})}
							</div>
						)}

						<div className="flex flex-col lg:flex-row items-center gap-8">
							<div className="flex-shrink-0">
								<div className="flex items-center justify-center w-36 h-36 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/10 ring-1 ring-primary/10 animate-bounce-slow">
									<Icon iconNode={Trophy} className="h-14 w-14 text-yellow-500" />
								</div>
							</div>

							<div className="flex-1">
								<h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">You won the match!</h1>
								<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Great play — you earned a reward and moved up the leaderboard. Share your victory or challenge another opponent.</p>

								<div className="mt-6 flex items-end gap-6">
									<div>
										<div className="text-xs text-gray-500">REWARD</div>
										<div className="mt-1 flex items-baseline gap-3">
											<div className="text-4xl font-bold text-primary tracking-tight">{count}</div>
											<div className="text-sm text-gray-500">tokens</div>
										</div>
										<div className="text-xs text-gray-400 mt-1">+{reward - count} pending</div>
									</div>

									<div className="flex items-center gap-3 ml-auto">
										<Button variant="ghost" size="icon" asChild>
											<Link href="/play">
												<Icon iconNode={Repeat} className="h-5 w-5 text-gray-700 dark:text-gray-200" />
											</Link>
										</Button>
										<Button>
											<span className="flex items-center gap-2"><Icon iconNode={Share2} className="h-4 w-4" /> Share</span>
										</Button>
									</div>
								</div>
							</div>
						</div>

						<div className="mt-8">
							<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Match summary</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 shadow-sm">
									<div className="text-xs text-gray-500">Opponent</div>
									<div className="mt-2 font-semibold">Sophia</div>
									<div className="text-xs text-gray-400">Won by 3 points</div>
								</div>
								<div className="p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 shadow-sm">
									<div className="text-xs text-gray-500">Duration</div>
									<div className="mt-2 font-semibold">6m 24s</div>
									<div className="text-xs text-gray-400">Fast and decisive</div>
								</div>
								<div className="p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 shadow-sm">
									<div className="text-xs text-gray-500">Tokens Earned</div>
									<div className="mt-2 font-semibold">{reward}</div>
									<div className="text-xs text-gray-400">Auto-credited to your wallet</div>
								</div>
							</div>
						</div>
					</div>

					<div className="mt-6 flex gap-3">
						<Button asChild>
							<Link href="/dashboard">Back to dashboard</Link>
						</Button>
						
					</div>
				</div>
			</div>

			<style>{`
				.confetti{ animation: confetti-fall 1400ms cubic-bezier(.2,.9,.2,1) forwards; }
				@keyframes confetti-fall{ 0%{ transform: translateY(-8vh) rotate(0deg) scale(1); opacity:1 } 100%{ transform: translateY(60vh) rotate(360deg) scale(.9); opacity:0 } }
				.animate-bounce-slow{ animation: bounce 1600ms infinite; }
				@keyframes bounce{ 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-6px) } }
			`}</style>
		</AppLayout>
	);
}
