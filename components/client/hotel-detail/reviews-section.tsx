"use client";

import { Star, Loader2, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useHotelReviews } from "@/hooks/client/use-hotels";
import { useInfiniteScroll } from "@/hooks/use-infinity-scroll";
import { Card } from "@/components/ui/card";
import { formatDateShort } from "@/lib/utils";

interface ReviewsSectionProps {
  hotelId: string;
  avgRating: number | null;
  reviewCount: number;
}

export const ReviewsSection = ({
  hotelId,
  avgRating,
  reviewCount,
}: ReviewsSectionProps) => {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useHotelReviews(hotelId);
  const { sentinelRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

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
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs w-3 text-muted-foreground">
                    {star}
                  </span>
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-4">
                    {count}
                  </span>
                </div>
              );
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <Card
              key={review.id}
              className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-3 relative shadow-none"
            >
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
          ))}
        </div>
      )}

      <div ref={sentinelRef} className="h-2" />

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
};
