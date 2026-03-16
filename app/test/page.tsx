import Link from "next/link";
import { Home, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4 bg-background">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
        <SearchX className="w-7 h-7 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Không tìm thấy trang
        </h1>
        <p className="text-sm text-muted-foreground">
          Trang bạn đang tìm không tồn tại hoặc đã bị xoá.
        </p>
      </div>
      <Button
        asChild
        className="rounded-xl gap-2 mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Link href="/">
          <Home className="w-4 h-4" />
          Về trang chủ
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
