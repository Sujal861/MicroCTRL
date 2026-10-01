"use client";

import React, { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  radius: number;
  label: string;
  pulse: number;
}

export default function ConstellationGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let visible = true;

    const mouse = {
      x: -1000,
      y: -1000,
      prevX: -1000,
      prevY: -1000,
      vx: 0,
      vy: 0,
      radius: 140,
    };

    let nodes: Node[] = [];

    const initNodes = () => {
      nodes = [];
      const spacing = 56;
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          nodes.push({
            x,
            y,
            vx: 0,
            vy: 0,
            baseX: x,
            baseY: y,
            radius: 1.1,
            label: `${(i * 7).toString(16).toUpperCase()}:${(j * 11).toString(16).toUpperCase()}`,
            pulse: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    const handleResize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes();
      if (reduced) draw(0.016);
    };

    const toLocal = (clientX: number, clientY: number) => {
      const rect = wrap.getBoundingClientRect();
      mouse.x = clientX - rect.left;
      mouse.y = clientY - rect.top;
    };

    const handleMouseMove = (e: MouseEvent) => toLocal(e.clientX, e.clientY);
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(wrap);
    handleResize();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduced && !animationFrameId) {
        animationFrameId = requestAnimationFrame(render);
      }
    });
    io.observe(wrap);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    let lastTime = performance.now();

    const draw = (dt: number) => {
      mouse.vx = (mouse.x - mouse.prevX) / (dt * 1000 || 1);
      mouse.vy = (mouse.y - mouse.prevY) / (dt * 1000 || 1);
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      const speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);

      ctx.fillStyle = "#0B1117";
      ctx.fillRect(0, 0, width, height);

      const spring = reduced ? 0 : 14;
      const damping = 0.84;

      for (const n of nodes) {
        n.pulse += dt * 1.4;
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.hypot(dx, dy);
        if (!reduced && dist < mouse.radius && dist > 0) {
          const power = 1 - dist / mouse.radius;
          const force = power * (700 + speed * 80);
          const angle = Math.atan2(dy, dx);
          n.vx -= Math.cos(angle) * force * dt;
          n.vy -= Math.sin(angle) * force * dt;
        }
        n.vx += (n.baseX - n.x) * spring * dt;
        n.vy += (n.baseY - n.y) * spring * dt;
        n.vx *= damping;
        n.vy *= damping;
        n.x += n.vx * dt * 60;
        n.y += n.vy * dt * 60;
      }

      const maxDist = 72;
      const maxSq = maxDist * maxDist;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const ndx = n.x - n2.x;
          const ndy = n.y - n2.y;
          const distSq = ndx * ndx + ndy * ndy;
          if (distSq < maxSq) {
            const nDist = Math.sqrt(distSq);
            const alpha = (1 - nDist / maxDist) * 0.16;
            ctx.strokeStyle = `rgba(167, 176, 184, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        const dist = Math.hypot(mouse.x - n.x, mouse.y - n.y);
        const isNear = dist < mouse.radius;
        const alpha = isNear ? 0.9 : 0.28;
        ctx.fillStyle = isNear
          ? `rgba(63, 166, 107, ${alpha})`
          : `rgba(167, 176, 184, ${alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, isNear ? 2.2 : 1.15, 0, Math.PI * 2);
        ctx.fill();
        if (dist < 72) {
          ctx.font = "8px ui-monospace, SFMono-Regular, Consolas, monospace";
          ctx.fillStyle = "rgba(63, 166, 107, 0.8)";
          ctx.fillText(n.label, n.x + 8, n.y - 8);
        }
      }
    };

    const render = (now: number) => {
      animationFrameId = 0;
      if (!visible) return;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      draw(dt);
      animationFrameId = requestAnimationFrame(render);
    };

    if (!reduced) animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      io.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="h-full w-full">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
