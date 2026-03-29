"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeaturedHotels } from "./featured-hotels";
import { PopularDestinations } from "./popular-destinations";
import { HowItWorks } from "./how-it-works";
import { TopAmenities } from "./top-amenities";
import { ReviewsHighlight } from "./reviews-highlight";
import { HeroSection } from "./hero-section";

const SectionHeader = ({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
}) => (
  <div className="flex items-end justify-between mb-6">
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      )}
    </div>
    {action && (
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="gap-1 text-primary hover:text-foreground hover:bg-primary/10"
      >
        <Link href={action.href}>
          {action.label} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </Button>
    )}
  </div>
);

export const HomeClient = () => {
  return (
    <div className="min-h-screen">
      <section>
        <HeroSection />
      </section>
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        <section>
          <SectionHeader
            title="Khách sạn nổi bật"
            subtitle="Được lựa chọn bởi hàng nghìn du khách"
            action={{ label: "Xem tất cả", href: "/hotels" }}
          />
          <FeaturedHotels />
        </section>

        <section>
          <SectionHeader
            title="Điểm đến phổ biến"
            subtitle="Những thành phố được yêu thích nhất"
          />
          <PopularDestinations />
        </section>

        <section className="rounded-2xl bg-muted/40 border border-border p-8">
          <SectionHeader
            title="Đặt phòng dễ dàng"
            subtitle="Chỉ 4 bước để hoàn tất"
          />
          <HowItWorks />
        </section>

        <section>
          <SectionHeader
            title="Tiện nghi phổ biến"
            subtitle="Lọc theo những gì bạn cần"
          />
          <TopAmenities />
        </section>

        <section>
          <SectionHeader
            title="Khách hàng nói gì?"
            subtitle="Đánh giá thực từ khách đã lưu trú"
          />
          <ReviewsHighlight />
        </section>
      </div>
    </div>
  );
};
