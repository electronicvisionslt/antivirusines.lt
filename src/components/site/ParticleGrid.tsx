import { useEffect, useRef, useCallback } from 'react';

interface Dot {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  radius: number;
  alpha: number;
  phase: number;
  speed: number;
}

const ParticleGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -999, y: -999 });
  const sizeRef = useRef({ w: 0, h: 0 });

  const buildGrid = useCallback(() => {
    const { w, h } = sizeRef.current;
    const spacing = 38;
    const dots: Dot[] = [];
    for (let x = spacing / 2; x < w; x += spacing) {
      for (let y = spacing / 2; y < h; y += spacing) {
        dots.push({
          baseX: x,
          baseY: y,
          x,
          y,
          radius: 1.2 + Math.random() * 0.6,
          alpha: 0.08 + Math.random() * 0.07,
          phase: Math.random() * Math.PI * 2,
          speed: 0.3 + Math.random() * 0.4,
        });
      }
    }
    dotsRef.current = dots;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
      sizeRef.current = { w: rect.width, h: rect.height };
      buildGrid();
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleLeave = () => {
      mouseRef.current = { x: -999, y: -999 };
    };
    canvas.addEventListener('mousemove', handleMouse);
    canvas.addEventListener('mouseleave', handleLeave);

    let t = 0;
    const draw = () => {
      t += 0.016;
      const { w, h } = sizeRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const interactRadius = 100;

      // Use primary color HSL (192, 55%, 30%)
      for (const dot of dotsRef.current) {
        // Subtle breathing movement
        const floatX = Math.sin(t * dot.speed + dot.phase) * 2;
        const floatY = Math.cos(t * dot.speed * 0.7 + dot.phase) * 2;

        dot.x = dot.baseX + floatX;
        dot.y = dot.baseY + floatY;

        // Mouse interaction — push dots away gently
        const dx = dot.x - mx;
        const dy = dot.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let drawX = dot.x;
        let drawY = dot.y;
        let extraAlpha = 0;

        if (dist < interactRadius) {
          const force = (1 - dist / interactRadius) * 12;
          const angle = Math.atan2(dy, dx);
          drawX += Math.cos(angle) * force;
          drawY += Math.sin(angle) * force;
          extraAlpha = (1 - dist / interactRadius) * 0.15;
        }

        // Draw connecting lines to nearby dots (within mouse range)
        if (dist < interactRadius * 1.3) {
          for (const other of dotsRef.current) {
            const odx = other.x - dot.x;
            const ody = other.y - dot.y;
            const oDist = Math.sqrt(odx * odx + ody * ody);
            if (oDist > 0 && oDist < 50) {
              const oMouseDist = Math.sqrt((other.x - mx) ** 2 + (other.y - my) ** 2);
              if (oMouseDist < interactRadius * 1.3) {
                const lineAlpha = (1 - oDist / 50) * 0.08;
                ctx.beginPath();
                ctx.moveTo(drawX, drawY);
                ctx.lineTo(other.x, other.y);
                ctx.strokeStyle = `hsla(192, 55%, 30%, ${lineAlpha})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            }
          }
        }

        const finalAlpha = dot.alpha + extraAlpha;
        ctx.beginPath();
        ctx.arc(drawX, drawY, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(192, 55%, 30%, ${finalAlpha})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouse);
      canvas.removeEventListener('mouseleave', handleLeave);
    };
  }, [buildGrid]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'auto' }}
      aria-hidden="true"
    />
  );
};

export default ParticleGrid;
