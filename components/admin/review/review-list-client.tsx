"use client";

import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
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
import { StatusBadge } from "@/components/shared/status-badge";
import { StarRating } from "@/components/shared/star-rating";
import { Check, X, Eye } from "lucide-react";
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
import { formatDateShort } from "@/lib/utils";

type Review = RouterOutput["admin"]["review"]["list"]["items"][number];

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
      setParams({ status: v === "all" ? null : (v as ReviewStatus), page: 1 }),
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
            <TabsList className="bg-muted border-border">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground"
              >
                Tất cả
              </TabsTrigger>
              <TabsTrigger
                value="PENDING"
                className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground"
              >
                Chờ duyệt
              </TabsTrigger>
              <TabsTrigger
                value="APPROVED"
                className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground"
              >
                Đã duyệt
              </TabsTrigger>
              <TabsTrigger
                value="REJECTED"
                className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground"
              >
                Từ chối
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </ListHeader>

      <Card className="bg-card border-border shadow-none">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">
                Khách sạn
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Người dùng
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Rating
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Tiêu đề
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Nội dung
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Booking
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Ngày tạo
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Trạng thái
              </TableHead>
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
                  <TableRow
                    key={review.id}
                    className="border-border hover:bg-muted/40"
                  >
                    <TableCell className="text-sm font-medium text-foreground">
                      {review.hotel.name}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-foreground">
                        {review.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {review.user.email}
                      </p>
                    </TableCell>
                    <TableCell>
                      <StarRating
                        value={review.overallRating}
                        readonly
                        size="xs"
                      />
                    </TableCell>
                    <TableCell className="text-sm text-foreground">
                      {review.title ?? "—"}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {review.comment}
                      </p>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {review.booking.bookingRef.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateShort(review.createdAt)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={review.status} type="review" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                          onClick={() => setViewReview(review)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        {review.status === "PENDING" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10"
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
      </Card>

      <Dialog open={!!viewReview} onOpenChange={handleCloseDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Chi tiết đánh giá
            </DialogTitle>
          </DialogHeader>
          {viewReview && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    {viewReview.user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {viewReview.user.email}
                  </p>
                </div>
                <StarRating
                  value={viewReview.overallRating}
                  readonly
                  size="sm"
                />
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
                <p className="font-medium text-foreground">
                  {viewReview.title}
                </p>
              )}
              <p className="text-sm text-foreground leading-relaxed">
                {viewReview.comment}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <StatusBadge status={viewReview.status} type="review" />
                {viewReview.status === "PENDING" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border text-primary hover:bg-primary/10 hover:text-primary"
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
                      className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
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
