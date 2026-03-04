"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
  debounce = 300,
}: SearchInputProps) => {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => onChange(local), debounce);
    return () => clearTimeout(timer);
  }, [local, debounce, onChange]);

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 w-4 h-4 text-muted-foreground center-box" />
      <Input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-8 h-10"
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
