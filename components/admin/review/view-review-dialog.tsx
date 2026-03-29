import React from "react";
import { Review } from "./review-list-client";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { StarRating } from "@/components/common/star-rating";
import { useUpdateReviewStatus } from "@/hooks/admin/use-admin-reviews";
import { useModalDialogStore } from "@/store/modal-dialog-store";

interface ViewReviewDialogProps {
  review: Review;
}

export const ViewReviewDialog = ({ review }: ViewReviewDialogProps) => {
  const updateStatus = useUpdateReviewStatus();
  const { closeModal } = useModalDialogStore();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-foreground">{review.user.name}</p>
          <p className="text-xs text-muted-foreground">{review.user.email}</p>
        </div>
        <StarRating value={review.overallRating} readonly size="sm" />
      </div>
      <p className="text-sm text-muted-foreground">
        Khách sạn:{" "}
        <span className="text-foreground font-medium">{review.hotel.name}</span>
      </p>
      <p className="text-xs text-muted-foreground font-mono">
        Booking: {review.booking.bookingRef.slice(0, 8).toUpperCase()}
      </p>
      {review.title && (
        <p className="font-medium text-foreground">{review.title}</p>
      )}
      <p className="text-sm text-foreground leading-relaxed">
        {review.comment}
      </p>
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <StatusBadge status={review.status} type="review" />
        {review.status === "PENDING" && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-border text-primary hover:bg-primary/10 hover:text-primary"
              disabled={updateStatus.isPending}
              onClick={() => {
                updateStatus.mutate({
                  id: review.id,
                  status: "APPROVED",
                });
                closeModal();
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
                  id: review.id,
                  status: "REJECTED",
                });
                closeModal();
              }}
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Từ chối
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
