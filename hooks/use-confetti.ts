import { useEffect, useRef } from "react";

const CONFETTI_COLORS = [
  "#b89a6f",
  "#c9a87c",
  "#8c7355",
  "#d4b896",
  "#6b563e",
  "#e0cdb0",
  "#a0845c",
  "#f0e0c8",
];

type ConfettiShape = "rect" | "circle" | "ribbon";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  width: number;
  height: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: ConfettiShape;
};

const spawnBurst = (canvas: HTMLCanvasElement, count: number): Particle[] =>
  Array.from({ length: count }, () => {
    const side = Math.random() < 0.5 ? canvas.width * 0.2 : canvas.width * 0.8;
    return {
      x: side,
      y: -10,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * 4 + 2,
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      width: Math.random() * 8 + 4,
      height: Math.random() * 14 + 6,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.22,
      opacity: 1,
      shape: (["rect", "circle", "ribbon"] as ConfettiShape[])[
        Math.floor(Math.random() * 3)
      ],
    };
  });

export function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let particles: Particle[] = [];
    particles.push(...spawnBurst(canvas, 130));
    const t2 = setTimeout(() => particles.push(...spawnBurst(canvas, 90)), 350);
    const t3 = setTimeout(() => particles.push(...spawnBurst(canvas, 70)), 750);

    let rafId: number;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter((p) => p.opacity > 0);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.13;
        p.vx *= 0.992;
        p.rotation += p.rotationSpeed;
        if (p.y > canvas.height * 0.55) p.opacity -= 0.022;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.width / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "ribbon") {
          ctx.beginPath();
          ctx.moveTo(-p.width / 2, -p.height / 2);
          ctx.quadraticCurveTo(p.width / 2, 0, -p.width / 2, p.height / 2);
          ctx.quadraticCurveTo(p.width / 2, 0, -p.width / 2, -p.height / 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        }
        ctx.restore();
      }

      if (particles.length > 0) rafId = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return canvasRef;
}
