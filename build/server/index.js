import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, Link, redirect } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useRef, useEffect, useState } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders
    });
  }
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const appStyles = "/assets/app-D0Gv2PL1.css";
const links = () => [{
  rel: "icon",
  type: "image/svg+xml",
  href: "/favicon.svg"
}, {
  rel: "icon",
  type: "image/png",
  href: "/images/profile.png",
  sizes: "64x64"
}, {
  rel: "apple-touch-icon",
  href: "/images/profile.png"
}, {
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap"
}, {
  rel: "stylesheet",
  href: appStyles
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "Page not found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    style: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif",
      background: "#f4f3ef",
      color: "#0a0a0a",
      padding: 40
    },
    children: [/* @__PURE__ */ jsx("h1", {
      style: {
        fontFamily: '"Instrument Serif", serif',
        fontSize: 122,
        lineHeight: 1,
        margin: 0
      },
      children: message
    }), /* @__PURE__ */ jsx("p", {
      style: {
        marginTop: 16,
        fontSize: 18,
        color: "#5a5a58"
      },
      children: details
    }), /* @__PURE__ */ jsx("a", {
      href: "/",
      style: {
        marginTop: 32,
        fontSize: 14,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        borderBottom: "1px solid currentColor"
      },
      children: "← Back home"
    })]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const ringRef2 = useRef({ x: -100, y: -100 });
  const rafRef = useRef(0);
  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      const target = e.target;
      if (target.closest("a, button, [data-hover]")) {
        ring.classList.add("is-hovering");
      } else {
        ring.classList.remove("is-hovering");
      }
    };
    const tick = () => {
      const { x, y } = mouseRef.current;
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      ringRef2.current.x += (x - ringRef2.current.x) * 0.1;
      ringRef2.current.y += (y - ringRef2.current.y) * 0.1;
      ring.style.left = `${ringRef2.current.x}px`;
      ring.style.top = `${ringRef2.current.y}px`;
      rafRef.current = requestAnimationFrame(tick);
    };
    document.addEventListener("mousemove", onMove);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { ref: dotRef, className: "cursor-dot", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx("div", { ref: ringRef, className: "cursor-ring", "aria-hidden": "true" })
  ] });
}
function SmoothScroll() {
  useEffect(() => {
    let cleanup;
    import("lenis").then(({ default: Lenis }) => {
      const lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2
      });
      let rafId;
      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
      cleanup = () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
      };
    });
    return () => cleanup == null ? void 0 : cleanup();
  }, []);
  return null;
}
function ScrollProgress() {
  const barRef = useRef(null);
  const thumbRef = useRef(null);
  useEffect(() => {
    const bar = barRef.current;
    const thumb = thumbRef.current;
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? scrollTop / docHeight : 0;
      if (bar) bar.style.width = `${pct * 100}%`;
      if (thumb) {
        const trackH = 80;
        const thumbH = Math.max(12, trackH * (window.innerHeight / document.documentElement.scrollHeight));
        const maxTop = trackH - thumbH;
        thumb.style.height = `${thumbH}px`;
        thumb.style.top = `${pct * maxTop}px`;
      }
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { ref: barRef, className: "scroll-progress", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx("div", { className: "custom-scrollbar", "aria-hidden": "true", children: /* @__PURE__ */ jsx("div", { ref: thumbRef, className: "custom-scrollbar-thumb" }) })
  ] });
}
const portfolio = {
  role: "Senior Frontend Engineer",
  location: "Remote · Worldwide",
  email: "ajaoabdulsamad2000@gmail.com",
  socials: {
    github: "https://github.com/ajaoseyi",
    linkedin: "https://linkedin.com/in/abdulsamad-ajao-9279a11b8",
    twitter: "https://x.com/Abdulsamad_O",
    devto: "https://dev.to/ajaoseyi"
  },
  resume: "/Abdulsamad_Ajao_Resume.pdf",
  available: "Available · Full-time & Freelance",
  metrics: [
    { v: "40%", k: "avg perf uplift" },
    { v: "99.8%", k: "payment success" },
    { v: "90+", k: "Lighthouse score" },
    { v: "80%", k: "test coverage" }
  ],
  stack: [
    "React",
    "TypeScript",
    "Next.js",
    "React Native",
    "TailwindCSS",
    "Socket.IO",
    "Ethers.js",
    "GraphQL",
    "Node.js",
    "Jest",
    "WordPress"
  ],
  projects: [
    {
      id: "soundturf",
      n: "01",
      cat: "Music / Entertainment",
      name: "Soundturf",
      year: "2023",
      role: "Frontend Engineer",
      stack: ["React", "TypeScript", "Socket.IO", "REST API", "Geolocation API"],
      desc: "Interactive party experience where the crowd is in control of the music. Real-time song voting, geolocation-based venue detection, and smart search algorithms keep the dance floor moving.",
      tagline: "The crowd controls the playlist — live, every song.",
      problem: "At parties and events, the DJ or a single host always controlled the music — leaving the crowd no voice. Finding a venue or discovering what was playing nearby was impossible without being physically inside.",
      approach: "Built a real-time voting and queue system on Socket.IO so every attendee can influence what plays next. Geolocation ties users to their venue automatically, and search algorithms surface songs by popularity, tempo, and crowd preference without manual curation.",
      outcomes: [
        { v: "Real-time", k: "crowd song voting" },
        { v: "<100ms", k: "socket event latency" },
        { v: "Live", k: "geolocation venue detection" },
        { v: "Zero", k: "manual DJ interventions needed" }
      ],
      highlights: [
        "Implemented real-time song voting and queue management using Socket.IO with optimistic UI updates.",
        "Built geolocation features for automatic venue detection and proximity-based event discovery.",
        "Designed search algorithms that surface songs by crowd votes, tempo, and listening patterns."
      ],
      url: "sound-turf.com",
      images: {
        hero: "/images/soundturf-hero.jpg",
        logo: "/images/soundturf-logo.svg",
        detail: [
          "/images/soundturf-detail-1.jpg",
          "/images/soundturf-detail-2.jpg"
        ]
      }
    },
    {
      id: "refine",
      n: "05",
      cat: "AI / Productivity Tools",
      name: "Refine",
      year: "2026",
      role: "Full-Stack Engineer · Solo Build",
      stack: ["React", "TypeScript", "Vite", "TipTap", "Node.js", "Express", "LangChain", "Socket.IO", "Groq (Llama 3)", "Google Docs API"],
      desc: "An AI-powered writing assistant that merges grammar and style correction with self-hosted SEO auditing and readability scoring, so writers can polish prose and optimize it for search without juggling separate tools.",
      tagline: "Write, polish, and rank — without leaving the editor.",
      problem: "Writers had to bounce between a grammar checker, a separate SEO auditing tool, and Google Docs to ship a piece that was both well-written and search-ready — every round trip risked edits falling out of sync between the source doc and whatever tool was open.",
      approach: "I built the editor in TipTap and wired it to a Node/Express backend where LangChain orchestrates a Groq-hosted Llama 3 model for grammar, sentence-structure, and keyword/heading analysis, alongside a self-hosted Flesch/Fog readability scorer. A Socket.IO layer keeps the editor and the Google Docs API in sync bidirectionally, so edits made in either surface update the other in real time.",
      outcomes: [
        { v: "Single pass", k: "grammar + SEO + readability" },
        { v: "Real-time", k: "bidirectional Google Docs sync" },
        { v: "Llama 3", k: "Groq-accelerated inference" },
        { v: "Zero", k: "tool-switching to ship a draft" }
      ],
      highlights: [
        "Built a LangChain-orchestrated backend that runs grammar, sentence-structure, and keyword-density analysis through a Groq-hosted Llama 3 model.",
        "Implemented a self-hosted SEO and readability auditor — keyword density, heading hierarchy, and Flesch/Fog scoring — without relying on third-party SEO APIs.",
        "Wired a Socket.IO-driven bidirectional sync with the Google Docs API so edits in the TipTap editor or the source doc never fall out of sync."
      ],
      url: "my-writing-assistant-production.up.railway.app",
      images: {
        hero: "/images/refine-mockup-one.png",
        detail: [
          "/images/refine-mockup-two.png",
          "/images/refine-mockup-three.png",
          "/images/refine-mockup-four.png",
          "/images/refine-mockup-five.png"
        ]
      }
    },
    {
      id: "lingo",
      n: "02",
      cat: "Design Tools",
      name: "Lingo",
      year: "2023",
      role: "Maker · Open source",
      stack: ["Preact", "TailwindCSS", "Node.js", "Docker", "VPS"],
      desc: "Lingo is an open-source design tool that helps designers and developers efficiently create and manage multiple language versions of their products. Lingo integrates directly into the Figma workflow, allowing designers to translate text elements without leaving their design environment.",
      tagline: "Translate your designs without leaving Figma.",
      problem: "Localising a Figma file for a new market meant manually duplicating frames and replacing every text layer — a process that broke as soon as copy changed, and kept design and translation teams permanently out of sync.",
      approach: "Built a Figma plugin in Preact that surfaces a translation panel inline, hooks into the Figma Plugin API to read and write text nodes, and sends strings through a Node.js translation service on VPS. Docker keeps the translation model portable across environments.",
      outcomes: [
        { v: "8.4K", k: "plugin installs" },
        { v: "320", k: "GitHub stars" },
        { v: "Zero", k: "context switching for designers" },
        { v: "23", k: "open-source contributors" }
      ],
      highlights: [
        "Built the Figma plugin in Preact with a translation panel that reads and writes text nodes without leaving Figma.",
        "Shipped a Node.js translation service containerised with Docker and deployed on VPS for language model inference.",
        "Maintained an open-source repo with 23 contributors and 320 GitHub stars."
      ],
      url: "figma.com/community/plugin/ajao",
      images: {
        hero: "/images/lingo-hero.png",
        logo: "/images/lingo-logo.png"
      }
    },
    {
      id: "buybox",
      n: "03",
      cat: "Tech Marketplace",
      name: "Buybox",
      year: "2024",
      role: "Mobile Engineer · Vendor Dashboard Lead",
      stack: ["Next.js", "React Native", "React", "REST APIs", "Payment Gateway", "TypeScript", "TailwindCSS", "SSR"],
      desc: "A better way to buy, request, repair & upgrade your tech. BuyBox brings trusted vendors for new and renewed electronics into one app — discover devices, send custom requests, book a repair, or trade-in, with same-day delivery on eligible products.",
      tagline: "One app for every stage of your device lifecycle.",
      problem: "Consumers had no reliable way to discover certified vendors, request custom device orders, book repairs, or manage trade-ins without juggling three separate platforms. Vendor onboarding was manual and slow.",
      approach: "I led development of the cross-platform mobile app in React Native, giving users a unified flow for browsing, requesting, and booking — then built the vendor dashboard in React so vendors could manage listings, repair slots, and same-day delivery queues from a single interface.",
      outcomes: [
        { v: "500+", k: "verified vendors onboarded" },
        { v: "< 3 min", k: "average request-to-quote" },
        { v: "4.8★", k: "app store rating" },
        { v: "60%", k: "repeat order rate" }
      ],
      highlights: [
        "Built the React Native mobile app from scratch — browsing, custom requests, repair booking, and trade-in flows.",
        "Designed and shipped a vendor dashboard for real-time order, inventory, and repair slot management.",
        "Integrated same-day delivery scheduling with live order-tracking UI."
      ],
      url: "buybox.ng",
      images: {
        hero: "/images/buybox-mockup.jpeg",
        logo: "/images/buybox-logo.png"
      }
    },
    {
      id: "void",
      n: "04",
      cat: "Media Agency",
      name: "The Void",
      year: "2025",
      role: "Frontend Engineer · SEO Lead",
      stack: ["Next.js", "CSS", "HLS / DASH", "Vercel", "WordPress"],
      desc: "SEO-optimised landing page for Void Media Group — a creative media agency. Built to establish their digital footprint with adaptive video, pixel-perfect styling, and a 90+ Lighthouse score across all categories.",
      tagline: "A digital footprint built to be found — and felt.",
      problem: "Void Media Group had no web presence to match their creative reputation. They needed a landing page that communicated their identity instantly, ranked well on search engines from day one, and loaded fast enough not to lose the visitors it earned.",
      approach: "I built the site in Next.js for SSR-first SEO, structured every page with semantic HTML and schema markup so search engines could parse intent immediately. The hero video uses HLS/DASH-based adaptive bitrate streaming — the browser negotiates the best quality for the available bandwidth, keeping the experience cinematic on any connection. All styling was hand-crafted in CSS with no UI framework overhead, which contributed directly to sub-second LCP and a clean 90+ across all four Lighthouse categories.",
      outcomes: [
        { v: "90+", k: "Lighthouse score all categories" },
        { v: "Sub-1s", k: "Largest Contentful Paint" },
        { v: "ABR", k: "adaptive video via HLS/DASH" },
        { v: "SSR", k: "search-indexed from first crawl" }
      ],
      highlights: [
        "Achieved 90+ Lighthouse scores across Performance, Accessibility, Best Practices, and SEO with zero third-party UI frameworks.",
        "Implemented adaptive bitrate video streaming (HLS/DASH) so the hero reel plays at the highest quality the viewer's bandwidth supports.",
        "Structured the entire site with semantic HTML and JSON-LD schema to ensure correct indexing and rich search results from the first crawl."
      ],
      url: "www.voidmediagrp.com",
      images: {
        logo: "/images/the-void-logo.png"
      }
    }
  ],
  experience: [
    {
      role: "Senior Frontend Engineer",
      co: "Foodcourt",
      loc: "Remote",
      dates: "Apr 2022 — Present",
      bullets: [
        "Improved app performance by 40% through modern React patterns and TypeScript.",
        "Architected real-time order management system using Socket.IO.",
        "Achieved 99.8% payment success rate with Paystack integration."
      ],
      productUrl: "https://www.getfoodcourt.com"
    },
    {
      role: "Frontend Engineer",
      co: "Zerotech Agency",
      loc: "Remote",
      dates: "Jan 2024 — Apr 2025",
      bullets: [
        "Built the frontend for VibesMeet, unifying digital content monetisation with physical and virtual event ticketing on one platform.",
        "Shipped gated content, paid community access, and 1-on-1 experience flows so creators could monetise their following beyond a single revenue stream.",
        "Implemented ticketing for meetups, workshops, and large conferences, turning an audience into real-world events."
      ],
      productUrl: "https://www.vibesmeet.com/"
    },
    {
      role: "Mobile & Dashboard Engineer",
      co: "Buybox",
      loc: "Remote",
      dates: "Apr 2021 — Apr 2025",
      bullets: [
        "Built the React Native mobile app covering device discovery, custom requests, repair booking, and trade-in.",
        "Developed the vendor dashboard in React — inventory, repair slot management, and same-day delivery queues.",
        "Collaborated with product and design to ship end-to-end device lifecycle features for 500+ verified vendors."
      ],
      productUrl: "https://buybox.ng"
    }
  ],
  writing: [
    { d: "Mar 2026", t: "On the cost of premature abstraction in React", read: "6 min" },
    { d: "Jan 2026", t: "Building a 99.8% reliable payment flow", read: "11 min" },
    { d: "Nov 2025", t: "Why TypeScript saved my Socket.IO architecture", read: "8 min" }
  ]
};
const NAV_ITEMS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" }
];
function scrollTo(id) {
  if (id === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}
function Nav() {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "header",
      {
        style: {
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(244, 243, 239, 0.88)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--faint-rule)"
        },
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              maxWidth: "var(--max-w)",
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "18px var(--pad-x)"
            },
            children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => scrollTo("top"),
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 15,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    color: "var(--ink)"
                  },
                  children: [
                    /* @__PURE__ */ jsx("div", { style: { width: 9, height: 9, background: "var(--ink)", flexShrink: 0 } }),
                    "A · Abdulsamad",
                    /* @__PURE__ */ jsx("sup", { style: { fontWeight: 400, color: "var(--dim)", marginLeft: 2, fontSize: 12 }, children: "®" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx("nav", { className: "nav-desktop-links", style: { color: "var(--dim)" }, children: NAV_ITEMS.map(({ id, label }) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => scrollTo(id),
                  style: {
                    fontSize: 14,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--dim)",
                    transition: "color 0.18s"
                  },
                  onMouseEnter: (e) => e.currentTarget.style.color = "var(--ink)",
                  onMouseLeave: (e) => e.currentTarget.style.color = "var(--dim)",
                  children: label
                },
                id
              )) }),
              /* @__PURE__ */ jsxs("div", { className: "nav-availability", children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "pulse-dot",
                    style: {
                      display: "inline-block",
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "var(--ink)"
                    }
                  }
                ),
                portfolio.available
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  className: "nav-hamburger",
                  onClick: () => setOpen(true),
                  "aria-label": "Open menu",
                  children: [
                    /* @__PURE__ */ jsx("span", {}),
                    /* @__PURE__ */ jsx("span", {})
                  ]
                }
              )
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: `mobile-nav-overlay ${open ? "is-open" : ""}`, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "mobile-nav-close kicker",
          onClick: () => setOpen(false),
          "aria-label": "Close menu",
          children: "Close ✕"
        }
      ),
      NAV_ITEMS.map(({ id, label }, i) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            scrollTo(id);
            setOpen(false);
          },
          style: {
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(42px, 10vw, 66px)",
            fontWeight: 400,
            letterSpacing: "-0.025em",
            color: "var(--ink)",
            textAlign: "left",
            lineHeight: 1.2,
            padding: "6px 0",
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(16px)",
            transition: `opacity 0.4s ${i * 0.06}s, transform 0.4s ${i * 0.06}s`
          },
          children: label
        },
        id
      )),
      /* @__PURE__ */ jsx(
        "div",
        {
          style: {
            marginTop: "auto",
            paddingTop: 32,
            fontSize: 14,
            color: "var(--dim)",
            letterSpacing: "0.06em",
            textTransform: "uppercase"
          },
          children: portfolio.available
        }
      )
    ] })
  ] });
}
function Reveal({ children, delay = 0, className = "", style, as: Tag = "div" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry2]) => {
        if (entry2.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const delayClass = delay > 0 ? `delay-${delay}` : "";
  const props = { ref, className: `reveal ${delayClass} ${className}`.trim(), style };
  return /* @__PURE__ */ jsx(Tag, { ...props, children });
}
function Arrow$3({ size = 12, color = "currentColor", dir = "ne" }) {
  const paths = {
    ne: "M3 13L13 3M13 3H6M13 3v7",
    e: "M3 8h10M9 4l4 4-4 4"
  };
  return /* @__PURE__ */ jsx(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 16 16",
      style: { display: "inline-block", verticalAlign: "-2px", flexShrink: 0 },
      children: /* @__PURE__ */ jsx("path", { d: paths[dir], stroke: color, strokeWidth: "1.4", fill: "none", strokeLinecap: "square" })
    }
  );
}
function Hero() {
  const featured = portfolio.projects[0];
  return /* @__PURE__ */ jsxs(
    "section",
    {
      style: {
        maxWidth: "var(--max-w)",
        margin: "0 auto",
        padding: "64px var(--pad-x) 80px"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "grid-12", children: [
          /* @__PURE__ */ jsx(
            Reveal,
            {
              style: {
                gridColumn: "span 4",
                borderTop: "1px solid var(--ink)",
                paddingTop: 14
              },
              children: /* @__PURE__ */ jsx("span", { className: "kicker", children: "№ 01 — Introducing" })
            }
          ),
          /* @__PURE__ */ jsxs(
            Reveal,
            {
              delay: 1,
              style: {
                gridColumn: "span 8",
                borderTop: "1px solid var(--ink)",
                paddingTop: 14,
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 8
              },
              children: [
                /* @__PURE__ */ jsx("span", { className: "kicker", children: portfolio.role }),
                /* @__PURE__ */ jsxs("span", { className: "kicker", children: [
                  portfolio.location,
                  " · UTC+1"
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          Reveal,
          {
            as: "h1",
            className: "serif-h",
            style: {
              gridColumn: "span 12",
              fontSize: "clamp(58px, 11vw, 170px)",
              lineHeight: 0.92,
              marginTop: 32
            },
            children: [
              "I build ",
              /* @__PURE__ */ jsx("em", { children: "quietly" }),
              /* @__PURE__ */ jsx("br", {}),
              "fast interfaces."
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid-12", style: { marginTop: 64 }, children: [
          /* @__PURE__ */ jsxs(
            Reveal,
            {
              style: {
                gridColumn: "1 / span 5",
                paddingTop: 18,
                borderTop: "1px solid var(--faint-rule)"
              },
              children: [
                /* @__PURE__ */ jsx("p", { style: { margin: 0, fontSize: 19, lineHeight: 1.55, color: "#222" }, children: "Five years shipping production across two continents" }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => {
                      var _a;
                      return (_a = document.getElementById("about")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
                    },
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 18,
                      fontSize: 15,
                      color: "var(--dim)",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase"
                    },
                    children: [
                      /* @__PURE__ */ jsx(Arrow$3, { size: 11 }),
                      " Read about my approach"
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Reveal,
            {
              delay: 2,
              style: {
                gridColumn: "6 / span 3",
                paddingTop: 18,
                borderTop: "1px solid var(--faint-rule)"
              },
              children: portfolio.metrics.map((m, i) => /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    padding: "9px 0",
                    borderBottom: i < portfolio.metrics.length - 1 ? "1px dashed var(--faint-rule)" : "none"
                  },
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "kicker", children: m.k }),
                    /* @__PURE__ */ jsx("span", { className: "serif-h", style: { fontSize: 26 }, children: m.v })
                  ]
                },
                i
              ))
            }
          ),
          /* @__PURE__ */ jsxs(
            Reveal,
            {
              delay: 3,
              style: {
                gridColumn: "9 / span 4",
                background: "var(--invert-bg)",
                color: "var(--invert-ink)",
                padding: "22px 24px",
                borderTop: "1px solid var(--ink)"
              },
              children: [
                /* @__PURE__ */ jsxs("div", { className: "kicker", style: { color: "var(--dark-dim)" }, children: [
                  "Featured · ",
                  featured.cat
                ] }),
                /* @__PURE__ */ jsx("div", { className: "serif-h", style: { fontSize: 40, marginTop: 10, lineHeight: 1 }, children: featured.name }),
                /* @__PURE__ */ jsxs("p", { style: { fontSize: 15, lineHeight: 1.5, color: "#c4c3be", marginTop: 12 }, children: [
                  "Real-time order management, payment integration, analytics dashboard.",
                  " ",
                  /* @__PURE__ */ jsx("strong", { style: { color: "#fff" }, children: "99.8% payment success" }),
                  "."
                ] }),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: `/work/${featured.id}`,
                    style: { display: "flex", alignItems: "center", gap: 6, marginTop: 18 },
                    children: /* @__PURE__ */ jsxs("span", { className: "kicker", style: { color: "#fff" }, children: [
                      "View case study ",
                      /* @__PURE__ */ jsx(Arrow$3, { size: 11, color: "#fff" })
                    ] })
                  }
                )
              ]
            }
          )
        ] })
      ]
    }
  );
}
function Arrow$2({ size = 12, color = "currentColor" }) {
  return /* @__PURE__ */ jsx("svg", { width: size, height: size, viewBox: "0 0 16 16", style: { display: "inline-block", verticalAlign: "-2px" }, children: /* @__PURE__ */ jsx("path", { d: "M3 13L13 3M13 3H6M13 3v7", stroke: color, strokeWidth: "1.4", fill: "none", strokeLinecap: "square" }) });
}
const LAYOUTS = [
  { col: "1 / span 7", big: true },
  { col: "8 / span 5", big: false },
  { col: "1 / span 5", big: false },
  { col: "6 / span 7", big: true },
  { col: "1 / span 12", big: true }
];
function ProjectCard({ p, big, col }) {
  const [hovered, setHovered] = useState(false);
  return /* @__PURE__ */ jsx(
    Reveal,
    {
      as: "article",
      className: "project-card",
      style: {
        gridColumn: col,
        borderTop: "1px solid var(--ink)",
        paddingTop: 18
      },
      children: /* @__PURE__ */ jsxs(Link, { to: `/work/${p.id}`, style: { display: "block" }, children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 18
            },
            className: "kicker",
            children: [
              /* @__PURE__ */ jsxs("span", { children: [
                p.n,
                " · ",
                p.cat
              ] }),
              /* @__PURE__ */ jsx("span", { children: p.year })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "project-image",
            style: {
              height: big ? 360 : 280,
              background: "var(--invert-bg)",
              color: "var(--invert-ink)",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "flex-end",
              padding: 28
            },
            onMouseEnter: () => setHovered(true),
            onMouseLeave: () => setHovered(false),
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "serif-h work-watermark",
                  style: {
                    position: "absolute",
                    top: -28,
                    right: -16,
                    fontSize: big ? 362 : 282,
                    lineHeight: 0.8,
                    color: "#1a1a1a",
                    userSelect: "none",
                    pointerEvents: "none"
                  },
                  children: p.n
                }
              ),
              /* @__PURE__ */ jsxs("div", { style: { position: "relative", zIndex: 2 }, children: [
                /* @__PURE__ */ jsx("div", { className: "serif-h work-card-title", style: { fontSize: big ? 66 : 50, lineHeight: 1 }, children: p.name }),
                /* @__PURE__ */ jsx("div", { className: "kicker", style: { color: "var(--dark-dim)", marginTop: 12 }, children: p.tagline })
              ] }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    top: 24,
                    right: 24,
                    transition: "transform 0.25s",
                    transform: hovered ? "translate(3px, -3px)" : "none"
                  },
                  children: /* @__PURE__ */ jsx(Arrow$2, { size: 22, color: "#fff" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "work-card-meta", style: { marginTop: 16 }, children: [
          /* @__PURE__ */ jsx("p", { className: "work-card-desc", style: { margin: 0, fontSize: 16, lineHeight: 1.55, color: "#222" }, children: p.desc }),
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginTop: 14
              },
              children: p.stack.slice(0, 4).map((s) => /* @__PURE__ */ jsx("span", { className: "kicker", children: s }, s))
            }
          )
        ] })
      ] })
    }
  );
}
function Work() {
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "work",
      style: {
        maxWidth: "var(--max-w)",
        margin: "0 auto",
        padding: "40px var(--pad-x) 80px"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "grid-12", style: { alignItems: "baseline" }, children: [
          /* @__PURE__ */ jsx(Reveal, { style: { gridColumn: "span 6", borderTop: "1px solid var(--ink)", paddingTop: 14 }, children: /* @__PURE__ */ jsx("span", { className: "kicker", children: "№ 02 — Selected Work" }) }),
          /* @__PURE__ */ jsx(
            Reveal,
            {
              delay: 1,
              style: {
                gridColumn: "span 6",
                borderTop: "1px solid var(--ink)",
                paddingTop: 14,
                textAlign: "right"
              },
              children: /* @__PURE__ */ jsx("span", { className: "kicker", children: "05 of 17 · 2022—2026" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          Reveal,
          {
            as: "h2",
            className: "serif-h",
            style: {
              fontSize: "clamp(50px, 8vw, 114px)",
              lineHeight: 1,
              margin: "24px 0 40px"
            },
            children: [
              "Things I've ",
              /* @__PURE__ */ jsx("em", { children: "shipped" }),
              "."
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "work-grid",
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: 24
            },
            children: portfolio.projects.map((p, i) => /* @__PURE__ */ jsx(ProjectCard, { p, big: LAYOUTS[i].big, col: LAYOUTS[i].col }, p.id))
          }
        )
      ]
    }
  );
}
const BELIEFS = [
  {
    title: "Performance is empathy",
    body: "Slow apps tax the people with the slowest devices. I'd rather ship 30 KB than 300."
  },
  {
    title: "Types are documentation",
    body: "TypeScript isn't a tax — it's the cheapest spec you'll ever write."
  },
  {
    title: "Boring tech wins",
    body: "I reach for React, Postgres, and good defaults before anything novel."
  }
];
function About() {
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "about",
      style: {
        background: "var(--invert-bg)",
        color: "var(--invert-ink)",
        padding: "80px 0"
      },
      children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid-12", style: { alignItems: "baseline" }, children: [
          /* @__PURE__ */ jsx(
            Reveal,
            {
              style: {
                gridColumn: "span 6",
                borderTop: "1px solid rgba(250,250,248,0.15)",
                paddingTop: 14
              },
              children: /* @__PURE__ */ jsx("span", { className: "kicker", style: { color: "var(--dark-dim)" }, children: "№ 03 — About" })
            }
          ),
          /* @__PURE__ */ jsx(
            Reveal,
            {
              delay: 1,
              style: {
                gridColumn: "span 6",
                borderTop: "1px solid rgba(250,250,248,0.15)",
                paddingTop: 14,
                textAlign: "right"
              },
              children: /* @__PURE__ */ jsx("span", { className: "kicker", style: { color: "var(--dark-dim)" }, children: "Worldwide · Remote-first · Open to full-time & freelance" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid-12", style: { marginTop: 32, gap: 32, alignItems: "start" }, children: [
          /* @__PURE__ */ jsx(Reveal, { style: { gridColumn: "span 4" }, children: /* @__PURE__ */ jsxs(
            "div",
            {
              className: "about-portrait",
              style: {
                width: "100%",
                aspectRatio: "4/5",
                background: "linear-gradient(135deg, #2a2a2a 0%, #141414 100%)",
                position: "relative",
                overflow: "hidden"
              },
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: "/images/profile.png",
                    alt: "Abdulsamad Ajao",
                    style: {
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top"
                    },
                    onError: (e) => {
                      e.target.style.display = "none";
                    }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "kicker",
                    style: {
                      position: "absolute",
                      bottom: 18,
                      left: 18,
                      right: 18,
                      color: "var(--dark-dim)"
                    },
                    children: "Abdulsamad Ajao — Remote"
                  }
                )
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { style: { gridColumn: "span 8" }, children: [
            /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs(
              "h2",
              {
                className: "serif-h",
                style: {
                  fontSize: "clamp(42px, 6vw, 90px)",
                  lineHeight: 1.15,
                  paddingBottom: 16
                },
                children: [
                  "I make the web feel",
                  " ",
                  /* @__PURE__ */ jsx("em", { style: { color: "var(--dark-dim)" }, children: "lighter" }),
                  "."
                ]
              }
            ) }),
            /* @__PURE__ */ jsxs(
              Reveal,
              {
                delay: 1,
                className: "story-grid",
                style: {
                  marginTop: 48,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 36
                },
                children: [
                  /* @__PURE__ */ jsx("p", { style: { margin: 0, fontSize: 18, lineHeight: 1.65, color: "var(--dark-text)" }, children: "I started writing JavaScript in a generator-powered office in Yaba in 2019. Six years later, I'm still chasing the same thing — interfaces that load before you notice they did." }),
                  /* @__PURE__ */ jsx("p", { style: { margin: 0, fontSize: 18, lineHeight: 1.65, color: "var(--dark-text)" }, children: "Most of my work lives at the seams: the millisecond between tap and feedback, the retry that decides whether a meal arrives, the type system that keeps a small team honest. I care about Core Web Vitals because users  pay for every byte." })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Reveal,
              {
                delay: 2,
                style: {
                  marginTop: 48,
                  paddingTop: 18,
                  borderTop: "1px dashed #2a2a2a"
                },
                children: [
                  /* @__PURE__ */ jsx("div", { className: "kicker", style: { color: "var(--dark-dim)", marginBottom: 14 }, children: "Daily drivers" }),
                  /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 10 }, children: portfolio.stack.map((s) => /* @__PURE__ */ jsx(
                    "span",
                    {
                      style: {
                        fontSize: 15,
                        padding: "8px 14px",
                        border: "1px solid #2a2a2a",
                        color: "var(--dark-text)",
                        letterSpacing: "0.02em"
                      },
                      children: s
                    },
                    s
                  )) })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              Reveal,
              {
                delay: 3,
                className: "beliefs-grid",
                style: {
                  marginTop: 48,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 24
                },
                children: BELIEFS.map(({ title, body }, i) => /* @__PURE__ */ jsxs("div", { style: { borderTop: "1px solid #2a2a2a", paddingTop: 14 }, children: [
                  /* @__PURE__ */ jsx("div", { className: "serif-h", style: { fontSize: 24, color: "#fafaf8", lineHeight: 1.3 }, children: title }),
                  /* @__PURE__ */ jsx("p", { style: { marginTop: 8, fontSize: 15, lineHeight: 1.55, color: "var(--dark-dim)" }, children: body })
                ] }, i))
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
function Experience() {
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "experience",
      style: {
        maxWidth: "var(--max-w)",
        margin: "0 auto",
        padding: "80px var(--pad-x)"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "grid-12", style: { alignItems: "baseline" }, children: [
          /* @__PURE__ */ jsx(Reveal, { style: { gridColumn: "span 6", borderTop: "1px solid var(--ink)", paddingTop: 14 }, children: /* @__PURE__ */ jsx("span", { className: "kicker", children: "№ 04 — Experience" }) }),
          /* @__PURE__ */ jsx(
            Reveal,
            {
              delay: 1,
              style: {
                gridColumn: "span 6",
                borderTop: "1px solid var(--ink)",
                paddingTop: 14,
                textAlign: "right"
              },
              children: /* @__PURE__ */ jsx(
                "a",
                {
                  href: "/cv.pdf",
                  className: "kicker",
                  style: { color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: 3 },
                  children: "Download CV ↓"
                }
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          Reveal,
          {
            as: "h2",
            className: "serif-h",
            style: { fontSize: "clamp(42px, 7vw, 98px)", lineHeight: 1, margin: "24px 0 40px" },
            children: [
              "Where I've ",
              /* @__PURE__ */ jsx("em", { children: "worked" }),
              "."
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { children: portfolio.experience.map((e, i) => /* @__PURE__ */ jsxs(
          Reveal,
          {
            delay: i % 3,
            className: "exp-row",
            style: {
              display: "grid",
              gridTemplateColumns: "180px 1fr 1fr",
              gap: 32,
              padding: "32px 0",
              borderTop: "1px solid var(--faint-rule)",
              borderBottom: i === portfolio.experience.length - 1 ? "1px solid var(--ink)" : "none"
            },
            children: [
              /* @__PURE__ */ jsx("div", { className: "kicker", style: { paddingTop: 6 }, children: e.dates }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "serif-h", style: { fontSize: 38, lineHeight: 1, letterSpacing: "-0.02em" }, children: e.role }),
                /* @__PURE__ */ jsxs("div", { style: { marginTop: 8, fontSize: 15, color: "var(--dim)" }, children: [
                  e.co,
                  " · ",
                  e.loc
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("ul", { style: { listStyle: "none", padding: 0, margin: 0 }, children: e.bullets.map((b, j) => /* @__PURE__ */ jsxs(
                  "li",
                  {
                    style: {
                      fontSize: 16,
                      lineHeight: 1.55,
                      color: "#222",
                      paddingLeft: 18,
                      position: "relative",
                      marginBottom: 10
                    },
                    children: [
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          style: {
                            position: "absolute",
                            left: 0,
                            top: 10,
                            width: 8,
                            height: 1,
                            background: "var(--ink)"
                          }
                        }
                      ),
                      b
                    ]
                  },
                  j
                )) }),
                e.productUrl && /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: e.productUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "kicker",
                    style: {
                      display: "inline-block",
                      marginTop: 18,
                      color: "var(--ink)",
                      textDecoration: "underline",
                      textUnderlineOffset: 3
                    },
                    children: "View product ↗"
                  }
                )
              ] })
            ]
          },
          i
        )) })
      ]
    }
  );
}
function Arrow$1({ size = 14 }) {
  return /* @__PURE__ */ jsx("svg", { width: size, height: size, viewBox: "0 0 16 16", style: { display: "inline-block", verticalAlign: "-2px" }, children: /* @__PURE__ */ jsx("path", { d: "M3 13L13 3M13 3H6M13 3v7", stroke: "currentColor", strokeWidth: "1.4", fill: "none", strokeLinecap: "square" }) });
}
function Writing() {
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "writing",
      style: {
        maxWidth: "var(--max-w)",
        margin: "0 auto",
        padding: "0 var(--pad-x) 80px"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "grid-12", style: { alignItems: "baseline" }, children: [
          /* @__PURE__ */ jsx(Reveal, { style: { gridColumn: "span 6", borderTop: "1px solid var(--ink)", paddingTop: 14 }, children: /* @__PURE__ */ jsx("span", { className: "kicker", children: "№ 05 — Writing" }) }),
          /* @__PURE__ */ jsx(
            Reveal,
            {
              delay: 1,
              style: {
                gridColumn: "span 6",
                borderTop: "1px solid var(--ink)",
                paddingTop: 14,
                textAlign: "right"
              },
              children: /* @__PURE__ */ jsx("span", { className: "kicker", children: "Occasional · RSS available" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          Reveal,
          {
            as: "h2",
            className: "serif-h",
            style: { fontSize: "clamp(42px, 7vw, 98px)", lineHeight: 1, margin: "24px 0 40px" },
            children: [
              "Notes on ",
              /* @__PURE__ */ jsx("em", { children: "craft" }),
              "."
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          portfolio.writing.map((w, i) => /* @__PURE__ */ jsx(Reveal, { delay: i % 3, children: /* @__PURE__ */ jsxs(
            "a",
            {
              href: "#",
              className: "writing-row",
              style: {
                display: "grid",
                gridTemplateColumns: "120px 1fr 100px 60px",
                gap: 24,
                alignItems: "baseline",
                padding: "22px 0",
                borderTop: "1px solid var(--faint-rule)",
                color: "var(--ink)"
              },
              children: [
                /* @__PURE__ */ jsx("div", { className: "kicker", children: w.d }),
                /* @__PURE__ */ jsx("div", { className: "serif-h", style: { fontSize: 30, letterSpacing: "-0.02em", lineHeight: 1.2 }, children: w.t }),
                /* @__PURE__ */ jsx("div", { className: "kicker writing-readtime", style: { textAlign: "right" }, children: w.read }),
                /* @__PURE__ */ jsx("div", { className: "writing-arrow", style: { textAlign: "right" }, children: /* @__PURE__ */ jsx(Arrow$1, { size: 14 }) })
              ]
            }
          ) }, i)),
          /* @__PURE__ */ jsx("div", { style: { borderTop: "1px solid var(--ink)" } })
        ] })
      ]
    }
  );
}
const SOCIAL_LINKS = [
  { label: "GitHub", handle: "@ajaoseyi", href: portfolio.socials.github },
  { label: "LinkedIn", handle: "/in/abdulsamad-ajao", href: portfolio.socials.linkedin },
  { label: "X / Twitter", handle: "@Abdulsamad_O", href: portfolio.socials.twitter },
  { label: "Dev.to", handle: "@ajaoseyi", href: portfolio.socials.devto }
];
const LOOKING_FOR = [
  {
    title: "Senior or staff role",
    body: "Product-led teams shipping React or React Native at real scale."
  },
  {
    title: "Consulting · 4-week min.",
    body: "Performance audits, design-system bring-up, hiring loops."
  }
];
function Contact() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    var _a;
    (_a = navigator.clipboard) == null ? void 0 : _a.writeText(portfolio.email).catch(() => {
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "contact",
      style: {
        background: "var(--invert-bg)",
        color: "var(--invert-ink)",
        padding: "80px 0 0"
      },
      children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid-12", style: { alignItems: "baseline" }, children: [
          /* @__PURE__ */ jsx(
            Reveal,
            {
              style: {
                gridColumn: "span 6",
                borderTop: "1px solid rgba(250,250,248,0.15)",
                paddingTop: 14
              },
              children: /* @__PURE__ */ jsx("span", { className: "kicker", style: { color: "var(--dark-dim)" }, children: "№ 06 — Contact" })
            }
          ),
          /* @__PURE__ */ jsxs(
            Reveal,
            {
              delay: 1,
              style: {
                gridColumn: "span 6",
                borderTop: "1px solid rgba(250,250,248,0.15)",
                paddingTop: 14,
                textAlign: "right",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 8
              },
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "pulse-dot",
                    style: {
                      display: "inline-block",
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#0eea6c"
                    }
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "kicker", style: { color: "var(--dark-dim)" }, children: portfolio.available })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          Reveal,
          {
            as: "h2",
            className: "serif-h",
            style: {
              fontSize: "clamp(66px, 13vw, 222px)",
              lineHeight: 0.92,
              marginTop: 40
            },
            children: [
              "Let's",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("em", { style: { color: "var(--dark-dim)" }, children: "build" }),
              " something."
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "contact-cards",
            style: {
              display: "grid",
              gridTemplateColumns: "5fr 4fr 3fr",
              gap: 24,
              marginTop: 64
            },
            children: [
              /* @__PURE__ */ jsxs(Reveal, { style: { borderTop: "1px solid rgba(250,250,248,0.15)", paddingTop: 18 }, children: [
                /* @__PURE__ */ jsx("div", { className: "kicker", style: { color: "var(--dark-dim)" }, children: "Email — fastest" }),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "serif-h",
                    style: {
                      fontSize: "clamp(20px, 2.5vw, 38px)",
                      marginTop: 8,
                      color: "#fafaf8",
                      wordBreak: "break-all"
                    },
                    children: portfolio.email
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: handleCopy,
                    style: {
                      marginTop: 20,
                      padding: "14px 22px",
                      border: "1px solid #fafaf8",
                      color: "#fafaf8",
                      fontSize: 13,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      transition: "background 0.2s, color 0.2s"
                    },
                    onMouseEnter: (e) => {
                      e.currentTarget.style.background = "#fafaf8";
                      e.currentTarget.style.color = "#0a0a0a";
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#fafaf8";
                    },
                    children: copied ? "Copied ✓" : "Copy address"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(
                Reveal,
                {
                  delay: 1,
                  style: { borderTop: "1px solid rgba(250,250,248,0.15)", paddingTop: 18 },
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "kicker", style: { color: "var(--dark-dim)" }, children: "30-min intro call" }),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "serif-h",
                        style: { fontSize: 30, marginTop: 8, color: "#fafaf8", lineHeight: 1.2 },
                        children: "Tell me about the work — I'll come prepared."
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        href: "mailto:ajaoabdulsamad2000@gmail.com?subject=Let's talk",
                        style: {
                          display: "inline-block",
                          marginTop: 20,
                          padding: "14px 22px",
                          background: "#fafaf8",
                          color: "#0a0a0a",
                          fontSize: 13,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase"
                        },
                        children: "Book a slot →"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Reveal,
                {
                  delay: 2,
                  style: { borderTop: "1px solid rgba(250,250,248,0.15)", paddingTop: 18 },
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "kicker", style: { color: "var(--dark-dim)", marginBottom: 12 }, children: "Elsewhere" }),
                    /* @__PURE__ */ jsx("ul", { style: { listStyle: "none" }, children: SOCIAL_LINKS.map(({ label, handle, href }) => /* @__PURE__ */ jsx("li", { style: { borderBottom: "1px dashed #2a2a2a" }, children: /* @__PURE__ */ jsxs(
                      "a",
                      {
                        href,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        style: {
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px 0",
                          fontSize: 15,
                          color: "var(--dark-text)",
                          textDecoration: "none"
                        },
                        children: [
                          /* @__PURE__ */ jsx("span", { children: label }),
                          /* @__PURE__ */ jsxs("span", { style: { color: "#fafaf8" }, children: [
                            handle,
                            " ↗"
                          ] })
                        ]
                      }
                    ) }, label)) }),
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        href: portfolio.resume,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        style: {
                          display: "inline-block",
                          marginTop: 16,
                          fontSize: 13,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "var(--dark-dim)",
                          textDecoration: "none"
                        },
                        children: "Download CV ↓"
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Reveal,
          {
            style: {
              marginTop: 64,
              paddingTop: 18,
              borderTop: "1px dashed #2a2a2a"
            },
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: "contact-looking-for",
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 24,
                  alignItems: "start"
                },
                children: [
                  /* @__PURE__ */ jsx("div", { className: "kicker", style: { color: "var(--dark-dim)" }, children: "What I'm looking for" }),
                  /* @__PURE__ */ jsx("div", { className: "contact-looking-for-inner", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }, children: LOOKING_FOR.map(({ title, body }, i) => /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: "serif-h", style: { fontSize: 26, color: "#fafaf8" }, children: title }),
                    /* @__PURE__ */ jsx("p", { style: { marginTop: 6, fontSize: 15, color: "var(--dark-dim)", lineHeight: 1.55 }, children: body })
                  ] }, i)) })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              padding: "40px 0 32px",
              marginTop: 56,
              borderTop: "1px solid #2a2a2a"
            },
            className: "kicker",
            children: [
              /* @__PURE__ */ jsx("span", { style: { color: "var(--dark-dim)" }, children: "© Abdulsamad Ajao MMXXVI · All rights reserved" }),
              /* @__PURE__ */ jsx("span", { style: { color: "var(--dark-dim)" }, children: "Crafted with care · Set in Inter & Instrument Serif" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
                  style: { color: "var(--dark-dim)", fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase" },
                  children: "↑ Back to top"
                }
              )
            ]
          }
        )
      ] })
    }
  );
}
const meta$1 = () => [{
  title: "Abdulsamad Portfolio"
}, {
  name: "description",
  content: "Abdulsamad Ajao is a Senior Frontend Engineer working internationally, crafting fast, accessible interfaces for fintech, food-tech, and Web3 products. Five years shipping production React across two continents."
}, {
  name: "author",
  content: "Abdulsamad Ajao"
}, {
  name: "keywords",
  content: "frontend engineer, React, TypeScript, remote, fintech, web3, UI engineer, portfolio"
}, {
  property: "og:title",
  content: "Abdulsamad Portfolio"
}, {
  property: "og:description",
  content: "Senior Frontend Engineer working internationally — building performant, pixel-precise interfaces for fintech, food-tech, and Web3."
}, {
  property: "og:type",
  content: "website"
}, {
  property: "og:image",
  content: "/images/profile.png"
}, {
  property: "og:image:alt",
  content: "Abdulsamad Ajao"
}, {
  name: "twitter:card",
  content: "summary_large_image"
}, {
  name: "twitter:title",
  content: "Abdulsamad Portfolio"
}, {
  name: "twitter:description",
  content: "Senior Frontend Engineer working internationally — building performant, pixel-precise interfaces for fintech, food-tech, and Web3."
}, {
  name: "twitter:image",
  content: "/images/profile.png"
}];
const _index = UNSAFE_withComponentProps(function Index() {
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(CustomCursor, {}), /* @__PURE__ */ jsx(SmoothScroll, {}), /* @__PURE__ */ jsx(ScrollProgress, {}), /* @__PURE__ */ jsx(Nav, {}), /* @__PURE__ */ jsxs("main", {
      children: [/* @__PURE__ */ jsx(Hero, {}), /* @__PURE__ */ jsx(Work, {}), /* @__PURE__ */ jsx(About, {}), /* @__PURE__ */ jsx(Experience, {}), /* @__PURE__ */ jsx(Writing, {}), /* @__PURE__ */ jsx(Contact, {})]
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _index,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
async function loader({
  params
}) {
  const project = portfolio.projects.find((p) => p.id === params.id);
  if (!project) throw redirect("/");
  return {
    project
  };
}
const meta = ({
  data
}) => {
  if (!data) return [{
    title: "Work — Abdulsamad Ajao"
  }];
  const {
    project: p
  } = data;
  return [{
    title: `${p.name} — Abdulsamad Ajao`
  }, {
    name: "description",
    content: p.tagline
  }];
};
function Arrow({
  size = 12,
  color = "currentColor"
}) {
  return /* @__PURE__ */ jsx("svg", {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    style: {
      display: "inline-block",
      verticalAlign: "-2px"
    },
    children: /* @__PURE__ */ jsx("path", {
      d: "M3 13L13 3M13 3H6M13 3v7",
      stroke: color,
      strokeWidth: "1.4",
      fill: "none",
      strokeLinecap: "square"
    })
  });
}
const work_$id = UNSAFE_withComponentProps(function CaseStudy({
  loaderData
}) {
  var _a, _b, _c, _d, _e, _f, _g;
  const {
    project: p
  } = loaderData;
  const idx = portfolio.projects.findIndex((proj) => proj.id === p.id);
  const next = portfolio.projects[(idx + 1) % portfolio.projects.length];
  return /* @__PURE__ */ jsxs("div", {
    style: {
      background: "var(--bg)",
      color: "var(--ink)",
      fontFamily: "var(--font-sans)",
      minHeight: "100vh"
    },
    children: [/* @__PURE__ */ jsx(CustomCursor, {}), /* @__PURE__ */ jsx(SmoothScroll, {}), /* @__PURE__ */ jsx(ScrollProgress, {}), /* @__PURE__ */ jsx("header", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(244, 243, 239, 0.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--faint-rule)"
      },
      children: /* @__PURE__ */ jsxs("div", {
        style: {
          maxWidth: "var(--max-w)",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px var(--pad-x)"
        },
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/",
          style: {
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 15,
            fontWeight: 600,
            color: "var(--ink)"
          },
          children: "← Back to index"
        }), /* @__PURE__ */ jsxs("span", {
          className: "kicker",
          children: ["Case Study · ", p.n, " of 05"]
        }), /* @__PURE__ */ jsxs("a", {
          href: `https://${p.url}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "kicker cs-nav-visit",
          style: {
            color: "var(--ink)"
          },
          children: ["Visit ", p.url, " ↗"]
        })]
      })
    }), /* @__PURE__ */ jsxs("section", {
      style: {
        maxWidth: "var(--max-w)",
        margin: "0 auto",
        padding: "64px var(--pad-x) 0"
      },
      children: [/* @__PURE__ */ jsx("div", {
        className: "grid-12",
        children: /* @__PURE__ */ jsxs("div", {
          style: {
            gridColumn: "span 12",
            borderTop: "1px solid var(--ink)",
            paddingTop: 14,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8
          },
          children: [/* @__PURE__ */ jsxs("span", {
            className: "kicker",
            children: [p.n, " · ", p.cat]
          }), /* @__PURE__ */ jsxs("span", {
            className: "kicker",
            children: [p.year, " — ", p.role]
          })]
        })
      }), /* @__PURE__ */ jsxs(Reveal, {
        as: "h1",
        className: "serif-h",
        style: {
          fontSize: "clamp(66px, 13vw, 202px)",
          lineHeight: 0.92,
          marginTop: 32
        },
        children: [p.name, "."]
      }), /* @__PURE__ */ jsx(Reveal, {
        delay: 1,
        className: "serif-h",
        style: {
          gridColumn: "1 / span 8",
          marginTop: 24,
          fontSize: "clamp(26px, 3.4vw, 54px)",
          fontStyle: "italic",
          lineHeight: 1.15,
          color: "#3a3a38",
          maxWidth: 900
        },
        children: p.tagline
      }), /* @__PURE__ */ jsx(Reveal, {
        delay: 2,
        style: {
          marginTop: 40
        },
        children: /* @__PURE__ */ jsxs("a", {
          href: `https://${p.url}`,
          target: "_blank",
          rel: "noopener noreferrer",
          style: {
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 28px",
            background: "#0a0a0a",
            border: "1px solid #0a0a0a",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#f4f3ef",
            textDecoration: "none",
            transition: "background 0.2s, color 0.2s, border-color 0.2s"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.background = "#2a2a2a";
            e.currentTarget.style.borderColor = "#2a2a2a";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.background = "#0a0a0a";
            e.currentTarget.style.borderColor = "#0a0a0a";
          },
          children: ["View Project ", /* @__PURE__ */ jsx(Arrow, {
            size: 13
          })]
        })
      }), /* @__PURE__ */ jsx(Reveal, {
        delay: 2,
        className: "cs-outcomes-grid",
        style: {
          marginTop: 56,
          paddingTop: 18,
          borderTop: "1px solid var(--ink)",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24
        },
        children: p.outcomes.map((o, i) => /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("div", {
            className: "serif-h",
            style: {
              fontSize: 66,
              lineHeight: 1,
              letterSpacing: "-0.03em"
            },
            children: o.v
          }), /* @__PURE__ */ jsx("div", {
            className: "kicker",
            style: {
              marginTop: 10
            },
            children: o.k
          })]
        }, i))
      })]
    }), ((_a = p.images) == null ? void 0 : _a.hero) && /* @__PURE__ */ jsx("section", {
      style: {
        maxWidth: "var(--max-w)",
        margin: "0 auto",
        padding: "64px var(--pad-x) 0"
      },
      children: /* @__PURE__ */ jsxs("div", {
        className: "cs-hero-visual",
        style: {
          height: 560,
          background: "var(--invert-bg)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        },
        children: [/* @__PURE__ */ jsx("div", {
          className: "serif-h cs-hero-watermark",
          style: {
            position: "absolute",
            top: -60,
            right: -40,
            fontSize: 722,
            lineHeight: 0.8,
            color: "#161616",
            userSelect: "none",
            pointerEvents: "none"
          },
          children: p.n
        }), /* @__PURE__ */ jsx("img", {
          src: p.images.hero,
          alt: `${p.name} app screenshot`,
          style: {
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            zIndex: 2
          }
        })]
      })
    }), /* @__PURE__ */ jsxs("section", {
      className: "cs-three-col",
      style: {
        maxWidth: "var(--max-w)",
        margin: "0 auto",
        padding: "80px var(--pad-x) 0",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 24
      },
      children: [[{
        label: "The problem",
        content: p.problem
      }, {
        label: "My approach",
        content: p.approach
      }].map(({
        label,
        content
      }, i) => /* @__PURE__ */ jsxs(Reveal, {
        delay: i,
        children: [/* @__PURE__ */ jsx("div", {
          className: "kicker",
          style: {
            borderTop: "1px solid var(--ink)",
            paddingTop: 14
          },
          children: label
        }), /* @__PURE__ */ jsx("p", {
          style: {
            marginTop: 18,
            fontSize: 19,
            lineHeight: 1.6,
            color: "#222"
          },
          children: content
        })]
      }, label)), /* @__PURE__ */ jsxs(Reveal, {
        delay: 2,
        children: [/* @__PURE__ */ jsx("div", {
          className: "kicker",
          style: {
            borderTop: "1px solid var(--ink)",
            paddingTop: 14
          },
          children: "Stack"
        }), /* @__PURE__ */ jsx("ul", {
          style: {
            marginTop: 18,
            padding: 0,
            listStyle: "none"
          },
          children: p.stack.map((s) => /* @__PURE__ */ jsxs("li", {
            style: {
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px dashed var(--faint-rule)",
              fontSize: 15,
              color: "#222"
            },
            children: [/* @__PURE__ */ jsx("span", {
              children: s
            }), /* @__PURE__ */ jsx("span", {
              style: {
                color: "var(--dim)"
              },
              children: "·"
            })]
          }, s))
        })]
      })]
    }), /* @__PURE__ */ jsxs("section", {
      style: {
        maxWidth: "var(--max-w)",
        margin: "0 auto",
        padding: "80px var(--pad-x) 0"
      },
      children: [/* @__PURE__ */ jsx("div", {
        className: "kicker",
        style: {
          borderTop: "1px solid var(--ink)",
          paddingTop: 14
        },
        children: "What I shipped"
      }), /* @__PURE__ */ jsx("div", {
        className: "cs-three-col",
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 32,
          marginTop: 32
        },
        children: p.highlights.map((h, i) => /* @__PURE__ */ jsx(Reveal, {
          delay: i % 3,
          children: /* @__PURE__ */ jsxs("div", {
            style: {
              borderTop: "1px solid var(--faint-rule)",
              paddingTop: 18
            },
            children: [/* @__PURE__ */ jsx("div", {
              className: "serif-h",
              style: {
                fontSize: 58,
                color: "var(--dim)"
              },
              children: String(i + 1).padStart(2, "0")
            }), /* @__PURE__ */ jsx("p", {
              style: {
                marginTop: 14,
                fontSize: 18,
                lineHeight: 1.55,
                color: "#222"
              },
              children: h
            })]
          })
        }, i))
      })]
    }), (((_b = p.images) == null ? void 0 : _b.logo) || ((_d = (_c = p.images) == null ? void 0 : _c.detail) == null ? void 0 : _d.length)) && /* @__PURE__ */ jsx("section", {
      style: {
        maxWidth: "var(--max-w)",
        margin: "0 auto",
        padding: "80px var(--pad-x) 0"
      },
      children: /* @__PURE__ */ jsxs("div", {
        className: "cs-two-col",
        style: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16
        },
        children: [((_e = p.images) == null ? void 0 : _e.logo) && /* @__PURE__ */ jsx("div", {
          style: {
            height: 360,
            background: "var(--invert-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 48,
            overflow: "hidden"
          },
          children: /* @__PURE__ */ jsx("img", {
            src: p.images.logo,
            alt: `${p.name} logo`,
            style: {
              maxHeight: 120,
              maxWidth: "70%",
              objectFit: "contain"
            }
          })
        }), (_g = (_f = p.images) == null ? void 0 : _f.detail) == null ? void 0 : _g.map((src) => /* @__PURE__ */ jsx("div", {
          style: {
            height: 360,
            background: "var(--invert-bg)",
            overflow: "hidden"
          },
          children: /* @__PURE__ */ jsx("img", {
            src,
            alt: `${p.name} detail`,
            style: {
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center top"
            }
          })
        }, src))]
      })
    }), /* @__PURE__ */ jsx("section", {
      style: {
        maxWidth: 1100,
        margin: "0 auto",
        padding: "120px var(--pad-x)"
      },
      children: /* @__PURE__ */ jsxs(Reveal, {
        className: "serif-h",
        style: {
          fontSize: "clamp(34px, 4.6vw, 74px)",
          lineHeight: 1.15,
          fontStyle: "italic"
        },
        children: ['"', p.tagline, '"', " ", /* @__PURE__ */ jsx("span", {
          style: {
            color: "var(--dim)",
            fontStyle: "normal",
            fontSize: "0.5em"
          },
          children: "— the brief, in one line."
        })]
      })
    }), /* @__PURE__ */ jsx("section", {
      style: {
        borderTop: "1px solid var(--ink)"
      },
      children: /* @__PURE__ */ jsx(Link, {
        to: `/work/${next.id}`,
        style: {
          display: "block",
          padding: "64px var(--pad-x)",
          transition: "background 0.3s"
        },
        onMouseEnter: (e) => e.currentTarget.style.background = "var(--invert-bg)",
        onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
        children: /* @__PURE__ */ jsxs("div", {
          className: "next-project-inner",
          style: {
            maxWidth: "var(--max-w)",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 16,
            alignItems: "baseline"
          },
          children: [/* @__PURE__ */ jsx("div", {
            style: {
              gridColumn: "span 6"
            },
            children: /* @__PURE__ */ jsxs("span", {
              className: "kicker",
              style: {
                mixBlendMode: "difference",
                color: "white"
              },
              children: ["Next case → ", next.cat]
            })
          }), /* @__PURE__ */ jsx("div", {
            style: {
              gridColumn: "span 6",
              textAlign: "right"
            },
            children: /* @__PURE__ */ jsxs("span", {
              className: "kicker",
              style: {
                mixBlendMode: "difference",
                color: "white"
              },
              children: [next.n, " of 05"]
            })
          }), /* @__PURE__ */ jsxs("h2", {
            className: "serif-h",
            style: {
              gridColumn: "span 12",
              margin: "24px 0 0",
              fontSize: "clamp(66px, 13vw, 202px)",
              lineHeight: 0.9,
              mixBlendMode: "difference",
              color: "white"
            },
            children: [next.name, " ", /* @__PURE__ */ jsx(Arrow, {
              size: 64,
              color: "currentColor"
            })]
          })]
        })
      })
    })]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: work_$id,
  loader,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BTIMp5NP.js", "imports": ["/assets/chunk-5KNZJZUH-Bx-f-fMl.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": true, "module": "/assets/root-B38kpUl-.js", "imports": ["/assets/chunk-5KNZJZUH-Bx-f-fMl.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/_index-BNvjFNbq.js", "imports": ["/assets/chunk-5KNZJZUH-Bx-f-fMl.js", "/assets/Reveal-Bfk8qU6q.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/work.$id": { "id": "routes/work.$id", "parentId": "root", "path": "work/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/work._id-CbGYW-s0.js", "imports": ["/assets/chunk-5KNZJZUH-Bx-f-fMl.js", "/assets/Reveal-Bfk8qU6q.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-dcd15e61.js", "version": "dcd15e61", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "v8_passThroughRequests": false, "unstable_trailingSlashAwareDataRequests": false, "unstable_previewServerPrerendering": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/work.$id": {
    id: "routes/work.$id",
    parentId: "root",
    path: "work/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  }
};
const allowedActionOrigins = false;
export {
  allowedActionOrigins,
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
