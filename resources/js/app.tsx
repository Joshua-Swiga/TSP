import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { configureEcho } from '@laravel/echo-react';

configureEcho({
    broadcaster: 'pusher',
});
// Improve Echo config with environment vars and CSRF auth header for private channels
try {
    const key = import.meta.env.VITE_PUSHER_APP_KEY || import.meta.env.VITE_PUSHER_KEY || '';
    const cluster = import.meta.env.VITE_PUSHER_APP_CLUSTER || '';
    const scheme = import.meta.env.VITE_PUSHER_SCHEME || import.meta.env.VITE_PUSHER_SCHEME || 'https';
    const forceTLS = scheme === 'https';
    const tokenMeta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
    const csrf = tokenMeta ? tokenMeta.content : '';

    configureEcho({
        broadcaster: 'pusher',
        key: key,
        cluster: cluster,
        forceTLS: forceTLS,
        encrypted: forceTLS,
        auth: {
            headers: {
                'X-CSRF-TOKEN': csrf,
            },
        },
    });
} catch (e) {
    // ignore
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
