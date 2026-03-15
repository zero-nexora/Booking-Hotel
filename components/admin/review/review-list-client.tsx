"use client";

import { useState, useCallback } from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import { Check, X, Eye, Star } from "lucide-react";
import {
  useAdminReviewList,
  useUpdateReviewStatus,
} from "@/hooks/admin/use-admin-reviews";
import { useQueryStates } from "nuqs";
import { adminReviewParsers } from "@/lib/search-params/admin-reviews";
import { RouterOutput } from "@/trpc/client";
import { ReviewStatus } from "@/generated/prisma/enums";
import { ListHeader } from "@/components/shared/list-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";

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

const InlineStars = ({ value }: { value: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < value ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
      />
    ))}
  </div>
);

export const ReviewListClient = () => {
  const [params, setParams] = useQueryStates(adminReviewParsers);
  const [viewReview, setViewReview] = useState<Review | null>(null);
  const { data, isLoading } = useAdminReviewList(params);
  const updateStatus = useUpdateReviewStatus();

  const handleSearchChange = useCallback(
    (v: string) => setParams({ search: v, page: 1 }),
    [setParams],
  );

  const handleTabChange = useCallback(
    (v: string) =>
      setParams({
        status: v === "all" ? null : (v as ReviewStatus),
        page: 1,
      }),
    [setParams],
  );

  const handlePageChange = useCallback(
    (p: number) => setParams({ page: p }),
    [setParams],
  );

  const handleLimitChange = useCallback(
    (l: number) => setParams({ limit: l, page: 1 }),
    [setParams],
  );

  const handleCloseDialog = useCallback(() => setViewReview(null), []);

  return (
    <div className="space-y-4">
      <ListHeader title="Đánh giá" count={data?.total} countLabel="đánh giá">
        <div className="flex flex-wrap gap-3 items-center">
          <SearchInput
            value={params.search}
            onChange={handleSearchChange}
            placeholder="Tìm tên, email, khách sạn..."
            className="w-64"
          />
          <Tabs value={params.status ?? "all"} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="PENDING">Chờ duyệt</TabsTrigger>
              <TabsTrigger value="APPROVED">Đã duyệt</TabsTrigger>
              <TabsTrigger value="REJECTED">Từ chối</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </ListHeader>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khách sạn</TableHead>
              <TableHead>Người dùng</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Booking</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <TableSkeleton cols={9} />
          ) : (
            <TableBody>
              {data?.items.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center text-muted-foreground py-12"
                  >
                    Không có đánh giá nào
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="text-sm font-medium">
                      {review.hotel.name}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{review.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {review.user.email}
                      </p>
                    </TableCell>
                    <TableCell>
                      <InlineStars value={review.overallRating} />
                    </TableCell>
                    <TableCell className="text-sm">
                      {review.title ?? "—"}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {review.comment}
                      </p>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {review.booking.bookingRef.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(review.createdAt), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={REVIEW_STATUS_VARIANT[review.status]}>
                        {REVIEW_STATUS_LABEL[review.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setViewReview(review)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        {review.status === "PENDING" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              disabled={updateStatus.isPending}
                              onClick={() =>
                                updateStatus.mutate({
                                  id: review.id,
                                  status: "APPROVED",
                                })
                              }
                            >
                              <Check className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                              disabled={updateStatus.isPending}
                              onClick={() =>
                                updateStatus.mutate({
                                  id: review.id,
                                  status: "REJECTED",
                                })
                              }
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          )}
        </Table>
        {data && (
          <Pagination
            page={params.page}
            totalPages={data.totalPages}
            total={data.total}
            limit={params.limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        )}
      </Card>

      <Dialog open={!!viewReview} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết đánh giá</DialogTitle>
          </DialogHeader>
          {viewReview && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{viewReview.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {viewReview.user.email}
                  </p>
                </div>
                <InlineStars value={viewReview.overallRating} />
              </div>
              <p className="text-sm text-muted-foreground">
                Khách sạn:{" "}
                <span className="text-foreground font-medium">
                  {viewReview.hotel.name}
                </span>
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                Booking:{" "}
                {viewReview.booking.bookingRef.slice(0, 8).toUpperCase()}
              </p>
              {viewReview.title && (
                <p className="font-medium">{viewReview.title}</p>
              )}
              <p className="text-sm leading-relaxed">{viewReview.comment}</p>
              <div className="flex items-center justify-between pt-2 border-t">
                <Badge variant={REVIEW_STATUS_VARIANT[viewReview.status]}>
                  {REVIEW_STATUS_LABEL[viewReview.status]}
                </Badge>
                {viewReview.status === "PENDING" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-emerald-600 border-emerald-200 hover:text-emerald-500 hover:border-emerald-200"
                      disabled={updateStatus.isPending}
                      onClick={() => {
                        updateStatus.mutate({
                          id: viewReview.id,
                          status: "APPROVED",
                        });
                        setViewReview(null);
                      }}
                    >
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Duyệt
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                      disabled={updateStatus.isPending}
                      onClick={() => {
                        updateStatus.mutate({
                          id: viewReview.id,
                          status: "REJECTED",
                        });
                        setViewReview(null);
                      }}
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      Từ chối
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
