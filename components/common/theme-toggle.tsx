"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          {resolvedTheme === "light" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-36 bg-card border-border text-foreground"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="gap-2 text-sm cursor-pointer text-foreground hover:bg-muted hover:text-foreground"
        >
          <Sun className="size-4 shrink-0" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="gap-2 text-sm cursor-pointer text-foreground hover:bg-muted hover:text-foreground"
        >
          <Moon className="size-4 shrink-0" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="gap-2 text-sm cursor-pointer text-foreground hover:bg-muted hover:text-foreground"
        >
          <Monitor className="size-4 shrink-0" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
