import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/common/logo";
import authPanelDark from "@/public/images/auth-panel-dark.svg";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = async ({ children }: AuthLayoutProps) => {
  const session = await getSession();
  if (session) redirect("/");
  return (
    <div className="min-h-screen flex bg-background">
      <AuthPanel />
      <div className="flex-1 flex flex-col min-h-screen lg:px-12 px-6">
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

const AuthPanel = () => {
  return (
    <aside className="box-hidden w-120 shrink-0 flex-col relative overflow-hidden bg-card border-r border-border">
      <div className="absolute inset-0">
        <Image
          src={authPanelDark}
          alt=""
          fill
          className="object-cover object-center opacity-60"
          priority
          aria-hidden="true"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.14 0.015 60 / 0.6) 0%, oklch(0.65 0.09 75 / 0.15) 50%, oklch(0.14 0.015 60 / 0.7) 100%)",
          }}
        />
      </div>
      <div className="relative z-10 flex flex-col h-full p-10">
        <Link href="/" aria-label="Staywise — về trang chủ">
          <Logo />
        </Link>
        <div className="mt-auto">
          <blockquote className="text-lg font-medium text-secondary-foreground leading-relaxed">
            &quot;Mỗi chuyến đi là một câu chuyện. Chúng tôi giúp bạn viết nên
            những trang đẹp nhất.&quot;
          </blockquote>
          <p className="mt-4 text-sm text-secondary-foreground font-medium tracking-wide uppercase">
            — Staywise
          </p>
        </div>
      </div>
    </aside>
  );
};
