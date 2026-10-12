
import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";


import "../globals.css";
import { routing } from "@/i18n/routing";
import AppProviders from "@/structure/providers/app-providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const arabicFont = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SmartDM AI",
    template: "%s | SmartDM AI",
  },
  description:
    "Manage your conversations, customers, and AI-powered workflows with SmartDM AI.",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }



  const messages = await getMessages();
  const isArabic = locale === "ar";

  return (
    <html lang={locale} dir={isArabic ? "rtl" : "ltr"}>
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          arabicFont.variable,
          "min-h-full antialiased",
          isArabic ? "font-arabic" : "font-sans",
        ].join(" ")}
      >
        <NextIntlClientProvider messages={messages}>
         <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
