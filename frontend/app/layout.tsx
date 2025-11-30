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
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 6000,
            style: {
              background: "#F7F7F5",
              color: "#121212",
              borderRadius: "0px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
              padding: "16px 20px",
              fontWeight: 600,
              fontSize: "14px",
              letterSpacing: "0.01em",
              maxWidth: "400px",
            },
            success: {
              style: {
                background: "#F7F7F5",
                borderLeft: "4px solid #4AA5A2",
              },
              iconTheme: {
                primary: "#4AA5A2",
                secondary: "#F7F7F5",
              },
            },
            error: {
              style: {
                background: "#F7F7F5",
                borderLeft: "4px solid #E97F8A",
              },
              iconTheme: {
                primary: "#E97F8A",
                secondary: "#F7F7F5",
              },
            },
          }}
        />
        <OrderNotifications />
        {children}
      </body>
    </html>
  );
}
