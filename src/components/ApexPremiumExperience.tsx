import React, { useEffect, useRef, useState } from 'react';
import './ApexPremiumExperience.css';

const features = [
  ['01', 'RUN BEYOND LIMITS', 'Built for athletes who refuse ordinary.'],
  ['02', 'DISCIPLINE OVER EXCUSES', 'Every kilometre is a statement.'],
  ['03', 'COMMUNITY IN MOTION', 'One valley. One movement. Thousands of possibilities.'],
];

const events = [
  { title: 'APEX 4K MARATHON', meta: 'KULGAM • 21 AUGUST', tag: 'OPEN', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=85' },
  { title: 'APEX FITNESS DAY', meta: 'SOUTH KASHMIR • COMING SOON', tag: 'SOON', image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1200&q=85' },
  { title: 'ATHLETE CAMP', meta: 'KULGAM • COMING SOON', tag: 'SOON', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=85' },
];

export default function ApexPremiumExperience() {
  const hero = useRef<HTMLDivElement>(null);
  const [login, setLogin] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [review, setReview] = useState(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const root = hero.current;
      if (!root) return;
      root.style.setProperty('--mx', `${(e.clientX / innerWidth - .5) * 2}`);
      root.style.setProperty('--my', `${(e.clientY / innerHeight - .5) * 2}`);
    };
    const onScroll = () => document.documentElement.style.setProperty('--scroll', `${scrollY}`);
    addEventListener('pointermove', onMove); addEventListener('scroll', onScroll, { passive: true });
    return () => { removeEventListener('pointermove', onMove); removeEventListener('scroll', onScroll); };
  }, []);

  return <div className="apex-premium" ref={hero}>
    <nav className="apex-nav">
      <div className="apex-logo">APEX <span>ATHLETICS</span></div>
      <div className="apex-navlinks"><a href="#events">Events</a><a href="#movement">Movement</a><a href="#reviews">Reviews</a><button onClick={() => setLogin(true)}>LOGIN</button></div>
    </nav>

    <main>
      <section className="apex-hero">
        <div className="hero-grid" />
        <div className="hero-orb hero-orb-a" /><div className="hero-orb hero-orb-b" />
        <div className="hero-ring ring-a" /><div className="hero-ring ring-b" />
        <div className="hero-copy reveal"><div className="eyebrow">SINCE 2026 • KULGAM, JAMMU & KASHMIR</div><h1>RUN<br/><i>BEYOND</i><br/>LIMITS.</h1><p>We don't create runners. We create a movement.</p><div className="hero-actions"><a href="#events">EXPLORE EVENTS <b>↗</b></a><button onClick={() => setLogin(true)}>ATHLETE LOGIN</button></div></div>
        <div className="hero-athlete" aria-hidden="true"><div className="athlete-aura" /><div className="athlete-core">APEX</div><div className="athlete-ring" /></div>
        <div className="scroll-mark">SCROLL TO EVOLVE ↓</div>
      </section>

      <section className="statement" id="movement"><div className="section-label">THE MOVEMENT</div><h2>DISCIPLINE<br/><span>BUILDS</span> WHAT<br/>MOTIVATION STARTS.</h2><p>APEX Athletics is a sports and fitness movement built around endurance, community and the belief that your strongest version is always one more step away.</p></section>

      <section className="feature-grid">{features.map(([n,t,d]) => <article className="feature-card reveal" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><div className="feature-arrow">↗</div></article>)}</section>

      <section className="events" id="events"><div className="section-head"><div><div className="section-label">NEXT CHAPTER</div><h2>EVENTS <span>IN MOTION.</span></h2></div><a href="#events">VIEW ALL ↗</a></div><div className="event-grid">{events.map(e => <article className="event-card reveal" key={e.title}><div className="event-image" style={{backgroundImage:`url(${e.image})`}}><span>{e.tag}</span></div><div className="event-body"><small>{e.meta}</small><h3>{e.title}</h3><button onClick={() => setLogin(true)}>REGISTER <b>→</b></button></div></article>)}</div></section>

      <section className="numbers"><div><strong>01</strong><span>VISION</span></div><div><strong>04K</strong><span>MARATHON</span></div><div><strong>∞</strong><span>POSSIBILITIES</span></div><div><strong>2026</strong><span>SINCE</span></div></section>

      <section className="reviews" id="reviews"><div className="section-label">ATHLETE VOICES</div><h2>THEY RAN.<br/><span>THEY FELT IT.</span></h2><div className="review-stage"><button onClick={() => setReview((review + 2) % 3)}>←</button><div><div className="quote">“{['The energy was unreal. APEX made the race feel bigger than a race.','A powerful community experience from start to finish.','The kind of event that makes you want to train harder.'][review]}”</div><small>— APEX ATHLETE • KULGAM</small></div><button onClick={() => setReview((review + 1) % 3)}>→</button></div></section>

      <section className="cta-section"><div className="cta-glow"/><div className="section-label">YOUR NEXT VERSION</div><h2>READY TO<br/><span>MOVE?</span></h2><button onClick={() => setLogin(true)}>JOIN APEX <b>↗</b></button></section>
    </main>

    <footer><div className="apex-logo">APEX <span>ATHLETICS</span></div><p>TRAIN HARD. RUN FREE. LIVE APEX.</p><button onClick={() => setAdmin(true)}>ADMIN</button></footer>

    {login && <div className="modal-backdrop" onClick={() => setLogin(false)}><div className="auth-modal" onClick={e => e.stopPropagation()}><button className="close" onClick={() => setLogin(false)}>×</button><div className="section-label">ATHLETE ACCESS</div><h2>WELCOME<br/><span>BACK.</span></h2><input placeholder="Email / Phone"/><input placeholder="Password" type="password"/><button className="primary">LOGIN ↗</button><p>New athlete? <b>Create account</b></p></div></div>}
    {admin && <div className="modal-backdrop" onClick={() => setAdmin(false)}><div className="admin-modal" onClick={e => e.stopPropagation()}><button className="close" onClick={() => setAdmin(false)}>×</button><div className="section-label">APEX CONTROL</div><h2>ADMIN<br/><span>COMMAND.</span></h2><div className="admin-stats"><div><b>1,250</b><small>ATHLETES</small></div><div><b>12</b><small>EVENTS</small></div><div><b>98%</b><small>SUCCESS</small></div></div><button className="primary">OPEN DASHBOARD ↗</button></div></div>}
  </div>;
}
