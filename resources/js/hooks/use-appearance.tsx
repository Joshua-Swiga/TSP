import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const prefersDark = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

// Force the application into light mode at all times per request.
// This will still allow the UI to call the hook, but the app will always remain light.
const applyTheme = (_appearance: Appearance) => {
    // ensure 'dark' class is removed so the site stays light
    document.documentElement.classList.remove('dark');
    try {
        // also set a data attribute for consumer code that might check it
        document.documentElement.setAttribute('data-appearance', 'light');
    } catch (e) {
        // ignore DOM write errors in SSR
    }
};

const mediaQuery = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = () => {
    const currentAppearance = localStorage.getItem('appearance') as Appearance;
    applyTheme(currentAppearance || 'system');
};

export function initializeTheme() {
    // Force 'light' on startup
    try {
        localStorage.setItem('appearance', 'light');
        setCookie('appearance', 'light');
    } catch (e) {
        // ignore
    }
    applyTheme('light');
    // no need to listen for system changes when appearance is forced
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('system');

    const updateAppearance = useCallback((mode: Appearance) => {
        // Persist the user's intent but enforce light mode regardless
        setAppearance('light');
        try {
            localStorage.setItem('appearance', 'light');
            setCookie('appearance', 'light');
        } catch (e) {
            // ignore
        }
        applyTheme('light');
    }, []);

    useEffect(() => {
        const savedAppearance = localStorage.getItem('appearance') as Appearance | null;
        updateAppearance(savedAppearance || 'system');

        return () => mediaQuery()?.removeEventListener('change', handleSystemThemeChange);
    }, [updateAppearance]);

    return { appearance, updateAppearance } as const;
}
