import { useEffect, useRef } from 'react';
import './Apex3DExperience.css';

export default function Apex3DExperience() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const move = (x: number, y: number) => {
      const rx = (y / window.innerHeight - 0.5) * -10;
      const ry = (x / window.innerWidth - 0.5) * 14;
      el.style.setProperty('--rx', `${rx}deg`);
      el.style.setProperty('--ry', `${ry}deg`);
    };
    const onPointer = (e: PointerEvent) => move(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => e.touches[0] && move(e.touches[0].clientX, e.touches[0].clientY);
    window.addEventListener('pointermove', onPointer);
    window.addEventListener('touchmove', onTouch, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('touchmove', onTouch);
    };
  }, []);

  return (
    <section className="apex3d" ref={heroRef} aria-label="APEX Athletics 3D experience">
      <div className="apex3d__glow" />
      <div className="apex3d__ring apex3d__ring--one" />
      <div className="apex3d__ring apex3d__ring--two" />
      <div className="apex3d__content">
        <span className="apex3d__eyebrow">SPORT • FITNESS • PERFORMANCE</span>
        <h2>PUSH <span>YOUR</span><br />LIMITS.</h2>
        <p>Train harder. Run stronger. Become your next version.</p>
      </div>
      <div className="apex3d__orb" aria-hidden="true">
        <div className="apex3d__orb-core">APEX</div>
      </div>
      <div className="apex3d__bottom">DISCIPLINE BUILDS WHAT MOTIVATION STARTS.</div>
    </section>
  );
}
