"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

const segmentLabels: Record<string, string> = {
  admin: "Dashboard",
  hotels: "Khách sạn",
  "room-types": "Loại phòng",
  "bed-types": "Loại giường",
  rooms: "Phòng",
  bookings: "Đặt phòng",
  reviews: "Đánh giá",
  amenities: "Tiện nghi",
  countries: "Quốc gia",
  cities: "Thành phố",
  users: "Người dùng",
  new: "Tạo mới",
  edit: "Chỉnh sửa",
  availability: "Lịch phòng",
};

export const AdminBreadcrumb = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((seg, i) => ({
    label: segmentLabels[seg] ?? seg,
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb) => (
          <Fragment key={crumb.href}>
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage className="font-medium">
                  {crumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    href={crumb.href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!crumb.isLast && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
