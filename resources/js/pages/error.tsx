import React, { useEffect, useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

export default function ErrorPage() {
	const page = usePage();
	const p: any = page.props || {};

	const explicit = p.message ?? p.error ?? (p.flash && p.flash.error) ?? (p.errors && p.errors.message);

	let derived: string | undefined = undefined;
	if (!explicit && p.errors && typeof p.errors === 'object') {
		const vals = Object.values(p.errors).filter(Boolean);
		if (vals.length) {
			const first = vals[0];
			if (Array.isArray(first)) {
				derived = first.join(' ');
			} else if (typeof first === 'string') {
				derived = first;
			}
		}
	}

	const message = explicit ?? derived ?? 'We encountered an unexpected issue. Please try again or contact support if the problem persists.';
	const title = p.title ?? 'Process Failed';
	const backUrl: string = p.backUrl ?? '/';

	// simple mount animation for entrance
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		const t = setTimeout(() => setMounted(true), 20);
		return () => clearTimeout(t);
	}, []);

	return (
		<AppLayout>
			<div className="flex flex-col items-center justify-center py-16 px-4">
				<div className={`max-w-2xl w-full bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden transform transition-all duration-450 ease-out ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'}`}>
					<div className="p-8 md:p-12">
						<div className="flex items-start gap-6">
							<div className="flex-shrink-0">
								<div className="w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
									<span className="material-symbols-outlined text-primary text-5xl">error</span>
								</div>
							</div>

							<div className="flex-1">
								<h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">{title}</h1>
								<p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{message}</p>

								<p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Play or Pay is a fast-paced trivia and prediction platform where players compete in short rounds to win rewards. Matches are quick, social, and designed for fair play — play your best or pay the entry to keep the competition moving.</p>

								<div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-3">
									<Link href={backUrl} className="w-full sm:w-auto">
										<Button className="w-full sm:w-auto transform transition-transform duration-150 hover:-translate-y-0.5">Back to Dashboard</Button>
									</Link>

									<Link href="/games/lobby" className="w-full sm:w-auto">
										<Button className="w-full sm:w-auto bg-white dark:bg-slate-700 text-primary border border-primary/10 hover:shadow-md transform transition-transform duration-150 hover:-translate-y-0.5">Go to Lobby</Button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</AppLayout>
	);
}

