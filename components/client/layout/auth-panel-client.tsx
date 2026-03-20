"use client";

import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/common/logo";
import AuthPanelDark from "@/public/images/auth-panel-dark.svg";
import AuthPanelLight from "@/public/images/auth-panel-light.svg";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export const AuthPanelClient = () => {
  const { resolvedTheme } = useTheme();
  return (
    <aside className="box-hidden w-120 shrink-0 flex-col relative overflow-hidden bg-card border-r border-border">
      <div className="absolute inset-0">
        <Image
          src={resolvedTheme === "light" ? AuthPanelLight : AuthPanelDark}
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
        <motion.div
          className="mt-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.3 }}
        >
          <blockquote className="text-lg font-medium text-secondary-foreground leading-relaxed">
            &quot;Mỗi chuyến đi là một câu chuyện. Chúng tôi giúp bạn viết nên
            những trang đẹp nhất.&quot;
          </blockquote>
          <p className="mt-4 text-sm text-secondary-foreground font-medium tracking-wide uppercase">
            — Staywise
          </p>
        </motion.div>
      </div>
    </aside>
  );
};
