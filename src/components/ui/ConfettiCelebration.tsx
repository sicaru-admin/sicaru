"use client";

import { useEffect, useState } from "react";

const COLORS = ["#E84393", "#D4A853", "#6B3FA0", "#8650B5", "#25D366"];
const PARTICLE_COUNT = 50;

type Particle = {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  rotation: number;
  size: number;
};

export function ConfettiCelebration() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const p: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 2,
      rotation: Math.random() * 720 - 360,
      size: 6 + Math.random() * 6,
    }));
    setParticles(p);

    const timer = setTimeout(() => setParticles([]), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle absolute top-0"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            ["--rotation" as string]: `${p.rotation}deg`,
          }}
        />
      ))}
    </div>
  );
}
