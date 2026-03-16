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
import { cn, formatDateShort, formatDateCompact } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type AvailabilityStatus = "AVAILABLE" | "LOCKED" | "BOOKED" | "MAINTENANCE";

const STATUS_COLOR: Record<AvailabilityStatus, string> = {
  AVAILABLE: "#b89a6f",
  LOCKED: "#c9a87c",
  BOOKED: "#6b5040",
  MAINTENANCE: "#8c3a3a",
};

const STATUS_LABEL: Record<AvailabilityStatus, string> = {
  AVAILABLE: "Trống",
  LOCKED: "Đang giữ",
  BOOKED: "Đã đặt",
  MAINTENANCE: "Bảo trì",
};

const STATUS_BADGE_CLASS: Record<AvailabilityStatus, string> = {
  AVAILABLE: "bg-primary/10 text-primary border-primary/20",
  LOCKED: "bg-secondary text-secondary-foreground border-border",
  BOOKED: "bg-accent text-accent-foreground border-border",
  MAINTENANCE: "bg-destructive/10 text-destructive border-destructive/20",
};

interface RoomAvailabilityTabProps {
  roomId: string;
}

export const RoomAvailabilityTab = ({ roomId }: RoomAvailabilityTabProps) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selected, setSelected] = useState<{ start: Date; end: Date } | null>(null);

  const from = startOfMonth(currentMonth);
  const to = endOfMonth(currentMonth);

  const { data: availability = [] } = useRoomAvailability(roomId, from, to);
  const setAvailability = useSetRoomAvailability(roomId);

  const events = availability.map((a) => ({
    id: a.id,
    title: STATUS_LABEL[a.status as AvailabilityStatus],
    start: formatDateShort(a.date),
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
    setSelected({ start: new Date(arg.startStr), end: new Date(arg.endStr) });
  };

  const handleSetStatus = async (status: "AVAILABLE" | "MAINTENANCE") => {
    if (!selected) return;

    const dateStrings: string[] = [];
    const cursor = new Date(selected.start);

    while (cursor < selected.end) {
      const dateStr = format(cursor, "yyyy-MM-dd");
      const existing = availability.find((a) => format(new Date(a.date), "yyyy-MM-dd") === dateStr);

      if (!existing || existing.status === "AVAILABLE" || existing.status === "MAINTENANCE") {
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

  const displayEnd = selected ? new Date(selected.end.getTime() - 86_400_000) : null;

  const isSingleDay =
    selected && displayEnd
      ? format(selected.start, "yyyy-MM-dd") === format(displayEnd, "yyyy-MM-dd")
      : false;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["AVAILABLE", "LOCKED", "BOOKED", "MAINTENANCE"] as AvailabilityStatus[]).map((s) => (
            <Badge
              key={s}
              variant="outline"
              className={cn("text-xs font-medium px-2 py-0.5", STATUS_BADGE_CLASS[s])}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 shrink-0"
                style={{ backgroundColor: STATUS_COLOR[s] }}
              />
              {STATUS_LABEL[s]}
            </Badge>
          ))}
        </div>

        {selected && displayEnd && (
          <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-1.5 bg-muted/40">
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {isSingleDay
                ? formatDateShort(selected.start)
                : `${formatDateShort(selected.start)} – ${formatDateShort(displayEnd)}`}
            </span>
            <div className="w-px h-4 bg-border" />
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs text-primary hover:text-primary hover:bg-primary/10"
              disabled={setAvailability.isPending}
              onClick={() => void handleSetStatus("AVAILABLE")}
            >
              Đặt trống
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
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
            timeZone="local"
          />
        </div>
      </Card>
    </div>
  );
};