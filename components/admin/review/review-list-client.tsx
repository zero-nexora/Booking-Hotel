"use client";

import { useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/common/pagination";
import { SearchInput } from "@/components/common/search-input";
import { StatusBadge } from "@/components/common/status-badge";
import { StarRating } from "@/components/common/star-rating";
import { Check, X, Eye } from "lucide-react";
import {
  useAdminReviewList,
  useUpdateReviewStatus,
} from "@/hooks/admin/use-admin-reviews";
import { useQueryStates } from "nuqs";
import { adminReviewParsers } from "@/lib/search-params/admin-reviews";
import { RouterOutput } from "@/trpc/client";
import { ReviewStatus } from "@/prisma/generated/prisma/enums";
import { ListHeader } from "@/components/common/list-header";
import { formatDateShort } from "@/lib/utils";
import { DataTableBody } from "@/components/common/table-body";
import { useModalDialogStore } from "@/store/modal-dialog-store";
import { ViewReviewDialog } from "./view-review-dialog";
import { useConfirmDialogStore } from "@/store/confirm-dialog-store";
import { DEFAULT_PAGE } from "@/lib/constants";

export type Review = RouterOutput["admin"]["review"]["list"]["items"][number];

export const ReviewListClient = () => {
  const [params, setParams] = useQueryStates(adminReviewParsers);
  const { data, isLoading } = useAdminReviewList(params);
  const updateStatus = useUpdateReviewStatus();
  const { openModal } = useModalDialogStore();
  const { openConfirm } = useConfirmDialogStore();

  const handleSearchChange = useCallback(
    (v: string) => setParams({ search: v, page: DEFAULT_PAGE }),
    [setParams],
  );

  const handleTabChange = useCallback(
    (v: string) =>
      setParams({
        status: v === "all" ? null : (v as ReviewStatus),
        page: DEFAULT_PAGE,
      }),
    [setParams],
  );

  const handlePageChange = useCallback(
    (p: number) => setParams({ page: p }),
    [setParams],
  );

  const handleLimitChange = useCallback(
    (l: number) => setParams({ limit: l, page: DEFAULT_PAGE }),
    [setParams],
  );

  const handleOpenViewDetailReview = (review: Review) =>
    openModal({
      title: "Chi tiết đánh giá",
      content: <ViewReviewDialog review={review} />,
    });

  const handleOpenUpdateStatus = (
    id: string,
    status: "APPROVED" | "REJECTED",
  ) => {
    openConfirm({
      title: `Xác nhận ${status === "APPROVED" ? "duyệt" : "từ chối"} đánh giá`,
      description: `Bạn có chắc chắn muốn ${status === "APPROVED" ? "duyệt" : "từ chối"} đánh giá này không?`,
      onConfirm: () =>
        updateStatus.mutate({
          id,
          status,
        }),
    });
  };

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

      <Card>
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
          <DataTableBody
            data={data?.items}
            isLoading={isLoading}
            cols={9}
            emptyMessage="Không có đánh giá nào"
            renderRow={(review) => (
              <TableRow
                key={review.id}
                className="border-border hover:bg-muted/40"
              >
                <TableCell className="text-sm font-medium text-foreground">
                  {review.hotel.name}
                </TableCell>
                <TableCell>
                  <p className="text-sm text-foreground">{review.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {review.user.email}
                  </p>
                </TableCell>
                <TableCell>
                  <StarRating value={review.overallRating} readonly size="xs" />
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
                      onClick={() => handleOpenViewDetailReview(review)}
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
                            handleOpenUpdateStatus(review.id, "APPROVED")
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
                            handleOpenUpdateStatus(review.id, "REJECTED")
                          }
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          />
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
    </div>
  );
};
