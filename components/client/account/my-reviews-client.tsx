"use client";

import Link from "next/link";
import {
  Star,
  Building2,
  CalendarDays,
  Loader2,
  MessageSquarePlus,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useInfiniteScroll } from "@/hooks/use-infinity-scroll";
import { useMyReviews } from "@/hooks/client/use-reviews";
import { formatDateShort } from "@/lib/utils";

const REVIEW_STATUS_MAP: Record<string, { label: string; className: string }> =
  {
    PENDING: {
      label: "Chờ duyệt",
      className: "bg-secondary text-secondary-foreground border-border",
    },
    APPROVED: {
      label: "Đã duyệt",
      className: "bg-primary/10 text-primary border-primary/20",
    },
    REJECTED: {
      label: "Bị từ chối",
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
  };

export const MyReviewsClient = () => {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useMyReviews();
  const { sentinelRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const reviews = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="space-y-5">
      <h1 className="text-lg font-semibold text-foreground">
        Đánh giá của tôi
      </h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl bg-muted" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card py-14 flex flex-col items-center gap-3 text-center shadow-none">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <MessageSquarePlus className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-sm text-foreground">
              Bạn chưa có đánh giá nào
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Đánh giá sẽ xuất hiện sau khi bạn hoàn thành chuyến lưu trú
            </p>
          </div>
          <Button
            size="sm"
            className="rounded-xl mt-1 bg-primary text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <Link href="/account/bookings">Xem đặt phòng của tôi</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => {
            const statusInfo =
              REVIEW_STATUS_MAP[review.status] ?? REVIEW_STATUS_MAP.PENDING;

            return (
              <div
                key={review.id}
                className="rounded-2xl border border-border bg-card shadow-none p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate text-foreground">
                        {review.hotel.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                        <CalendarDays className="w-3 h-3" />
                        <span>
                          {formatDateShort(review.booking.checkIn)}
                          {" – "}
                          {formatDateShort(review.booking.checkOut)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs shrink-0 font-medium",
                      statusInfo.className,
                    )}
                  >
                    {statusInfo.label}
                  </Badge>
                </div>

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3.5 h-3.5",
                        i < review.overallRating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground/20",
                      )}
                    />
                  ))}
                  <span className="text-xs font-medium ml-1 text-foreground">
                    {review.overallRating}/5
                  </span>
                </div>

                {review.title && (
                  <p className="font-semibold text-sm text-foreground">
                    {review.title}
                  </p>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {review.comment}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatDateShort(review.createdAt)}
                  </div>
                  {review.status === "REJECTED" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-7 rounded-lg gap-1 text-muted-foreground hover:text-foreground hover:bg-muted"
                      asChild
                    >
                      <Link
                        href={`/account/bookings/${review.booking.bookingRef}/review`}
                      >
                        Viết lại
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div ref={sentinelRef} className="h-2" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      )}
      {!hasNextPage && reviews.length > 5 && (
        <p className="text-center text-xs text-muted-foreground py-2">
          Đã hiển thị tất cả {reviews.length} đánh giá
        </p>
      )}
    </div>
  );
};
