"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Lenis from "lenis"
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Star,
} from "lucide-react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"

import { cn } from "@/lib/utils"
import { CALYPSO, GALLERY, MENU, TESTIMONIALS } from "@/components/calypso/data"

/* ————— Library audit applied here —————
   Lenis (installed): smooth scroll, disabled for reduced-motion / touch.
   Motion (already in project): scroll parallax, reveals, layout-animated menu.
   React Bits patterns (SplitText / BlurText): re-implemented in ~30 lines on
   Motion rather than copying a whole component library.
   GSAP, R3F/Drei, Theatre.js, AutoAnimate: intentionally NOT installed —
   they duplicate Motion, add WebGL weight, or are authoring tools. */

/** Lenis smooth scrolling, respecting reduced-motion and native anchors. */
function useSmoothScroll() {
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce || window.matchMedia("(pointer: coarse)").matches) return
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 })
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[href^="#"]'
      )
      if (!a) return
      const el = document.querySelector(a.getAttribute("href")!)
      if (el) {
        e.preventDefault()
        lenis.scrollTo(el as HTMLElement, { offset: -72 })
      }
    }
    document.addEventListener("click", onClick)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener("click", onClick)
      lenis.destroy()
    }
  }, [reduce])
}

const ease = [0.22, 1, 0.36, 1] as const

/** React-Bits-style split-text blur reveal, built on Motion. */
function SplitWords({
  text,
  className,
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          aria-hidden
          className="-mb-[0.08em] inline-block overflow-hidden pb-[0.08em] align-bottom"
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={
              reduce
                ? { opacity: 0 }
                : { y: "110%", opacity: 0, filter: "blur(6px)" }
            }
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: delay + i * 0.07, ease }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  )
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.32em] text-[#c9903f] uppercase">
      <span className="h-px w-10 bg-[#c9903f]/70" aria-hidden /> {children}
    </p>
  )
}

/* ————————————— Nav ————————————— */
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [])
  const links = [
    ["Story", "#story"],
    ["Menu", "#menu"],
    ["Moments", "#moments"],
    ["Visit", "#visit"],
  ] as const
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#120c07]/90 shadow-lg shadow-black/20 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <nav
        aria-label="Calypso"
        className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-10"
      >
        <a
          href="#top"
          className="font-[family-name:var(--font-calypso-display)] text-2xl tracking-wide text-[#f6ecdc]"
        >
          Calypso
          <sup className="ml-1 text-[10px] tracking-[0.25em] text-[#c9903f]">
            EG
          </sup>
        </a>
        <ul className="hidden items-center gap-9 md:flex">
          {links.map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                className="group relative text-[13px] font-medium tracking-[0.18em] text-[#f6ecdc]/80 uppercase transition hover:text-[#f6ecdc] focus-visible:outline-2 focus-visible:outline-[#c9903f]"
              >
                {label}
                <span
                  className="absolute -bottom-1.5 left-0 h-px w-0 bg-[#c9903f] transition-all duration-300 group-hover:w-full"
                  aria-hidden
                />
              </a>
            </li>
          ))}
        </ul>
        <a
          href={CALYPSO.phoneHref}
          className="inline-flex items-center gap-2 rounded-full border border-[#f6ecdc]/25 px-4 py-2 text-[13px] font-medium text-[#f6ecdc] transition hover:border-[#c9903f] hover:bg-[#c9903f] hover:text-[#120c07] focus-visible:outline-2 focus-visible:outline-[#c9903f]"
        >
          <Phone className="size-3.5" aria-hidden />{" "}
          <span className="hidden sm:inline">{CALYPSO.phoneDisplay}</span>
          <span className="sm:hidden">Call us</span>
        </a>
      </nav>
    </header>
  )
}

