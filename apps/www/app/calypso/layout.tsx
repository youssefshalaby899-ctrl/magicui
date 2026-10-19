import type { Metadata } from "next"
import { Fraunces, Inter } from "next/font/google"

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-calypso-display",
  style: ["normal", "italic"],
  display: "swap",
})
const body = Inter({
  subsets: ["latin"],
  variable: "--font-calypso-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Calypso Café & Restaurant — Cairo",
  description:
    "Calypso Café & Restaurant on El Kafrawi Axis, Cairo: a nice meal, a proper drink and shisha with friends, in a homey, friendly atmosphere. Dine-in & outdoor seating.",
  openGraph: {
    title: "Calypso Café & Restaurant — Cairo",
    description:
      "Where Cairo comes to unwind. Café, restaurant & shisha on El Kafrawi Axis.",
    type: "website",
  },
}

export default function CalypsoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${display.variable} ${body.variable}`}>
      <style>{`
        .calypso-grain{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E");}
        @keyframes calypso-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .calypso-marquee{animation:calypso-marquee 36s linear infinite}
        @media (prefers-reduced-motion: reduce){.calypso-marquee{animation:none}}
      `}</style>
      {children}
    </div>
  )
}
