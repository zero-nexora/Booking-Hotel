"use client";

import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const Error = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4 bg-background">
      <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
        <TriangleAlert className="w-7 h-7 text-destructive" />
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Đã xảy ra lỗi
        </h1>
        <p className="text-sm text-muted-foreground">
          Đã có sự cố. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu lỗi tiếp tục.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground font-mono mt-2">
            #{error.digest}
          </p>
        )}
      </div>
      <Button
        variant="outline"
        className="rounded-xl gap-2 mt-2 border-border text-foreground hover:bg-muted hover:text-foreground"
        onClick={reset}
      >
        <RotateCcw className="w-4 h-4" />
        Thử lại
      </Button>
    </div>
  );
};

export default Error;
