"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vr: number;
  size: number;
  color: string;
};

const COLORS = ["#c1633d", "#d68652", "#e8a87c", "#d4af6a", "#7c9473", "#f0c9a5"];

export default function BirthdayCelebration({ name }: { name: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const particles: Particle[] = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 3,
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 8,
      size: 6 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="watercolor relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
      <motion.h1
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative text-center font-hand text-6xl text-clay-600 sm:text-8xl"
      >
        Happy birthday, {name}
      </motion.h1>
    </section>
  );
}
