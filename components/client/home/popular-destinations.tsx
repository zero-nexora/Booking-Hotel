"use client";

import { useRouter } from "next/navigation";
import { MapPin, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePopularDestinations } from "@/hooks/client/use-home";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export const PopularDestinations = () => {
  const router = useRouter();
  const { data: destinations, isLoading } = usePopularDestinations();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {destinations?.map((dest) => (
        <motion.button
          key={dest.id}
          variants={itemVariants}
          onClick={() =>
            router.push(`/hotels?search=${encodeURIComponent(dest.name)}`)
          }
          className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-primary hover:border-primary text-left"
        >
          <div className="w-9 h-9 rounded-lg bg-primary/10 group-hover:bg-primary-foreground/20 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate text-foreground group-hover:text-primary-foreground">
              {dest.name}
            </p>
            <p className="text-xs text-muted-foreground group-hover:text-primary-foreground/70 flex items-center gap-0.5">
              <Building2 className="w-3 h-3" />
              {dest.hotelCount} khách sạn
            </p>
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
};
