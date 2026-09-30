import { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';

/* ---------- Small icons ---------- */
const Icon = {
    Send: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M3 10l14-6-5.5 6L17 16 3 10z" />
        </svg>
    ),
    Chat: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M3 5.5A2.5 2.5 0 015.5 3h9A2.5 2.5 0 0117 5.5v6a2.5 2.5 0 01-2.5 2.5H8l-5 3.5V5.5z" />
        </svg>
    ),
};

/* ---------- Helpers ---------- */
const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('ms-MY', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getSenderInitial = (message) =>
    (message?.sender?.name ?? 'U').charAt(0).toUpperCase();

export default function ChatBox({ booking }) {
    const { auth } = usePage().props;
    const [messages, setMessages] = useState(booking.messages ?? []);
    const [body, setBody] = useState('');
    const [sending, setSending] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    /* ---------- Realtime subscription ---------- */
    useEffect(() => {
        if (!window.Echo) return;

        const channel = window.Echo.private(`booking.${booking.id}`);

        channel.listen('.message.sent', (e) => {
            setMessages((prev) => {
                // Avoid duplicates when our own optimistic post already added it
                if (prev.some((m) => m.id === e.id)) return prev;
                return [...prev, e];
            });
        });

        return () => {
            window.Echo.leave(`booking.${booking.id}`);
        };
    }, [booking.id]);

    /* ---------- Auto-scroll to newest ---------- */
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    /* ---------- Submit ---------- */
    const submit = (e) => {
        e.preventDefault();
        const text = body.trim();
        if (!text || sending) return;

        setSending(true);
        setBody('');

        fetch(route('bookings.messages.store', booking.id), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                Accept: 'application/json',
            },
            body: JSON.stringify({ body: text }),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to send');
                return res.json();
            })
            .then((data) => {
                if (data?.message) {
                    setMessages((prev) => {
                        if (prev.some((m) => m.id === data.message.id)) return prev;
                        return [...prev, data.message];
                    });
                }
            })
            .catch(() => {
                // Restore the text so the user can retry
                setBody(text);
            })
            .finally(() => {
                setSending(false);
                inputRef.current?.focus();
            });
    };

    return (
        <div className="flex flex-col">
            {/* ---------- Message thread ---------- */}
            <div className="max-h-96 overflow-y-auto rounded-xl border border-stone-200 bg-stone-50/60 p-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                            <Icon.Chat style={{ width: 20, height: 20 }} />
                        </span>
                        <p className="text-sm font-semibold text-stone-800">
                            Belum ada mesej
                        </p>
                        <p className="max-w-xs text-xs text-stone-500">
                            Mulakan perbualan dengan menghantar mesej pertama anda.
                        </p>
                    </div>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {messages.map((message) => {
                            const isMine = message.sender?.id === auth?.user?.id;

                            return (
                                <li
                                    key={message.id}
                                    className={`flex items-end gap-2 ${
                                        isMine ? 'flex-row-reverse' : 'flex-row'
                                    }`}
                                >
                                    {/* Avatar */}
                                    <span
                                        className={`grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full text-xs font-bold ${
                                            isMine
                                                ? 'bg-emerald-700 text-white'
                                                : 'bg-emerald-100 text-emerald-800'
                                        }`}
                                    >
                                        {message.sender?.avatar_url ? (
                                            <img
                                                src={message.sender.avatar_url}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            getSenderInitial(message)
                                        )}
                                    </span>

                                    {/* Bubble */}
                                    <div
                                        className={`flex max-w-[75%] flex-col ${
                                            isMine ? 'items-end' : 'items-start'
                                        }`}
                                    >
                                        <div
                                            className={`whitespace-pre-line break-words rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                                                isMine
                                                    ? 'rounded-br-sm bg-emerald-700 text-white'
                                                    : 'rounded-bl-sm border border-stone-200 bg-white text-stone-800'
                                            }`}
                                        >
                                            {message.body}
                                        </div>
                                        <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                                            {formatTime(message.created_at)}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
                <div ref={bottomRef} />
            </div>

            {/* ---------- Input form ---------- */}
            <form
                onSubmit={submit}
                className="mt-4 flex items-end gap-2 rounded-xl border border-stone-200 bg-white p-2 transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/15"
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Taip mesej anda..."
                    maxLength={2000}
                    autoComplete="off"
                    className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-stone-800 placeholder-stone-400 outline-none"
                />

                <button
                    type="submit"
                    disabled={!body.trim() || sending}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-700 text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                    aria-label="Hantar mesej"
                >
                    {sending ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    ) : (
                        <Icon.Send style={{ width: 16, height: 16 }} />
                    )}
                </button>
            </form>

            {/* Character counter + hint */}
            <div className="mt-1.5 flex items-center justify-between px-1">
                <p className="text-[10px] text-stone-400">
                    Mesej dipaparkan kepada kedua-dua pihak.
                </p>
                {body.length > 0 && (
                    <p
                        className={`text-[10px] font-semibold ${
                            body.length > 1800 ? 'text-rose-500' : 'text-stone-400'
                        }`}
                    >
                        {body.length}/2000
                    </p>
                )}
            </div>
        </div>
    );
}