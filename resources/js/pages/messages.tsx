import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import Messages from '@/components/messages';
import { Head, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Messages', href: '/messages' },
];

export default function MessagesPage() {
    const { props } = usePage<any>();
    // frontEndPayload is the preferred location for page data, but some controllers may return values
    // at the top-level props (for example: Inertia::render('messages', ['error' => '...']))
    const payload = props.frontEndPayload ?? {};

    const activeUser = payload.activeUser ?? props.activeUser ?? null;
    const channel = payload.channel ?? props.channel ?? null;

    // normalize questions: Laravel collections may come as objects; ensure an array
    const rawQuestions = payload.questions ?? props.questions ?? [];
    const questions = Array.isArray(rawQuestions) ? rawQuestions : (rawQuestions ? Object.values(rawQuestions) : []);

    // page-level error support (controllers sometimes return `error` at top-level)
    const pageError = props.error ?? payload.error ?? null;

    // Debug: log server props and frontEndPayload
    try {
        console.debug('messages.tsx props:', props);
        console.debug('frontEndPayload:', payload);
    } catch (err) {
        console.error('Failed to debug-log messages page props', err);
    }
// If this page was rendered from Games::store, the data is under frontEndPayload
// Prepare initial system message when a new game was just created
const systemMessage = payload ? {
    id: `sys-${Date.now()}`,
    message: 'Your game has been created. We have posted it on the lobby.',
    type_of_message: 'text',
    user: { id: 0, name: 'System' },
    created_at: new Date().toISOString(),
} : null;

const initialMessages = payload.messages?.data ?? (systemMessage ? [systemMessage] : []);
const channelUsers = payload.channelUsers ?? [];
const gameName = payload.name_of_the_game ?? null;
const gameImage = payload.path_to_the_game_image ?? null;
const numberOfPlayersAllowed = payload.number_of_players_allowed ?? null;

function shuffle<T>(arr: T[]) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const questionsPrepared = shuffle(
    questions.map((q: any) => ({ id: q.id, actual_question: q.actual_question ?? q.question ?? q.text ?? q.actual ?? '', answered: false }))
);

    async function sendMessage(payload: { message: string; type_of_message: 'text' | 'image' }) {
        try {
            const body = new URLSearchParams();
            body.append('message', payload.message);
            body.append('type_of_message', payload.type_of_message);
            body.append('channel_id', String(channel?.id ?? ''));
            const tokenMeta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
            const csrf = tokenMeta ? tokenMeta.content : '';

            const res = await fetch('/messages/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrf,
                    'Accept': 'application/json',
                },
                credentials: 'same-origin',
                body: body.toString(),
            });
            const data = await res.json();
            return data;
        } catch (err) {
            console.error('Failed to send message', err);
            return null;
        }
    }

    const [localError, setLocalError] = useState<string | null>(pageError ?? null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Messages" />

            {localError && (
                <div className="max-w-6xl mx-auto p-4">
                    <div className="rounded-lg bg-red-50 dark:bg-red-900/60 border border-red-200 dark:border-red-700 p-4 flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" />
                            </svg>
                            <div>
                                <p className="text-sm font-semibold text-red-800 dark:text-red-200">Error</p>
                                <p className="mt-1 text-sm text-red-700 dark:text-red-100">{localError}</p>
                            </div>
                        </div>
                        <div>
                            <button onClick={() => setLocalError(null)} className="inline-flex items-center px-3 py-2 bg-transparent rounded-md text-sm font-medium text-red-700 dark:text-red-100 hover:bg-red-100 dark:hover:bg-red-800">Dismiss</button>
                        </div>
                    </div>
                </div>
            )}

            <Messages
                initialMessages={initialMessages}
                channelId={channel?.id}
                users={channelUsers}
                questions={questionsPrepared}
                gameName={gameName}
                gameImage={gameImage}
                numberOfPlayersAllowed={numberOfPlayersAllowed}
                onSend={sendMessage}
                activeUser={activeUser}
            />
        </AppLayout>
    );
}
