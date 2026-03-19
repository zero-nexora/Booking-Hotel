"use client";

import { useRef, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  format,
  addMonths,
  subMonths,
} from "date-fns";
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
import { cn, formatDateCompact } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type AvailabilityStatus = "AVAILABLE" | "LOCKED" | "BOOKED" | "MAINTENANCE";

const STATUS_COLOR: Record<AvailabilityStatus, string> = {
  AVAILABLE: "oklch(0.55 0.15 160)",
  LOCKED: "oklch(0.58 0.14 250)",
  BOOKED: "oklch(0.52 0.18 300)",
  MAINTENANCE: "oklch(0.58 0.19 28)",
};

const STATUS_LABEL: Record<AvailabilityStatus, string> = {
  AVAILABLE: "Trống",
  LOCKED: "Đang giữ",
  BOOKED: "Đã đặt",
  MAINTENANCE: "Bảo trì",
};

const STATUS_BADGE_CLASS: Record<AvailabilityStatus, string> = {
  AVAILABLE:
    "bg-[oklch(0.55_0.15_160/0.1)] text-[oklch(0.38_0.15_160)] border-[oklch(0.55_0.15_160/0.3)]",
  LOCKED:
    "bg-[oklch(0.58_0.14_250/0.1)] text-[oklch(0.40_0.14_250)] border-[oklch(0.58_0.14_250/0.3)]",
  BOOKED:
    "bg-[oklch(0.52_0.18_300/0.1)] text-[oklch(0.38_0.18_300)] border-[oklch(0.52_0.18_300/0.3)]",
  MAINTENANCE:
    "bg-[oklch(0.58_0.19_28/0.1)]  text-[oklch(0.42_0.19_28)]  border-[oklch(0.58_0.19_28/0.3)]",
};

const ALL_STATUSES = [
  "AVAILABLE",
  "LOCKED",
  "BOOKED",
  "MAINTENANCE",
] as AvailabilityStatus[];

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

  const events = availability.map((a) => {
    const status = a.status as AvailabilityStatus;
    return {
      id: a.id,
      title: STATUS_LABEL[status],
      start: format(new Date(a.date), "yyyy-MM-dd"),
      allDay: true,
      backgroundColor: STATUS_COLOR[status],
      borderColor: STATUS_COLOR[status],
      textColor: "#ffffff",
    };
  });

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
    setSelected({ start: new Date(arg.startStr), end: new Date(arg.endStr) });
  };

  const handleSetStatus = async (status: "AVAILABLE" | "MAINTENANCE") => {
    if (!selected) return;

    const dateStrings: string[] = [];
    const cursor = new Date(selected.start);

    while (cursor < selected.end) {
      const dateStr = format(cursor, "yyyy-MM-dd");
      const existing = availability.find(
        (a) => format(new Date(a.date), "yyyy-MM-dd") === dateStr,
      );
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

  const selectedLabel =
    selected && displayEnd
      ? isSingleDay
        ? format(selected.start, "dd/MM/yyyy")
        : `${format(selected.start, "dd/MM")} – ${format(displayEnd, "dd/MM/yyyy")}`
      : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {ALL_STATUSES.map((s) => (
            <Badge
              key={s}
              variant="outline"
              className={cn(
                "text-xs font-medium px-2 py-0.5 gap-1.5",
                STATUS_BADGE_CLASS[s],
              )}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: STATUS_COLOR[s] }}
              />
              {STATUS_LABEL[s]}
            </Badge>
          ))}
        </div>

        {selected && displayEnd && (
          <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-1.5 bg-muted/40">
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {selectedLabel}
            </span>
            <div className="w-px h-4 bg-border" />
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs text-[oklch(0.38_0.15_160)] hover:text-[oklch(0.38_0.15_160)] hover:bg-[oklch(0.55_0.15_160/0.08)]"
              disabled={setAvailability.isPending}
              onClick={() => void handleSetStatus("AVAILABLE")}
            >
              Đặt trống
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs text-[oklch(0.42_0.19_28)] hover:text-[oklch(0.42_0.19_28)] hover:bg-[oklch(0.58_0.19_28/0.08)]"
              disabled={setAvailability.isPending}
              onClick={() => void handleSetStatus("MAINTENANCE")}
            >
              Bảo trì
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
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

      <Card className="bg-card border-border shadow-none overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30">
          <span className="text-sm font-semibold capitalize tracking-tight text-foreground">
            {formatDateCompact(currentMonth)}
          </span>
          <div className="flex gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={handleNext}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <div className="p-4">
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
            timeZone="UTC"
          />
        </div>
      </Card>
    </div>
  );
};
