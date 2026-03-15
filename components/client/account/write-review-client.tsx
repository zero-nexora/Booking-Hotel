"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Star,
  Building2,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn, formatDateShort } from "@/lib/utils";
import {
  useCreateReview,
  useReviewForBooking,
} from "@/hooks/client/use-reviews";

const reviewSchema = z.object({
  overallRating: z.number().int().min(1, "Vui lòng chọn điểm đánh giá").max(5),
  title: z.string().max(200).optional(),
  comment: z.string().min(10, "Nhận xét phải có ít nhất 10 ký tự"),
});

type ReviewValues = z.infer<typeof reviewSchema>;

const RATING_LABELS: Record<number, string> = {
  1: "Tệ",
  2: "Không tốt",
  3: "Bình thường",
  4: "Tốt",
  5: "Tuyệt vời",
};

interface WriteReviewClientProps {
  bookingRef: string;
}

export const WriteReviewClient = ({ bookingRef }: WriteReviewClientProps) => {
  const router = useRouter();
  const { data, isLoading } = useReviewForBooking(bookingRef);
  const createReview = useCreateReview(bookingRef);
  const [hoveredStar, setHoveredStar] = useState(0);

  const form = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { overallRating: 0, title: "", comment: "" },
  });

  const rating = form.watch("overallRating");

  const handleSubmit = async (values: ReviewValues) => {
    await createReview.mutateAsync({ bookingRef, ...values });
    router.push(`/account/bookings/${bookingRef}`);
  };

  if (isLoading) return <WriteReviewSkeleton />;
  if (!data) return null;

  if (data.review) {
    return (
      <div className="space-y-5">
        <BackLink bookingRef={bookingRef} />
        <div className="rounded-2xl border border-border bg-card shadow-none p-8 flex flex-col items-center gap-3 text-center">
          <CheckCircle2 className="w-10 h-10 text-primary" />
          <h2 className="font-semibold text-foreground">
            Bạn đã gửi đánh giá này rồi
          </h2>
          <p className="text-sm text-muted-foreground">
            Cảm ơn bạn đã chia sẻ trải nghiệm.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl mt-1 border-border text-foreground hover:bg-muted"
            asChild
          >
            <Link href="/account/reviews">Xem đánh giá của tôi</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (data.status !== "CHECKED_OUT") {
    return (
      <div className="space-y-5">
        <BackLink bookingRef={bookingRef} />
        <div className="rounded-2xl border border-border bg-muted/40 p-8 flex flex-col items-center gap-3 text-center">
          <Info className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Bạn chỉ có thể đánh giá sau khi check-out.
          </p>
        </div>
      </div>
    );
  }

  const item = data.items[0];

  return (
    <div className="space-y-5">
      <BackLink bookingRef={bookingRef} />

      <h1 className="text-lg font-semibold text-foreground">Viết đánh giá</h1>

      <div className="rounded-2xl border border-border bg-card shadow-none p-4 space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
          Bạn đang đánh giá chuyến đi
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="font-semibold text-sm text-foreground">
              {data.hotel.name}
            </span>
          </div>
          {item && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BedDouble className="w-3.5 h-3.5 shrink-0" />
              <span>{item.room.name}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="w-3.5 h-3.5 shrink-0" />
            <span>
              {formatDateShort(data.checkIn)}
              {" → "}
              {formatDateShort(data.checkOut)}
            </span>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <div className="rounded-2xl border border-border bg-card shadow-none p-5 space-y-5">
            <FormField
              control={form.control}
              name="overallRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">
                    Điểm đánh giá tổng thể
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const value = i + 1;
                          const filled = value <= (hoveredStar || field.value);
                          return (
                            <button
                              key={i}
                              type="button"
                              onMouseEnter={() => setHoveredStar(value)}
                              onMouseLeave={() => setHoveredStar(0)}
                              onClick={() => field.onChange(value)}
                              className="p-0.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                              <Star
                                className={cn(
                                  "w-8 h-8",
                                  filled
                                    ? "fill-primary text-primary"
                                    : "text-muted-foreground/30 hover:text-primary/50",
                                )}
                              />
                            </button>
                          );
                        })}
                        {(hoveredStar || field.value) > 0 && (
                          <span className="text-sm font-medium text-muted-foreground ml-1">
                            {RATING_LABELS[hoveredStar || field.value]}
                          </span>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <Separator className="bg-border" />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">
                    Tiêu đề{" "}
                    <span className="text-muted-foreground font-normal">
                      (tuỳ chọn)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tóm tắt trải nghiệm của bạn..."
                      maxLength={200}
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">
                    Nhận xét chi tiết
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Chia sẻ chi tiết về phòng, dịch vụ, vị trí, vệ sinh..."
                      rows={5}
                      className="resize-none bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex items-center justify-between">
                    <FormMessage className="text-destructive" />
                    <span className="text-xs text-muted-foreground ml-auto">
                      {field.value?.length ?? 0} ký tự
                    </span>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/40 border border-border rounded-xl px-4 py-3">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <p>
              Đánh giá sẽ được kiểm duyệt trước khi hiển thị công khai. Thời
              gian xét duyệt thường từ 1-2 ngày làm việc.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl h-11 bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={createReview.isPending || rating === 0}
          >
            {createReview.isPending ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

const BackLink = ({ bookingRef }: { bookingRef: string }) => (
  <Button
    variant="ghost"
    size="sm"
    className="gap-1.5 -ml-2 h-8 text-muted-foreground hover:text-foreground hover:bg-muted"
    asChild
  >
    <Link href={`/account/bookings/${bookingRef}`}>
      <ArrowLeft className="w-3.5 h-3.5" />
      Chi tiết đặt phòng
    </Link>
  </Button>
);

const WriteReviewSkeleton = () => (
  <div className="space-y-5">
    <Skeleton className="h-8 w-36 bg-muted" />
    <Skeleton className="h-6 w-32 bg-muted" />
    <Skeleton className="h-28 rounded-2xl bg-muted" />
    <Skeleton className="h-64 rounded-2xl bg-muted" />
  </div>
);
