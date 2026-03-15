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
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-9 border-border bg-background text-foreground hover:bg-accent hover:text-secondary-foreground"
        >
          {theme === "light" ? (
            <Sun className="size-4" />
          ) : theme === "dark" ? (
            <Moon className="size-4" />
          ) : (
            <Monitor className="size-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-36 bg-popover border-border text-popover-foreground"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="gap-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
        >
          <Sun className="size-4 shrink-0" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="gap-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
        >
          <Moon className="size-4 shrink-0" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="gap-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
        >
          <Monitor className="size-4 shrink-0" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};