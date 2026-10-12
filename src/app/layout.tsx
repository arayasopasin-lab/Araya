import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import { NavBar } from "@/components/nav-bar";
import { OrdersProvider } from "@/lib/orders-store";
import "./globals.css";

const thaiFont = IBM_Plex_Sans_Thai({
  variable: "--font-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ระบบติดตามคำสั่งซื้อ | สำนักพิมพ์อมตะ",
  description: "ระบบติดตามคำสั่งซื้อหนังสือจากร้านค้า สำนักพิมพ์อมตะ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${thaiFont.variable} font-sans antialiased`}>
        <OrdersProvider>
          <NavBar />
          <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
        </OrdersProvider>
      </body>
    </html>
  );
}
