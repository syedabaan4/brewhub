import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import OrderNotifications from "@/components/OrderNotifications";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brewhub - Coffee Ordering Platform",
  description: "Order your favorite coffee online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Toaster position="top-right" />
        <OrderNotifications />
        {children}
      </body>
    </html>
  );
}
