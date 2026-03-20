"use client";

import { Star, Quote } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useHighlightedReviews } from "@/hooks/client/use-home";
import { formatDateFull } from "@/lib/utils";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const ReviewsHighlight = () => {
  const { data: reviews, isLoading } = useHighlightedReviews();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {reviews?.map((review) => (
        <motion.div
          key={review.id}
          variants={cardVariants}
          className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4 relative"
        >
          <Quote className="w-6 h-6 text-primary/20 absolute top-4 right-4" />
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < review.overallRating
                    ? "fill-primary text-primary"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          {review.title && (
            <p className="font-semibold text-sm line-clamp-1 text-foreground">
              {review.title}
            </p>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
            {review.comment}
          </p>
          <div className="flex items-center gap-2.5 pt-3 border-t border-border">
            <Avatar className="w-8 h-8">
              <AvatarImage src={review.user.image ?? undefined} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {review.user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate text-foreground">
                {review.user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {review.hotel.name}
              </p>
            </div>
            <p className="text-xs text-muted-foreground shrink-0">
              {formatDateFull(review.createdAt)}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
