import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
    </div>
  );
};

export default Loading;
