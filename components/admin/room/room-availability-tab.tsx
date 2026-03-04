"use client";

import { useRef, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  format,
  addMonths,
  subMonths,
} from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateSelectArg } from "@fullcalendar/core";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useRoomAvailability,
  useSetRoomAvailability,
} from "@/hooks/admin/use-admin-rooms";
import { cn } from "@/lib/utils";

type AvailabilityStatus = "AVAILABLE" | "LOCKED" | "BOOKED" | "MAINTENANCE";

const STATUS_COLOR: Record<AvailabilityStatus, string> = {
  AVAILABLE: "#10b981",
  LOCKED: "#f59e0b",
  BOOKED: "#3b82f6",
  MAINTENANCE: "#ef4444",
};

const STATUS_LABEL: Record<AvailabilityStatus, string> = {
  AVAILABLE: "Trống",
  LOCKED: "Đang giữ",
  BOOKED: "Đã đặt",
  MAINTENANCE: "Bảo trì",
};

const STATUS_BADGE_CLASS: Record<AvailabilityStatus, string> = {
  AVAILABLE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  LOCKED: "bg-yellow-100 text-yellow-700 border-yellow-200",
  BOOKED: "bg-blue-100 text-blue-700 border-blue-200",
  MAINTENANCE: "bg-red-100 text-red-700 border-red-200",
};

const toDateStr = (date: Date | string): string => {
  if (typeof date === "string") return date.slice(0, 10);
  return format(date, "yyyy-MM-dd");
};

const fcDateToStr = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

const formatDisplay = (date: Date) => {
  return format(date, "dd/MM");
};

interface RoomAvailabilityTabProps {
  roomId: string;
}

export const RoomAvailabilityTab = ({ roomId }: RoomAvailabilityTabProps) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selected, setSelected] = useState<{ start: Date; end: Date } | null>(
    null,
  );

  const from = startOfMonth(currentMonth);
  const to = endOfMonth(currentMonth);

  const { data: availability = [] } = useRoomAvailability(roomId, from, to);
  const setAvailability = useSetRoomAvailability(roomId);

  const events = availability.map((a) => ({
    id: a.id,
    title: STATUS_LABEL[a.status as AvailabilityStatus],
    start: toDateStr(a.date),
    allDay: true,
    backgroundColor: STATUS_COLOR[a.status as AvailabilityStatus],
    borderColor: STATUS_COLOR[a.status as AvailabilityStatus],
  }));

  const handlePrev = () => {
    calendarRef.current?.getApi().prev();
    setCurrentMonth((m) => subMonths(m, 1));
    setSelected(null);
  };

  const handleNext = () => {
    calendarRef.current?.getApi().next();
    setCurrentMonth((m) => addMonths(m, 1));
    setSelected(null);
  };

  const handleSelect = (arg: DateSelectArg) => {
    setSelected({
      start: new Date(arg.startStr),
      end: new Date(arg.endStr),
    });
  };

  const handleSetStatus = async (status: "AVAILABLE" | "MAINTENANCE") => {
    if (!selected) return;

    const dateStrings: string[] = [];
    const cursor = new Date(selected.start);

    while (cursor < selected.end) {
      const dateStr = format(cursor, "yyyy-MM-dd");
      const existing = availability.find((a) => toDateStr(a.date) === dateStr);

      if (
        !existing ||
        existing.status === "AVAILABLE" ||
        existing.status === "MAINTENANCE"
      ) {
        dateStrings.push(dateStr);
      }

      cursor.setDate(cursor.getDate() + 1);
    }

    if (!dateStrings.length) {
      toast.error("Không có ngày nào có thể thay đổi trong khoảng đã chọn");
      return;
    }

    await setAvailability.mutateAsync({
      roomId,
      dates: dateStrings as unknown as Date[],
      status,
    });

    setSelected(null);
    calendarRef.current?.getApi().unselect();
  };

  const displayEnd = selected
    ? new Date(selected.end.getTime() - 86_400_000)
    : null;

  const isSingleDay =
    selected && displayEnd
      ? format(selected.start, "yyyy-MM-dd") ===
        format(displayEnd, "yyyy-MM-dd")
      : false;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1.5 flex-wrap">
          {(
            [
              "AVAILABLE",
              "LOCKED",
              "BOOKED",
              "MAINTENANCE",
            ] as AvailabilityStatus[]
          ).map((s) => (
            <Badge
              key={s}
              variant="outline"
              className={cn("text-xs", STATUS_BADGE_CLASS[s])}
            >
              {STATUS_LABEL[s]}
            </Badge>
          ))}
        </div>

        {selected && displayEnd && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {isSingleDay
                ? formatDisplay(selected.start)
                : `${formatDisplay(selected.start)} – ${formatDisplay(displayEnd)}`}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
              disabled={setAvailability.isPending}
              onClick={() => void handleSetStatus("AVAILABLE")}
            >
              Đặt trống
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              disabled={setAvailability.isPending}
              onClick={() => void handleSetStatus("MAINTENANCE")}
            >
              Bảo trì
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSelected(null);
                calendarRef.current?.getApi().unselect();
              }}
            >
              Bỏ chọn
            </Button>
          </div>
        )}
      </div>

      <Card className="p-4 [&_.fc-toolbar]:hidden [&_.fc-daygrid-day-number]:text-sm [&_.fc-daygrid-day-number]:font-medium [&_.fc-event]:text-xs [&_.fc-event]:rounded [&_.fc-event]:px-1 [&_.fc-col-header-cell-cushion]:text-xs [&_.fc-col-header-cell-cushion]:text-muted-foreground [&_.fc-col-header-cell-cushion]:font-medium [&_.fc-highlight]:bg-primary/10!">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium capitalize text-sm">
            {format(currentMonth, "MMMM yyyy", { locale: vi })}
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handlePrev}
            >
              ‹
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleNext}
            >
              ›
            </Button>
          </div>
        </div>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="vi"
          firstDay={1}
          selectable
          selectMirror
          unselectAuto={false}
          events={events}
          select={handleSelect}
          height="auto"
          dayMaxEvents={1}
          headerToolbar={false}
          timeZone="local"
        />
      </Card>
    </div>
  );
};