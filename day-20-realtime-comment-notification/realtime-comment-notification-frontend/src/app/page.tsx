"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  MessageSquare,
  Send,
  Signal,
  UserRound,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { io, Socket } from "socket.io-client";

/* ─── Types ─── */
type CommentItem = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  mine?: boolean;
};

type ToastItem = {
  id: string;
  title: string;
  description: string;
};

/* ─── Constants ─── */
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

const seedComments: CommentItem[] = [
  {
    id: "seed-1",
    author: "Ayesha",
    text: "This feels soft, premium, and very natural on the eyes. Really love how the real-time updates just appear without any page refresh.",
    createdAt: new Date(Date.now() - 1000 * 60 * 13).toISOString(),
  },
  {
    id: "seed-2",
    author: "Hamza",
    text: "The realtime update should almost disappear into the experience. Great work on the Socket.IO integration!",
    createdAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
  },
  {
    id: "seed-3",
    author: "Sara",
    text: "This is the kind of UI that looks calm but still feels expensive. The toast notifications are a nice touch.",
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
];

/* ─── Utils ─── */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function timeAgo(dateString: string) {
  const diff = Math.max(0, Date.now() - new Date(dateString).getTime());
  const seconds = Math.floor(diff / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "U";
  const second = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return `${first}${second}`.toUpperCase();
}

/* ─── Sub-components ─── */

function Avatar({ name, mine, size = "md" }: { name: string; mine?: boolean; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "h-8 w-8 text-[11px]" : "h-10 w-10 text-[12px]";
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-full border font-semibold tracking-wide select-none",
        sizeClass
      )}
      style={{
        borderColor: mine ? "var(--border-avatar-mine)" : "var(--border-default)",
        background: mine ? "var(--bg-avatar-mine)" : "var(--bg-avatar)",
        color: mine ? "var(--text-avatar-mine)" : "var(--text-avatar)",
      }}
    >
      {initials(name)}
    </div>
  );
}

function StatusPill({ connected }: { connected: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium"
      style={{
        borderColor: connected ? "var(--border-pill-live)" : "var(--border-pill-offline)",
        background: connected ? "var(--bg-pill-live)" : "var(--bg-pill-offline)",
        color: connected ? "var(--text-pill-live)" : "var(--text-pill-offline)",
      }}
    >
      {connected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
      {connected ? "Live" : "Offline"}
    </span>
  );
}

/* ─── Comment Card ─── */
function CommentCard({ comment }: { comment: CommentItem }) {
  const isMine = Boolean(comment.mine);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-2xl border p-4 shadow-sm"
      style={{
        borderColor: isMine ? "var(--border-mine)" : "var(--border-default)",
        background: isMine ? "var(--bg-card-mine)" : "var(--bg-card)",
      }}
    >
      <div className="flex items-start gap-3">
        <Avatar name={comment.author} mine={isMine} />
        <div className="min-w-0 flex-1">
          {/* Author row */}
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--text-author)" }}
            >
              {comment.author}
            </span>
            {isMine && (
              <span
                className="rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                style={{
                  borderColor: "var(--border-pill-live)",
                  background: "var(--bg-pill-live)",
                  color: "var(--text-pill-live)",
                }}
              >
                you
              </span>
            )}
            <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>
              · {timeAgo(comment.createdAt)}
            </span>
          </div>

          {/* Comment text */}
          <p
            className="mt-1.5 text-[14px] leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {comment.text}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Main Page ─── */
