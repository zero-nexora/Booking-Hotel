import { Search, BedDouble, CreditCard, KeyRound } from "lucide-react";
import { motion, Variants } from "framer-motion";

const steps = [
  {
    icon: Search,
    title: "Tìm kiếm",
    desc: "Nhập điểm đến, ngày và số khách để xem danh sách khách sạn phù hợp.",
  },
  {
    icon: BedDouble,
    title: "Chọn phòng",
    desc: "So sánh các phòng, tiện nghi và đọc đánh giá từ khách lưu trú.",
  },
  {
    icon: CreditCard,
    title: "Thanh toán",
    desc: "Thanh toán an toàn qua thẻ tín dụng với bảo mật Stripe.",
  },
  {
    icon: KeyRound,
    title: "Check-in",
    desc: "Nhận email xác nhận và đến khách sạn theo giờ check-in đã chọn.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const numberVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      delay: 0.2,
      ease: "easeOut",
    },
  },
};

export const HowItWorks = () => (
  <motion.div
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-60px" }}
  >
    {steps.map((step, i) => {
      const Icon = step.icon;
      return (
        <motion.div
          key={i}
          variants={stepVariants}
          className="relative flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-center gap-2 flex-1">
              <motion.span
                variants={numberVariants}
                className="text-xs font-bold text-muted-foreground/50 tabular-nums"
              >
                0{i + 1}
              </motion.span>
              {i < steps.length - 1 && (
                <div className="box-hidden flex-1 h-px border-t border-dashed border-border" />
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-1 text-foreground">
              {step.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {step.desc}
            </p>
          </div>
        </motion.div>
      );
    })}
  </motion.div>
);
