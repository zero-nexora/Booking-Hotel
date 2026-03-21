"use client";

import { useConfetti } from "@/hooks/use-confetti";

const NotFound = () => {
  const canvasRef = useConfetti(true);
  return (
    <canvas
      ref={canvasRef}
      // className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  );
};

export default NotFound;
