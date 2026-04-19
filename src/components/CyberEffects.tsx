import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function detectReducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

export function detectLowEnd(): boolean {
  try {
    return (navigator.hardwareConcurrency ?? 8) <= 4;
  } catch {
    return false;
  }
}

export function shouldDegrade(enabled: boolean): boolean {
  return !enabled || detectReducedMotion() || detectLowEnd();
}

// ---------- 彩色粒子 ----------
const CONFETTI_COLORS = [
  "#e63946", "#ff6b35", "#ffd166", "#06d6a0",
  "#4cc9f0", "#9b5de5", "#f72585", "#4361ee",
  "#ff9f1c", "#2ec4b6", "#c77dff", "#ffb703",
];

interface Particle {
  id: number;
  angle: number;   // 发射角度 deg
  dist: number;    // X 方向飞出距离 px
  drop: number;    // Y 方向重力下落 px
  delay: number;   // 启动延迟 ms
  dur: number;     // 动画时长 ms
  color: string;
  size: number;
  spin: number;    // 旋转角度 deg
  rect: boolean;   // 是否方形纸片
}

function generateParticles(n: number): Particle[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    angle: (360 / n) * i + (Math.random() - 0.5) * 14,
    dist: 100 + Math.random() * 160,
    drop: 110 + Math.random() * 280,
    delay: Math.floor(Math.random() * 90),
    dur: 900 + Math.floor(Math.random() * 280),
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 5 + Math.floor(Math.random() * 8),
    spin: Math.floor((Math.random() - 0.5) * 680),
    rect: i % 3 === 1,
  }));
}

interface BombProps {
  active: boolean;
  onDone: () => void;
}

export function BombEffect({ active, onDone }: BombProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;
    setParticles(generateParticles(50));
    const id = setTimeout(onDone, 1100);
    return () => clearTimeout(id);
  }, [active, onDone]);

  if (!active) return null;
  return (
    <div className="bomb-overlay">
      <div className="bomb-flash" />
      {particles.map((p) => (
        <div
          key={p.id}
          className="c-outer"
          style={{
            ["--angle" as string]: `${p.angle}deg`,
            ["--dist" as string]: `${p.dist}px`,
            ["--dur" as string]: `${p.dur}ms`,
            ["--delay" as string]: `${p.delay}ms`,
          }}
        >
          <div
            className="c-inner"
            style={{
              ["--drop" as string]: `${p.drop}px`,
              ["--spin" as string]: `${p.spin}deg`,
              ["--color" as string]: p.color,
              ["--size" as string]: `${p.size}px`,
              ["--br" as string]: p.rect ? "3px" : "50%",
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function useScreenShake(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const el = document.body;
    el.classList.add("screen-shake");
    const id = setTimeout(() => el.classList.remove("screen-shake"), 340);
    return () => {
      clearTimeout(id);
      el.classList.remove("screen-shake");
    };
  }, [active]);
}

/**
 * 简易封装：触发全屏炸弹 + shake，并在动画结束时调用 cb。
 */
export function useBombTrigger() {
  const [active, setActive] = useState(false);
  useScreenShake(active);
  const trigger = (cb?: () => void) => {
    setActive(true);
    setTimeout(() => { cb?.(); }, 600);
    setTimeout(() => setActive(false), 900);
  };
  return { active, trigger };
}

// ---------- 卡片礼花（从卡片中心爆发）----------
export interface FireworkOrigin { x: number; y: number }

interface CardFireworkProps {
  origin: FireworkOrigin | null;
  onDone: () => void;
}

export function CardFirework({ origin, onDone }: CardFireworkProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!origin) return;
    setParticles(generateParticles(28));
    const id = setTimeout(onDone, 1000);
    return () => clearTimeout(id);
  }, [origin, onDone]);

  if (!origin) return null;
  // 通过 Portal 渲染到 body，避免被卡片的 transform 动画影响
  return createPortal(
    <div
      className="firework-burst"
      style={{ left: origin.x, top: origin.y } as React.CSSProperties}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="c-outer"
          style={{
            ["--angle" as string]: `${p.angle}deg`,
            ["--dist" as string]: `${Math.round(p.dist * 0.55)}px`,
            ["--dur" as string]: `${p.dur}ms`,
            ["--delay" as string]: `${p.delay}ms`,
          }}
        >
          <div
            className="c-inner"
            style={{
              ["--drop" as string]: `${Math.round(p.drop * 0.6)}px`,
              ["--spin" as string]: `${p.spin}deg`,
              ["--color" as string]: p.color,
              ["--size" as string]: `${Math.max(4, p.size - 2)}px`,
              ["--br" as string]: p.rect ? "3px" : "50%",
            }}
          />
        </div>
      ))}
    </div>,
    document.body
  );
}
