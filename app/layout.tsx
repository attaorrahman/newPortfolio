import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "M. Atta Ur Rahman — Front-End Developer",
  description:
    "Portfolio of M. Atta Ur Rahman, a Front-End Developer based in Lahore with 3+ years of experience in React.js, Next.js and Node.js.",
  icons: {
    icon: "/AR-Logo.svg",
    shortcut: "/AR-Logo.svg",
    apple: "/AR-Logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
