import React, { useEffect, useState, useCallback } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Messages from '@/components/messages';
import { useEcho } from '@laravel/echo-react';

export default function GamePortal() {
    const { props } = usePage<any>();
    // When server returns Inertia render, props will contain activeUser, channel, channelUsers, messages, game, questions
    const activeUser = props.activeUser ?? null;
    const channel = props.channel ?? null;
    const initialMessages = props.messages?.data ?? [];
    const channelUsers = props.channelUsers ?? [];
    const rawQuestions = props.questions ?? [];
    const questions = Array.isArray(rawQuestions) ? rawQuestions : (rawQuestions ? Object.values(rawQuestions) : []);

    // Debug: log what the server sent so we can inspect shapes
    try {
        console.debug('game-portal props:', props);
        console.debug('activeUser:', activeUser);
        console.debug('channel:', channel);
        console.debug('channelUsers:', channelUsers);
        console.debug('initialMessages:', initialMessages);
        console.debug('questions (normalized):', questions);
    } catch (err) {
        console.error('Debug log failure in game-portal', err);
    }

    const [messages, setMessages] = useState<any[]>(initialMessages);

    // Append incoming message from broadcast
    const handleIncoming = useCallback((payload: any) => {
        setMessages((m) => [...m, payload]);
    }, []);

    // subscribe to private channel via useEcho hook
    useEffect(() => {
        if (!channel) return;

        // useEcho signature: useEcho<Payload>(channelName, event, callback, deps, visibility)
        const echoHandle = useEcho<any>(`channel.${channel.id}`, 'MessageSent', (payload) => {
            handleIncoming(payload);
        }, [channel.id], 'private');

        // start listening
        echoHandle.listen();

        // Debug: attempt to surface Echo/pusher connection state if available
        try {
            const Echo = (window as any).Echo;
            if (Echo && Echo.connector && Echo.connector.pusher) {
                const pusher = Echo.connector.pusher;
                pusher.bind('connected', () => console.debug('Pusher connected'));
                pusher.bind('error', (err: any) => console.warn('Pusher error', err));
                pusher.connection.bind('connected', () => console.debug('Pusher connection connected'));
                pusher.connection.bind('disconnected', () => console.debug('Pusher connection disconnected'));
            }
        } catch (e) {
            // ignore if Echo isn't present or shape differs
        }

        return () => {
            try {
                echoHandle.leave();
            } catch (err) {
                // ignore
            }
        };
    }, [channel, handleIncoming]);

    // send handler posts to /messages/create
    async function sendMessage(payload: { message: string; type_of_message: 'text' | 'image' }) {
        try {
            const body = new URLSearchParams();
            body.append('message', payload.message);
            body.append('type_of_message', payload.type_of_message);
            body.append('channel_id', String(channel.id));
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
            console.log('body', body.toString());
            console.log('res', res);
            const data = await res.json();
            return data;
        } catch (err) {
            console.error('Failed to send message', err);
            return null;
        }
    }

    return (
        <div>
            <Head title={`Game: ${channel?.name ?? 'Game'}`} />
            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">{channel?.name ?? 'Game portal'}</h1>
                <div className="mb-4">
                    <p className="text-sm text-muted-light">Players: {channelUsers.length}</p>
                </div>

                <Messages initialMessages={messages} channelId={channel?.id} users={channelUsers} questions={questions} onSend={sendMessage} activeUser={activeUser} />
            </div>
        </div>
    );
}
