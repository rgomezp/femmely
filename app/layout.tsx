/* eslint-disable @next/next/no-page-custom-font -- Material Symbols is not in next/font/google; link tag loads the icon font reliably */
import type { Metadata } from "next";
import { Manrope, Noto_Serif } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-noto-serif",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: {
    default: "Femmely — Fashion discovery & size guide",
    template: "%s | Femmely",
  },
  description:
    "Curated outfit boards with shoppable Amazon finds and men's-to-women's sizing tools across shoes, apparel, and more.",
  openGraph: {
    type: "website",
    siteName: "Femmely",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        />
      </head>
      <body className={`${notoSerif.variable} ${manrope.variable} font-body bg-surface text-on-surface`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
