"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const RATING_LABELS: Record<number, string> = {
  1: "Rất tệ",
  2: "Tệ",
  3: "Bình thường",
  4: "Tốt",
  5: "Xuất sắc",
};

const reviewSchema = z.object({
  overallRating: z.number().min(1, "Vui lòng chọn điểm đánh giá").max(5),
  title: z.string().max(100).optional(),
  comment: z.string().min(10, "Tối thiểu 10 ký tự").max(2000),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  onSubmit: (data: ReviewFormValues) => Promise<void>;
  isPending: boolean;
}

export const ReviewForm = ({ onSubmit, isPending }: ReviewFormProps) => {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { overallRating: 0, title: "", comment: "" },
  });

  const rating = form.watch("overallRating");
  const comment = form.watch("comment");
  const title = form.watch("title") ?? "";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="overallRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Điểm tổng thể</FormLabel>
              <FormControl>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => field.onChange(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={cn(
                            "w-8 h-8",
                            star <= field.value
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground",
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <span className="text-sm font-medium">
                      {RATING_LABELS[rating]}
                    </span>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between">
                <FormLabel>Tiêu đề (tuỳ chọn)</FormLabel>
                <span className="text-xs text-muted-foreground">
                  {title.length}/100
                </span>
              </div>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Tóm tắt trải nghiệm của bạn..."
                  maxLength={100}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between">
                <FormLabel>Nội dung đánh giá</FormLabel>
                <span className="text-xs text-muted-foreground">
                  {comment.length}/2000
                </span>
              </div>
              <FormControl>
                <Textarea
                  {...field}
                  rows={5}
                  maxLength={2000}
                  placeholder="Chia sẻ trải nghiệm của bạn về khách sạn, phòng, dịch vụ..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isPending || rating === 0 || comment.length < 10}
        >
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Gửi đánh giá
        </Button>
      </form>
    </Form>
  );
};
