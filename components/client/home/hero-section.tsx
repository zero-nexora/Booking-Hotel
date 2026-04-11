import { HeroSearch } from "./hero-search";
import Image from "next/image";
import HeroBannerDark from "@/public/images/hero-banner-dark.svg";
import HeroBannerLight from "@/public/images/hero-banner-light.svg";
import { useTheme } from "next-themes";
import { CountUp } from "@/components/common/count-up";
import { motion, Variants } from "framer-motion";
import { BookOpen, Globe, Smartphone, Star } from "lucide-react";

const STATS = [
  { value: 80, suffix: "%", label: "Đặt phòng trực tuyến", icon: Globe },
  { value: 70, suffix: "%", label: "Khách dùng di động", icon: Smartphone },
  { value: 5, suffix: "/5", label: "Đánh giá trung bình", icon: Star },
  { value: 95, suffix: "%", label: "Đọc review trước khi đặt", icon: BookOpen },
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-10 py-36 text-center space-y-6">
        <motion.div
          className="space-y-4"
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium tracking-wide uppercase">
            <Star size={11} className="fill-primary" />
            Nền tảng đặt phòng hàng đầu
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
            Tìm khách sạn
            <br />
            <span className="text-primary">hoàn hảo cho bạn</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            Hàng nghìn khách sạn cao cấp — giá tốt nhất, đặt phòng trong vài
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
          className="flex justify-center gap-6 sm:gap-10 mt-10 flex-wrap"
          variants={statsContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {STATS.map(({ value, label, suffix, icon: Icon }) => (
            <motion.div
              key={label}
              variants={statItemVariants}
              className="flex items-center gap-3 bg-background/60 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary shrink-0">
                <Icon size={18} />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold text-foreground leading-none">
                  <CountUp to={value} triggerOnView />
                  {suffix}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
