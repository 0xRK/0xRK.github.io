import { useState, useEffect, useRef, useCallback } from 'react';
import './Cat.css';

// Bed position (percentage of viewport)
const BED_X = 62;
const BED_Y = 58;

// Walking speed in pixels per frame (~60fps)
const WALK_SPEED = 2.5;
// Distance threshold: cat stops walking when close enough to cursor
const STOP_DIST = 50;
// Distance threshold: cat starts walking again when cursor moves far enough
const START_DIST = 80;
// Minimum horizontal distance before changing facing direction
const FACE_THRESHOLD = 15;

type CatState = 'sleeping' | 'walking' | 'idle' | 'going-home' | 'petted';

export function Cat() {
  const [catState, setCatState] = useState<CatState>('sleeping');
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const elRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);
  const facingRef = useRef<'left' | 'right'>('left');
  const isMovingRef = useRef(false);
  const [hearts, setHearts] = useState<{ id: number; angle: number }[]>([]);
  const [petCount, setPetCount] = useState(0);

  const bedPos = useCallback(() => ({
    x: (BED_X / 100) * window.innerWidth,
    y: (BED_Y / 100) * window.innerHeight,
  }), []);

  // Set initial position slightly above the bed so the bed is visible
  useEffect(() => {
    const bed = bedPos();
    posRef.current = { x: bed.x, y: bed.y - 25 };
    if (elRef.current) {
      elRef.current.style.left = `${bed.x}px`;
      elRef.current.style.top = `${bed.y - 25}px`;
    }
  }, [bedPos]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    targetRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  // Petting timer — return to idle after a moment, resets on each pet
  useEffect(() => {
    if (petCount === 0) return;
    const timer = setTimeout(() => setCatState('idle'), 1500);
    return () => clearTimeout(timer);
  }, [petCount]);

  // Following animation loop
  useEffect(() => {
    if (catState === 'sleeping' || catState === 'petted') return;

    const goingHome = catState === 'going-home';

    if (!goingHome) {
      window.addEventListener('mousemove', onMouseMove);
    }

    isMovingRef.current = goingHome || catState === 'walking';

    const animate = () => {
      const pos = posRef.current;
      const target = targetRef.current;

      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Check if cat arrived home (tight threshold so it lands on the bed)
      if (goingHome && dist < 10) {
        isMovingRef.current = false;
        setCatState('sleeping');
        return;
      }

      // Hysteresis: start moving when far, stop when close
      if (!goingHome) {
        if (!isMovingRef.current && dist > START_DIST) {
          isMovingRef.current = true;
          setCatState('walking');
        } else if (isMovingRef.current && dist < STOP_DIST) {
          isMovingRef.current = false;
          setCatState('idle');
        }
      }

      // Always update facing direction, even when idle
      if (Math.abs(dx) > FACE_THRESHOLD) {
        const newFacing = dx > 0 ? 'right' : 'left';
        if (newFacing !== facingRef.current) {
          facingRef.current = newFacing;
          if (emojiRef.current) {
            emojiRef.current.classList.toggle('cat__emoji--right', newFacing === 'right');
          }
        }
      }

      if (isMovingRef.current && dist > 1) {
        pos.x += (dx / dist) * WALK_SPEED;
        pos.y += (dy / dist) * WALK_SPEED;
      }

      if (elRef.current) {
        elRef.current.style.left = `${pos.x}px`;
        elRef.current.style.top = `${pos.y}px`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (!goingHome) {
        window.removeEventListener('mousemove', onMouseMove);
      }
      cancelAnimationFrame(rafRef.current);
    };
  }, [catState, onMouseMove]);

  // Click cat to wake or pet it
  const handleCatClick = () => {
    if (catState === 'sleeping') {
      targetRef.current = { ...posRef.current };
      isMovingRef.current = false;
      setCatState('idle');
    } else if (catState !== 'going-home') {
      isMovingRef.current = false;
      const id = Date.now();
      const angle = Math.random() * 360; // any direction
      setHearts((prev) => [...prev, { id, angle }]);
      setTimeout(() => setHearts((prev) => prev.filter((h) => h.id !== id)), 1500);
      setCatState('petted');
      setPetCount((c) => c + 1);
    }
  };

  // Click bed to send cat home
  const handleBedClick = () => {
    if (catState !== 'sleeping') {
      const bed = bedPos();
      targetRef.current = { x: bed.x, y: bed.y - 25 };
      setCatState('going-home');
    }
  };

  return (
    <>
      {/* Cat bed */}
      <div
        className="cat-bed"
        style={{
          left: `${BED_X}%`,
          top: `${BED_Y}%`,
        }}
        onClick={handleBedClick}
        title={catState !== 'sleeping' ? 'Click to call Gloobert home' : "Gloobert's bed"}
      >
        <span className="cat-bed__emoji">🛏️</span>
        <span className="cat-bed__label">
          {catState !== 'sleeping' ? 'Go to sleep!' : 'Wake him up!'}
        </span>
      </div>

      {/* Cat */}
      <div
        ref={elRef}
        className={`cat cat--${catState}`}
        onClick={handleCatClick}
        title={catState === 'sleeping' ? 'Click to wake Gloobert!' : 'Gloobert'}
      >
        <span className="cat__label">Gloobert</span>
        {hearts.map(({ id, angle }) => (
          <span key={id} className="cat__heart" style={{ '--heart-angle': `${angle}deg` } as React.CSSProperties}>❤️</span>
        ))}
        <span ref={emojiRef} className="cat__emoji">
          {catState === 'sleeping' ? '😼' : catState === 'petted' ? '😻' : '🐈\u200d⬛'}
        </span>
        {catState === 'sleeping' && <span className="cat__zzz">💤</span>}
      </div>
    </>
  );
}
