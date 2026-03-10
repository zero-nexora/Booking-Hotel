import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css";
import { AppProviders } from "@/components/providers/app-providers";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Staywise — Khách sạn tốt nhất, giá tốt nhất",
    template: "%s · Staywise",
  },
  description: "Đặt phòng khách sạn cao cấp với giá tốt nhất. Hơn 50,000 khách sạn trên toàn thế giới.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${playfair.variable} ${jakarta.variable} font-sans antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}