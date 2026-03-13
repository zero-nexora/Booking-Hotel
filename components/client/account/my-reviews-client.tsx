"use client";

import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
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

const REVIEW_STATUS_MAP: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    color: string;
  }
> = {
  PENDING: {
    label: "Chờ duyệt",
    variant: "secondary",
    color: "text-amber-500",
  },
  APPROVED: { label: "Đã duyệt", variant: "default", color: "text-primary" },
  REJECTED: {
    label: "Bị từ chối",
    variant: "destructive",
    color: "text-destructive",
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
      <h1 className="text-lg font-semibold">Đánh giá của tôi</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border bg-card py-14 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <MessageSquarePlus className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-sm">Bạn chưa có đánh giá nào</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Đánh giá sẽ xuất hiện sau khi bạn hoàn thành chuyến lưu trú
            </p>
          </div>
          <Button size="sm" className="rounded-xl mt-1" asChild>
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
                className="rounded-2xl border bg-card p-4 space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {review.hotel.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                        <CalendarDays className="w-3 h-3" />
                        <span>
                          {format(
                            new Date(review.booking.checkIn),
                            "dd/MM/yyyy",
                            { locale: vi },
                          )}
                          {" – "}
                          {format(
                            new Date(review.booking.checkOut),
                            "dd/MM/yyyy",
                            { locale: vi },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={statusInfo.variant}
                    className="text-xs shrink-0"
                  >
                    {statusInfo.label}
                  </Badge>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3.5 h-3.5",
                        i < review.overallRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/20",
                      )}
                    />
                  ))}
                  <span className="text-xs font-medium ml-1">
                    {review.overallRating}/5
                  </span>
                </div>

                {/* Content */}
                {review.title && (
                  <p className="font-semibold text-sm">{review.title}</p>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {review.comment}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {format(new Date(review.createdAt), "dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </div>
                  {review.status === "REJECTED" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-7 rounded-lg gap-1 text-muted-foreground"
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
}
