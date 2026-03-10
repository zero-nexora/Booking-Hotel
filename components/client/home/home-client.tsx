"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSearch } from "./hero-search";
import { FeaturedHotels } from "./featured-hotels";
import { PopularDestinations } from "./popular-destinations";
import { HowItWorks } from "./how-it-works";
import { TopAmenities } from "./top-amenities";
import { ReviewsHighlight } from "./reviews-highlight";
import heroBg from "@/public/images/hero-bg.jpg";

const STATS = [
  { value: "500+", label: "Khách sạn" },
  { value: "50K+", label: "Lượt đặt phòng" },
  { value: "4.9★", label: "Đánh giá" },
  { value: "24/7", label: "Hỗ trợ" },
];

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
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      )}
    </div>
    {action && (
      <Button variant="ghost" size="sm" asChild className="gap-1 text-primary">
        <Link href={action.href}>
          {action.label} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </Button>
    )}
  </div>
);

export const HomeClient = () => (
  <div className="min-h-screen">
    <section className="relative overflow-hidden">
      <Image
        src={heroBg}
        alt="Luxury hotel at night"
        fill
        priority
        className="object-cover object-center"
        quality={90}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,8,22,0.7) 0%, rgba(5,8,22,0.4) 50%, rgba(5,8,22,0.6) 100%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 sm:py-36 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-4">
          Tìm chỗ nghỉ{" "}
          <span style={{ color: "rgba(255,210,80,0.95)" }}>hoàn hảo</span> cho
          mỗi chuyến đi
        </h1>
        <p className="text-white/60 text-base sm:text-lg max-w-lg mx-auto mb-10">
          Hàng nghìn khách sạn chất lượng, giá tốt — đặt phòng chỉ trong vài
          bước.
        </p>

        <HeroSearch />

        <div className="flex justify-center gap-8 sm:gap-12 mt-10 flex-wrap">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p
                className="text-xl font-bold"
                style={{ color: "rgba(255,210,80,0.95)" }}
              >
                {value}
              </p>
              <p className="text-xs text-white/40 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
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

      <section className="rounded-2xl bg-muted/40 border p-8">
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
