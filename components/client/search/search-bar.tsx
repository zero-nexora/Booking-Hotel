"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search, MapPin, CalendarIcon, Users, ChevronDown } from "lucide-react";
import { useLocations } from "@/hooks/client/use-hotels";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  defaultCityId?: string;
  defaultCheckIn?: Date;
  defaultCheckOut?: Date;
  defaultGuests?: number;
}

export const SearchBar = ({
  className,
  defaultCityId,
  defaultCheckIn,
  defaultCheckOut,
  defaultGuests = 1,
}: SearchBarProps) => {
  const router = useRouter();
  const { data: locations = [] } = useLocations();

  const [cityId, setCityId] = useState(defaultCityId ?? "");
  const [cityLabel, setCityLabel] = useState("");
  const [checkIn, setCheckIn] = useState<Date | undefined>(defaultCheckIn);
  const [checkOut, setCheckOut] = useState<Date | undefined>(defaultCheckOut);
  const [adults, setAdults] = useState(defaultGuests);
  const [children, setChildren] = useState(0);
  const [locationOpen, setLocationOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);

  const allCities = locations.flatMap((country) =>
    country.cities.map((city) => ({
      id: city.id,
      label: `${city.name}, ${country.name}`,
    })),
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (cityId) params.set("cityId", cityId);
    if (checkIn) params.set("checkIn", format(checkIn, "yyyy-MM-dd"));
    if (checkOut) params.set("checkOut", format(checkOut, "yyyy-MM-dd"));
    params.set("guests", String(adults + children));
    router.push(`/hotels?${params.toString()}`);
  };

  return (
    <div className={cn("bg-white rounded-xl shadow-lg p-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Popover open={locationOpen} onOpenChange={setLocationOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start h-12 font-normal"
            >
              <MapPin className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
              <span className="truncate text-left">
                {cityLabel || (
                  <span className="text-muted-foreground">Điểm đến</span>
                )}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="start">
            <Command>
              <CommandInput placeholder="Tìm thành phố..." />
              <CommandList>
                <CommandEmpty>Không tìm thấy</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value=""
                    onSelect={() => {
                      setCityId("");
                      setCityLabel("");
                      setLocationOpen(false);
                    }}
                  >
                    Tất cả địa điểm
                  </CommandItem>
                  {allCities.map((city) => (
                    <CommandItem
                      key={city.id}
                      value={city.label}
                      onSelect={() => {
                        setCityId(city.id);
                        setCityLabel(city.label);
                        setLocationOpen(false);
                      }}
                    >
                      {city.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start h-12 font-normal"
            >
              <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
              {checkIn ? (
                format(checkIn, "dd/MM/yyyy")
              ) : (
                <span className="text-muted-foreground">Check-in</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={checkIn}
              onSelect={(date) => {
                setCheckIn(date);
                if (date && (!checkOut || checkOut <= date)) {
                  const next = new Date(date);
                  next.setDate(next.getDate() + 1);
                  setCheckOut(next);
                }
                setCheckInOpen(false);
              }}
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
            />
          </PopoverContent>
        </Popover>

        <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start h-12 font-normal"
            >
              <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
              {checkOut ? (
                format(checkOut, "dd/MM/yyyy")
              ) : (
                <span className="text-muted-foreground">Check-out</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={checkOut}
              onSelect={(date) => {
                setCheckOut(date);
                setCheckOutOpen(false);
              }}
              disabled={(date) => {
                const minDate = checkIn ? new Date(checkIn) : new Date();
                minDate.setDate(minDate.getDate() + 1);
                return date < minDate;
              }}
            />
          </PopoverContent>
        </Popover>

        <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start h-12 font-normal"
            >
              <Users className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
              <span className="truncate">
                {adults} người lớn{children > 0 ? `, ${children} trẻ em` : ""}
              </span>
              <ChevronDown className="w-3.5 h-3.5 ml-auto text-muted-foreground shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <div className="space-y-4 p-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Người lớn</p>
                  <p className="text-xs text-muted-foreground">Từ 18 tuổi</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                  >
                    -
                  </Button>
                  <span className="w-4 text-center text-sm">{adults}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setAdults(Math.min(20, adults + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Trẻ em</p>
                  <p className="text-xs text-muted-foreground">Dưới 18 tuổi</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                  >
                    -
                  </Button>
                  <span className="w-4 text-center text-sm">{children}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setChildren(Math.min(10, children + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Button className="w-full mt-3 h-11" onClick={handleSearch}>
        <Search className="w-4 h-4 mr-2" />
        Tìm kiếm
      </Button>
    </div>
  );
};
