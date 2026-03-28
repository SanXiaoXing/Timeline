import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  color: string;
  driftX: number;
  driftY: number;
}

interface Meteor {
  x: number;
  y: number;
  len: number;
  speed: number;
  opacity: number;
  angle: number;
}

const StarryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars: Star[] = [];
    const starCount = Math.floor((width * height) / 10000); // Slightly less dense for cleaner look

    const colors = ['#fff', '#e0f2fe', '#fef3c7', '#fff']; // white, blue, yellow, white

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.2 + 0.3,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.01 + 0.002,
        color: colors[Math.floor(Math.random() * colors.length)],
        driftX: (Math.random() - 0.5) * 0.05,
        driftY: (Math.random() - 0.5) * 0.05,
      });
    }

    const meteors: Meteor[] = [];

    const createMeteor = () => {
      const side = Math.random() > 0.5 ? 'top' : 'right';
      let x, y;
      if (side === 'top') {
        x = Math.random() * width;
        y = -20;
      } else {
        x = width + 20;
        y = Math.random() * height * 0.5;
      }

      meteors.push({
        x,
        y,
        len: Math.random() * 80 + 50,
        speed: Math.random() * 10 + 15,
        opacity: 1,
        angle: Math.PI * 0.75, // 135 degrees
      });
    };

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Stars
      stars.forEach((star) => {
        // Star movement (slow drift)
        star.x += star.driftX;
        star.y += star.driftY;

        // Wrap around
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        star.opacity += star.twinkleSpeed;
        if (star.opacity > 1 || star.opacity < 0) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity * 0.8;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw Meteors
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += Math.cos(m.angle) * m.speed;
        m.y -= Math.sin(m.angle) * m.speed; // Note: y is inverted in canvas
        m.opacity -= 0.015;

        if (m.opacity <= 0 || m.x < -100 || m.y > height + 100) {
          meteors.splice(i, 1);
          continue;
        }

        const gradient = ctx.createLinearGradient(
          m.x,
          m.y,
          m.x - Math.cos(m.angle) * m.len,
          m.y + Math.sin(m.angle) * m.len
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${m.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - Math.cos(m.angle) * m.len, m.y + Math.sin(m.angle) * m.len);
        ctx.stroke();
      }

      // Randomly create meteor
      if (Math.random() < 0.002) {
        createMeteor();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      // Re-populate stars on large resize to maintain density
      stars.length = 0;
      const newStarCount = Math.floor((width * height) / 10000);
      for (let i = 0; i < newStarCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.2 + 0.3,
          opacity: Math.random(),
          twinkleSpeed: Math.random() * 0.01 + 0.002,
          color: colors[Math.floor(Math.random() * colors.length)],
          driftX: (Math.random() - 0.5) * 0.05,
          driftY: (Math.random() - 0.5) * 0.05,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
};

export default StarryBackground;
