import { useEffect, useRef } from 'react';

/**
 * The decorative red "bloom" behind a hero. The glow follows the pointer
 * across its section, easing toward the cursor rather than snapping, and
 * drifts back to its resting corner when the pointer leaves.
 *
 * Honours `prefers-reduced-motion`: there the bloom simply renders static at
 * its resting position and no listeners are attached.
 */
export default function Bloom() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    // matchMedia is absent in jsdom (and some embedded webviews); treat a
    // missing implementation as "no stated preference" rather than crashing.
    if (typeof window.matchMedia === 'function') {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    }

    // Resting position matches the CSS defaults, so the first frame is seamless.
    const restX = 30;
    const restY = 42;
    let targetX = restX;
    let targetY = restY;
    let currentX = restX;
    let currentY = restY;
    let frame = 0;
    let running = false;

    const step = () => {
      // Ease toward the pointer; the lag is what makes it feel like light.
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      el.style.setProperty('--bloom-x', `${currentX.toFixed(2)}%`);
      el.style.setProperty('--bloom-y', `${currentY.toFixed(2)}%`);

      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        frame = requestAnimationFrame(step);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(step);
    };

    const handleMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      targetX = ((event.clientX - rect.left) / rect.width) * 100;
      targetY = ((event.clientY - rect.top) / rect.height) * 100;
      start();
    };

    const handleLeave = () => {
      targetX = restX;
      targetY = restY;
      start();
    };

    host.addEventListener('pointermove', handleMove);
    host.addEventListener('pointerleave', handleLeave);
    return () => {
      host.removeEventListener('pointermove', handleMove);
      host.removeEventListener('pointerleave', handleLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="wash-drift" aria-hidden="true" ref={ref} />;
}
