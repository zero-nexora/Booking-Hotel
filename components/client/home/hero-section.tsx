import React from "react";
import { HeroSearch } from "./hero-search";
import Image from "next/image";
import HeroBannerDark from "@/public/images/hero-banner-dark.svg";
import HeroBannerLight from "@/public/images/hero-banner-light.svg";
import { useTheme } from "next-themes";
import { CountUp } from "@/components/common/count-up";
import { motion, Variants } from "framer-motion";
import { Star } from "lucide-react";

const STATS = [
  { value: 500, suffix: "+", label: "Khách sạn" },
  { value: 50, suffix: "K+", label: "Lượt đặt phòng" },
  { value: 4.9, suffix: "star", label: "Đánh giá" },
  { value: 50, suffix: "+", label: "Thành phố" },
];

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const statsContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const statItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const HeroSection = () => {
  const { resolvedTheme } = useTheme();
  return (
    <div className="relative overflow-hidden">
      <Image
        src={resolvedTheme === "light" ? HeroBannerLight : HeroBannerDark}
        alt="Luxury hotel at night"
        fill
        priority
        className="object-cover object-center"
        quality={90}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 sm:py-36 text-center space-y-6">
        <motion.div
          className="space-y-3"
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            Tìm khách sạn hoàn hảo
            <br />
            <span className="text-primary">cho chuyến đi của bạn</span>
          </h1>
          <p className="text-lg text-secondary-foreground max-w-xl mx-auto">
            Hàng nghìn khách sạn cao cấp, giá tốt nhất, đặt phòng trong vài
            giây.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.15 }}
        >
          <HeroSearch />
        </motion.div>

        <motion.div
          className="flex justify-center gap-8 sm:gap-12 mt-10 flex-wrap"
          variants={statsContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {STATS.map(({ value, label, suffix }) => (
            <motion.div key={label} variants={statItemVariants}>
              <p className="text-3xl font-bold text-primary">
                <div className="flex items-center gap-1">
                  <CountUp to={value} triggerOnView />
                  {suffix === "star" ? (
                    <Star className="fill-primary text-primary" size={28} />
                  ) : (
                    suffix
                  )}
                </div>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
