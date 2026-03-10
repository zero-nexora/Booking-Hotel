"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSearch } from "./hero-search";
import { FeaturedHotels } from "./featured-hotels";
import { PopularDestinations } from "./popular-destinations";
import { HowItWorks } from "./how-it-works";
import { TopAmenities } from "./top-amenities";
import { ReviewsHighlight } from "./reviews-highlight";

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && (
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="gap-1 text-primary"
        >
          <Link href={action.href}>
            {action.label}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Button>
      )}
    </div>
  );
}

export function HomeClient() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-primary/5 border-b">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
              Tìm chỗ nghỉ hoàn hảo
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              Hàng nghìn khách sạn chất lượng, giá tốt — đặt phòng chỉ trong vài
              bước.
            </p>
          </div>
          <HeroSearch />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Featured Hotels */}
        <section>
          <SectionHeader
            title="Khách sạn nổi bật"
            subtitle="Được lựa chọn bởi hàng nghìn du khách"
            action={{ label: "Xem tất cả", href: "/hotels" }}
          />
          <FeaturedHotels />
        </section>

        {/* Popular Destinations */}
        <section>
          <SectionHeader
            title="Điểm đến phổ biến"
            subtitle="Những thành phố được yêu thích nhất"
          />
          <PopularDestinations />
        </section>

        {/* How It Works */}
        <section className="rounded-2xl bg-muted/40 border p-8">
          <SectionHeader
            title="Đặt phòng dễ dàng"
            subtitle="Chỉ 4 bước để hoàn tất"
          />
          <HowItWorks />
        </section>

        {/* Top Amenities */}
        <section>
          <SectionHeader
            title="Tiện nghi phổ biến"
            subtitle="Lọc theo những gì bạn cần"
          />
          <TopAmenities />
        </section>

        {/* Reviews */}
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
}
