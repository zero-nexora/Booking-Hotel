"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/shared/pagination";
import { adminReviewParsers } from "@/lib/search-params/admin-reviews";
import { CheckCircle2, XCircle, Star } from "lucide-react";
import { format } from "date-fns";
import { useQueryStates } from "nuqs";
import { useCallback } from "react";
import { RouterOutput } from "@/trpc/client";
import { ReviewStatus } from "@/generated/prisma/enums";
import {
  useAdminReviewList,
  useUpdateReviewStatus,
} from "@/hooks/admin/use-admin-reviews";

type Review = RouterOutput["admin"]["review"]["list"]["items"][number];

const REVIEW_STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
};

const REVIEW_STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
};

const ReviewCardSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <Skeleton key={i} className="h-28" />
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
  <Card>
    <CardContent className="pt-4 space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">{review.user.name}</p>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: review.overallRating }).map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {format(new Date(review.createdAt), "dd/MM/yyyy HH:mm")}
          </p>
        </div>
        <Badge variant={REVIEW_STATUS_VARIANT[review.status]}>
          {REVIEW_STATUS_LABEL[review.status]}
        </Badge>
      </div>
      {review.title && <p className="text-sm font-medium">{review.title}</p>}
      <p className="text-sm text-muted-foreground line-clamp-3">
        {review.comment}
      </p>
      {review.status === "PENDING" && (
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
            disabled={isPending}
            onClick={() => onApprove(review.id)}
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Duyệt
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-destructive border-destructive/20 hover:bg-destructive/5"
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
      setParams({
        status: v === "all" ? null : (v as ReviewStatus),
        page: 1,
      }),
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
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="PENDING">Chờ duyệt</TabsTrigger>
          <TabsTrigger value="APPROVED">Đã duyệt</TabsTrigger>
          <TabsTrigger value="REJECTED">Từ chối</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <ReviewCardSkeleton />
      ) : data?.items.length === 0 ? (
        <Card className="flex items-center justify-center h-32 text-muted-foreground text-sm">
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