export default function UI() {
  const [name, setName] = useState("Talha");
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState<CommentItem[]>(seedComments);
  const [connected, setConnected] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const socketRef = useRef<Socket | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const mySocketIdRef = useRef<string | null>(null);
  const sentIdsRef = useRef<Set<string>>(new Set());
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  /* ── Socket connection ── */
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      mySocketIdRef.current = socket.id ?? null;
      showToast("Connected", "You are live on the comment stream.");
    });

    socket.on("disconnect", () => {
      setConnected(false);
      showToast("Connection lost", "Trying to reconnect silently.");
    });

    socket.on("comment_history", (history: CommentItem[]) => {
      setComments((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const newOnes = history.filter((c) => !existingIds.has(c.id));
        return [...prev, ...newOnes];
      });
    });

    socket.on("new_comment", (incoming: CommentItem & { socketId?: string }) => {
      if (sentIdsRef.current.has(incoming.id)) {
        sentIdsRef.current.delete(incoming.id);
        return;
      }

      const isMine = incoming.socketId && incoming.socketId === mySocketIdRef.current;
      const normalized: CommentItem = {
        id: incoming.id || crypto.randomUUID(),
        author: incoming.author || "Anonymous",
        text: incoming.text || "",
        createdAt: incoming.createdAt || new Date().toISOString(),
        mine: isMine ? true : undefined,
      };

      setComments((prev) => [...prev, normalized]);

      if (!isMine) {
        setUnreadCount((v) => v + 1);
        showToast(normalized.author, normalized.text);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  /* ── Auto-scroll ── */
  useEffect(() => {
    if (isAtBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments, isAtBottom]);

  function handleScroll() {
    const el = listRef.current;
    if (!el) return;
    const threshold = 100;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    setIsAtBottom(atBottom);
    if (atBottom && unreadCount > 0) {
      setUnreadCount(0);
    }
  }

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setUnreadCount(0);
    setIsAtBottom(true);
  }

  function showToast(title: string, description: string) {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, title, description }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3500);
  }

  function send() {
    const text = message.trim();
    if (!text) return;

    const commentId = crypto.randomUUID();
    const comment: CommentItem & { socketId?: string } = {
      id: commentId,
      author: name.trim() || "You",
      text,
      createdAt: new Date().toISOString(),
      mine: true,
      socketId: mySocketIdRef.current ?? undefined,
    };

    setComments((prev) => [...prev, comment]);
    setMessage("");
    setUnreadCount(0);
    setIsAtBottom(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    if (socketRef.current?.connected) {
      sentIdsRef.current.add(commentId);
      socketRef.current.emit("add_comment", comment);
    } else {
      window.setTimeout(() => {
        showToast("Preview mode", "Backend is not connected.");
      }, 650);
    }

    setTimeout(() => textareaRef.current?.focus(), 50);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div
      className="flex h-dvh flex-col overflow-hidden"
      style={{
        background: `radial-gradient(circle at top, var(--bg-radial-top), transparent 32%), linear-gradient(180deg, var(--bg-page-start) 0%, var(--bg-page-mid) 48%, var(--bg-page-end) 100%)`,
        color: "var(--text-body)",
      }}
    >
      {/* ── Header ── */}
      <header
        className="z-20 shrink-0 border-b px-4 py-4 backdrop-blur-xl sm:px-8"
        style={{
          borderColor: "var(--border-divider)",
          background: "var(--bg-surface)",
        }}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusPill connected={connected} />
              <span className="text-xs" style={{ color: "var(--text-faint)" }}>
                · {comments.length} comments
              </span>
            </div>
            <h1
              className="text-lg font-bold tracking-tight sm:text-xl"
              style={{ color: "var(--text-primary)" }}
            >
              Live Comments
            </h1>
          </div>

          {/* Name Editor */}
          <div className="flex items-center gap-2">
            {showNameEdit ? (
              <div
                className="flex items-center gap-1.5 rounded-full border px-3 py-1.5"
                style={{
                  borderColor: "var(--border-input-focus)",
                  background: "var(--bg-input)",
                }}
              >
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setShowNameEdit(false);
                  }}
                  onBlur={() => setShowNameEdit(false)}
                  className="w-24 bg-transparent text-sm font-medium outline-none sm:w-32"
                  style={{ color: "var(--text-body)" }}
                  placeholder="Your name"
                />
                <button onClick={() => setShowNameEdit(false)}>
                  <X className="h-3.5 w-3.5" style={{ color: "var(--text-faint)" }} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowNameEdit(true)}
                className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition hover:opacity-80"
                style={{
                  borderColor: "var(--border-default)",
                  background: "var(--bg-pill)",
                  color: "var(--text-label)",
                }}
              >
                <UserRound className="h-3.5 w-3.5" />
                <span className="max-w-[80px] truncate font-medium sm:max-w-[120px]">{name || "Set name"}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Comment List (Middle Scrollable) ── */}
      <main
        ref={listRef}
        onScroll={handleScroll}
        className="relative flex-1 overflow-y-auto"
      >
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))}
            </AnimatePresence>
            <div ref={bottomRef} className="h-4" />
          </div>
        </div>

        {/* Unread badge / Scroll down */}
        <AnimatePresence>
          {(!isAtBottom || unreadCount > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="pointer-events-none sticky bottom-6 z-30 flex justify-center"
            >
              <button
                onClick={scrollToBottom}
                className="pointer-events-auto flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium shadow-lg backdrop-blur-md transition hover:scale-105 active:scale-95"
                style={{
                  borderColor: "var(--border-default)",
                  background: "var(--bg-toast)",
                  color: "var(--text-body)",
                  boxShadow: "var(--shadow-toast)",
                }}
              >
                <ChevronDown className="h-3.5 w-3.5" />
                {unreadCount > 0 ? (
                  <>
                    <span
                      className="grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold"
                      style={{ background: "var(--bg-button)", color: "var(--text-button)" }}
                    >
                      {unreadCount}
                    </span>
                    new
                  </>
                ) : (
                  "Scroll to latest"
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Sticky Bottom Input ── */}
      <footer
        className="z-20 shrink-0 border-t pb-4 pt-3 backdrop-blur-xl sm:pb-6"
        style={{
          borderColor: "var(--border-divider)",
          background: "var(--bg-surface)",
        }}
      >
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <section
            className="rounded-2xl border p-3 sm:p-4"
            style={{
              borderColor: "var(--border-default)",
              background: "var(--bg-card)",
              boxShadow: "var(--shadow-surface)",
            }}
          >
            <div className="flex items-end gap-3">
              <Avatar name={name || "You"} mine size="sm" />
              <div
                className="flex-1 rounded-xl border px-3 py-2 transition focus-within:ring-2"
                style={{
                  borderColor: "var(--border-input)",
                  background: "var(--bg-input)",
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  className="w-full resize-none bg-transparent text-sm leading-6 outline-none sm:text-[15px]"
                  style={{ color: "var(--text-body)" }}
                  placeholder="Add a comment..."
                />
              </div>
              <button
                onClick={send}
                disabled={!message.trim()}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full transition active:scale-90 disabled:opacity-30"
                style={{
                  background: message.trim() ? "var(--bg-button)" : "var(--border-default)",
                  color: message.trim() ? "var(--text-button)" : "var(--text-faint)",
                  boxShadow: message.trim() ? "var(--shadow-button)" : "none",
                }}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </section>

          {/* Desktop shortcut hint */}
          <p
            className="mt-3 hidden text-center text-[10px] tracking-wide sm:block"
            style={{ color: "var(--text-hint)" }}
          >
            Press <span className="font-semibold">Enter</span> to post · <span className="font-semibold">Shift+Enter</span> for new line
          </p>
        </div>
      </footer>

      {/* ── Toast Notifications ── */}
      <div className="pointer-events-none fixed right-0 top-4 z-50 flex flex-col gap-2 px-3 sm:px-5">
        <AnimatePresence>
          {toasts.map((toastItem) => (
            <motion.div
              key={toastItem.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="pointer-events-auto w-72 rounded-2xl border p-3.5 backdrop-blur-xl sm:w-80"
              style={{
                borderColor: "var(--border-default)",
                background: "var(--bg-toast)",
                boxShadow: "var(--shadow-toast)",
              }}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-xl"
                  style={{
                    background: "var(--bg-note-icon)",
                    color: "var(--text-note-icon)",
                  }}
                >
                  <Bell className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {toastItem.title}
                    </p>
                    <span
                      className="rounded-full border px-1.5 py-0.5 text-[9px] font-medium"
                      style={{
                        borderColor: "var(--border-pill-live)",
                        background: "var(--bg-pill-live)",
                        color: "var(--text-pill-live)",
                      }}
                    >
                      live
                    </span>
                  </div>
                  <p
                    className="mt-0.5 line-clamp-2 text-xs leading-5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {toastItem.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
