"use client";

import { useState, useEffect, useId, Fragment } from "react";
import {
  PRODUCTS,
  CATEGORIES,
  TESTIMONIALS,
  fmt,
  type Product,
  type CartItem,
  type User,
} from "./data";
import "./marketplace.css";

/* ----- Icon primitives ----- */
type IconProps = {
  d?: string | string[];
  fill?: boolean;
  size?: number;
  cls?: string;
  stroke?: number;
};

const Icon = ({ d, fill = false, size = 20, cls = "", stroke = 1.6 }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={cls}
    fill={fill ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const IconSearch = (p: IconProps) => <Icon {...p} d={["M11 11m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0", "M21 21l-4.3-4.3"]} />;
const IconUser = (p: IconProps) => <Icon {...p} d={["M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0", "M4 21c0-3.6 3.6-6 8-6s8 2.4 8 6"]} />;
const IconBag = (p: IconProps) => <Icon {...p} d={["M6 8h12l-1 12H7L6 8z", "M9 8V6a3 3 0 0 1 6 0v2"]} />;
const IconClose = (p: IconProps) => <Icon {...p} d={["M6 6l12 12", "M18 6L6 18"]} />;
const IconPlus = (p: IconProps) => <Icon {...p} d={["M12 5v14", "M5 12h14"]} />;
const IconMinus = (p: IconProps) => <Icon {...p} d={"M5 12h14"} />;
const IconTrash = (p: IconProps) => <Icon {...p} d={["M4 7h16", "M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2", "M6 7l1 13h10l1-13"]} />;
const IconCheck = (p: IconProps) => <Icon {...p} d={"M4 12.5 L10 18 L20 6"} />;
const IconArrow = (p: IconProps) => <Icon {...p} d={["M5 12h14", "M13 6l6 6-6 6"]} />;
const IconShield = (p: IconProps) => <Icon {...p} d={["M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z", "M9 12l2 2 4-4"]} />;
const IconLock = (p: IconProps) => <Icon {...p} d={["M6 11h12v9H6z", "M9 11V8a3 3 0 0 1 6 0v3"]} />;
const IconLeaf = (p: IconProps) => <Icon {...p} d={["M5 19c0-8 6-13 14-13 0 8-6 13-14 13z", "M5 19c4-6 8-8 11-9"]} />;
const IconStar = (p: IconProps) => <Icon {...p} fill d={"M12 3.5l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z"} />;
const IconTruck = (p: IconProps) => <Icon {...p} d={["M3 7h11v8H3z", "M14 10h4l3 3v2h-7", "M7 18m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0", "M17 18m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0"]} />;

/* ----- Botanical product placeholder / image ----- */
type ProductImageProps = {
  hue?: number;
  label?: string;
  src?: string | null;
  className?: string;
  round?: string;
};

const ProductImage = ({ hue = 140, label = "product shot", src = null, className = "", round = "rounded-2xl" }: ProductImageProps) => {
  const id = useId().replace(/:/g, "");
  if (src) {
    return (
      <div className={`relative overflow-hidden ${round} ${className}`} style={{ background: `hsl(${hue} 28% 90%)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={label} loading="eager" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
      </div>
    );
  }
  const base = `hsl(${hue} 28% 90%)`;
  const stripe = `hsl(${hue} 26% 84%)`;
  const ink = `hsl(${hue} 35% 34%)`;
  return (
    <div className={`relative overflow-hidden ${round} ${className}`} style={{ background: base }}>
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <pattern id={`s${id}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="14" height="14" fill={base} />
            <rect width="7" height="14" fill={stripe} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#s${id})`} opacity="0.7" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ color: ink }}>
        <IconLeaf size={34} stroke={1.3} cls="opacity-70" />
        <span className="font-mono text-[10px] tracking-widest uppercase opacity-70">{label}</span>
      </div>
    </div>
  );
};

/* ----- Small UI atoms ----- */
const Pill = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full text-[11px] font-medium tracking-wide ${className}`}>{children}</span>
);

const Field = ({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="block text-[13px] font-medium text-ink-soft mb-1.5">{label}</span>
    {children}
    {hint && !error && <span className="block text-[12px] text-ink-faint mt-1">{hint}</span>}
    {error && <span className="block text-[12px] text-terracotta-600 mt-1">{error}</span>}
  </label>
);

const inputCls =
  "w-full h-11 px-3.5 rounded-xl bg-cream-soft border border-sage-200 text-ink placeholder:text-ink-faint outline-none transition focus:border-sage-400 focus:ring-2 focus:ring-sage-200";

/* ===== Scroll-driven vine rail ===== */
type VineNode = { at: number; side: "l" | "r"; kind: "green" | "amber"; rot: number };

const VINE_NODES: VineNode[] = [
  { at: 0.05, side: "r", kind: "green", rot: -6 },
  { at: 0.2, side: "l", kind: "amber", rot: 8 },
  { at: 0.36, side: "r", kind: "green", rot: -10 },
  { at: 0.52, side: "l", kind: "amber", rot: 5 },
  { at: 0.66, side: "r", kind: "green", rot: -4 },
  { at: 0.8, side: "l", kind: "amber", rot: 10 },
  { at: 0.93, side: "r", kind: "green", rot: -8 },
];

const LeafShape = ({ kind }: { kind: "green" | "amber" }) => {
  const uid = useId().replace(/:/g, "");
  const palette =
    kind === "amber"
      ? { from: "#d6b66e", to: "#a8703a", edge: "#8a5a30", vein: "#9c6f3a" }
      : { from: "#7d9266", to: "#3f5a44", edge: "#2f4634", vein: "#4f6b54" };
  return (
    <svg viewBox="0 0 70 34" width="54" height="26" aria-hidden="true">
      <defs>
        <linearGradient id={`lg${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={palette.from} />
          <stop offset="1" stopColor={palette.to} />
        </linearGradient>
      </defs>
      <path d="M0,17.5 L6,17" fill="none" stroke={palette.edge} strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M5,17 C 11,6 26,2 43,4 C 55,5.5 64,10 68,16.5 C 64,23 55,27.5 43,29 C 26,31 11,28 5,17 Z"
        fill={`url(#lg${uid})`}
        stroke={palette.edge}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path d="M6,17 C 30,16 50,16.5 67,16.5" fill="none" stroke={palette.vein} strokeWidth="1.1" strokeLinecap="round" opacity="0.85" />
      <g fill="none" stroke={palette.vein} strokeWidth="0.85" strokeLinecap="round" opacity="0.65">
        <path d="M16,16.7 C 21,12 27,9 33,7" />
        <path d="M16,16.9 C 21,21 27,24 33,26" />
        <path d="M30,16.4 C 36,12 43,9 50,8" />
        <path d="M30,16.7 C 36,21 43,24 50,25" />
        <path d="M44,16.3 C 49,13 54,11 59,10" />
        <path d="M44,16.6 C 49,20 54,22 59,23" />
      </g>
      <path d="M12,14 C 24,8 38,7 52,10" fill="none" stroke="#ffffff" strokeWidth="0.9" strokeLinecap="round" opacity="0.18" />
    </svg>
  );
};

const VineLeaf = ({ node, grown }: { node: VineNode; grown: boolean }) => {
  const flip = node.side === "l";
  return (
    <span
      className="vine-leaf"
      data-grown={grown ? "1" : "0"}
      style={{ top: `${node.at * 100}%`, "--flip": flip ? -1 : 1, "--rot": node.rot } as React.CSSProperties}
    >
      <LeafShape kind={node.kind} />
    </span>
  );
};

const Vine = () => {
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const next = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
      setP((prev) => (Math.abs(prev - next) > 0.002 ? next : prev));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="vine-rail" aria-hidden="true" style={{ "--p": p } as React.CSSProperties}>
      <svg className="vine-svg" viewBox="0 0 60 1000" preserveAspectRatio="none">
        <path className="vine-track" d="M30,0 C50,120 10,240 30,360 C50,480 10,600 30,720 C50,840 10,960 30,1000" />
        <path className="vine-grow" d="M30,0 C50,120 10,240 30,360 C50,480 10,600 30,720 C50,840 10,960 30,1000" pathLength="1" />
      </svg>
      {VINE_NODES.map((n, i) => (
        <VineLeaf key={i} node={n} grown={p >= n.at - 0.01} />
      ))}
      <span className="vine-bud" style={{ top: `${p * 100}%` }} />
      <span className="vine-seed" />
    </div>
  );
};

/* ===== Decorative blob ===== */
const Blob = ({ className = "", color = "#c2cdb2", opacity = 0.5 }: { className?: string; color?: string; opacity?: number }) => (
  <svg viewBox="0 0 200 200" className={className} aria-hidden="true" style={{ opacity }}>
    <path
      fill={color}
      d="M44.6,-58.3C57.4,-50.3,66.5,-36.3,70.7,-20.9C74.9,-5.5,74.2,11.4,67.6,25.4C61,39.4,48.6,50.6,34.6,58.7C20.7,66.8,5.3,71.9,-10.8,71.6C-26.9,71.3,-43.7,65.7,-55.6,54.4C-67.5,43.1,-74.5,26.2,-75.8,9C-77.1,-8.2,-72.7,-25.6,-62.8,-38.8C-52.9,-52,-37.5,-61,-22.1,-67.7C-6.7,-74.4,8.7,-78.8,23.3,-74.8C37.9,-70.8,51.7,-58.3,44.6,-58.3Z"
      transform="translate(100 100)"
    />
  </svg>
);

/* ===== Header ===== */
const Header = ({
  cartCount,
  onCart,
  onAccount,
  onSearch,
  query,
  user,
}: {
  cartCount: number;
  onCart: () => void;
  onAccount: () => void;
  onSearch: (v: string) => void;
  query: string;
  user: User | null;
}) => (
  <header className="fixed top-0 inset-x-0 z-40 bg-cream/85 backdrop-blur-md border-b border-sage-200/70">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 sm:h-[72px] flex items-center gap-3 sm:gap-6">
      <a href="#top" className="flex items-center gap-2.5 shrink-0">
        <span className="grid place-items-center w-9 h-9 rounded-full bg-forest text-cream">
          <IconLeaf size={18} stroke={1.4} />
        </span>
        <span className="leading-none">
          <span className="block font-serif text-xl sm:text-2xl font-semibold text-forest tracking-tight">AyaVine</span>
          <span className="hidden sm:block text-[10px] tracking-[0.22em] uppercase text-ink-faint">Metaphysical Medic</span>
        </span>
      </a>

      <div className="hidden md:flex flex-1 max-w-md relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint">
          <IconSearch size={18} />
        </span>
        <input
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search the collection…"
          className="w-full h-11 pl-10 pr-4 rounded-full bg-cream-soft border border-sage-200 text-ink placeholder:text-ink-faint outline-none transition focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
        />
      </div>

      <div className="flex-1 md:hidden" />

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <button onClick={onAccount} className="group flex items-center gap-2 h-10 px-2.5 sm:px-3 rounded-full hover:bg-sage-100 transition" aria-label="Account">
          <IconUser size={20} cls="text-forest" />
          <span className="hidden lg:block text-sm text-ink-soft group-hover:text-forest">{user ? user.name.split(" ")[0] : "Sign in"}</span>
        </button>
        <button onClick={onCart} className="relative flex items-center gap-2 h-10 px-2.5 sm:px-3 rounded-full hover:bg-sage-100 transition" aria-label="Cart">
          <IconBag size={20} cls="text-forest" />
          <span className="hidden lg:block text-sm text-ink-soft">Cart</span>
          {cartCount > 0 && (
            <span key={cartCount} className="absolute -top-0.5 -right-0.5 grid place-items-center min-w-[18px] h-[18px] px-1 rounded-full bg-terracotta text-cream text-[10px] font-bold animate-pop">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  </header>
);

/* ===== Hero ===== */
const Hero = ({ onShop }: { onShop: () => void }) => (
  <section id="top" className="relative overflow-hidden min-h-svh flex flex-col">
    <Blob className="absolute -top-24 -right-24 w-[420px] h-[420px] animate-floaty" color="#c2cdb2" opacity={0.45} />
    <Blob className="absolute top-40 -left-32 w-[360px] h-[360px] animate-floaty" color="#d6b66e" opacity={0.25} />
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 pt-24 sm:pt-32 pb-8 sm:pb-10 relative flex-1 flex flex-col">
      <div className="flex-1 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        <div className="animate-fadeUp">
          <Pill className="bg-sage-100 text-forest px-3 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta" /> Traditional Plant Medicine · Modern Integration
          </Pill>
          <h1 className="font-serif text-[2.7rem] leading-[1.04] sm:text-6xl lg:text-[4.2rem] font-semibold text-forest tracking-tight">
            Sacred Wellness
            <br />
            for <em className="text-terracotta not-italic font-normal italic">Modern</em> Times
          </h1>
          <p className="mt-6 text-[1.02rem] sm:text-lg leading-relaxed text-ink-soft max-w-xl">
            AyaVine <span className="italic text-forest">“Grandmother Caapi Vine”</span> is traditional Peruvian plant medicine that supports feelings of overall wellness and clarity. Every product is urinalysis safe and legal throughout the US.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button onClick={onShop} className="group inline-flex items-center justify-center gap-2 h-13 px-7 rounded-full bg-terracotta text-cream font-medium tracking-wide whitespace-nowrap shadow-lift hover:bg-terracotta-600 transition">
              Shop the collection <IconArrow size={18} cls="group-hover:translate-x-0.5 transition" />
            </button>
            <a href="#about" className="inline-flex items-center justify-center h-13 px-6 rounded-full border border-sage-300 text-forest font-medium whitespace-nowrap hover:bg-sage-100 transition">
              Why AyaVine
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-ink-faint">
            <span className="inline-flex items-center gap-1.5">
              <IconShield size={16} cls="text-sage-500" /> Urinalysis safe &amp; legal in the US
            </span>
            <span className="inline-flex items-center gap-1.5">
              <IconLeaf size={16} cls="text-sage-500" /> Sourced with reverence
            </span>
          </div>
        </div>

        <div className="relative animate-scaleIn">
          <div className="relative rounded-[2rem] overflow-hidden shadow-lift">
            <ProductImage hue={42} src={PRODUCTS.find((p) => p.id === "ayahoney")?.img} label="AyaHoney — Grandmother Caapi Vine honey" round="rounded-[2rem]" className="aspect-[4/5]" />
          </div>
          <div className="absolute -bottom-6 -left-6 w-44 rounded-2xl bg-cream-soft shadow-card p-4 hidden sm:block animate-fadeUp" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-1 text-gold">
              {[0, 1, 2, 3, 4].map((i) => (
                <IconStar key={i} size={14} />
              ))}
            </div>
            <p className="mt-1.5 text-[13px] leading-snug text-ink-soft">“Handled with genuine reverence.”</p>
          </div>
          <div className="absolute -top-5 -right-3 rounded-2xl bg-forest text-cream shadow-lift px-4 py-3 hidden sm:flex items-center gap-2.5 animate-fadeUp" style={{ animationDelay: "0.45s" }}>
            <IconLeaf size={20} />
            <div className="leading-tight">
              <div className="text-[11px] opacity-70">Grandmother</div>
              <div className="text-sm font-medium">Caapi Vine</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-sage-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[12px] uppercase tracking-[0.18em] text-ink-faint">Secure payment accepted</span>
        <div className="flex items-center gap-2">
          {["VISA", "MC", "AMEX", "DISC", "JCB"].map((c) => (
            <span key={c} className="grid place-items-center h-7 px-3 rounded-md bg-cream-soft border border-sage-200 text-[11px] font-semibold text-ink-soft tracking-wide">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ===== Product card ===== */
const ProductCard = ({ p, onAdd, qtyInCart }: { p: Product; onAdd: (p: Product) => void; qtyInCart: number }) => {
  const [added, setAdded] = useState(false);
  const add = () => {
    onAdd(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 1300);
  };
  return (
    <article className="group flex flex-col bg-cream-soft rounded-3xl border border-sage-200/70 shadow-card overflow-hidden hover:shadow-lift hover:-translate-y-1 transition duration-300">
      <div className="relative p-3">
        <ProductImage hue={p.hue} src={p.img} label={p.name} round="rounded-2xl" className="aspect-square" />
        {p.tag && <Pill className="absolute top-5 left-5 bg-forest text-cream px-2.5 py-1">{p.tag}</Pill>}
        {p.size && <Pill className="absolute top-5 right-5 bg-cream/90 text-ink-soft px-2.5 py-1 border border-sage-200">{p.size}</Pill>}
      </div>
      <div className="flex flex-col flex-1 px-5 pb-5">
        <span className="text-[11px] uppercase tracking-[0.16em] text-sage-500 font-medium">{p.cat}</span>
        <h3 className="mt-1 font-serif text-xl font-semibold text-forest leading-tight">{p.name}</h3>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft flex-1">{p.blurb}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="font-serif text-2xl font-semibold text-ink">{fmt(p.price)}</span>
          <button onClick={add} className={`relative inline-flex items-center gap-1.5 h-10 px-4 rounded-full font-medium text-sm tracking-wide transition ${added ? "bg-sage-500 text-cream" : "bg-forest text-cream hover:bg-forest-600"}`}>
            {added ? (
              <>
                <IconCheck size={16} /> Added
              </>
            ) : (
              <>
                <IconPlus size={16} /> Add{qtyInCart > 0 ? ` · ${qtyInCart}` : ""}
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

/* ===== Catalog ===== */
const Catalog = ({
  products,
  onAdd,
  cart,
  query,
  onQuery,
}: {
  products: Product[];
  onAdd: (p: Product) => void;
  cart: CartItem[];
  query: string;
  onQuery: (v: string) => void;
}) => {
  const [cat, setCat] = useState("All");
  const filtered = products.filter(
    (p) => (cat === "All" || p.cat === cat) && (p.name + p.blurb + p.cat).toLowerCase().includes(query.trim().toLowerCase())
  );
  const qtyOf = (id: string) => cart.find((c) => c.id === id)?.qty || 0;
  return (
    <section id="catalog" className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
        <div>
          <span className="text-[12px] uppercase tracking-[0.2em] text-terracotta font-semibold">The Catalog</span>
          <h2 className="mt-2 font-serif text-4xl sm:text-5xl font-semibold text-forest tracking-tight">Our Products</h2>
        </div>
        <div className="relative md:hidden">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint">
            <IconSearch size={18} />
          </span>
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full h-11 pl-10 pr-4 rounded-full bg-cream-soft border border-sage-200 outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-9">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`h-9 px-4 rounded-full text-sm font-medium tracking-wide transition border ${cat === c ? "bg-forest text-cream border-forest" : "bg-cream-soft text-ink-soft border-sage-200 hover:border-sage-400"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <div className="inline-grid place-items-center w-14 h-14 rounded-full bg-sage-100 text-sage-500 mb-4">
            <IconSearch size={24} />
          </div>
          <p className="text-ink-soft">No products match “{query}”. Try another search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} onAdd={onAdd} qtyInCart={qtyOf(p.id)} />
          ))}
        </div>
      )}
    </section>
  );
};

/* ===== About ===== */
const About = () => {
  const offers = [
    "Sourced Grandmother Caapi Vine — traditional Peruvian plant medicine",
    "All products urinalysis safe and legal throughout the US",
    "Prepared with respect, intention, and reverence for the tradition",
    "Integration support for those working with plant medicines",
    "Clear safety guidance — no SSRIs or street-drug interactions",
    "Personal, heart-centered service every step of the way",
  ];
  return (
    <section id="about" className="relative overflow-hidden bg-forest text-cream scroll-mt-20">
      <Blob className="absolute -bottom-24 -right-20 w-[440px] h-[440px]" color="#274232" opacity={0.7} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 relative grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <span className="text-[12px] uppercase tracking-[0.2em] text-gold-light font-semibold">Why choose AyaVine</span>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-semibold tracking-tight">
            Sacred medicine,
            <br />
            handled with reverence
          </h2>
          <p className="mt-6 text-[1.02rem] leading-relaxed text-cream/75 max-w-xl">
            This isn’t a mass-market supplement shop. AyaVine is a carefully sourced offering of Grandmother Caapi Vine, prepared with respect and intention — so you can explore this path with confidence and clarity.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <span className="grid place-items-center w-12 h-12 rounded-full bg-cream/10 ring-1 ring-cream/20">
              <IconShield size={22} cls="text-gold-light" />
            </span>
            <div>
              <div className="font-serif text-xl">Rooted in tradition</div>
              <div className="text-sm text-cream/60">Respect · safety · personal sovereignty</div>
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-cream/5 ring-1 ring-cream/10 p-7 sm:p-9 backdrop-blur-sm">
          <h3 className="font-serif text-2xl mb-5">What AyaVine offers</h3>
          <ul className="space-y-3.5">
            {offers.map((o, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="grid place-items-center w-6 h-6 rounded-full bg-sage-500/30 text-sage-200 shrink-0 mt-0.5">
                  <IconCheck size={14} />
                </span>
                <span className="text-[15px] leading-relaxed text-cream/85">{o}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

/* ===== Testimonials ===== */
const Testimonials = () => (
  <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
    <div className="text-center mb-12">
      <span className="text-[12px] uppercase tracking-[0.2em] text-terracotta font-semibold">In their words</span>
      <h2 className="mt-2 font-serif text-4xl sm:text-5xl font-semibold text-forest tracking-tight">Held with care</h2>
    </div>
    <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
      {TESTIMONIALS.map((t, i) => (
        <figure key={i} className="flex flex-col bg-cream-soft rounded-3xl border border-sage-200/70 shadow-card p-7">
          <div className="flex items-center gap-1 text-gold mb-4">
            {[0, 1, 2, 3, 4].map((s) => (
              <IconStar key={s} size={16} />
            ))}
          </div>
          <blockquote className="font-serif text-xl leading-relaxed text-forest flex-1">“{t.quote}”</blockquote>
          <figcaption className="mt-5 pt-5 border-t border-sage-200 text-sm">
            <span className="font-semibold text-ink">{t.name}</span>
            <span className="text-ink-faint"> · {t.loc}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  </section>
);

/* ===== Footer ===== */
const Footer = ({ onShop }: { onShop: () => void }) => (
  <footer id="contact" className="bg-cream-deep border-t border-sage-200 scroll-mt-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-16">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <div>
          <span className="text-[12px] uppercase tracking-[0.2em] text-terracotta font-semibold">Reach out to Metaphysical Medic</span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-forest tracking-tight">Questions, support, or guidance?</h2>
          <p className="mt-4 text-ink-soft leading-relaxed max-w-lg">
            Whether you’re curious about AyaVine or already working with traditional plant medicines, reach out with questions, support needs, or product guidance.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="mailto:Christina@AyaCaapi.com" className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-forest text-cream font-medium hover:bg-forest-600 transition">
              <IconLeaf size={18} /> Christina@AyaCaapi.com
            </a>
            <button onClick={onShop} className="inline-flex items-center gap-2 h-12 px-6 rounded-full border border-sage-300 text-forest font-medium hover:bg-sage-100 transition">
              Browse products
            </button>
          </div>
          <p className="mt-4 text-sm text-ink-faint">Killeen, TX · Open online, made for you</p>
        </div>

        <div className="rounded-2xl bg-terracotta/10 border border-terracotta/20 p-6">
          <div className="flex items-center gap-2 text-terracotta-600 font-semibold mb-2">
            <IconShield size={18} /> Safety note
          </div>
          <p className="text-[14.5px] leading-relaxed text-ink-soft">
            AyaVine products are not to be used in conjunction with SSRIs or street drugs. Do not consume Caapi when drinking or otherwise intoxicated.
          </p>
        </div>
      </div>

      <div className="mt-12 pt-7 border-t border-sage-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-8 h-8 rounded-full bg-forest text-cream">
            <IconLeaf size={16} />
          </span>
          <span className="font-serif text-lg font-semibold text-forest">AyaVine</span>
        </div>
        <p className="text-[13px] text-ink-faint">© 2026 Metaphysical Medic. All rights reserved.</p>
        <div className="flex items-center gap-2">
          {["VISA", "MC", "AMEX", "DISC", "JCB"].map((c) => (
            <span key={c} className="grid place-items-center h-6 px-2.5 rounded bg-cream-soft border border-sage-200 text-[10px] font-semibold text-ink-faint">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

/* ===== Overlay shell ===== */
const Backdrop = ({ onClose, children, align = "end" }: { onClose: () => void; children: React.ReactNode; align?: "end" | "center" }) => (
  <div className="fixed inset-0 z-50 flex" style={{ justifyContent: align === "end" ? "flex-end" : "center", alignItems: align === "center" ? "center" : "stretch" }}>
    <div className="absolute inset-0 bg-forest-900/45 backdrop-blur-[2px]" style={{ animation: "fadeUp 0.3s ease both" }} onClick={onClose} />
    {children}
  </div>
);

/* ===== Quantity stepper ===== */
const Stepper = ({ qty, onInc, onDec }: { qty: number; onInc: () => void; onDec: () => void }) => (
  <div className="inline-flex items-center rounded-full border border-sage-200 bg-cream-soft">
    <button onClick={onDec} className="grid place-items-center w-8 h-8 text-forest hover:bg-sage-100 rounded-l-full transition" aria-label="Decrease">
      <IconMinus size={15} />
    </button>
    <span className="w-8 text-center text-sm font-semibold text-ink tabular-nums">{qty}</span>
    <button onClick={onInc} className="grid place-items-center w-8 h-8 text-forest hover:bg-sage-100 rounded-r-full transition" aria-label="Increase">
      <IconPlus size={15} />
    </button>
  </div>
);

/* ===== Slide-out cart ===== */
const Cart = ({
  items,
  onClose,
  onInc,
  onDec,
  onRemove,
  onCheckout,
  subtotal,
}: {
  items: CartItem[];
  onClose: () => void;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  subtotal: number;
}) => (
  <Backdrop onClose={onClose}>
    <aside className="relative w-full sm:max-w-md bg-cream shadow-panel flex flex-col animate-slideIn h-full">
      <div className="flex items-center justify-between px-5 sm:px-6 h-16 border-b border-sage-200 shrink-0">
        <h2 className="font-serif text-2xl font-semibold text-forest flex items-center gap-2">
          <IconBag size={20} /> Your Cart
        </h2>
        <button onClick={onClose} className="grid place-items-center w-9 h-9 rounded-full hover:bg-sage-100 transition" aria-label="Close cart">
          <IconClose size={20} />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex-1 grid place-items-center px-8 text-center">
          <div>
            <div className="inline-grid place-items-center w-16 h-16 rounded-full bg-sage-100 text-sage-500 mb-4">
              <IconLeaf size={28} />
            </div>
            <p className="font-serif text-2xl text-forest mb-1">Your cart is quiet</p>
            <p className="text-ink-soft mb-6">Add something grounding from the collection.</p>
            <button onClick={onClose} className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-forest text-cream font-medium hover:bg-forest-600 transition">
              Browse products <IconArrow size={16} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto no-scrollbar px-5 sm:px-6 py-5 space-y-4">
            {items.map((it) => (
              <div key={it.id} className="flex gap-3.5">
                <ProductImage hue={it.hue} src={it.img} label={it.name} round="rounded-xl" className="w-20 h-20 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-lg font-semibold text-forest leading-tight">{it.name}</h3>
                    <button onClick={() => onRemove(it.id)} className="text-ink-faint hover:text-terracotta-600 transition shrink-0" aria-label="Remove">
                      <IconTrash size={17} />
                    </button>
                  </div>
                  <p className="text-[12px] text-ink-faint">{it.cat}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <Stepper qty={it.qty} onInc={() => onInc(it.id)} onDec={() => onDec(it.id)} />
                    <span className="font-semibold text-ink tabular-nums">{fmt(it.price * it.qty)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-sage-200 px-5 sm:px-6 py-5 space-y-4 shrink-0 bg-cream-soft">
            <div className="flex items-center justify-between text-sm text-ink-soft">
              <span>Subtotal</span>
              <span className="font-serif text-2xl font-semibold text-ink tabular-nums">{fmt(subtotal)}</span>
            </div>
            <p className="flex items-center gap-1.5 text-[12px] text-ink-faint">
              <IconTruck size={15} /> Shipping &amp; taxes calculated at checkout
            </p>
            <button onClick={onCheckout} className="w-full h-13 py-3.5 rounded-full bg-terracotta text-cream font-medium tracking-wide shadow-lift hover:bg-terracotta-600 transition inline-flex items-center justify-center gap-2">
              Proceed to checkout <IconArrow size={18} />
            </button>
          </div>
        </>
      )}
    </aside>
  </Backdrop>
);

/* ===== Checkout ===== */
const STEPS = ["Summary", "Shipping", "Payment"];

const Checkout = ({ items, subtotal, onClose, onPlaced }: { items: CartItem[]; subtotal: number; onClose: () => void; onPlaced: () => void }) => {
  const [step, setStep] = useState(0);
  const [ship, setShip] = useState({ name: "", email: "", address: "", city: "", state: "", zip: "" });
  const [pay, setPay] = useState({ card: "", exp: "", cvc: "", name: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const shipping = subtotal > 75 ? 0 : 6.5;
  const tax = +(subtotal * 0.0825).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  const validateShip = () => {
    const e: Record<string, string> = {};
    if (!ship.name.trim()) e.name = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ship.email)) e.email = "Enter a valid email";
    if (!ship.address.trim()) e.address = "Required";
    if (!ship.city.trim()) e.city = "Required";
    if (!ship.zip.trim()) e.zip = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const validatePay = () => {
    const e: Record<string, string> = {};
    if (pay.card.replace(/\s/g, "").length < 15) e.card = "Enter a valid card number";
    if (!/^\d{2}\s*\/\s*\d{2}$/.test(pay.exp)) e.exp = "MM / YY";
    if (pay.cvc.length < 3) e.cvc = "3–4 digits";
    if (!pay.name.trim()) e.name = "Name on card required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 0) setStep(1);
    else if (step === 1) {
      if (validateShip()) {
        setErrors({});
        setStep(2);
      }
    } else if (step === 2) {
      if (validatePay()) onPlaced();
    }
  };

  const fmtCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExp = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + " / " + d.slice(2) : d;
  };

  return (
    <Backdrop onClose={onClose} align="center">
      <div className="relative w-full sm:max-w-2xl sm:rounded-3xl bg-cream shadow-lift flex flex-col max-h-full sm:max-h-[92vh] animate-scaleIn overflow-hidden">
        <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-sage-200 shrink-0">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-2xl font-semibold text-forest">Checkout</h2>
            <button onClick={onClose} className="grid place-items-center w-9 h-9 rounded-full hover:bg-sage-100 transition" aria-label="Close">
              <IconClose size={20} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <Fragment key={s}>
                <div className="flex items-center gap-2">
                  <span className={`grid place-items-center w-7 h-7 rounded-full text-[12px] font-bold transition ${i < step ? "bg-sage-500 text-cream" : i === step ? "bg-forest text-cream" : "bg-sage-100 text-ink-faint"}`}>
                    {i < step ? <IconCheck size={14} /> : i + 1}
                  </span>
                  <span className={`text-sm font-medium ${i <= step ? "text-forest" : "text-ink-faint"}`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && <span className={`flex-1 h-px ${i < step ? "bg-sage-400" : "bg-sage-200"}`} />}
              </Fragment>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-6 sm:px-8 py-6">
          {step === 0 && (
            <div className="space-y-3">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-3.5">
                  <ProductImage hue={it.hue} src={it.img} label={it.name} round="rounded-xl" className="w-14 h-14 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-ink leading-tight">{it.name}</div>
                    <div className="text-[12px] text-ink-faint">
                      Qty {it.qty} · {fmt(it.price)} each
                    </div>
                  </div>
                  <span className="font-semibold text-ink tabular-nums">{fmt(it.price * it.qty)}</span>
                </div>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Full name" error={errors.name}>
                  <input className={inputCls} value={ship.name} onChange={(e) => setShip({ ...ship, name: e.target.value })} placeholder="Jane Rivera" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Email" error={errors.email}>
                  <input className={inputCls} value={ship.email} onChange={(e) => setShip({ ...ship, email: e.target.value })} placeholder="you@email.com" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Street address" error={errors.address}>
                  <input className={inputCls} value={ship.address} onChange={(e) => setShip({ ...ship, address: e.target.value })} placeholder="123 Cedar Way" />
                </Field>
              </div>
              <Field label="City" error={errors.city}>
                <input className={inputCls} value={ship.city} onChange={(e) => setShip({ ...ship, city: e.target.value })} placeholder="Killeen" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="State">
                  <input className={inputCls} value={ship.state} onChange={(e) => setShip({ ...ship, state: e.target.value })} placeholder="TX" />
                </Field>
                <Field label="ZIP" error={errors.zip}>
                  <input className={inputCls} value={ship.zip} onChange={(e) => setShip({ ...ship, zip: e.target.value })} placeholder="76541" />
                </Field>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-sage-50 border border-sage-200 p-4 flex items-center gap-2.5 text-sm text-ink-soft">
                <IconLock size={18} cls="text-sage-500" /> This is a demo — no real card is charged or stored.
              </div>
              <Field label="Card number" error={errors.card}>
                <input inputMode="numeric" className={inputCls} value={pay.card} onChange={(e) => setPay({ ...pay, card: fmtCard(e.target.value) })} placeholder="4242 4242 4242 4242" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Expiry" error={errors.exp}>
                  <input inputMode="numeric" className={inputCls} value={pay.exp} onChange={(e) => setPay({ ...pay, exp: fmtExp(e.target.value) })} placeholder="08 / 28" />
                </Field>
                <Field label="CVC" error={errors.cvc}>
                  <input inputMode="numeric" className={inputCls} value={pay.cvc} onChange={(e) => setPay({ ...pay, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="123" />
                </Field>
              </div>
              <Field label="Name on card" error={errors.name}>
                <input className={inputCls} value={pay.name} onChange={(e) => setPay({ ...pay, name: e.target.value })} placeholder="Jane Rivera" />
              </Field>
            </div>
          )}
        </div>

        <div className="border-t border-sage-200 px-6 sm:px-8 py-5 shrink-0 bg-cream-soft">
          <div className="space-y-1.5 mb-4 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>Subtotal</span>
              <span className="tabular-nums">{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Shipping</span>
              <span className="tabular-nums">{shipping === 0 ? "Free" : fmt(shipping)}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Tax (est.)</span>
              <span className="tabular-nums">{fmt(tax)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 mt-1 border-t border-sage-200">
              <span className="font-medium text-ink">Total</span>
              <span className="font-serif text-2xl font-semibold text-ink tabular-nums">{fmt(total)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={() => {
                  setErrors({});
                  setStep(step - 1);
                }}
                className="h-12 px-5 rounded-full border border-sage-300 text-forest font-medium hover:bg-sage-100 transition"
              >
                Back
              </button>
            )}
            <button onClick={next} className="flex-1 h-12 rounded-full bg-terracotta text-cream font-medium tracking-wide shadow-lift hover:bg-terracotta-600 transition inline-flex items-center justify-center gap-2">
              {step === 2 ? (
                <>
                  <IconLock size={17} /> Place order · {fmt(total)}
                </>
              ) : (
                <>
                  Continue <IconArrow size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Backdrop>
  );
};

/* ===== Order confirmation ===== */
const OrderConfirmed = ({ onClose }: { onClose: () => void }) => (
  <Backdrop onClose={onClose} align="center">
    <div className="relative w-full sm:max-w-md sm:rounded-3xl bg-cream shadow-lift p-8 sm:p-10 text-center animate-scaleIn">
      <div className="inline-grid place-items-center w-16 h-16 rounded-full bg-sage-500 text-cream mb-5">
        <IconCheck size={32} />
      </div>
      <h2 className="font-serif text-3xl font-semibold text-forest">Your order is placed</h2>
      <p className="mt-3 text-ink-soft leading-relaxed">Thank you for working with Metaphysical Medic. A confirmation is on its way — we’ll prepare your order with care and reverence.</p>
      <button onClick={onClose} className="mt-7 inline-flex items-center gap-2 h-12 px-7 rounded-full bg-forest text-cream font-medium hover:bg-forest-600 transition">
        Continue browsing <IconArrow size={18} />
      </button>
    </div>
  </Backdrop>
);

/* ===== Account modal ===== */
const Account = ({ user, onClose, onAuth, onSignOut }: { user: User | null; onClose: () => void; onAuth: (u: User) => void; onSignOut: () => void }) => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [form, setForm] = useState({ name: "", email: "", pass: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [serverErr, setServerErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (loading) return;
    const e: Record<string, string> = {};
    if (mode === "signup" && !form.name.trim()) e.name = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.pass.length < 6) e.pass = "At least 6 characters";
    setErr(e);
    setServerErr("");
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    try {
      const body = mode === "signup" ? { name: form.name.trim(), email: form.email.trim(), password: form.pass } : { email: form.email.trim(), password: form.pass };
      const res = await fetch(`/api/auth/${mode === "signup" ? "signup" : "signin"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerErr(data.error || "Something went wrong. Please try again.");
        return;
      }
      onAuth(data.user as User);
    } catch {
      setServerErr("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Backdrop onClose={onClose} align="center">
      <div className="relative w-full sm:max-w-md sm:rounded-3xl bg-cream shadow-lift overflow-hidden animate-scaleIn">
        <div className="relative px-7 pt-8 pb-6 bg-forest text-cream overflow-hidden">
          <Blob className="absolute -top-16 -right-12 w-56 h-56" color="#274232" opacity={0.7} />
          <div className="relative">
            <span className="grid place-items-center w-11 h-11 rounded-full bg-cream/10 ring-1 ring-cream/20 mb-3">
              <IconLeaf size={22} cls="text-gold-light" />
            </span>
            {user ? (
              <>
                <h2 className="font-serif text-2xl font-semibold">Welcome back, {user.name.split(" ")[0]}</h2>
                <p className="text-cream/70 text-sm mt-1">{user.email}</p>
              </>
            ) : (
              <>
                <h2 className="font-serif text-2xl font-semibold">{mode === "signin" ? "Welcome back" : "Create your account"}</h2>
                <p className="text-cream/70 text-sm mt-1">Heart-centered service, every step of the way.</p>
              </>
            )}
          </div>
          <button onClick={onClose} className="absolute top-5 right-5 grid place-items-center w-9 h-9 rounded-full bg-cream/10 hover:bg-cream/20 transition" aria-label="Close">
            <IconClose size={20} />
          </button>
        </div>

        {user ? (
          <div className="p-7 space-y-3">
            <div className="rounded-2xl bg-cream-soft border border-sage-200 p-4 flex items-center gap-3">
              <span className="grid place-items-center w-10 h-10 rounded-full bg-sage-100 text-sage-500">
                <IconUser size={20} />
              </span>
              <div>
                <div className="font-medium text-ink">{user.name}</div>
                <div className="text-[13px] text-ink-faint">{user.email}</div>
              </div>
            </div>
            <button className="w-full h-11 rounded-xl bg-cream-soft border border-sage-200 text-ink-soft hover:border-sage-400 transition text-sm font-medium text-left px-4 flex items-center justify-between">
              Order history <IconArrow size={16} />
            </button>
            <button className="w-full h-11 rounded-xl bg-cream-soft border border-sage-200 text-ink-soft hover:border-sage-400 transition text-sm font-medium text-left px-4 flex items-center justify-between">
              Integration support <IconArrow size={16} />
            </button>
            <button onClick={onSignOut} className="w-full h-11 rounded-xl border border-terracotta/30 text-terracotta-600 hover:bg-terracotta/5 transition text-sm font-medium mt-1">
              Sign out
            </button>
          </div>
        ) : (
          <div className="p-7">
            <div className="flex p-1 rounded-full bg-sage-100 mb-6">
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setErr({});
                  }}
                  className={`flex-1 h-9 rounded-full text-sm font-medium transition ${mode === m ? "bg-cream shadow-sm text-forest" : "text-ink-faint"}`}
                >
                  {m === "signin" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              {mode === "signup" && (
                <Field label="Full name" error={err.name}>
                  <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Rivera" autoComplete="name" />
                </Field>
              )}
              <Field label="Email" error={err.email}>
                <input className={inputCls} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" autoComplete="email" />
              </Field>
              <Field label="Password" error={err.pass}>
                <input type="password" className={inputCls} value={form.pass} onChange={(e) => setForm({ ...form, pass: e.target.value })} placeholder="••••••••" autoComplete={mode === "signin" ? "current-password" : "new-password"} />
              </Field>
              {serverErr && (
                <p className="rounded-xl bg-terracotta/10 border border-terracotta/20 px-3.5 py-2.5 text-[13px] text-terracotta-600" role="alert">
                  {serverErr}
                </p>
              )}
              <button type="submit" disabled={loading} className="w-full h-12 rounded-full bg-terracotta text-cream font-medium tracking-wide shadow-lift hover:bg-terracotta-600 transition disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
              </button>
            </form>
          </div>
        )}
      </div>
    </Backdrop>
  );
};

/* ===== Root ===== */
type View = "cart" | "checkout" | "confirmed" | "account" | null;

export default function MarketplacePage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>(null);

  useEffect(() => {
    document.body.style.overflow = view ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [view]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setView(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // restore session
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUser(d.user as User);
      })
      .catch(() => {});
  }, []);

  const signOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } catch {}
    setUser(null);
    setView(null);
  };

  const addToCart = (p: Product) =>
    setCart((prev) => {
      const found = prev.find((i) => i.id === p.id);
      if (found) return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...p, qty: 1 }];
    });
  const inc = (id: string) => setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  const dec = (id: string) => setCart((prev) => prev.flatMap((i) => (i.id === id ? (i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : []) : [i])));
  const remove = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));

  const count = cart.reduce((n, i) => n + i.qty, 0);
  const subtotal = +cart.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2);

  const scrollToCatalog = () => {
    setView(null);
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mk-root font-sans text-ink antialiased min-h-screen bg-cream">
      <Vine />
      <Header cartCount={count} onCart={() => setView("cart")} onAccount={() => setView("account")} onSearch={setQuery} query={query} user={user} />

      <main>
        <Hero onShop={scrollToCatalog} />
        <Catalog products={PRODUCTS} onAdd={addToCart} cart={cart} query={query} onQuery={setQuery} />
        <About />
        <Testimonials />
      </main>

      <Footer onShop={scrollToCatalog} />

      {view === "cart" && (
        <Cart items={cart} subtotal={subtotal} onClose={() => setView(null)} onInc={inc} onDec={dec} onRemove={remove} onCheckout={() => cart.length && setView("checkout")} />
      )}
      {view === "checkout" && cart.length > 0 && <Checkout items={cart} subtotal={subtotal} onClose={() => setView(null)} onPlaced={() => setView("confirmed")} />}
      {view === "confirmed" && (
        <OrderConfirmed
          onClose={() => {
            setCart([]);
            setView(null);
          }}
        />
      )}
      {view === "account" && <Account user={user} onClose={() => setView(null)} onAuth={(u) => { setUser(u); setView(null); }} onSignOut={signOut} />}
    </div>
  );
}