/* ————————————— Hero ————————————— */
function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "22%"])
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1.08, reduce ? 1.08 : 1.22]
  )
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#120c07]"
    >
      <motion.div style={{ y, scale }} className="absolute inset-0" aria-hidden>
        <Image
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2200&auto=format&fit=crop"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#120c07] via-[#120c07]/35 to-[#120c07]/30"
        aria-hidden
      />
      <div
        className="calypso-grain absolute inset-0 opacity-[0.14] mix-blend-overlay"
        aria-hidden
      />
      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-36 pb-14 md:px-10 md:pb-20"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="mb-6 flex items-center gap-3 text-[11px] font-semibold tracking-[0.34em] text-[#e9c07a] uppercase"
        >
          <span className="h-px w-12 bg-[#c9903f]" aria-hidden /> Café ·
          Restaurant · Shisha — Cairo
        </motion.p>
        <h1 className="max-w-4xl font-[family-name:var(--font-calypso-display)] text-[13.5vw] leading-[0.95] font-medium text-[#faf3e6] sm:text-7xl md:text-8xl lg:text-[7.5rem]">
          <SplitWords text="Where Cairo" />
          <br />
          <span className="text-[#e9c07a] italic">
            <SplitWords text="comes to unwind." delay={0.25} />
          </span>
        </h1>
        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8, ease }}
            className="max-w-md text-base leading-relaxed text-[#f6ecdc]/75 md:text-lg"
          >
            A nice meal, a proper drink and shisha with your friends — in a room
            that feels homey and friendly from the moment you step in.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8, ease }}
            className="flex flex-wrap items-center gap-3"
          >
            <a
              href="#menu"
              className="group inline-flex items-center gap-2 rounded-full bg-[#c9903f] px-6 py-3.5 text-sm font-semibold text-[#120c07] transition hover:bg-[#e9c07a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9c07a]"
            >
              Explore the menu{" "}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </a>
            <a
              href="#visit"
              className="inline-flex items-center gap-2 rounded-full border border-[#f6ecdc]/30 px-6 py-3.5 text-sm font-semibold text-[#f6ecdc] backdrop-blur transition hover:border-[#f6ecdc] hover:bg-[#f6ecdc]/10 focus-visible:outline-2 focus-visible:outline-[#e9c07a]"
            >
              Book a table
            </a>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-14 flex flex-wrap gap-x-10 gap-y-3 border-t border-[#f6ecdc]/15 pt-6 text-[13px] text-[#f6ecdc]/65"
        >
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-4 text-[#c9903f]" aria-hidden /> El Kafrawi
            Axis, Cairo
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock className="size-4 text-[#c9903f]" aria-hidden /> Dine-in &
            outdoor seating
          </span>
          <span className="inline-flex items-center gap-2">
            <Star
              className="size-4 fill-[#c9903f] text-[#c9903f]"
              aria-hidden
            />{" "}
            Loved by Cairo’s night owls
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ————————————— Marquee + Story ————————————— */
function Marquee() {
  const items = [
    "Slow mornings",
    "Golden-hour terraces",
    "Signature shisha",
    "Kitchen favourites",
    "Coffee, properly brewed",
    "Nights that linger",
  ]
  const row = [...items, ...items]
  return (
    <div
      className="overflow-hidden border-y border-[#f6ecdc]/10 bg-[#171008] py-4"
      aria-hidden
    >
      <div className="calypso-marquee flex w-max gap-0">
        {row.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-6 pr-6 font-[family-name:var(--font-calypso-display)] text-lg text-[#f6ecdc]/70 italic"
          >
            {t}
            <span className="size-1.5 rounded-full bg-[#c9903f]" />
          </span>
        ))}
      </div>
    </div>
  )
}

function Story() {
  const stats = [
    ["203+", "moments shared on Instagram"],
    ["7", "days a week, morning to late"],
    ["2", "ways to sit — dine-in or terrace"],
    ["1", "rule: never rush a guest"],
  ]
  return (
    <section id="story" className="bg-[#faf5ea] text-[#211812]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-2 md:px-10 md:py-36 lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow>Our story</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-[family-name:var(--font-calypso-display)] text-4xl leading-[1.05] font-medium md:text-6xl">
              Not just a table.
              <br />
              <span className="text-[#a96f2c] italic">A place to land.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-[#211812]/70 md:text-lg">
              Calypso began with a simple idea: Cairo needed a room that treats
              you like a guest in someone’s home. Good food, honest drinks,
              shisha prepared with care — and staff who remember your name by
              the second visit.
            </p>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-[#211812]/70">
              Find us on El Kafrawi Axis, where the terrace catches the evening
              breeze and dinner has a way of turning into the whole night.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[#211812]/10">
              {stats.map(([n, label]) => (
                <div key={label} className="bg-[#faf5ea] p-5">
                  <p className="font-[family-name:var(--font-calypso-display)] text-3xl text-[#a96f2c]">
                    {n}
                  </p>
                  <p className="mt-1 text-[13px] text-[#211812]/60">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="relative">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <Image
              src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1400&auto=format&fit=crop"
              alt="Warm, welcoming interior at Calypso Café & Restaurant"
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent"
              aria-hidden
            />
            <p className="absolute bottom-5 left-5 font-[family-name:var(--font-calypso-display)] text-lg text-white italic">
              “Step in — you’re among friends.”
            </p>
          </div>
          <div className="absolute -bottom-6 -left-4 hidden w-52 rotate-[-4deg] overflow-hidden rounded-2xl border-4 border-[#faf5ea] shadow-xl md:block">
            <Image
              src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=700&auto=format&fit=crop"
              alt="Coffee being poured"
              width={420}
              height={300}
              className="aspect-[4/3] object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ————————————— Menu (interactive dish cards) ————————————— */
function MenuSection() {
  const cats = Object.keys(MENU)
  const [cat, setCat] = useState(cats[0])
  return (
    <section id="menu" className="bg-[#120c07] text-[#f6ecdc]">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-36">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <Eyebrow>From the kitchen & bar</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 font-[family-name:var(--font-calypso-display)] text-4xl font-medium md:text-6xl">
                Tonight at{" "}
                <span className="text-[#e9c07a] italic">Calypso</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm leading-relaxed text-[#f6ecdc]/60">
              Highlights from the menu — ask your host about today’s specials
              and the full shisha list.
            </p>
          </Reveal>
        </div>

        <div
          role="tablist"
          aria-label="Menu categories"
          className="mt-12 flex flex-wrap gap-2"
        >
          {cats.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              onClick={() => setCat(c)}
              className={cn(
                "relative rounded-full px-5 py-2.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-[#e9c07a]",
                cat === c
                  ? "text-[#120c07]"
                  : "border border-[#f6ecdc]/20 text-[#f6ecdc]/70 hover:border-[#f6ecdc]/50 hover:text-[#f6ecdc]"
              )}
            >
              {cat === c && (
                <motion.span
                  layoutId="calypso-tab"
                  className="absolute inset-0 rounded-full bg-[#e9c07a]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  aria-hidden
                />
              )}
              <span className="relative z-10">{c}</span>
            </button>
          ))}
        </div>

        <motion.ul
          layout
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          aria-live="polite"
        >
          <AnimatePresence mode="popLayout">
            {MENU[cat].map((item) => (
              <motion.li
                key={`${cat}-${item.name}`}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -12 }}
                transition={{ duration: 0.45, ease }}
              >
                <article className="group h-full overflow-hidden rounded-3xl bg-[#1d130a] ring-1 ring-[#f6ecdc]/10 transition duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/50 hover:ring-[#c9903f]/40">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width:640px) 100vw, 25vw"
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-70 transition group-hover:opacity-40"
                      aria-hidden
                    />
                    {item.tag && (
                      <span className="absolute top-3 left-3 rounded-full bg-[#120c07]/70 px-3 py-1 text-[11px] font-semibold tracking-wide text-[#e9c07a] backdrop-blur">
                        {item.tag}
                      </span>
                    )}
                    <span className="absolute right-3 bottom-3 rounded-full bg-[#faf5ea] px-3 py-1 text-[13px] font-bold text-[#211812]">
                      {item.price}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-[family-name:var(--font-calypso-display)] text-xl leading-snug">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#f6ecdc]/60">
                      {item.desc}
                    </p>
                    <a
                      href={CALYPSO.phoneHref}
                      className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#e9c07a] transition hover:gap-2.5 focus-visible:outline-2 focus-visible:outline-[#e9c07a]"
                    >
                      Order / reserve{" "}
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </a>
                  </div>
                </article>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  )
}

/* ————————————— Gallery / Moments ————————————— */
function Moments() {
  const [i, setI] = useState(0)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setI((v) => (v + 1) % GALLERY.length), 5200)
    return () => clearInterval(t)
  }, [reduce])
  return (
    <section id="moments" className="bg-[#faf5ea] text-[#211812]">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-36">
        <Reveal>
          <Eyebrow>Moments</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 max-w-2xl font-[family-name:var(--font-calypso-display)] text-4xl font-medium md:text-6xl">
            Evenings, as they{" "}
            <span className="text-[#a96f2c] italic">actually feel</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <figure className="relative mt-12 aspect-[16/10] overflow-hidden rounded-[2rem] md:aspect-[21/9]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: reduce ? 1 : 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0.2 : 1.1, ease }}
                className="absolute inset-0"
              >
                <Image
                  src={GALLERY[i].src}
                  alt={GALLERY[i].alt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  loading="lazy"
                />
              </motion.div>
            </AnimatePresence>
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"
              aria-hidden
            />
            <figcaption className="absolute bottom-5 left-5 font-[family-name:var(--font-calypso-display)] text-xl text-white italic md:bottom-7 md:left-8 md:text-2xl">
              {GALLERY[i].caption}
            </figcaption>
          </figure>
        </Reveal>
        <div
          className="mt-5 flex flex-wrap gap-2.5"
          role="tablist"
          aria-label="Gallery"
        >
          {GALLERY.map((g, idx) => (
            <button
              key={g.caption}
              role="tab"
              aria-selected={i === idx}
              aria-label={g.caption}
              onClick={() => setI(idx)}
              className={cn(
                "relative h-16 w-24 overflow-hidden rounded-xl ring-offset-2 ring-offset-[#faf5ea] transition focus-visible:ring-2 focus-visible:ring-[#a96f2c] focus-visible:outline-none",
                i === idx
                  ? "ring-2 ring-[#a96f2c]"
                  : "opacity-55 hover:opacity-100"
              )}
            >
              <Image
                src={g.src}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>

        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, idx) => (
            <Reveal key={t.name} delay={idx * 0.08}>
              <blockquote className="h-full rounded-3xl bg-white/70 p-7 ring-1 ring-[#211812]/10 transition duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#a96f2c]/10">
                <div className="flex gap-1" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className="size-4 fill-[#c9903f] text-[#c9903f]"
                      aria-hidden
                    />
                  ))}
                </div>
                <p className="mt-4 font-[family-name:var(--font-calypso-display)] text-xl leading-snug italic">
                  “{t.quote}”
                </p>
                <footer className="mt-5 text-[13px] font-medium tracking-wide text-[#211812]/55 uppercase">
                  {t.name}
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ————————————— Visit / Reserve ————————————— */
function Visit() {
  const [sent, setSent] = useState(false)
  return (
    <section
      id="visit"
      className="relative overflow-hidden bg-[#120c07] text-[#f6ecdc]"
    >
      <Image
        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1800&auto=format&fit=crop"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-25"
        loading="lazy"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#120c07] via-[#120c07]/85 to-[#120c07]/40"
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-24 md:px-10 md:py-36 lg:grid-cols-2">
        <div>
          <Reveal>
            <Eyebrow>Visit us</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-[family-name:var(--font-calypso-display)] text-4xl font-medium md:text-6xl">
              Your table is{" "}
              <span className="text-[#e9c07a] italic">waiting.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-10 space-y-5 text-[15px]">
              <li>
                <a
                  href={CALYPSO.maps}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex gap-4 focus-visible:outline-2 focus-visible:outline-[#e9c07a]"
                >
                  <MapPin
                    className="mt-0.5 size-5 shrink-0 text-[#c9903f]"
                    aria-hidden
                  />
                  <span>
                    {CALYPSO.address}
                    <span className="block text-sm text-[#f6ecdc]/55 underline-offset-4 group-hover:underline">
                      Get directions →
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={CALYPSO.phoneHref}
                  className="flex gap-4 focus-visible:outline-2 focus-visible:outline-[#e9c07a]"
                >
                  <Phone
                    className="mt-0.5 size-5 shrink-0 text-[#c9903f]"
                    aria-hidden
                  />
                  {CALYPSO.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CALYPSO.email}`}
                  className="flex gap-4 break-all focus-visible:outline-2 focus-visible:outline-[#e9c07a]"
                >
                  <Mail
                    className="mt-0.5 size-5 shrink-0 text-[#c9903f]"
                    aria-hidden
                  />
                  {CALYPSO.email}
                </a>
              </li>
              <li className="flex gap-4">
                <Clock
                  className="mt-0.5 size-5 shrink-0 text-[#c9903f]"
                  aria-hidden
                />
                <span>
                  Open daily — dine-in & outdoor seating
                  <span className="block text-sm text-[#f6ecdc]/55">
                    Call ahead for large groups & celebrations.
                  </span>
                </span>
              </li>
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex gap-3">
              <a
                href={CALYPSO.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Calypso on Instagram"
                className="inline-flex items-center gap-2 rounded-full border border-[#f6ecdc]/25 px-5 py-2.5 text-sm transition hover:border-[#c9903f] hover:bg-[#c9903f] hover:text-[#120c07] focus-visible:outline-2 focus-visible:outline-[#e9c07a]"
              >
                <Instagram className="size-4" aria-hidden /> @calypso.egypt
              </a>
              <a
                href={CALYPSO.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Calypso on Facebook"
                className="inline-flex items-center gap-2 rounded-full border border-[#f6ecdc]/25 px-5 py-2.5 text-sm transition hover:border-[#c9903f] hover:bg-[#c9903f] hover:text-[#120c07] focus-visible:outline-2 focus-visible:outline-[#e9c07a]"
              >
                <Facebook className="size-4" aria-hidden /> Facebook
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="rounded-[2rem] bg-[#faf5ea] p-7 text-[#211812] shadow-2xl md:p-9">
            {sent ? (
              <div role="status" className="py-10 text-center">
                <p className="font-[family-name:var(--font-calypso-display)] text-3xl">
                  Shukran! 🎉
                </p>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#211812]/65">
                  Your request is ready — tap below to send it to us instantly
                  on the phone line, and we’ll confirm your table.
                </p>
                <a
                  href={CALYPSO.phoneHref}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#211812] px-6 py-3 text-sm font-semibold text-[#faf5ea] transition hover:bg-[#a96f2c]"
                >
                  Call {CALYPSO.phoneDisplay}
                </a>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 block w-full text-sm text-[#211812]/55 underline underline-offset-4"
                >
                  Make another request
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
                aria-label="Reserve a table"
              >
                <h3 className="font-[family-name:var(--font-calypso-display)] text-2xl">
                  Reserve a table
                </h3>
                <p className="mt-1 text-sm text-[#211812]/60">
                  We reply fastest by phone — this form prepares your request.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-medium">
                    Name
                    <input
                      required
                      name="name"
                      autoComplete="name"
                      placeholder="Your name"
                      className="rounded-xl border border-[#211812]/15 bg-white px-4 py-3 font-normal transition outline-none focus:border-[#a96f2c] focus:ring-2 focus:ring-[#a96f2c]/25"
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium">
                    Phone
                    <input
                      required
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="01x xxxx xxxx"
                      className="rounded-xl border border-[#211812]/15 bg-white px-4 py-3 font-normal transition outline-none focus:border-[#a96f2c] focus:ring-2 focus:ring-[#a96f2c]/25"
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium">
                    Guests
                    <input
                      name="guests"
                      type="number"
                      min={1}
                      max={40}
                      defaultValue={2}
                      className="rounded-xl border border-[#211812]/15 bg-white px-4 py-3 font-normal transition outline-none focus:border-[#a96f2c] focus:ring-2 focus:ring-[#a96f2c]/25"
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium">
                    Seating
                    <select
                      name="seating"
                      className="rounded-xl border border-[#211812]/15 bg-white px-4 py-3 font-normal transition outline-none focus:border-[#a96f2c] focus:ring-2 focus:ring-[#a96f2c]/25"
                    >
                      <option>Terrace (outdoor)</option>
                      <option>Indoor</option>
                      <option>No preference</option>
                    </select>
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
                    Anything we should know?
                    <textarea
                      name="notes"
                      rows={3}
                      placeholder="Birthday, shisha preference, quiet corner…"
                      className="resize-none rounded-xl border border-[#211812]/15 bg-white px-4 py-3 font-normal transition outline-none focus:border-[#a96f2c] focus:ring-2 focus:ring-[#a96f2c]/25"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#211812] px-6 py-3.5 text-sm font-semibold text-[#faf5ea] transition hover:bg-[#a96f2c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a96f2c]"
                >
                  Request reservation{" "}
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
      <footer className="relative border-t border-[#f6ecdc]/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-[13px] text-[#f6ecdc]/50 md:flex-row md:px-10">
          <p className="font-[family-name:var(--font-calypso-display)] text-lg text-[#f6ecdc]">
            Calypso{" "}
            <span className="text-[#c9903f] italic">Café & Restaurant</span>
          </p>
          <p>
            Menu highlights shown — ask our team for today’s full menu. ©{" "}
            {new Date().getFullYear()} Calypso Egypt.
          </p>
          <a
            href="#top"
            className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#e9c07a]"
          >
            Back to top ↑
          </a>
        </div>
      </footer>
    </section>
  )
}

export function CalypsoSite() {
  useSmoothScroll()
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease }}
      className="bg-[#120c07] font-[family-name:var(--font-calypso-body)] text-[#f6ecdc] selection:bg-[#c9903f] selection:text-[#120c07]"
    >
      <a
        href="#menu"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-[#faf5ea] focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[#211812]"
      >
        Skip to menu
      </a>
      <Nav />
      <Hero />
      <Marquee />
      <Story />
      <MenuSection />
      <Moments />
      <Visit />
    </motion.main>
  )
}
