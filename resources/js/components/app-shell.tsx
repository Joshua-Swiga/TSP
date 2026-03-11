import { SidebarProvider } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import OnboardingModal from '@/components/onboarding/OnboardingModal';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const isOpen = usePage<SharedData>().props.sidebarOpen;
    const [debugOnboardingOpen, setDebugOnboardingOpen] = useState(false);

    // Expose global functions to open/close the onboarding modal from non-React code paths
    useEffect(() => {
        (window as any).__showOnboardingDebug = () => setDebugOnboardingOpen(true);
        (window as any).__hideOnboardingDebug = () => setDebugOnboardingOpen(false);
    // no-op for enable notifications here; mounted in sidebar template
        return () => {
            try {
                delete (window as any).__showOnboardingDebug;
                delete (window as any).__hideOnboardingDebug;
                // nothing to delete for enable notifications here
            } catch (e) {
                (window as any).__showOnboardingDebug = undefined;
                (window as any).__hideOnboardingDebug = undefined;
                // nothing to undefined for enable notifications here
            }
        };
    }, []);

    // Mount the real OnboardingModal so it uses the project's Sheet/portal behavior and styles
    const modal = <OnboardingModal open={debugOnboardingOpen} onOpenChange={setDebugOnboardingOpen} />;
    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">
                {children}
                {modal}
            </div>
        );
    }

    return (
        <SidebarProvider defaultOpen={isOpen}>
            {children}
            {modal}
        </SidebarProvider>
    );
}
