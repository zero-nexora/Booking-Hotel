"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared/star-rating";

interface ReviewCardProps {
  review: {
    id: string;
    overallRating: number;
    title?: string | null;
    comment: string;
    createdAt: Date | string;
    user: { name: string; image?: string | null };
  };
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const initials = review.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const isLong = review.comment.length > 200;

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={review.user.image ?? undefined} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{review.user.name}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(review.createdAt), "dd/MM/yyyy")}
            </p>
          </div>
        </div>
        <StarRating value={review.overallRating} size="sm" />
      </div>
      {review.title && <p className="font-medium text-sm">{review.title}</p>}
      <p
        className={`text-sm text-muted-foreground ${!expanded && isLong ? "line-clamp-4" : ""}`}
      >
        {review.comment}
      </p>
      {isLong && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs p-0"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Thu gọn" : "Xem thêm"}
        </Button>
      )}
    </div>
  );
};
