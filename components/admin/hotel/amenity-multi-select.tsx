"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAmenityList } from "@/hooks/admin/use-admin-amenities";

interface AmenityMultiSelectProps {
  value: string[];
  onChange: (val: string[]) => void;
}

export const AmenityMultiSelect = ({
  value,
  onChange,
}: AmenityMultiSelectProps) => {
  const { data } = useAmenityList();

  const toggle = (id: string) =>
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id],
    );

  const selected = data?.filter((a) => value.includes(a.id)) ?? [];

  return (
    <div className="space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between font-normal border-border bg-background text-foreground hover:bg-muted hover:text-foreground"
          >
            {selected.length > 0
              ? `${selected.length} tiện nghi đã chọn`
              : "Chọn tiện nghi..."}
            <ChevronsUpDown className="w-4 h-4 ml-2 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0 bg-card border-border"
          align="start"
        >
          <Command className="bg-card">
            <CommandInput
              placeholder="Tìm tiện nghi..."
              className="text-foreground placeholder:text-muted-foreground border-border"
            />
            <CommandList>
              <CommandEmpty className="text-muted-foreground text-sm py-4 text-center">
                Không tìm thấy tiện nghi
              </CommandEmpty>
              <CommandGroup>
                {data?.map((amenity) => (
                  <CommandItem
                    key={amenity.id}
                    onSelect={() => toggle(amenity.id)}
                    className="text-foreground hover:bg-muted cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 text-primary",
                        value.includes(amenity.id)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {amenity.icon && (
                      <span className="mr-2">{amenity.icon}</span>
                    )}
                    {amenity.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((a) => (
            <Badge
              key={a.id}
              variant="outline"
              className="gap-1 bg-muted text-muted-foreground border-border"
            >
              {a.icon && <span>{a.icon}</span>}
              {a.name}
              <button
                onClick={() => toggle(a.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
