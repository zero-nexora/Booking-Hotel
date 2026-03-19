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
import HeroBannerDark from "@/public/images/hero-banner-dark.svg";
import HeroBannerLight from "@/public/images/hero-banner-light.svg";
import { useTheme } from "next-themes";
import { CountUp } from "@/components/common/count-up";

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
        className="gap-1 text-primary hover:text-primary hover:bg-primary/10"
      >
        <Link href={action.href}>
          {action.label} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </Button>
    )}
  </div>
);

export const HomeClient = () => {
  const { resolvedTheme } = useTheme();
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <Image
          src={resolvedTheme === "light" ? HeroBannerLight : HeroBannerDark}
          alt="Luxury hotel at night"
          fill
          priority
          className="object-cover object-center"
          quality={90}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 sm:py-36 text-center space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Tìm khách sạn hoàn hảo
              <br />
              <span className="text-primary">cho chuyến đi của bạn</span>
            </h1>
            <p className="text-base sm:text-lg text-secondary-foreground max-w-xl mx-auto">
              Hàng nghìn khách sạn cao cấp, giá tốt nhất, đặt phòng trong vài
              giây.
            </p>
          </div>
          <HeroSearch />
          <div className="flex items-center justify-center gap-8 sm:gap-12 pt-2">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                <CountUp to={12800} separator="," triggerOnView />+
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 ">Khách sạn</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                <CountUp to={98} triggerOnView />%
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Hài lòng</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold  text-primary">
                <CountUp to={340} separator="," triggerOnView />
                K+
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Lượt đặt phòng
              </p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                <CountUp to={50} triggerOnView />+
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Thành phố</p>
            </div>
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
