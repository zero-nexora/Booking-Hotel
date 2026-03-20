"use client";

import { Star, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

interface HotelOverviewProps {
  name: string;
  starRating: number;
  address: {
    street: string;
    city: { name: string; country: { name: string } };
    state?: string | null;
  };
  phone?: string | null;
  email?: string | null;
  avgRating: number | null;
  reviewCount: number;
  policy?: { checkInTime: string; checkOutTime: string } | null;
}

export const HotelOverview = ({
  name,
  starRating,
  address,
  phone,
  email,
  avgRating,
  reviewCount,
  policy,
}: HotelOverviewProps) => {
  const ratingLabel =
    avgRating == null
      ? null
      : avgRating >= 4.5
        ? "Tuyệt vời"
        : avgRating >= 4.0
          ? "Rất tốt"
          : avgRating >= 3.5
            ? "Tốt"
            : "Bình thường";

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="gap-0.5 text-xs border-border">
              {Array.from({ length: starRating }).map((_, i) => (
                <Star
                  key={i}
                  className="w-2.5 h-2.5 fill-primary text-primary"
                />
              ))}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {name}
          </h1>
          <div className="flex items-start gap-1.5 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span className="text-sm">
              {address.street}, {address.city.name}
              {address.state ? `, ${address.state}` : ""},{" "}
              {address.city.country.name}
            </span>
          </div>
        </div>

        {avgRating !== null && (
          <motion.div
            className="flex items-center gap-3 sm:flex-col sm:items-end shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
          >
            <div className="flex items-center gap-2 bg-primary/10 rounded-xl px-3 py-2">
              <div>
                <p className="text-xs text-muted-foreground text-right">
                  {ratingLabel}
                </p>
                <p className="text-2xl font-bold text-primary leading-none">
                  {avgRating.toFixed(1)}
                </p>
              </div>
              <Star className="w-5 h-5 fill-primary text-primary" />
            </div>
            <p className="text-xs text-muted-foreground sm:text-right">
              {reviewCount} đánh giá
            </p>
          </motion.div>
        )}
      </div>

      <Separator className="bg-border" />

      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <Phone className="w-3.5 h-3.5" />
            {phone}
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <Mail className="w-3.5 h-3.5" />
            {email}
          </a>
        )}
        {policy && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>
              Check-in:{" "}
              <span className="font-medium text-foreground">
                {policy.checkInTime}
              </span>
            </span>
            <span className="mx-1">·</span>
            <span>
              Check-out:{" "}
              <span className="font-medium text-foreground">
                {policy.checkOutTime}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
