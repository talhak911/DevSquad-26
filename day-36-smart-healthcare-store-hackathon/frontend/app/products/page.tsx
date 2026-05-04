"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3002";

interface Product {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  tags: string[];
  stock: number;
}

interface ChatMsg {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: Product[];
}

const CATEGORY_COLORS: Record<string, string> = {
  "Vitamins": "badge-green",
  "Supplements": "badge-blue",
  "Bone Health": "badge-amber",
  "Hair & Nail": "badge-purple",
  "Immunity": "badge-green",
  "Digestive Health": "badge-blue",
  "Skin Care": "badge-purple",
  "Pain Relief": "badge-red",
  "Heart Health": "badge-red",
  "Eye Care": "badge-blue",
  "Sleep & Stress": "badge-purple",
  "Weight Management": "badge-green",
  "Diabetes Care": "badge-amber",
  "Protein & Fitness": "badge-blue",
};

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("hc_token") : "";
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const colorClass = CATEGORY_COLORS[product.category] || "badge-blue";
  return (
    <div className="glass-card animate-fade-up" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", lineHeight: "1.3", flex: 1 }}>{product.name}</h3>
        <span className={`badge ${colorClass}`} style={{ flexShrink: 0 }}>{product.category}</span>
      </div>
      <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6", flex: 1 }}>
        {product.description.substring(0, 120)}{product.description.length > 120 ? "…" : ""}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {product.tags.slice(0, 4).map((tag) => (
          <span key={tag} style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
            {tag}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "8px", borderTop: "1px solid var(--border)" }}>
        <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--accent)" }}>₹{product.price}</span>
        <span style={{ fontSize: "12px", color: product.stock > 0 ? "var(--accent)" : "var(--danger)" }}>
          {product.stock > 0 ? `✓ In Stock (${product.stock})` : "Out of Stock"}
        </span>
      </div>
    </div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="glass-card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div className="skeleton" style={{ height: "20px", width: "70%" }} />
      <div className="skeleton" style={{ height: "14px", width: "40%" }} />
      <div className="skeleton" style={{ height: "56px" }} />
      <div style={{ display: "flex", gap: "6px" }}>
        <div className="skeleton" style={{ height: "22px", width: "60px", borderRadius: "12px" }} />
        <div className="skeleton" style={{ height: "22px", width: "50px", borderRadius: "12px" }} />
      </div>
      <div className="skeleton" style={{ height: "24px", width: "30%", marginTop: "8px" }} />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchMode, setSearchMode] = useState<"title" | "ai">("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ explanation: string; intent: string } | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("hc_token");
    const userData = localStorage.getItem("hc_user");
    if (!token) { router.replace("/"); return; }
    if (userData) setUser(JSON.parse(userData));
  }, [router]);

  const fetchProducts = useCallback(async (cat?: string) => {
    setLoading(true);
    try {
      const url = cat && cat !== "All" ? `${BACKEND}/products?category=${encodeURIComponent(cat)}` : `${BACKEND}/products`;
      const res = await fetch(url, { headers: authHeaders() });
      if (res.status === 401) { router.replace("/"); return; }
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch { setProducts([]); } finally { setLoading(false); }
  }, [router]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND}/products/categories`, { headers: authHeaders() });
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch { /**/ }
  }, []);

  useEffect(() => { fetchProducts(); fetchCategories(); }, [fetchProducts, fetchCategories]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) { setAiResult(null); fetchProducts(activeCategory !== "All" ? activeCategory : undefined); return; }
    setSearchLoading(true);
    setAiResult(null);
    try {
      if (searchMode === "title") {
        const res = await fetch(`${BACKEND}/products/search?q=${encodeURIComponent(searchQuery)}`, { headers: authHeaders() });
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } else {
        const res = await fetch(`${BACKEND}/products/ai-search?q=${encodeURIComponent(searchQuery)}`, { headers: authHeaders() });
        const data = await res.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
        setAiResult({ explanation: data.explanation, intent: data.intent });
      }
    } catch { /**/ } finally { setSearchLoading(false); }
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setSearchQuery("");
    setAiResult(null);
    fetchProducts(cat !== "All" ? cat : undefined);
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    const userMsg: ChatMsg = { id: Date.now().toString(), role: "user", content: msg };
    setChatMessages((p) => [...p, userMsg]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch(`${BACKEND}/products/chat`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      const botMsg: ChatMsg = { id: `bot-${Date.now()}`, role: "assistant", content: data.response || "Sorry, I couldn't process that.", products: data.products };
      setChatMessages((p) => [...p, botMsg]);
    } catch {
      setChatMessages((p) => [...p, { id: `err-${Date.now()}`, role: "assistant", content: "Error connecting to assistant. Please try again." }]);
    } finally { setChatLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem("hc_token");
    localStorage.removeItem("hc_user");
    router.replace("/");
  };

  return (
    <div className="bg-mesh" style={{ minHeight: "100vh" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0f1e]/85 backdrop-blur-xl border-b border-white/10 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-xl md:text-2xl shadow-lg shadow-emerald-500/20">
              🏥
            </div>
            <div>
              <span className="gradient-text text-xl md:text-2xl font-extrabold tracking-tight">MediStore</span>
              <p className="hidden md:block text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-0.5">Smart Healthcare</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {user && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                <span className="text-xs text-slate-400">Welcome back,</span>
                <span className="text-sm font-semibold text-white">{user.name}</span>
              </div>
            )}

            <div className="h-6 w-[1px] bg-white/10 mx-2"></div>

            <button
              id="chat-toggle-btn"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all font-semibold text-sm group"
              onClick={() => setShowChat((v) => !v)}
            >
              <span className="text-lg group-hover:scale-110 transition-transform">💬</span>
              <span>AI Assistant</span>
              {chatMessages.length > 0 && (
                <span className="bg-emerald-500 text-white rounded-full min-w-[20px] h-5 px-1.5 text-[10px] flex items-center justify-center font-bold">
                  {chatMessages.filter(m => m.role === "assistant").length}
                </span>
              )}
            </button>

            <button
              id="logout-btn"
              className="px-5 py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all font-semibold text-sm"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 text-slate-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/10 py-6 animate-fade-in">
            <div className="flex flex-col gap-4">
              {user && (
                <div className="px-2 mb-2">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Signed in as</p>
                  <p className="text-lg font-bold text-white">{user.name}</p>
                </div>
              )}

              <button
                className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold"
                onClick={() => { setShowChat(!showChat); setIsMenuOpen(false); }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">💬</span>
                  <span>AI Health Assistant</span>
                </div>
                {chatMessages.length > 0 && (
                  <span className="bg-emerald-500 text-white rounded-full min-w-[24px] h-6 px-2 text-xs flex items-center justify-center font-bold">
                    {chatMessages.filter(m => m.role === "assistant").length}
                  </span>
                )}
              </button>

              <button
                className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold"
                onClick={handleLogout}
              >
                <span className="text-xl">🚪</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Hero search */}
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>
              Healthcare <span className="gradient-text">Products</span>
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "15px", marginBottom: "24px" }}>
              Discover the right products for your health needs — with AI guidance.
            </p>

            {/* Search mode toggle */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              {(["title", "ai"] as const).map((m) => (
                <button key={m} id={`search-mode-${m}`} onClick={() => { setSearchMode(m); setAiResult(null); }}
                  style={{
                    padding: "7px 16px", borderRadius: "20px", border: "1px solid", cursor: "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "inherit", transition: "all 0.2s",
                    background: searchMode === m ? "var(--accent-light)" : "transparent",
                    borderColor: searchMode === m ? "var(--accent)" : "var(--border)",
                    color: searchMode === m ? "var(--accent)" : "var(--text-muted)",
                  }}>
                  {m === "title" ? "🔍 Title Search" : "🤖 AI Intent Search"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input id="search-input" className="input-field pr-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchMode === "title" ? "Search by product name..." : "Describe your health need..."}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    onClick={() => { setSearchQuery(""); setAiResult(null); fetchProducts(activeCategory !== "All" ? activeCategory : undefined); }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <button type="submit" className="btn-primary w-full sm:w-auto min-w-[120px] flex items-center justify-center gap-2" id="search-btn" disabled={searchLoading}>
                {searchLoading ? <div className="spinner" /> : (
                  <>
                    <span className="sm:hidden lg:inline text-lg">🔍</span>
                    <span>Search</span>
                  </>
                )}
              </button>
            </form>

            {/* AI explanation banner */}
            {aiResult && (
              <div style={{ marginTop: "16px", background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(59,130,246,0.06))", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "14px", padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <span style={{ fontSize: "24px", flexShrink: 0 }}>🤖</span>
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: "700", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                      AI Detected: {aiResult.intent}
                    </p>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>{aiResult.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category filter */}
          {!aiResult && (
            <div className="-mx-0 flex flex-nowrap overflow-x-auto lg:flex-wrap gap-2 mb-6 pb-2 lg:pb-0 hide-scrollbar scroll-smooth">
              {["All", ...categories].map((cat) => (
                <button key={cat} id={`cat-${cat}`} onClick={() => handleCategoryClick(cat)}
                  className={`
                    flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border whitespace-nowrap
                    ${activeCategory === cat
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-white/5 border-white/10 text-slate-400 hover:border-emerald-500/40 hover:text-emerald-400"}
                  `}>
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Product Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "14px" }}>
            {loading || searchLoading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : products.length === 0
                ? (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "64px 20px" }}>
                    <p style={{ fontSize: "48px", marginBottom: "16px" }}>🔬</p>
                    <p style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-secondary)", marginBottom: "8px" }}>No products found</p>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Try a different search term or browse all categories.</p>
                  </div>
                )
                : products.map((p) => <ProductCard key={p._id} product={p} />)
            }
          </div>
        </div>

        {/* Chat Panel (slide-in / overlay on mobile) */}
        {showChat && (
          <aside className="fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-0 lg:w-[380px] lg:flex-shrink-0 animate-slide-right">
            {/* Mobile Backdrop */}
            <div className="absolute inset-0 bg-[#0a0f1e]/60 backdrop-blur-sm lg:hidden" onClick={() => setShowChat(false)}></div>

            <div className="absolute right-0 top-0 bottom-0 w-[90%] max-w-[400px] lg:w-full lg:static lg:h-[calc(100vh-120px)] lg:sticky lg:top-28 flex flex-col shadow-2xl lg:shadow-none">
              <div className="glass-card" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: 0 }}>
                {/* Chat Header */}
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🤖</div>
                    <div>
                      <p style={{ fontWeight: "700", fontSize: "14px" }}>AI Health Assistant</p>
                      <p style={{ fontSize: "11px", color: "var(--accent)" }}>● Online</p>
                    </div>
                  </div>
                  <button onClick={() => setShowChat(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "18px", lineHeight: 1 }}>✕</button>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {chatMessages.length === 0 && (
                    <div style={{ textAlign: "center", padding: "32px 16px" }}>
                      <p style={{ fontSize: "32px", marginBottom: "12px" }}>💬</p>
                      <p style={{ fontWeight: "700", color: "var(--text-secondary)", marginBottom: "8px" }}>Ask me anything!</p>
                      <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6" }}>Try: "Suggest vitamins for hair fall" or "What helps with weak immunity?"</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "16px" }}>
                        {["Suggest vitamins for hair fall", "Help with weak bones", "Best supplements for energy"].map((q) => (
                          <button key={q} onClick={() => setChatInput(q)}
                            style={{ padding: "8px 12px", borderRadius: "10px", background: "var(--accent-light)", border: "1px solid rgba(16,185,129,0.2)", color: "var(--accent)", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {chatMessages.map((msg) => (
                    <div key={msg.id} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                      <div style={{
                        maxWidth: "88%", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        padding: "10px 14px", background: msg.role === "user" ? "linear-gradient(135deg,#10b981,#059669)" : "rgba(255,255,255,0.05)",
                        border: msg.role === "assistant" ? "1px solid var(--border)" : "none", color: "var(--text-primary)"
                      }}>
                        {msg.role === "assistant"
                          ? <div className="prose" style={{ fontSize: "13px", color: "white", lineHeight: "1.65" }}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                          </div>
                          : <p style={{ fontSize: "14px", color: "white" }}>{msg.content}</p>
                        }
                      </div>
                    </div>
                  ))}

                  {chatLoading && (
                    <div style={{ display: "flex", gap: "6px", padding: "10px 14px", background: "rgba(255,255,255,0.05)", borderRadius: "16px 16px 16px 4px", width: "fit-content", border: "1px solid var(--border)" }}>
                      {[0, 150, 300].map((d) => (
                        <div key={d} style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--accent)", animation: `bounce 1s ${d}ms infinite` }} />
                      ))}
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <form onSubmit={handleChat} style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: "8px" }}>
                  <input id="chat-input" className="input-field" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about health products…" disabled={chatLoading}
                    style={{ flex: 1, padding: "10px 14px", fontSize: "13px" }} />
                  <button type="submit" className="btn-primary" id="chat-send-btn" disabled={chatLoading || !chatInput.trim()}
                    style={{ flexShrink: 0, padding: "10px 14px", minWidth: "auto" }}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </aside>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
