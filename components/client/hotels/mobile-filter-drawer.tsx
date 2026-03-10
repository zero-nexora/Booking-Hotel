"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HotelsFilterSidebar } from "./hotels-filter-sidebar";

export function MobileFilterDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 md:hidden">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Bộ lọc
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <SheetHeader className="px-4 py-3 border-b">
          <SheetTitle className="text-sm">Bộ lọc</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-56px)]">
          <div className="p-4">
            <HotelsFilterSidebar />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}