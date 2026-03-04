import Link from "next/link";
import Image from "next/image";
import { format, differenceInDays } from "date-fns";
import { MapPin, Calendar, Moon } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";

interface BookingCardProps {
  booking: {
    id: string;
    bookingRef: string;
    status: string;
    paymentStatus: string;
    checkIn: Date | string;
    checkOut: Date | string;
    totalAmount: unknown;
    hotel: {
      name: string;
      slug: string;
      images: { url: string }[];
      address: { city: { name: string; country: { name: string } } };
    };
    items: {
      nights: number;
      room: { name: string; roomType: { name: string } };
    }[];
  };
}

export const BookingCard = ({ booking }: BookingCardProps) => {
  const image = booking.hotel.images[0];
  const item = booking.items[0];
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const nights = differenceInDays(checkOut, checkIn);

  return (
    <div className="border rounded-lg overflow-hidden flex gap-0">
      <div className="relative w-24 h-24 md:w-28 md:h-28 shrink-0 bg-muted self-stretch">
        {image ? (
          <Image
            src={image.url}
            alt={booking.hotel.name}
            fill
            className="object-cover"
            sizes="112px"
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
      </div>

      <div className="flex-1 p-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
        <div className="flex-1 space-y-1 min-w-0">
          <p className="font-semibold truncate">{booking.hotel.name}</p>
          {item && (
            <p className="text-sm text-muted-foreground truncate">
              {item.room.name} · {item.room.roomType.name}
            </p>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {booking.hotel.address.city.name},{" "}
              {booking.hotel.address.city.country.name}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(checkIn, "dd/MM/yy")} → {format(checkOut, "dd/MM/yy")}
            </span>
            <span className="flex items-center gap-1">
              <Moon className="w-3 h-3" />
              {nights} đêm
            </span>
          </div>
        </div>

        <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0">
          <StatusBadge type="booking" status={booking.status} />
          <StatusBadge type="payment" status={booking.paymentStatus} />
          <p className="font-bold text-sm">
            {Number(booking.totalAmount).toLocaleString("vi-VN")}đ
          </p>
          <Link
            href={`/account/bookings/${booking.bookingRef}`}
            className="text-xs text-primary underline"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};
