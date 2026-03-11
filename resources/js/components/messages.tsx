import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Camera, Send, Smile } from 'lucide-react';
import { usePage } from '@inertiajs/react';

type ChatMessage = {
    id: number | string;
    message?: string;
    type_of_message?: 'text' | 'image';
    user?: {
        id: number;
        name?: string;
        profile_picture?: string | null;
    };
    image?: string;
    time?: string;
    reactions?: Record<string, number>;
};

type MessagesProps = {
    initialMessages?: any[];
    channelId?: number | null;
    users?: any[];
    questions?: any[]; // expected shape: {id, actual_question, answered}
    onSend?: (payload: { message: string; type_of_message: 'text' | 'image' }) => Promise<any> | any;
    activeUser?: any;
    gameName?: string | null;
    gameImage?: string | null;
    numberOfPlayersAllowed?: number | null;
};

export default function Messages({ initialMessages = [], channelId = null, users = [], questions = [], onSend, activeUser, gameName = null, gameImage = null, numberOfPlayersAllowed = null }: MessagesProps) {
    const breadcrumbs = [{ title: 'Messages', href: '/messages' }];

    useEffect(() => {
        try {
            console.debug('Messages component mounted/updated - incoming props:', {
                initialMessages,
                channelId,
                users,
                questions,
                activeUser,
                gameName,
                gameImage,
            });
        } catch (err) {
            console.error('Debug log failure in Messages component', err);
        }
    }, [initialMessages, channelId, users, questions, activeUser, gameName, gameImage]);
    // ref that stores the converted base64 string of the selected image
    const converted_base_64_image = useRef<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    // in-app notification state
    const [notification, setNotification] = useState<{
        type: 'success' | 'error' | 'info';
        message: string;
        title?: string;
    } | null>(null);

    function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info', title?: string) {
        setNotification({ message, type, title });
        // clear after 4s
        window.setTimeout(() => setNotification(null), 4000);
    }

    const [messages, setMessages] = useState<ChatMessage[]>(
        initialMessages.map((m: any) => {
            const userLike: any = m.user ? { ...m.user } : {};
            const fallbackIdentifier =
                coerceIdentifier(m.user_id) ??
                coerceIdentifier(m.sender_id) ??
                coerceIdentifier(m.from_user_id) ??
                coerceIdentifier(m.owner_id);

            if (fallbackIdentifier) {
                if (typeof userLike.id === 'undefined' || userLike.id === null) {
                    userLike.id = fallbackIdentifier;
                }
                if (typeof userLike.user_id === 'undefined' || userLike.user_id === null) {
                    userLike.user_id = fallbackIdentifier;
                }
            }

            return {
                id: m.id,
                message: m.message,
                type_of_message: m.type_of_message,
                user: Object.keys(userLike).length > 0 ? userLike : undefined,
                image: m.type_of_message === 'image' ? m.message : undefined,
                time: m.created_at ? new Date(m.created_at).toLocaleString() : undefined,
                reactions: m.reactions || {},
            };
        })
    );

    const [input, setInput] = useState('');
    const [tokenBalance, setTokenBalance] = useState<number>(() => Number(activeUser?.tokens ?? 150));
    const [isRefreshingTokens, setIsRefreshingTokens] = useState(false);
    const [transferOpen, setTransferOpen] = useState(false);
    const [transferAmount, setTransferAmount] = useState(50);
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const moderationWindow = useRef<{ text: string; risk: 'low' | 'medium' | 'high'; ts: number }[]>([]);
    const [moderationMutedUntil, setModerationMutedUntil] = useState<number>(0);

    async function refreshTokenBalance() {
        const refreshTarget = currentUserNumericId ?? currentUserIdentifier;
        if (!refreshTarget || isRefreshingTokens) return;

        setIsRefreshingTokens(true);
        try {
            const response = await fetch(`/tokens/seeTokens/${refreshTarget}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                }
            });

            const data = await response.json();
            
            if (data.success) {
                setTokenBalance(data.tokens);
                showNotification('Token balance updated', 'success');
            } else {
                showNotification(data.error || 'Failed to refresh tokens', 'error');
            }
        } catch (error) {
            showNotification('Error refreshing tokens', 'error');
        } finally {
            setIsRefreshingTokens(false);
        }
    }
    // local question state to track answered flags and current index
    const [localQuestions, setLocalQuestions] = useState<any[]>(
        questions.map((q: any) => ({ ...q }))
    );
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
        const first = questions.findIndex((q: any) => !q.answered);
        return first === -1 ? 0 : first;
    });
    // Send tokens modal state
    const [sendTokensOpen, setSendTokensOpen] = useState(false);
    const [selectedCreditUser, setSelectedCreditUser] = useState<any | null>(null);
    const [creditModalOpen, setCreditModalOpen] = useState(false);
    const [creditAmount, setCreditAmount] = useState<number>(10);
    const [creditSubmitting, setCreditSubmitting] = useState(false);

    const listRef = useRef<HTMLDivElement | null>(null);
    const [attachedPreview, setAttachedPreview] = useState<string | null>(null);
    const [composerFocused, setComposerFocused] = useState(false);
    const [emojiOpen, setEmojiOpen] = useState(false);
    const [emojiCategory, setEmojiCategory] = useState<string>('Smileys');
    const [emojiQuery, setEmojiQuery] = useState<string>('');
    const [recentEmojis, setRecentEmojis] = useState<string[]>(() => {
        try {
            const raw = window.localStorage.getItem('recentEmojis');
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
        } catch {
            return [];
        }
    });
    const composerInputRef = useRef<HTMLInputElement | null>(null);
    const emojiPickerRef = useRef<HTMLDivElement | null>(null);

    const emojiGroups = useMemo(() => {
        const groups: Record<string, string[]> = {
            Smileys: [
                '😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😋','😎','😍','😘','😗','😙','😚','🙂','🤗','🤩','🤔','🫡','🤨',
                '😐','😑','😶','🫥','🙄','😏','😣','😥','😮','🤐','😯','😪','😫','🥱','😴','😌','😛','😜','😝','🤤','😒','😓',
                '😔','😕','🫤','🙃','🫠','😲','☹️','🙁','😖','😞','😟','😤','😢','😭','😦','😧','😨','😩','🤯','😬','😰','😱',
                '🥵','🥶','😳','🤪','😵','😵‍💫','🥴','😠','😡','🤬','😷','🤒','🤕','🤢','🤮','🤧','😇','🥳','😈','👻','💀','🤡'
            ],
            Gestures: [
                '👍','👎','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','🫶','👏','🙌','👐','🤲','🙏','✋','🤚','🖐️','🖖','👋','🤝',
                '💪','🫵','☝️','👆','👇','👉','👈','✊','👊','🤛','🤜','🫳','🫴','💅'
            ],
            Hearts: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❤️‍🔥','❤️‍🩹','💖','💗','💓','💞','💕','💘','💝','💟','💌'],
            // Suggestive / flirty emojis (emoji-only). Keep it optional and user-driven.
            Flirty: ['😘','😗','😙','😚','😍','🥰','😉','😏','🤤','🥵','🔥','💋','🫦','👄','💘','💝','🌹','🥀','🍓','🍒','🍑','🍆','🫶','❤️‍🔥','✨','💦','👅','🖤','🧨','💥'],
            Fun: ['🔥','💯','✨','🎉','🎊','🥳','😂','🤣','😎','🤠','👀','💀','🤡','😈','👻','🎯','🎲','🃏','🧠','🫠','🫶','🪩','🎵','🎶','🎈','🎁','🪄'],
            Food: ['🍕','🍔','🍟','🌭','🍿','🥓','🥚','🧇','🥞','🍳','🍗','🍖','🥩','🍤','🍣','🍜','🍝','🍦','🍩','🍪','🍫','🍰','🧁','🍉','🍓','🍷','🍸','🍹','🍺','🍻'],
            Activities: ['⚽','🏀','🏈','⚾','🎾','🏐','🏓','🎮','🕹️','🎧','🎤','🎬','🎨','🎸','🎹','🥁','🏆','🥇','🥈','🥉','🧩','♟️'],
        };
        return groups;
    }, []);

    // Curated Stickers and GIFs lists (URLs). Selecting attaches them as image messages.
    const stickersList: string[] = [
        'https://i.imgur.com/6Y6aQ1E.png',
        'https://i.imgur.com/CiJc3sV.png',
        'https://i.imgur.com/r4kYJZs.png',
        'https://i.imgur.com/4AiXzf8.jpeg',
        'https://i.imgur.com/Z7AzH2c.png'
    ];
    const gifsList: string[] = [
        'https://media.giphy.com/media/l0HUqsz2jdQYElRm0/giphy.gif',
        'https://media.giphy.com/media/3o6Zt8MgUuvSbkZYWc/giphy.gif',
        'https://media.giphy.com/media/26gsvu3fqM1H0S8so/giphy.gif',
        'https://media.giphy.com/media/3ohzdQ1IynzclJldUQ/giphy.gif',
        'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif'
    ];

    const emojiCategories = useMemo(() => {
        return [...Object.keys(emojiGroups), 'Stickers', 'GIFs'];
    }, [emojiGroups]);
    const activeEmojiList = useMemo(() => emojiGroups[emojiCategory] ?? emojiGroups.Smileys, [emojiGroups, emojiCategory]);

    const filteredEmojiList = useMemo(() => {
        const q = emojiQuery.trim();
        if (!q) return activeEmojiList;
        // Emoji search is tricky without names; we do a simple "contains" match for now,
        // plus allow searching category names (e.g. "heart", "flirty") as shortcuts.
        const qLower = q.toLowerCase();
        const categoryMatches = emojiCategories.filter((c) => c.toLowerCase().includes(qLower));
        if (categoryMatches.length > 0) {
            const merged: string[] = [];
            for (const cat of categoryMatches) {
                merged.push(...(emojiGroups[cat] ?? []));
            }
            // de-dupe
            return Array.from(new Set(merged));
        }
        return activeEmojiList.filter((e) => String(e).includes(q));
    }, [activeEmojiList, emojiCategories, emojiGroups, emojiQuery]);

    useEffect(() => {
        if (!emojiOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setEmojiOpen(false);
        };
        const onMouseDown = (e: MouseEvent) => {
            const target = e.target as Node | null;
            if (!target) return;
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(target)) {
                setEmojiOpen(false);
            }
        };
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('mousedown', onMouseDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('mousedown', onMouseDown);
        };
    }, [emojiOpen]);

    const normalize = (text: string) => {
        const lower = text.toLowerCase();
        const map: Record<string, string> = { 'o': '0', 'O': '0', 'i': '1', 'l': '1', 's': '5' };
        const replaced = lower.replace(/[oi ls]/gi, (m) => map[m] ?? m).replace(/[\(\)\[\]\-\.\s_]/g, '');
        return { lower, compact: replaced };
    };

    const englishWords = ['zero','one','two','three','four','five','six','seven','eight','nine'];
    const swahiliWords = ['sifuri','moja','mbili','tatu','nne','tano','sita','saba','nane','tisa'];

    const wordsToDigits = (text: string) => {
        const tokens = text.toLowerCase().split(/[^a-zA-Z]+/).filter(Boolean);
        const map: Record<string, string> = {};
        englishWords.forEach((w, i) => (map[w] = String(i)));
        swahiliWords.forEach((w, i) => (map[w] = String(i)));
        const digits = tokens.map((t) => (map[t] ?? '')).join('');
        return digits.length >= 5 ? digits : '';
    };

    const detectNumericSequences = (text: string) => {
        const { lower, compact } = normalize(text);
        const found: string[] = [];
        const intl = lower.match(/\+\d(?:[\s\-]?\d){8,14}/g) || [];
        intl.forEach((m) => found.push(m.replace(/[^\d\+]/g, '')));
        const local = lower.match(/(?:\b0?7[\s\-]?(?:\d[\s\-]?){7,9}\b)/g) || [];
        local.forEach((m) => found.push(m.replace(/\D/g, '')));
        const longDigits = compact.match(/\d{9,13}/g) || [];
        longDigits.forEach((m) => found.push(m));
        const separated = lower.match(/(?:\d[\s\-]){6,}\d/g) || [];
        separated.forEach((m) => found.push(m.replace(/\D/g, '')));
        const words = wordsToDigits(text);
        if (words) found.push(words);
        const uniq = Array.from(new Set(found.filter((x) => x.length >= 7)));
        return uniq;
    };

    // keyword-based moderation intentionally removed; numeric-only policy enforced

    const computeRisk = (text: string) => {
        const numbers = detectNumericSequences(text);
        let risk: 'low' | 'medium' | 'high' = 'low';
        if (numbers.length > 0) risk = 'medium';
        const now = Date.now();
        const recent = moderationWindow.current.filter((m) => now - m.ts < 5 * 60 * 1000);
        const recentSignals = recent.filter((m) => m.risk !== 'low').length;
        if (recentSignals >= 2 && risk !== 'low') risk = 'high';
        return { risk, numbers };
    };

    const sha256Hex = async (inputStr: string) => {
        const enc = new TextEncoder();
        const data = enc.encode(inputStr);
        const digest = await crypto.subtle.digest('SHA-256', data);
        const bytes = Array.from(new Uint8Array(digest));
        return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
    };

    const moderateMessage = async (text: string) => {
        const { risk, numbers } = computeRisk(text);
        const hashes: string[] = [];
        for (const n of numbers) {
            try { hashes.push(await sha256Hex(n)); } catch {}
        }
        moderationWindow.current.push({ text, risk, ts: Date.now() });
        if (moderationWindow.current.length > 10) moderationWindow.current.shift();
        return { risk, hashes };
    };

    useEffect(() => {
        // autoscroll to bottom on new messages
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages]);

    // keep localQuestions in sync if parent passes new questions
    useEffect(() => {
        setLocalQuestions(questions.map((q: any) => ({ ...q })));
        const first = questions.findIndex((q: any) => !q.answered);
        setCurrentQuestionIndex(first === -1 ? 0 : first);
    }, [questions]);
    // sync token balance from activeUser when available/updated
    // read server-provided frontEndPayload (created during game store when private link is generated)
    const page = usePage();
    const frontEndPayload = (page.props && (page.props as any).frontEndPayload) || {};
    const authUserFromPage = (page.props && (page.props as any)?.auth?.user) || null;

    // Normalize users and activeUser with fallbacks to server-provided frontEndPayload
    const effectiveUsers: any[] =
        Array.isArray(users) && users.length > 0
            ? users
            : Array.isArray(frontEndPayload?.channelUsers)
            ? frontEndPayload.channelUsers
            : [];

    const resolvedActiveUser = useMemo(() => {
        const candidates: any[] = [
            activeUser,
            frontEndPayload?.activeUser,
            frontEndPayload?.active_user,
            authUserFromPage,
        ];

        if (Array.isArray(effectiveUsers)) {
            const flagged = effectiveUsers.find(
                (user: any) => user?.is_self || user?.is_me || user?.self || user?.isCurrentUser
            );
            if (flagged) candidates.push(flagged);
        }

        const fallbackIdentifier =
            coerceIdentifier(frontEndPayload?.activeUser?.id) ??
            coerceIdentifier(frontEndPayload?.active_user?.id) ??
            coerceIdentifier(authUserFromPage?.id);

        if (fallbackIdentifier && Array.isArray(effectiveUsers)) {
            const matched = effectiveUsers.find(
                (user: any) => getUserIdentifier(user) === fallbackIdentifier
            );
            if (matched) candidates.push(matched);
        }

        for (const candidate of candidates) {
            if (!candidate) continue;
            if (getUserIdentifier(candidate)) return candidate;
        }

        return candidates.find(Boolean) ?? null;
    }, [activeUser, authUserFromPage, effectiveUsers, frontEndPayload]);

    const currentUserIdentifier = useMemo(
        () => getUserIdentifier(resolvedActiveUser),
        [resolvedActiveUser]
    );

    const currentUserNumericId = useMemo(() => {
        if (!resolvedActiveUser) return null;
        const possible = [
            (resolvedActiveUser as any)?.id,
            (resolvedActiveUser as any)?.user_id,
        ];
        for (const value of possible) {
            const num = Number(value);
            if (!Number.isNaN(num) && Number.isFinite(num)) {
                return num;
            }
        }
        return null;
    }, [resolvedActiveUser]);

    const currentUserName =
        (resolvedActiveUser as any)?.name ??
        (resolvedActiveUser as any)?.username ??
        (resolvedActiveUser as any)?.full_name ??
        'You';

    const currentUserAvatar =
        (resolvedActiveUser as any)?.profile_picture ??
        (resolvedActiveUser as any)?.avatar ??
        null;

    // Determine whether the resolved active user is a member of this channel (use fallbacks)
    const isMember =
        Array.isArray(effectiveUsers) && currentUserIdentifier
            ? effectiveUsers.some((u: any) => getUserIdentifier(u) === currentUserIdentifier)
            : false;

    // Determine if this channel is private (backend may provide address_to_channel or explicit flag)
    const isPrivateChannel = Boolean(
        frontEndPayload && (frontEndPayload.address_to_channel || frontEndPayload.is_private_channel || frontEndPayload.private)
    );

    useEffect(() => {
        if (resolvedActiveUser && typeof (resolvedActiveUser as any)?.tokens !== 'undefined') {
            const n = Number((resolvedActiveUser as any).tokens);
            if (!Number.isNaN(n)) setTokenBalance(n);
        }
    }, [resolvedActiveUser]);

    // Helper function to wait for Echo to be ready with retry logic
    const waitForEcho = (maxRetries = 10, retryDelay = 500): Promise<any> => {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const tryConnect = () => {
                const Echo = (window as any).Echo;
                if (Echo && Echo.connector && Echo.connector.socket) {
                    console.debug('Echo is ready');
                    resolve(Echo);
                } else if (attempts < maxRetries) {
                    attempts++;
                    console.debug(`Waiting for Echo... attempt ${attempts}/${maxRetries}`);
                    setTimeout(tryConnect, retryDelay);
                } else {
                    reject(new Error('Echo connection timeout'));
                }
            };
            tryConnect();
        });
    };

    // Fetch new messages from server (polling fallback)
    const fetchNewMessages = async () => {
        if (!channelId) return;
        try {
            const response = await fetch(`/messages/fetch?channel_id=${channelId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                credentials: 'same-origin',
            });

            if (!response.ok) return;

            const data = await response.json();
            if (data.success && data.messages) {
                const serverMessages = data.messages || [];
                
                // Add any new messages from the server that we don't already have
                setMessages((prevMessages) => {
                    const existingIds = new Set(prevMessages.map(m => m.id));
                    const newMessages: ChatMessage[] = [];

                    for (const m of serverMessages) {
                        if (!existingIds.has(m.id)) {
                            const userLike: any = m.user ? { ...m.user } : {};
                            const fallbackIdentifier =
                                coerceIdentifier(m.user_id) ??
                                coerceIdentifier(m.sender_id) ??
                                coerceIdentifier(m.from_user_id) ??
                                coerceIdentifier(m.owner_id);

                            if (fallbackIdentifier) {
                                if (typeof userLike.id === 'undefined' || userLike.id === null) {
                                    userLike.id = fallbackIdentifier;
                                }
                            }

                            newMessages.push({
                                id: m.id,
                                message: m.message,
                                type_of_message: m.type_of_message,
                                user: Object.keys(userLike).length > 0 ? userLike : undefined,
                                image: m.type_of_message === 'image' ? m.message : undefined,
                                time: m.created_at ? new Date(m.created_at).toLocaleString() : undefined,
                                reactions: m.reactions || {},
                            });
                        }
                    }

                    if (newMessages.length > 0) {
                        console.debug(`Fetched ${newMessages.length} new messages from server`);
                        return [...prevMessages, ...newMessages];
                    }
                    return prevMessages;
                });
            }
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        }
    };

    // Set up real-time message listener via Echo + ALWAYS poll as a reliable fallback
    useEffect(() => {
        if (!channelId) {
            console.debug('No channelId available for Echo subscription');
            return;
        }

        let pollInterval: ReturnType<typeof setInterval> | null = null;
        let echoUnsubscribe: (() => void) | null = null;
        let cancelled = false;

        const setupEchoListener = async () => {
            try {
                console.debug('Setting up Echo listener for channel:', channelId);
                
                // Wait for Echo to be ready
                const Echo = await waitForEcho();
                const channelName = `channel.${channelId}`;

                console.debug(`Subscribing to channel: ${channelName}`);

                // Subscribe to the private channel and listen for MessageSent events
                Echo.private(channelName)
                    .listen('MessageSent', (data: any) => {
                        console.debug('Received MessageSent event:', data);

                        // Avoid adding duplicate messages
                        setMessages((prevMessages) => {
                            const messageExists = prevMessages.some((m) => m.id === data.id);
                            if (messageExists) {
                                console.debug('Message already exists, skipping duplicate');
                                return prevMessages;
                            }

                            const newMessage: ChatMessage = {
                                id: data.id,
                                message: data.message,
                                type_of_message: data.type || data.type_of_message,
                                user: data.user,
                                image: data.type === 'image' ? data.message : undefined,
                                time: data.created_at ? new Date(data.created_at).toLocaleString() : new Date().toLocaleString(),
                                reactions: data.reactions || {},
                            };

                            console.debug('Adding new message:', newMessage);
                            return [...prevMessages, newMessage];
                        });
                    })
                    .error((error: any) => {
                        console.error('Channel subscription error:', error);
                    });

                console.debug('Echo listener setup successful');
                
                // Store unsubscribe function
                echoUnsubscribe = () => {
                    console.debug(`Unsubscribing from channel: ${channelName}`);
                    Echo.leave(channelName);
                };
            } catch (err) {
                console.error('Failed to set up Echo listener:', err);
            }
        };

        // Kick off an immediate fetch + start polling (this is what makes it “instant” without refresh)
        fetchNewMessages();
        pollInterval = setInterval(() => {
            if (!cancelled) fetchNewMessages();
        }, 1000);

        setupEchoListener();

        // Cleanup: unsubscribe when component unmounts or channelId changes
        return () => {
            cancelled = true;
            if (echoUnsubscribe) {
                echoUnsubscribe();
            }
            if (pollInterval) {
                clearInterval(pollInterval);
            }
        };
    }, [channelId]);

    async function sendMessage() {
        const text = input.trim();
        if (!text && !converted_base_64_image.current) return;
        // Do not block UI with a sending loader
        if (Date.now() < moderationMutedUntil) {
            showNotification('Sharing contact details is not allowed on this platform.', 'error');
            setIsSending(false);
            return;
        }
        if (text) {
            try {
                const verdict = await moderateMessage(text);
                if (verdict.risk === 'medium' || verdict.risk === 'high') {
                    if (verdict.risk === 'high') setModerationMutedUntil(Date.now() + 5 * 60 * 1000);
                    showNotification('Sharing contact details is not allowed on this platform.', 'error');
                    return;
                }
            } catch {}
        }
        // If we have an onSend handler (server-backed), use it
        const optimisticUser: any = {
            id: currentUserNumericId ?? currentUserIdentifier ?? `local-${Date.now()}`,
            name: currentUserName,
        };
        if (currentUserAvatar) optimisticUser.profile_picture = currentUserAvatar;
        if (currentUserIdentifier) optimisticUser.user_id = currentUserIdentifier;

        if (onSend) {
            const payload = { message: converted_base_64_image.current ?? text, type_of_message: converted_base_64_image.current ? 'image' : 'text' } as any;

            // optimistic UI: append a temp message immediately so the sender sees it
            const tempId = `optimistic-${Date.now()}`;
            const optimisticMsg: ChatMessage = {
                id: tempId,
                message: converted_base_64_image.current ? undefined : text,
                image: converted_base_64_image.current ?? undefined,
                type_of_message: converted_base_64_image.current ? 'image' : 'text',
                user: optimisticUser,
                time: new Date().toLocaleString(),
                reactions: {},
            };
            setMessages((m) => [...m, optimisticMsg]);

            // Immediately clear composer so user can continue typing
            setInput('');
            converted_base_64_image.current = null;
            setAttachedPreview(null);
            setLightboxSrc(null);
            setIsSending(false);

            try {
                const start = Date.now();
                const res = await onSend(payload);
                const took = Date.now() - start;
                console.debug('onSend result', { took, res });

                // If server returned a broadcast payload, replace optimistic message with server one (dedupe)
                if (res && res.broadcast) {
                    const b = res.broadcast;
                    setMessages((list) => {
                        // try to find optimistic message by matching tempId
                        const idx = list.findIndex((it) => it.id === tempId);
                        const serverMsg: ChatMessage = {
                            id: b.id,
                            message: b.message,
                            type_of_message: b.type,
                            user: b.user,
                            image: b.type === 'image' ? b.message : undefined,
                            time: b.created_at,
                            reactions: {},
                        };
                        if (idx !== -1) {
                            const copy = [...list];
                            copy[idx] = serverMsg;
                            return copy;
                        }
                        // fallback: avoid duplicate if similar message exists
                        const dup = list.find((it) => it.message === serverMsg.message && Number(it.user?.id) === Number(serverMsg.user?.id));
                        if (dup) return list.map((it) => it === dup ? serverMsg : it);
                        return [...list, serverMsg];
                    });
                }
                // Ensure we sync with server state immediately (covers cases where broadcast/Echo fails)
                await fetchNewMessages();
            } catch (err) {
                console.error('send failed', err);
                // leave optimistic message but you might want to mark it failed
                showNotification('Failed to send message. Retrying sync…', 'error');
                await fetchNewMessages();
            }
        } else {
            // fallback local behaviour
            const newMsg: ChatMessage = { id: `m${Date.now()}` } as any;
            if (converted_base_64_image.current) newMsg.image = converted_base_64_image.current;
            if (text) newMsg.message = text;
            newMsg.type_of_message = converted_base_64_image.current ? 'image' : 'text';
            newMsg.user = optimisticUser;
            setMessages((m) => [...m, newMsg]);
            // Immediately clear composer so user can continue typing
            setInput('');
            converted_base_64_image.current = null;
            setAttachedPreview(null);
            setLightboxSrc(null);
            setIsSending(false);
            await fetchNewMessages();
        }
    }

    

    function completeChallenge() {
        // Simulate completing challenge: reward small token bonus and an auto message
        setTokenBalance((t) => t + 10);
        setMessages((m) => [
            ...m,
            { id: `m${Date.now()}`, sender: 'you', text: 'Challenge completed!', time: 'Now' },
        ]);
    }

    // Share the current question as a chat message (includes sharer info)
    async function shareCurrentQuestion() {
        const q = localQuestions[currentQuestionIndex];
        if (!q || !q.actual_question) {
            showNotification('No question to share', 'error');
            return;
        }

        const messageText = `Question by ${currentUserName} -> ${q.actual_question}`;

        // Compose payload including sharer info
        const sharerId =
            currentUserNumericId ??
            currentUserIdentifier ??
            frontEndPayload?.activeUser?.id ??
            frontEndPayload?.active_user?.id ??
            authUserFromPage?.id ??
            `local-${Date.now()}`;

        const payload = {
            message: messageText,
            type_of_message: 'text',
            sharer: {
                id: sharerId,
                user_id: currentUserIdentifier ?? sharerId,
                name:
                    currentUserName ??
                    frontEndPayload?.activeUser?.name ??
                    frontEndPayload?.active_user?.name ??
                    (authUserFromPage as any)?.name ??
                    'Someone',
                profile_picture:
                    currentUserAvatar ??
                    frontEndPayload?.activeUser?.profile_picture ??
                    frontEndPayload?.active_user?.profile_picture ??
                    (authUserFromPage as any)?.profile_picture ??
                    null,
            },
        } as any;

        // optimistic UI
        const tempId = `share-optimistic-${Date.now()}`;
        const optimisticMsg: ChatMessage = {
            id: tempId,
            message: messageText,
            type_of_message: 'text',
            user: {
                id: payload.sharer.id,
                user_id: payload.sharer.user_id,
                name: payload.sharer.name,
                profile_picture: payload.sharer.profile_picture,
            } as any,
            time: new Date().toLocaleString(),
            reactions: {},
        };
        setMessages((m) => [...m, optimisticMsg]);

        if (onSend) {
            try {
                const res = await onSend(payload);
                if (res && res.broadcast) {
                    const b = res.broadcast;
                    setMessages((list) => list.map((it) => it.id === tempId ? ({
                        id: b.id,
                        message: b.message,
                        type_of_message: b.type,
                        user: b.user,
                        image: b.type === 'image' ? b.message : undefined,
                        time: b.created_at,
                        reactions: {},
                    }) : it));
                }
            } catch (err) {
                console.error('share failed', err);
                showNotification('Failed to share question', 'error');
            }
        }
    }

    function markCurrentQuestionAnswered() {
        setLocalQuestions((qs) => {
            const copy = qs.map((q: any) => ({ ...q }));
            if (copy[currentQuestionIndex]) copy[currentQuestionIndex].answered = true;
            return copy;
        });
        // advance to next unanswered
        setTimeout(() => {
            const next = localQuestions.findIndex((q) => !q.answered);
            setCurrentQuestionIndex(next === -1 ? 0 : next);
        }, 50);
    }

    function goPrev() {
        setCurrentQuestionIndex((i) => Math.max(0, i - 1));
    }

    function goNext() {
        setCurrentQuestionIndex((i) => Math.min(localQuestions.length - 1, i + 1));
    }

    function openSendTokens() {
        // Prevent opening the send tokens modal if user has no tokens
        if (Number(tokenBalance) <= 0) {
            showNotification('You do not have enough tokens to send. Earn or buy more to proceed.', 'error', 'Insufficient tokens');
            return;
        }

        setSendTokensOpen(true);
    }

    function closeSendTokens() {
        setSendTokensOpen(false);
    }

    function onCreditClick(user: any) {
        setSelectedCreditUser(user);
        setCreditAmount(10);
        setCreditModalOpen(true);
    }

    function submitCredit() {
        // Submit a credit transaction to the server and update UI on success
        if (!selectedCreditUser) return;
        const amt = Math.max(0, Math.floor(creditAmount));
        if (amt <= 0) {
            showNotification('Please enter a positive amount', 'error');
            return;
        }
        if (amt > tokenBalance) {
            showNotification('Insufficient tokens', 'error');
            return;
        }

        setCreditSubmitting(true);

        (async () => {
            try {
                const tokenMeta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
                const csrf = tokenMeta ? tokenMeta.content : '';
                const body = new URLSearchParams();
                body.append('to', String(selectedCreditUser.id));
                body.append('amountOfTokensToTransfer', String(amt));

                const res = await fetch('/tokens/send', {
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
                if (res.ok && data.success) {
                    // Update local token balance immediately
                    setTokenBalance((t) => t - amt);
                    // Add a system/chat message indicating the transfer
                    setMessages((m) => [
                        ...m,
                        {
                            id: `transfer-${Date.now()}`,
                            message: `You transferred ${amt} tokens to ${selectedCreditUser.name ?? selectedCreditUser.email ?? `User ${selectedCreditUser.id}`}`,
                            type_of_message: 'text',
                            user: {
                                id: currentUserNumericId ?? currentUserIdentifier ?? 0,
                                user_id: currentUserIdentifier ?? currentUserNumericId ?? 0,
                                name: currentUserName,
                                profile_picture: currentUserAvatar ?? undefined,
                            } as any,
                            time: new Date().toLocaleString(),
                        } as any,
                    ]);

                    // Close modals and clear selection
                    setCreditModalOpen(false);
                    setSendTokensOpen(false);
                    setSelectedCreditUser(null);
                } else {
                    const errMsg = data.error ?? data.message ?? 'Failed to transfer tokens';
                    showNotification(errMsg, 'error');
                }
            } catch (err) {
                console.error('Token transfer failed', err);
                showNotification('Network error: failed to transfer tokens', 'error');
            } finally {
                setCreditSubmitting(false);
            }
        })();
    }

    function openTransfer() {
        setTransferAmount(50);
        setTransferOpen(true);
    }

    function triggerFileSelect() {
        if (input.trim().length > 0) return;
        if (fileInputRef.current) fileInputRef.current.click();
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setInput('');
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            // store base64 on the named ref required
            converted_base_64_image.current = result;
            // also show as preview (we reuse lightboxSrc as a quick preview target)
            setLightboxSrc(result);
            setAttachedPreview(result);
            // keep the file input value reset so same file can be reselected if needed
            if (fileInputRef.current) fileInputRef.current.value = '';
            console.log('converted_base_64_image set (length):', result.length);
        };
        reader.readAsDataURL(file);
    }

    function removeAttachedImage() {
        converted_base_64_image.current = null;
        setAttachedPreview(null);
        setLightboxSrc(null);
    }

    const hasAttachment = Boolean(attachedPreview);
    const hasText = input.trim().length > 0;

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (hasAttachment) {
            removeAttachedImage();
        }
        setInput(event.target.value);
    }

    function insertEmoji(emoji: string) {
        const el = composerInputRef.current;
        if (!el) {
            setInput((s) => s + emoji);
            return;
        }
        const start = el.selectionStart ?? input.length;
        const end = el.selectionEnd ?? input.length;
        const next = input.slice(0, start) + emoji + input.slice(end);
        setInput(next);
        // restore cursor right after inserted emoji
        requestAnimationFrame(() => {
            el.focus();
            const pos = start + emoji.length;
            el.setSelectionRange(pos, pos);
        });

        // track recents (persisted)
        setRecentEmojis((prev) => {
            const nextRecents = [emoji, ...prev.filter((e) => e !== emoji)].slice(0, 18);
            try {
                window.localStorage.setItem('recentEmojis', JSON.stringify(nextRecents));
            } catch {
                // ignore storage failures
            }
            return nextRecents;
        });
    }

    function confirmTransfer() {
        const amt = Math.max(0, Math.floor(transferAmount));
        if (amt <= 0) return;
        if (amt > tokenBalance) {
            alert('Insufficient tokens');
            return;
        }
        setTokenBalance((t) => t - amt);
        setTransferOpen(false);
        setMessages((m) => [
            ...m,
            { id: `m${Date.now()}`, sender: 'you', text: `Transferred ${amt} tokens`, time: 'Now' },
        ]);
    }

    function coerceIdentifier(value: unknown): string | null {
        if (value === null || typeof value === 'undefined') return null;
        const str = String(value);
        if (!str || str === 'undefined' || str === 'null') return null;
        return str;
    }

    function getUserIdentifier(user: any): string | null {
        if (!user || typeof user !== 'object') return null;
        return (
            coerceIdentifier((user as any)?.id) ??
            coerceIdentifier((user as any)?.user_id) ??
            coerceIdentifier((user as any)?.pivot?.user_id) ??
            coerceIdentifier((user as any)?.uuid) ??
            coerceIdentifier((user as any)?.email)
        );
    }

    function resolveMessageOwnerIdentifier(message: ChatMessage): string | null {
        if (!message) return null;
        const fromUser = getUserIdentifier((message as any).user);
        if (fromUser) return fromUser;

        const candidateKeys = ['user_id', 'sender_id', 'from_user_id', 'author_id', 'owner_id', 'userId'];
        for (const key of candidateKeys) {
            const identifier = coerceIdentifier((message as any)[key]);
            if (identifier) return identifier;
        }

        return null;
    }

    return (
        <>
            {/* Notification toast */}
            {notification && (
                <div className="fixed top-6 right-6 z-60 max-w-sm w-full pointer-events-auto">
                    <div className={`flex items-start gap-4 p-4 rounded-xl shadow-2xl backdrop-blur-sm border ${notification.type === 'success' ? 'bg-green-50/95 dark:bg-green-900/30 border-green-200 dark:border-green-800' : notification.type === 'error' ? 'bg-red-50/95 dark:bg-red-900/30 border-red-200 dark:border-red-800' : 'bg-blue-50/95 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'}`} role="status" aria-live="polite">
                        <div className={`flex items-center justify-center w-9 h-9 rounded-full ${notification.type === 'success' ? 'bg-green-600 text-white' : notification.type === 'error' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
                            {notification.type === 'success' ? '✓' : notification.type === 'error' ? '!' : 'i'}
                        </div>
                        <div className="flex-1">
                            {notification.title && <div className="font-semibold text-sm mb-1 text-[#1b1b18] dark:text-[#EDEDEC]">{notification.title}</div>}
                            <div className="text-sm text-[#1b1b18]/80 dark:text-[#EDEDEC]/80">{notification.message}</div>
                        </div>
                        <div className="flex items-start">
                            <button className="text-[#1b1b18]/60 dark:text-[#EDEDEC]/60 hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]" onClick={() => setNotification(null)} aria-label="Dismiss">✕</button>
                        </div>
                    </div>
                </div>
            )}
            <AppHeader breadcrumbs={breadcrumbs} />
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 gap-6 p-4 sm:p-6 lg:p-8 overflow-x-hidden bg-[#FDFDFC] dark:bg-[#0a0a0a] min-h-screen">
            {/* Left card */}
            <div className="rounded-2xl shadow-2xl flex flex-col h-full backdrop-blur-sm border border-[#19140035] dark:border-[#3E3E3A] bg-white dark:bg-[#0a0a0a] overflow-hidden">
                <div className="relative">
                    <img
                        alt={gameName ?? 'Game image'}
                        className="w-full h-56 object-cover"
                        src={gameImage ?? 'https://www.gravatar.com/avatar/?d=mp'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h2 className="text-2xl font-black">{gameName ?? 'Game'}</h2>
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    {localQuestions && localQuestions.length > 0 ? (
                        <>
                            <p className="text-[#1b1b18]/80 dark:text-[#EDEDEC]/80 mb-3">
                                <span className="font-bold text-red-600 dark:text-red-400">Question:</span>
                            </p>
                            <div className="mt-2 bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-900/10 dark:to-pink-900/10 rounded-xl p-5 shadow-lg border border-red-100 dark:border-red-900/30">
                                <div className="text-base text-[#1b1b18] dark:text-[#EDEDEC] font-semibold leading-relaxed">
                                    {localQuestions[currentQuestionIndex]?.actual_question ?? 'No more questions'}
                                </div>

                                {/* top buttons in one flex row */}
                                <div className="mt-5 flex gap-2">
                                    <button
                                        onClick={goPrev}
                                        className="flex-1 px-4 py-2.5 bg-[#1b1b18] dark:bg-[#EDEDEC] text-white dark:text-[#1b1b18] rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={currentQuestionIndex === 0}
                                    >
                                        Prev
                                    </button>
                                    <button
                                        onClick={openSendTokens}
                                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
                                    >
                                        Pay
                                    </button>
                                    <button
                                        onClick={goNext}
                                        className="flex-1 px-4 py-2.5 bg-[#1b1b18] dark:bg-[#EDEDEC] text-white dark:text-[#1b1b18] rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={currentQuestionIndex >= localQuestions.length - 1}
                                    >
                                        Next
                                    </button>
                                </div>

                                {/* share button below */}
                                <div className="mt-3">
                                    <button
                                        onClick={() => shareCurrentQuestion()}
                                        className="w-full px-4 py-2.5 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                                    >
                                        Share Question
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div>
                            <p className="text-[#1b1b18]/80 dark:text-[#EDEDEC]/80">No questions available for this game.</p>
                        </div>
                    )}

                    <div className="mt-auto pt-6 text-center text-xs text-[#1b1b18]/60 dark:text-[#EDEDEC]/60 leading-relaxed">
                        <p>In case of a dare, you may request image proof—provided it complies with community guidelines.</p>
                    </div>
                </div>
            </div>

            {/* Right chat area */}
            <div className={`rounded-2xl shadow-2xl flex flex-col ${numberOfPlayersAllowed === 1 ? 'h-auto lg:h-[calc(100vh-150px)]' : 'h-[60vh] sm:h-[70vh] lg:h-[calc(100vh-150px)]'} border border-[#19140035] dark:border-[#3E3E3A] bg-white dark:bg-[#0a0a0a] overflow-hidden`}>
                <div className="flex justify-between items-center p-5 border-b border-[#19140035] dark:border-[#3E3E3A] bg-gradient-to-r from-red-50/30 to-pink-50/30 dark:from-red-900/10 dark:to-pink-900/10">
                    <div className="flex items-center gap-4">
                        {/* Copy & share link button - shown to channel members only when the room is private */}
                        {isMember && isPrivateChannel && (
                            <button
                                onClick={async () => {
                                    const link = frontEndPayload.address_to_channel || `${window.location.origin}/games/join?channel_id=${channelId}${frontEndPayload.game_id ? '&game_id=' + frontEndPayload.game_id : ''}`;
                                    try {
                                        await navigator.clipboard.writeText(link);
                                        showNotification('Link copied to clipboard', 'success', 'Copied');
                                    } catch (err) {
                                        const input = document.createElement('input');
                                        input.value = link;
                                        document.body.appendChild(input);
                                        input.select();
                                        try { document.execCommand('copy'); showNotification('Link copied to clipboard', 'success', 'Copied'); } catch (e) { showNotification('Unable to copy link automatically. Please copy manually: ' + link, 'info', 'Copy failed'); }
                                        document.body.removeChild(input);
                                    }
                                }}
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                                Copy link & share
                            </button>
                        )}
                    </div>
                    <div className="text-sm font-semibold flex items-center gap-3">
                        <div className="text-xs text-[#1b1b18]/60 dark:text-[#EDEDEC]/60">Tokens</div>
                        <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white font-black text-xl px-4 py-1.5 rounded-lg shadow-lg">{tokenBalance}</div>
                        <button
                            onClick={refreshTokenBalance}
                            disabled={isRefreshingTokens}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-[#1b1b18] dark:bg-[#EDEDEC] text-white dark:text-[#1b1b18] hover:opacity-90 transition-all duration-200 disabled:opacity-50"
                        >
                            {isRefreshingTokens ? (
                                <>
                                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Refreshing...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>Refresh</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div ref={listRef} className={`flex-1 overflow-y-auto overflow-x-hidden ${numberOfPlayersAllowed === 1 ? 'p-8 sm:p-10 lg:p-12' : 'p-6'} bg-gradient-to-b from-white via-red-50/20 to-white dark:from-[#0a0a0a] dark:via-red-900/5 dark:to-[#0a0a0a]`}>
                    <div className="space-y-5 w-full max-w-4xl mx-auto">
                        {messages.map((m) => {
                            const ownerIdentifier = resolveMessageOwnerIdentifier(m);
                            const isYou = Boolean(
                                currentUserIdentifier && ownerIdentifier && ownerIdentifier === currentUserIdentifier
                            );
                            return (
                            <div key={m.id} className={`group relative flex ${isYou ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex items-start gap-3 ${isYou ? 'flex-row-reverse' : 'flex-row'} max-w-[75%] md:max-w-[65%]`}>
                                    {!isYou && (
                                        <img
                                            alt="Avatar"
                                            src={m.user?.profile_picture ?? 'https://www.gravatar.com/avatar/?d=mp'}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-11 h-11 rounded-full flex-shrink-0 border-2 border-red-200 dark:border-red-800 object-cover shadow-lg"
                                        />
                                    )}
                                    <div className="flex flex-col">
                                        {!isYou && (
                                            <div className="text-xs font-semibold text-[#1b1b18]/70 dark:text-[#EDEDEC]/70 mb-1 px-1">
                                                {m.user?.name ?? 'Anonymous'}
                                            </div>
                                        )}
                                        <div className={`${isYou ? 'bg-gradient-to-br from-red-600 to-pink-600 text-white' : 'bg-white dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC] border-2 border-[#19140035] dark:border-[#3E3E3A]'} px-5 py-3.5 rounded-2xl shadow-lg max-w-full`}>
                                            {!m.image && m.message && (
                                                <p className={`text-sm leading-relaxed ${isYou ? 'text-white' : 'text-[#1b1b18] dark:text-[#EDEDEC]'}`}>
                                                    {m.message}
                                                </p>
                                            )}
                                            {m.image && (
                                                <div className="mt-0">
                                                    <img
                                                        src={m.image}
                                                        alt="attachment"
                                                        className="rounded-xl max-h-64 max-w-full h-auto object-contain cursor-pointer shadow-xl"
                                                        onClick={() => setLightboxSrc(m.image || null)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className={`text-xs text-[#1b1b18]/50 dark:text-[#EDEDEC]/50 mt-1.5 px-1 ${isYou ? 'text-right' : 'text-left'}`}>
                                            {m.time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            )
                        })}
                    </div>
                </div>

                {/* Question card area - shows current question when available */}
                

                {/* Input area - hidden for single-player games */}
                {numberOfPlayersAllowed !== 1 && (
                <div className="p-4 bg-transparent border-t border-border">
                    <div className="relative">
                        {attachedPreview && (
                            <div className="mb-4 p-4 bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-900/10 dark:to-pink-900/10 rounded-xl border-2 border-red-200 dark:border-red-800 flex items-center gap-4">
                                <img src={attachedPreview} className="h-24 w-auto max-w-full rounded-xl shadow-lg object-contain" alt="preview" />
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Image attached</div>
                                    <div className="text-xs text-[#1b1b18]/70 dark:text-[#EDEDEC]/70 mt-1">Tap send to include it in your message or remove to change.</div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => setLightboxSrc(attachedPreview)} className="px-3 py-1.5 text-xs font-semibold bg-[#1b1b18] dark:bg-[#EDEDEC] text-white dark:text-[#1b1b18] rounded-lg hover:opacity-90 transition-all" aria-label="Preview">Preview</button>
                                    <button onClick={removeAttachedImage} className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all" aria-label="Remove attached image">✕</button>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3 min-w-0">
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setEmojiOpen((v) => !v)}
                                    className={`p-2.5 rounded-lg border-2 border-transparent hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition-all flex-shrink-0 ${
                                        emojiOpen ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'border-[#19140035] dark:border-[#3E3E3A]'
                                    }`}
                                    aria-label="Emoji"
                                >
                                    <Smile className="h-5 w-5 text-[#1b1b18] dark:text-[#EDEDEC]" />
                                </button>
                                {emojiOpen && (
                                    <div
                                        ref={emojiPickerRef}
                                        className="absolute bottom-14 left-0 z-50 w-[90vw] sm:w-[480px] md:w-[560px] max-h-[70vh] rounded-2xl border-2 border-[#19140035] dark:border-[#3E3E3A] bg-white dark:bg-[#0a0a0a] shadow-2xl p-4 overflow-hidden"
                                        role="dialog"
                                        aria-label="Emoji picker"
                                    >
                                        {recentEmojis.length > 0 && (
                                            <div className="mb-3 pb-3 border-b border-[#19140035] dark:border-[#3E3E3A]">
                                                <div className="text-xs font-semibold text-[#1b1b18]/70 dark:text-[#EDEDEC]/70 mb-2">Recent</div>
                                                <div className="grid grid-cols-12 gap-1.5">
                                                    {recentEmojis.slice(0, 12).map((e) => (
                                                        <button
                                                            key={`recent-${e}`}
                                                            type="button"
                                                            className="h-10 w-10 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-xl transition-all hover:scale-110"
                                                            onClick={() => {
                                                                insertEmoji(e);
                                                                setEmojiOpen(false);
                                                            }}
                                                            aria-label={`Insert ${e}`}
                                                        >
                                                            {e}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <input
                                                value={emojiQuery}
                                                onChange={(e) => setEmojiQuery(e.target.value)}
                                                className="w-full bg-white dark:bg-[#0a0a0a] border-2 border-[#19140035] dark:border-[#3E3E3A] rounded-lg py-2 px-3 text-sm text-[#1b1b18] dark:text-[#EDEDEC] placeholder:text-[#1b1b18]/50 dark:placeholder:text-[#EDEDEC]/50 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                placeholder="Search (e.g. hearts, flirty)…"
                                                aria-label="Search emojis"
                                            />
                                        </div>

                                        <div className="flex gap-1.5 flex-wrap mb-3 pb-3 border-b border-[#19140035] dark:border-[#3E3E3A]">
                                            {emojiCategories.map((cat) => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => setEmojiCategory(cat)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${
                                                        emojiCategory === cat
                                                            ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white border-transparent shadow-lg'
                                                            : 'bg-transparent text-[#1b1b18] dark:text-[#EDEDEC] border-[#19140035] dark:border-[#3E3E3A] hover:bg-red-50 dark:hover:bg-red-900/20'
                                                    }`}
                                                    aria-pressed={emojiCategory === cat}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="max-h-[50vh] overflow-y-auto overflow-x-hidden pr-1 overscroll-contain">
                                            {emojiCategory === 'Stickers' && (
                                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                                    {stickersList.map((url) => (
                                                        <button
                                                            key={`sticker-${url}`}
                                                            type="button"
                                                            className="rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 p-1 transition-all"
                                                            onClick={() => {
                                                                setAttachedPreview(url);
                                                                converted_base_64_image.current = url;
                                                                setEmojiOpen(false);
                                                            }}
                                                            aria-label="Insert sticker"
                                                        >
                                                            <img src={url} alt="sticker" className="h-16 w-16 sm:h-20 sm:w-20 object-contain rounded-md shadow" />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            {emojiCategory === 'GIFs' && (
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                    {gifsList.map((url) => (
                                                        <button
                                                            key={`gif-${url}`}
                                                            type="button"
                                                            className="rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 p-1 transition-all"
                                                            onClick={() => {
                                                                setAttachedPreview(url);
                                                                converted_base_64_image.current = url;
                                                                setEmojiOpen(false);
                                                            }}
                                                            aria-label="Insert GIF"
                                                        >
                                                            <img src={url} alt="gif" className="h-24 w-full object-cover rounded-md shadow" />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            {emojiCategory !== 'Stickers' && emojiCategory !== 'GIFs' && (
                                                <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1.5">
                                                    {filteredEmojiList.map((e) => (
                                                        <button
                                                            key={`${emojiCategory}-${e}`}
                                                            type="button"
                                                            className="h-10 w-10 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-xl transition-all hover:scale-110"
                                                            onClick={() => {
                                                                insertEmoji(e);
                                                                setEmojiOpen(false);
                                                            }}
                                                            aria-label={`Insert ${e}`}
                                                        >
                                                            {e}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-[#19140035] dark:border-[#3E3E3A] flex justify-end">
                                            <button
                                                type="button"
                                                className="text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                                onClick={() => setEmojiOpen(false)}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <input
                                ref={composerInputRef}
                                value={input}
                                onFocus={() => setComposerFocused(true)}
                                onBlur={() => setComposerFocused(false)}
                                onChange={handleInputChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') sendMessage();
                                }}
                                className="w-[60%] sm:w-auto flex-1 min-w-0 bg-white dark:bg-[#0a0a0a] border-2 border-[#19140035] dark:border-[#3E3E3A] focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl py-3.5 px-5 text-sm placeholder:text-[#1b1b18]/50 dark:placeholder:text-[#EDEDEC]/50 text-[#1b1b18] dark:text-[#EDEDEC] transition-all shadow-sm hover:shadow-md focus:shadow-lg"
                                placeholder="Write something fun..."
                                aria-label="Message input"
                            />

{/* Camera: For images.... to implement */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleFileChange}
                                className="hidden"
                                aria-hidden="true"
                                disabled={hasText}
                            />

                            {/* {!hasText && !hasAttachment && (
                                
                            )} */}
                            <button onClick={triggerFileSelect} className="p-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex-shrink-0" aria-label="Attach image">
                                    <Camera className="h-5 w-5 text-[#1b1b18] dark:text-[#EDEDEC]" />
                                </button>
                            <button 

                            
                                onClick={sendMessage} 
                                disabled={isSending || (!hasText && !hasAttachment)} 
                                className="px-5 py-3 flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                            >
                                <Send className="h-4 w-4" />
                                 {/* Send */}
                            </button>
                        </div>
                    </div>
                </div>
                )}
            </div>

            {/* Lightbox modal */}
            {lightboxSrc && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" role="dialog" aria-modal>
                    <div className="relative max-w-4xl max-h-[90vh] w-full">
                        <button
                            onClick={() => setLightboxSrc(null)}
                            className="absolute -top-10 right-0 text-white text-4xl font-bold hover:text-primary"
                            aria-label="Close image"
                        >
                            ×
                        </button>
                        <img alt="Enlarged" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl mx-auto" src={lightboxSrc} />
                    </div>
                </div>
            )}

            {/* Send Tokens modal - list users with Credit buttons */}
            {sendTokensOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl w-full max-w-lg border-2 border-[#19140035] dark:border-[#3E3E3A]">
                        <div className="p-6 border-b border-[#19140035] dark:border-[#3E3E3A]">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-[#1b1b18] dark:text-[#EDEDEC]">Send Tokens</h3>
                                <button onClick={closeSendTokens} className="text-[#1b1b18]/60 dark:text-[#EDEDEC]/60 hover:text-[#1b1b18] dark:hover:text-[#EDEDEC] text-xl font-bold">✕</button>
                            </div>
                            <p className="mt-2 text-sm text-[#1b1b18]/70 dark:text-[#EDEDEC]/70">Select a user to credit tokens to.</p>
                        </div>
                        <div className="p-6 max-h-96 overflow-y-auto">
                            {
                                (() => {
                                    const otherUsers = (users || []).filter((u: any) => {
                                        const identifier = getUserIdentifier(u);
                                        return !currentUserIdentifier || identifier !== currentUserIdentifier;
                                    });
                                    if (otherUsers.length === 0) {
                                        return <div className="p-4 text-sm text-center text-[#1b1b18]/60 dark:text-[#EDEDEC]/60">No other users available</div>;
                                    }

                                    return otherUsers.map((u: any) => (
                                        <div key={u.id} className="flex items-center justify-between p-4 rounded-xl border-2 border-[#19140035] dark:border-[#3E3E3A] hover:border-red-300 dark:hover:border-red-700 transition-all mb-3 last:mb-0">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={u.profile_picture ?? 'https://www.gravatar.com/avatar/?d=mp'} 
                                                    alt={u.name ?? 'User'} 
                                                    className="w-10 h-10 rounded-full border-2 border-red-200 dark:border-red-800"
                                                />
                                                <div>
                                                    <div className="font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">{u.name ?? u.email ?? `User ${u.id}`}</div>
                                                </div>
                                            </div>
                                            <button onClick={() => onCreditClick(u)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all">Credit</button>
                                        </div>
                                    ));
                                })()
                            }
                        </div>
                    </div>
                </div>
            )}

            {/* Credit modal: enter amount */}
            {creditModalOpen && selectedCreditUser && (
                <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl w-full max-w-sm border-2 border-[#19140035] dark:border-[#3E3E3A]">
                        <div className="p-6 border-b border-[#19140035] dark:border-[#3E3E3A]">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-[#1b1b18] dark:text-[#EDEDEC]">Credit {selectedCreditUser.name ?? selectedCreditUser.email}</h3>
                                <button onClick={() => setCreditModalOpen(false)} className="text-[#1b1b18]/60 dark:text-[#EDEDEC]/60 hover:text-[#1b1b18] dark:hover:text-[#EDEDEC] text-xl font-bold">✕</button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="mt-2">
                                <label className="block text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC] mb-2">Amount</label>
                                <input 
                                    type="number" 
                                    value={creditAmount} 
                                    onChange={(e) => setCreditAmount(Number(e.target.value))} 
                                    className="w-full p-3 rounded-xl border-2 border-[#19140035] dark:border-[#3E3E3A] bg-white dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC] focus:outline-none focus:ring-2 focus:ring-red-500" 
                                />
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button onClick={() => setCreditModalOpen(false)} className="px-5 py-2.5 rounded-xl bg-[#19140035] dark:bg-[#3E3E3A] text-[#1b1b18] dark:text-[#EDEDEC] font-semibold hover:opacity-90 transition-all">Cancel</button>
                                <button onClick={submitCredit} disabled={creditSubmitting} aria-busy={creditSubmitting} className={`px-5 py-2.5 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all ${creditSubmitting ? 'bg-red-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-pink-600'}`}>
                                    {creditSubmitting ? (
                                        <span className="inline-flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                            </svg>
                                            Submitting...
                                        </span>
                                    ) : (
                                        'Submit'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Transfer modal */}
            {transferOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl w-full max-w-lg border-2 border-[#19140035] dark:border-[#3E3E3A]">
                        <div className="p-6 border-b border-[#19140035] dark:border-[#3E3E3A]">
                            <div className="flex items-start justify-between">
                                <h3 className="text-xl font-black text-[#1b1b18] dark:text-[#EDEDEC]">Prompt Token Transfer</h3>
                                <button onClick={() => setTransferOpen(false)} className="text-[#1b1b18]/60 dark:text-[#EDEDEC]/60 hover:text-[#1b1b18] dark:hover:text-[#EDEDEC] text-xl font-bold">✕</button>
                            </div>
                            <p className="mt-2 text-sm text-[#1b1b18]/70 dark:text-[#EDEDEC]/70">Enter amount to transfer to your opponent.</p>
                        </div>
                        <div className="p-6">
                            <div className="mt-4 flex items-center gap-3">
                                <input
                                    type="number"
                                    value={transferAmount}
                                    onChange={(e) => setTransferAmount(Number(e.target.value))}
                                    className="w-32 p-3 rounded-xl border-2 border-[#19140035] dark:border-[#3E3E3A] bg-white dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC] focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                                <div className="text-sm font-semibold text-[#1b1b18]/70 dark:text-[#EDEDEC]/70">of {tokenBalance} available</div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button onClick={() => setTransferOpen(false)} className="px-5 py-2.5 rounded-xl bg-[#19140035] dark:bg-[#3E3E3A] text-[#1b1b18] dark:text-[#EDEDEC] font-semibold hover:opacity-90 transition-all">Cancel</button>
                                <button onClick={confirmTransfer} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all">Confirm Transfer</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </>
    );
}
