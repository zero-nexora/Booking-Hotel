"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { DEFAULT_DEBOUNCE } from "@/lib/constants";

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  debounce?: number;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
  className,
  debounce = DEFAULT_DEBOUNCE,
}: SearchInputProps) => {
  const [local, setLocal] = useState(value);
  const debounced = useDebounce(local, debounce);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    onChange(debounced);
  }, [debounced, onChange]);

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 w-4 h-4 text-muted-foreground center-box" />
      <Input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-8 h-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
      />
      {local && (
        <button
          onClick={() => {
            setLocal("");
            onChange("");
          }}
          className="absolute right-2 text-muted-foreground hover:text-foreground center-box"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
