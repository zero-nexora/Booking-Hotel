import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/common/logo";
import authBg from "@/public/images/auth-bg.jpg";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <AuthPanel />
      <div className="flex items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/" aria-label="Staywise — về trang chủ">
              <Logo />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

const AuthPanel = () => {
  return (
    <aside className="flex flex-col relative bg-slate-950 overflow-hidden box-hidden">
      <div className="absolute inset-0">
        <Image
          src={authBg}
          alt=""
          fill
          className="object-cover object-center opacity-90"
          priority
          aria-hidden="true"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 p-9">
        <Link href="/" aria-label="Staywise — về trang chủ">
          <Logo variant="light" size="lg" />
        </Link>
      </div>

      <div className="relative z-10 mt-auto p-10 pb-12">
        <div
          aria-hidden="true"
          className="w-10 h-px mb-5"
          style={{ background: "rgba(201,168,76,0.75)" }}
        />
        <blockquote className="space-y-3">
          <p className="text-3xl font-semibold leading-[1.3] text-white tracking-tight">
            Nơi mỗi kỳ nghỉ trở thành{" "}
            <em
              className="not-italic"
              style={{ color: "rgba(201,168,76,0.9)" }}
            >
              ký ức không quên
            </em>
          </p>
          <p
            className="text-xs font-medium tracking-[0.2em] uppercase"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Đặt phòng khách sạn cao cấp trên toàn quốc
          </p>
        </blockquote>
        <div className="flex items-center gap-7 mt-8">
          {[
            { value: "500+", label: "Khách sạn" },
            { value: "50K+", label: "Du khách" },
            { value: "4.9★", label: "Đánh giá" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p
                className="text-lg font-bold leading-none"
                style={{ color: "rgba(201,168,76,0.9)" }}
              >
                {value}
              </p>
              <p
                className="text-[11px] mt-0.5 tracking-wide"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
