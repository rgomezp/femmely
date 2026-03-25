/* eslint-disable @next/next/no-page-custom-font -- Material Symbols is not in next/font/google; link tag loads the icon font reliably */
import type { Metadata } from "next";
import { Manrope, Noto_Serif } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import { GoogleAnalyticsRoute } from "@/components/GoogleAnalyticsRoute";
import { Providers } from "@/components/providers";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import { siteUrl } from "@/lib/utils";
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
  metadataBase: new URL(siteUrl()),
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
        {/* FILL must be a range (0..1), not a single 0 — otherwise Google serves a static font and filled icons never render. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap"
        />
      </head>
      <body className={`${notoSerif.variable} ${manrope.variable} font-body bg-surface text-on-surface`}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <Suspense fallback={null}>
          <GoogleAnalyticsRoute />
        </Suspense>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
