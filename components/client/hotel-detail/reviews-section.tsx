"use client";

import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useHotelReviews } from "@/hooks/client/use-hotels";
import { Card } from "@/components/ui/card";
import { formatDateShort } from "@/lib/utils";
import { LoadMoreTrigger } from "@/components/common/load-more-trigger";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ReviewsSectionProps {
  hotelId: string;
  avgRating: number | null;
  reviewCount: number;
}

const RatingBar = ({ star, pct }: { star: number; pct: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div key={star} className="flex items-center gap-2">
      <span className="text-xs w-3 text-muted-foreground">{star}</span>
      <Star className="w-3 h-3 fill-primary text-primary" />
      <div
        ref={ref}
        className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden"
      >
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: inView ? `${pct}%` : 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: star * 0.06 }}
        />
      </div>
    </div>
  );
};

export const ReviewsSection = ({
  hotelId,
  avgRating,
  reviewCount,
}: ReviewsSectionProps) => {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useHotelReviews(hotelId);

  const reviews = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="space-y-5">
      {avgRating !== null && (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/40 border border-border">
          <div className="text-center">
            <p className="text-4xl font-bold text-foreground">
              {avgRating.toFixed(1)}
            </p>
            <div className="flex items-center justify-center gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(avgRating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {reviewCount} đánh giá
            </p>
          </div>
          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter(
                (r) => r.overallRating === star,
              ).length;
              const pct = reviews.length ? (count / reviews.length) * 100 : 0;
              return <RatingBar key={star} star={star} pct={pct} />;
            })}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl bg-muted" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <Card className="bg-card border-border text-center py-10 text-sm text-muted-foreground">
          Chưa có đánh giá nào cho khách sạn này.
        </Card>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, ease: "easeOut" },
                },
              }}
            >
              <Card className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-3 relative shadow-none">
                <Quote className="w-5 h-5 text-primary/15 absolute top-3 right-3" />
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < review.overallRating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground/20"
                      }`}
                    />
                  ))}
                </div>
                {review.title && (
                  <p className="font-semibold text-sm leading-tight text-foreground">
                    {review.title}
                  </p>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 flex-1">
                  {review.comment}
                </p>
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={review.user.image ?? undefined} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {review.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate text-foreground">
                      {review.user.name}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground shrink-0">
                    {formatDateShort(review.createdAt)}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <LoadMoreTrigger
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />

      {!hasNextPage && reviews.length > 0 && (
        <p className="text-center text-xs text-muted-foreground py-6">
          Đã hiển thị tất cả {reviews.length} đánh giá
        </p>
      )}
    </div>
  );
};
