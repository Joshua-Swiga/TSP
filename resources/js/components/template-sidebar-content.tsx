import { Link, usePage, router } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { Home, Play, MessageCircle, Rss, User, Settings, ShoppingCart, Info, LogOut, HelpCircle } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import EnableNotifications from '@/components/enable-notifications';
import { Bell } from "lucide-react";
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';


export default function TemplateSidebarContent({ onNavigate }: { onNavigate?: () => void }) {
    const { auth } = usePage<SharedData>().props;
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';
    const page = usePage();

    const avatarUrl = String(auth?.user?.profile_photo_url || auth?.user?.avatar || '');
    const displayName = String(auth?.user?.name ?? 'Player');
    const handleName = String(auth?.user?.username || auth?.user?.handle || (auth?.user?.name ? `@${String(auth.user.name).split(' ')[0].toLowerCase()}` : '@player'));

    const navItems = [
        { title: 'Home', href: '/dashboard', icon: Home },
        { title: 'Profile', href: `/settings/profile`, icon: User },
        { title: 'Active Games', href: '/players/inbox', icon: MessageCircle },
        { title: 'Play', href: '/games/lobby', icon: Play },
        // { title: 'Lead Board', href: '/leading-board', icon: Rss },
        // { title: 'Notifications', href: '/settings/notifications', icon: Bell  },
    ];
    const handleLogout = () => {
            cleanup();
            router.flushAll();
        };
        const cleanup = useMobileNavigation();
        

    return (
        <div className="flex h-full flex-col">
            {/* Avatar / header area */}
            <div className={isCollapsed ? 'flex items-center justify-center py-3' : 'flex items-center gap-4 mb-6 p-4'}>
                <div
                    className={isCollapsed ? 'bg-center bg-no-repeat bg-cover rounded-full size-10' : 'bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 flex-shrink-0'}
                    style={{ backgroundImage: `url("${avatarUrl}")` }}
                />
                {!isCollapsed && (
                    <div>
                        <div className="text-base font-semibold">{displayName}</div>
                        <div className="text-sm text-muted-light dark:text-muted-dark">{handleName}</div>
                    </div>
                )}
            </div>

            <nav className="flex-1 px-2 pb-4" aria-label="Primary">
                <TooltipProvider>
                    <ul className={isCollapsed ? 'space-y-3 flex flex-col items-center list-none m-0 p-0' : 'space-y-2 list-none m-0 p-0'}>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = page.url === item.href || page.url?.startsWith(item.href + '/');
                            return (
                                <li key={item.title} className={isCollapsed ? 'w-full' : ''}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            {/* If this is the Ebalbel notification item, render a button that opens the modal instead of a link */}
                                            {item.href === '/settings/notifications' ? (
                                                <button
                                                    onClick={() => {
                                                        const ev = new CustomEvent('openEnableNotifications');
                                                        window.dispatchEvent(ev);
                                                        try {
                                                            if (typeof (window as any).__openEnableNotifications === 'function') {
                                                                (window as any).__openEnableNotifications();
                                                            }
                                                        } catch (e) {
                                                            // ignore
                                                        }
                                                    }}
                                                    className={
                                                        isCollapsed
                                                            ? `inline-flex items-center justify-center w-10 h-10 rounded-md ${isActive ? 'bg-primary/10 text-primary' : 'text-sidebar-foreground'} hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary`
                                                            : `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-primary/10 text-primary font-semibold' : ''} hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary`
                                                    }
                                                    aria-label={item.title}
                                                >
                                                    <Icon className="size-5" />
                                                    {!isCollapsed && <span className="font-medium">{item.title}</span>}
                                                </button>
                                            ) : (
                                                <Link
                                                    href={item.href}
                                                    className={
                                                        isCollapsed
                                                            ? `inline-flex items-center justify-center w-10 h-10 rounded-md ${isActive ? 'bg-primary/10 text-primary' : 'text-sidebar-foreground'} hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary`
                                                            : `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-primary/10 text-primary font-semibold' : ''} hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary`
                                                    }
                                                    onClick={onNavigate}
                                                    aria-label={item.title}
                                                >
                                                    <Icon className="size-5" />
                                                    {!isCollapsed && <span className="font-medium">{item.title}</span>}
                                                </Link>
                                            )}
                                        </TooltipTrigger>
                                        {isCollapsed && (
                                            <TooltipContent side="right" sideOffset={8}>
                                                <span>{item.title}</span>
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                </li>
                            );
                        })}
                        {/* FAQ link under How to play */}
                        <li className={isCollapsed ? 'w-full' : ''}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="/FAQ"
                                        className={
                                            isCollapsed
                                                ? `inline-flex items-center justify-center w-10 h-10 rounded-md text-sidebar-foreground hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary`
                                                : 'flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary'
                                        }
                                        onClick={onNavigate}
                                        aria-label="FAQ"
                                    >
                                        <HelpCircle className="size-5" />
                                        {!isCollapsed && <span className="font-medium">FAQ</span>}
                                    </Link>
                                </TooltipTrigger>
                                {isCollapsed && (
                                    <TooltipContent side="right" sideOffset={8}>
                                        <span>FAQ</span>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </li>
                            {/* How to play trigger (opens onboarding modal) */}
                            <li className={isCollapsed ? 'w-full' : ''}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={() => {
                                                console.log('openOnboarding clicked');
                                                const ev = new CustomEvent('openOnboarding');
                                                window.dispatchEvent(ev);
                                                // try global fallback in case event listeners didn't catch it
                                                try {
                                                    if (typeof (window as any).__openOnboarding === 'function') {
                                                        console.log('calling global __openOnboarding fallback');
                                                        (window as any).__openOnboarding();
                                                    } else {
                                                        console.log('__openOnboarding not present, scheduling retry');
                                                        setTimeout(() => {
                                                            try {
                                                                if (typeof (window as any).__openOnboarding === 'function') {
                                                                    console.log('retry: calling global __openOnboarding fallback');
                                                                    (window as any).__openOnboarding();
                                                                } else {
                                                                    console.warn('retry: __openOnboarding still not present');
                                                                    // final fallback: show debug onboarding injected on the window
                                                                    try {
                                                                        if (typeof (window as any).__showOnboardingDebug === 'function') {
                                                                            console.log('final fallback: calling __showOnboardingDebug');
                                                                            (window as any).__showOnboardingDebug();
                                                                        }
                                                                    } catch (e) {
                                                                        console.error('final fallback __showOnboardingDebug failed', e);
                                                                    }
                                                                }
                                                            } catch (e) {
                                                                console.error('retry global __openOnboarding fallback failed', e);
                                                            }
                                                        }, 250);
                                                    }
                                                } catch (e) {
                                                    console.error('global __openOnboarding fallback failed', e);
                                                }
                                            }}
                                            className={
                                                isCollapsed
                                                    ? `inline-flex items-center justify-center w-10 h-10 rounded-md text-sidebar-foreground hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary`
                                                    : 'flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary'
                                            }
                                            aria-label="How to play"
                                        >
                                            <Info className="size-5" />
                                            {!isCollapsed && <span className="font-medium">How to play</span>}
                                        </button>
                                    </TooltipTrigger>
                                    {isCollapsed && (
                                        <TooltipContent side="right" sideOffset={8}>
                                            <span>How to play</span>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </li>
                    </ul>
                </TooltipProvider>
            </nav>

            {/* Mount enable notifications modal here so sidebar button can open it */}
            <EnableNotifications />

            <div className="p-4">
                {isCollapsed ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link className="block w-full" method="post" href={route('logout')} as="button" onClick={handleLogout}>
                            <LogOut className="mr-2" />
                            Log out
                        </Link>
                        </TooltipTrigger>
{/*                         
                        <TooltipContent side="right">
                            <span>Buy Tokens</span>
                        </TooltipContent> */}
                    </Tooltip>
                ) : (
                    <div className="flex flex-col">
                        {/* Visible logout action for expanded sidebar */}
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150 text-foreground"
                        >
                            <LogOut className="size-4" />
                            <span className="font-medium">Log out</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
