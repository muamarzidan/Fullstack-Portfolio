import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { ThemeProvider } from "../../contexts/ThemeContext";
import ToastProvider from "../../components/ToasterProvider";
import "./globals.css";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "MuzirO - Portfolio",
  description:
    "Fullstack Developer Portfolio built with Next.js, PostgreSQL, and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors`}
      >
        <ToastProvider />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
};