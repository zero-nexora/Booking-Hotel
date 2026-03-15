"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/shared/pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import { StarRating } from "@/components/shared/star-rating";
import { adminReviewParsers } from "@/lib/search-params/admin-reviews";
import { CheckCircle2, XCircle } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useCallback } from "react";
import { RouterOutput } from "@/trpc/client";
import { ReviewStatus } from "@/generated/prisma/enums";
import {
  useAdminReviewList,
  useUpdateReviewStatus,
} from "@/hooks/admin/use-admin-reviews";
import { formatDatetime } from "@/lib/utils";

type Review = RouterOutput["admin"]["review"]["list"]["items"][number];

const ReviewCardSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <Skeleton key={i} className="h-28 bg-muted" />
    ))}
  </div>
);

interface ReviewCardProps {
  review: Review;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isPending: boolean;
}

const ReviewCard = ({
  review,
  onApprove,
  onReject,
  isPending,
}: ReviewCardProps) => (
  <Card className="bg-card border-border shadow-none">
    <CardContent className="pt-4 space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm text-foreground">
              {review.user.name}
            </p>
            <StarRating value={review.overallRating} readonly size="xs" />
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDatetime(review.createdAt)}
          </p>
        </div>
        <StatusBadge status={review.status} type="review" />
      </div>
      {review.title && (
        <p className="text-sm font-medium text-foreground">{review.title}</p>
      )}
      <p className="text-sm text-muted-foreground line-clamp-3">
        {review.comment}
      </p>
      {review.status === "PENDING" && (
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="border-border text-primary hover:bg-primary/10 hover:text-primary"
            disabled={isPending}
            onClick={() => onApprove(review.id)}
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Duyệt
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
            disabled={isPending}
            onClick={() => onReject(review.id)}
          >
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Từ chối
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
);

interface HotelReviewsTabProps {
  hotelId: string;
}

export const HotelReviewsTab = ({ hotelId }: HotelReviewsTabProps) => {
  const [params, setParams] = useQueryStates(adminReviewParsers);
  const { data, isLoading } = useAdminReviewList({ ...params, hotelId });
  const updateStatus = useUpdateReviewStatus();

  const handleTabChange = useCallback(
    (v: string) =>
      setParams({ status: v === "all" ? null : (v as ReviewStatus), page: 1 }),
    [setParams],
  );

  const handleApprove = useCallback(
    (id: string) => updateStatus.mutateAsync({ id, status: "APPROVED" }),
    [updateStatus],
  );

  const handleReject = useCallback(
    (id: string) => updateStatus.mutateAsync({ id, status: "REJECTED" }),
    [updateStatus],
  );

  const handlePageChange = useCallback(
    (p: number) => setParams({ page: p }),
    [setParams],
  );

  const handleLimitChange = useCallback(
    (l: number) => setParams({ limit: l, page: 1 }),
    [setParams],
  );

  return (
    <div className="space-y-4">
      <Tabs value={params.status ?? "all"} onValueChange={handleTabChange}>
        <TabsList className="bg-muted border-border">
          {[
            { value: "all", label: "Tất cả" },
            { value: "PENDING", label: "Chờ duyệt" },
            { value: "APPROVED", label: "Đã duyệt" },
            { value: "REJECTED", label: "Từ chối" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <ReviewCardSkeleton />
      ) : data?.items.length === 0 ? (
        <Card className="bg-card border-border shadow-none flex items-center justify-center h-32 text-muted-foreground text-sm">
          Chưa có đánh giá nào
        </Card>
      ) : (
        <div className="space-y-3">
          {data?.items.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onApprove={handleApprove}
              onReject={handleReject}
              isPending={updateStatus.isPending}
            />
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <Pagination
          page={params.page}
          totalPages={data.totalPages}
          total={data.total}
          limit={params.limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}
    </div>
  );
};
