'use client';

import React, { useEffect, useRef } from 'react';

/**
 * FireworksBurstCanvas
 * An ultra-smooth, lightweight HTML5 Canvas fireworks / sky crackers bursting animation
 * featuring realistic rocket launches, glittering radial explosions, colorful particles,
 * gravity physics, and shimmer effects tailored for the festive crackershop hero.
 */
export default function FireworksBurstCanvas({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;

    // Handle high-DPI (Retina) screens for crystal-sharp sparks
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Festive Sky Cracker Color Palettes (Golden, Electric Blue, Vivid Magenta, Emerald, Silver White)
    const CRACKER_PALETTES = [
      ['#FFD700', '#FFA500', '#FFF275', '#FFE066'], // Golden Royale & Yellow Sparks
      ['#00D2FF', '#38BDF8', '#60A5FA', '#93C5FD'], // Electric Sky Blue & Azure
      ['#FFFFFF', '#E2E8F0', '#FDE047', '#FEF08A'], // Luminous White & Starlight
      ['#F43F5E', '#FB7185', '#FDA4AF', '#FFE4E6'], // Crimson Rose & Pink Sparks
      ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'], // Emerald Green & Lime
      ['#A855F7', '#C084FC', '#E879F9', '#F0ABFC']  // Royal Violet & Purple Sparks
    ];

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function getRandomPalette() {
      return CRACKER_PALETTES[Math.floor(Math.random() * CRACKER_PALETTES.length)];
    }

    // Explosion Burst Particle Class
    class Particle {
      constructor(x, y, palette, isSpecial = false) {
        this.x = x;
        this.y = y;
        this.palette = palette;
        this.color = palette[Math.floor(Math.random() * palette.length)];
        
        // Random spherical explosion distribution
        const angle = random(0, Math.PI * 2);
        const speed = isSpecial ? random(2, 9) : random(1.5, 6.5);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.alpha = 1;
        this.friction = 0.955; // Decelerates smoothly
        this.gravity = 0.12;    // Gently pulls downward
        this.decay = random(0.015, 0.028);
        this.size = random(1.5, 3.2);
        this.sparkle = Math.random() > 0.4;
      }

      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw() {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        
        // Twinkling shimmer effect
        if (this.sparkle && Math.random() > 0.7) {
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = this.color;
          ctx.shadowColor = this.color;
          ctx.shadowBlur = 4;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Sky Rocket Class (Shoots upwards with sparkling tail before bursting)
    class Rocket {
      constructor(startX, startY, targetX, targetY) {
        this.x = startX;
        this.y = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.palette = getRandomPalette();
        this.color = this.palette[0];
        
        const angle = Math.atan2(targetY - startY, targetX - startX);
        this.speed = random(4.5, 7.5);
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.history = [];
        this.dead = false;
      }

      update() {
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > 5) {
          this.history.shift();
        }

        this.x += this.vx;
        this.y += this.vy;

        // If it reached target height or begins descending, explode!
        if (this.y <= this.targetY || Math.hypot(this.targetX - this.x, this.targetY - this.y) < 15) {
          this.explode();
          this.dead = true;
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        if (this.history.length > 0) {
          ctx.moveTo(this.history[0].x, this.history[0].y);
          for (let i = 1; i < this.history.length; i++) {
            ctx.lineTo(this.history[i].x, this.history[i].y);
          }
        }
        ctx.strokeStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 5;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Small head spark
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.restore();
      }

      explode() {
        const particleCount = Math.floor(random(55, 95));
        const isSpecial = Math.random() > 0.6;
        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle(this.x, this.y, this.palette, isSpecial));
        }
      }
    }

    let rockets = [];
    let particles = [];
    let timer = 0;
    let nextLaunch = 40; // Frequency

    // Initial festive burst upon component mount
    setTimeout(() => {
      if (width > 0 && height > 0) {
        launchRocket(width * 0.35, height * 0.25);
        setTimeout(() => launchRocket(width * 0.65, height * 0.2), 300);
        setTimeout(() => launchRocket(width * 0.5, height * 0.35), 600);
      }
    }, 400);

    function launchRocket(customTargetX, customTargetY) {
      if (width <= 0 || height <= 0) return;
      const startX = random(width * 0.15, width * 0.85);
      const startY = height;
      const targetX = customTargetX !== undefined ? customTargetX : random(width * 0.1, width * 0.9);
      const targetY = customTargetY !== undefined ? customTargetY : random(height * 0.1, height * 0.5);
      rockets.push(new Rocket(startX, startY, targetX, targetY));
    }

    // Main 60FPS Animation Loop
    const animate = () => {
      // Clear with slight transparent trail for smooth motion blur
      ctx.clearRect(0, 0, width, height);

      timer++;
      if (timer >= nextLaunch) {
        launchRocket();
        // Occasional double sky cracker salvo
        if (Math.random() > 0.45) {
          setTimeout(() => launchRocket(), random(150, 400));
        }
        timer = 0;
        nextLaunch = Math.floor(random(45, 95)); // Launch every 0.8 - 1.6 seconds
      }

      // Update & Draw Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        rockets[i].update();
        if (rockets[i].dead) {
          rockets.splice(i, 1);
        } else {
          rockets[i].draw();
        }
      }

      // Update & Draw Explosions Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].alpha <= 0) {
          particles.splice(i, 1);
        } else {
          particles[i].draw();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Click anywhere on hero to launch a manual sky cracker to that point
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      if (clickX >= 0 && clickX <= width && clickY >= 0 && clickY <= height) {
        launchRocket(clickX, clickY);
      }
    };

    const parentElement = canvas.parentElement;
    if (parentElement) {
      parentElement.addEventListener('click', handleClick);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (parentElement) {
        parentElement.removeEventListener('click', handleClick);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-[3] ${className}`}
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
}
