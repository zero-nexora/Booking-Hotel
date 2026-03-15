import type { Metadata } from "next";
import { Cormorant, Nunito_Sans } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css";
import { AppProviders } from "@/components/providers/app-providers";

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Staywise — Khách sạn tốt nhất, giá tốt nhất",
    template: "%s · Staywise",
  },
  description:
    "Đặt phòng khách sạn cao cấp với giá tốt nhất. Hơn 50,000 khách sạn trên toàn thế giới.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${nunitoSans.variable} font-sans antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
