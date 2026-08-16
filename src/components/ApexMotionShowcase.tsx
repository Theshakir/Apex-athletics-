import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Play, Trophy, Users, Zap } from 'lucide-react';
import './ApexMotionShowcase.css';

const reviews = [
  ['01', '"Apex made running feel like a movement, not just a race."', 'ATHLETE'],
  ['02', '"Professional events. Real energy. One strong community."', 'RUNNER'],
  ['03', '"The next generation of sport starts here."', 'COMMUNITY'],
];

export default function ApexMotionShowcase() {
  const root = useRef<HTMLDivElement>(null);
  const [review, setReview] = useState(0);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const x = e.clientX / innerWidth - .5;
      const y = e.clientY / innerHeight - .5;
      el.style.setProperty('--mx', `${x * 22}px`);
      el.style.setProperty('--my', `${y * 18}px`);
      el.style.setProperty('--rx', `${-y * 8}deg`);
      el.style.setProperty('--ry', `${x * 12}deg`);
    };
    addEventListener('pointermove', onMove);
    return () => removeEventListener('pointermove', onMove);
  }, []);

  useEffect(() => {
    const nodes = root.current?.querySelectorAll('.ams-reveal');
    if (!nodes) return;
    const io = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')), { threshold: .14 });
    nodes.forEach(n => io.observe(n));
    return () => io.disconnect();
  }, []);

  return <div className="ams" ref={root}>
    <div className="ams-grid" />
    <header className="ams-nav">
      <div className="ams-logo">APEX <span>ATHLETICS</span></div>
      <button className="ams-menu" onClick={() => setMenu(!menu)}>{menu ? 'CLOSE' : 'MENU'}</button>
      <nav className={menu ? 'open' : ''}>
        <a href="#ams-events">EVENTS</a><a href="#ams-athletes">ATHLETES</a><a href="#ams-reviews">REVIEWS</a><a href="#ams-contact">CONTACT</a>
      </nav>
    </header>

    <section className="ams-hero">
      <div className="ams-copy ams-reveal is-visible">
        <div className="ams-kicker"><Zap size={14}/> SPORT • PERFORMANCE • COMMUNITY</div>
        <h1>BREAK<br/><i>THE</i><br/>LIMIT.</h1>
        <p>Train with purpose. Run with power. Build a stronger generation.</p>
        <div className="ams-actions"><a href="#ams-events" className="ams-primary">EXPLORE EVENTS <ArrowUpRight size={17}/></a><a href="#ams-athletes" className="ams-ghost">MEET THE ATHLETES <ArrowDown size={16}/></a></div>
      </div>
      <div className="ams-orbit" aria-hidden="true"><div className="ams-orbit-ring r1"/><div className="ams-orbit-ring r2"/><div className="ams-athlete"><div className="head"/><div className="body"/><div className="arm a"/><div className="arm b"/><div className="leg c"/><div className="leg d"/><div className="shoe e"/><div className="shoe f"/></div><div className="ams-orb-label">APEX<br/><small>01</small></div></div>
      <div className="ams-scroll"><span>SCROLL TO EXPLORE</span><ArrowDown size={15}/></div>
    </section>

    <section className="ams-section" id="ams-athletes">
      <div className="ams-section-head ams-reveal"><div><span className="ams-kicker">THE APEX STANDARD</span><h2>BUILT FOR<br/><em>ATHLETES.</em></h2></div><p>Performance is not a moment.<br/>It's a mindset.</p></div>
      <div className="ams-cards">
        <article className="ams-card ams-reveal"><Trophy/><strong>01</strong><h3>COMPETE</h3><p>Events designed to turn effort into achievement.</p></article>
        <article className="ams-card featured ams-reveal"><Zap/><strong>02</strong><h3>PERFORM</h3><p>Train smarter, move faster and push beyond yesterday.</p></article>
        <article className="ams-card ams-reveal"><Users/><strong>03</strong><h3>CONNECT</h3><p>A community where every runner has a place.</p></article>
      </div>
    </section>

    <section className="ams-event" id="ams-events"><div className="ams-event-art ams-reveal"><div className="ams-number">04</div><div className="ams-event-circle">KM</div></div><div className="ams-event-copy ams-reveal"><span className="ams-kicker">UPCOMING EXPERIENCE</span><h2>RUN<br/><em>YOUR</em><br>RACE.</h2><p>From local runs to ambitious athletic experiences — APEX creates events built around movement, discipline and community.</p><a className="ams-primary" href="#ams-contact">VIEW EVENT <ArrowUpRight size={17}/></a></div></section>

    <section className="ams-reviews" id="ams-reviews"><div className="ams-kicker">ATHLETE VOICES</div><div className="review-line">{reviews[review][1]}</div><div className="review-meta"><span>{reviews[review][0]} / 03 — {reviews[review][2]}</span><div><button onClick={() => setReview((review + reviews.length - 1) % reviews.length)}><ArrowUp size={16}/></button><button onClick={() => setReview((review + 1) % reviews.length)}><ArrowDown size={16}/></button></div></div></section>

    <section className="ams-final" id="ams-contact"><div className="ams-final-glow"/><span className="ams-kicker">APEX ATHLETICS • SINCE 2026</span><h2>YOUR<br/><i>NEXT</i><br>STARTS NOW.</h2><a className="ams-primary" href="#ams-events">JOIN THE MOVEMENT <ArrowUpRight size={17}/></a></section>
  </div>;
}
