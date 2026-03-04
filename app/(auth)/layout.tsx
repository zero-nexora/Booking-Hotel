"use client";

import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/common/logo";
import authBg from "../../public/images/auth-bg.png";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative box-hidden lg:flex flex-col bg-muted overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={authBg}
            alt="Luxury hotel"
            fill
            className="object-cover"
            preload
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/20 to-black/70" />
        </div>

        <div className="relative z-10 p-8">
          <Link href="/"><Logo /></Link>
        </div>

        <div className="relative z-10 mt-auto p-10">
          <blockquote className="space-y-3">
            <p className="text-3xl font-semibold leading-snug text-white">
              Nơi mỗi kỳ nghỉ trở thành{" "}
              <span className="text-primary-foreground/80 italic">
                ký ức không quên
              </span>
            </p>
            <p className="text-sm text-white/70 font-medium tracking-wide uppercase">
              Đặt phòng khách sạn cao cấp trên toàn quốc
            </p>
          </blockquote>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
