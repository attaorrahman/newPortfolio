import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import VisitTracker from "@/components/VisitTracker";
import RouteLoader from "@/components/RouteLoader";
import SplashLoader from "@/components/SplashLoader";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://attaurrahman.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "M. Atta Ur Rahman — AI Powered Full-Stack Developer",
    template: "%s | M. Atta Ur Rahman",
  },
  description:
    "AI Powered Full-Stack Developer based in Lahore. 3+ years building responsive React.js, Next.js & Node.js applications — dashboards, APIs, e-commerce and real-time systems.",
  keywords: [
    "Atta Ur Rahman",
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "Frontend Developer Lahore",
    "MERN Stack",
    "TypeScript",
    "Hire Developer Pakistan",
  ],
  authors: [{ name: "M. Atta Ur Rahman", url: siteUrl }],
  creator: "M. Atta Ur Rahman",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "M. Atta Ur Rahman — Portfolio",
    title: "M. Atta Ur Rahman — AI Powered Full-Stack Developer",
    description:
      "3+ years building React, Next.js & Node.js applications. Dashboards, APIs, e-commerce, real-time systems.",
    images: [
      {
        url: "/AR Logo7.png",
        width: 1200,
        height: 630,
        alt: "M. Atta Ur Rahman — Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "M. Atta Ur Rahman — AI Powered Full-Stack Developer",
    description:
      "Full-stack engineer specializing in React, Next.js & Node.js.",
    images: ["/AR Logo7.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1437" },
  ],
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "M. Atta Ur Rahman",
  url: siteUrl,
  image: `${siteUrl}/AR%20Logo7.png`,
  jobTitle: "AI Powered Full-Stack Developer",
  email: "ar416.official@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lahore",
    addressCountry: "PK",
  },
  sameAs: [
    "https://github.com/attaorrahman",
    "https://linkedin.com/in/attaurahman",
  ],
  knowsAbout: [
    "React.js",
    "Next.js",
    "Node.js",
    "TypeScript",
    "MongoDB",
    "REST APIs",
    "Tailwind CSS",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="antialiased">
        <SplashLoader />
        <Suspense fallback={null}>
          <RouteLoader />
        </Suspense>
        {children}
        <VisitTracker />
      </body>
    </html>
  );
}
