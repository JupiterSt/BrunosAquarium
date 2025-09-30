/* assets/js/main.js — Bruno’s Aquarium shared UX */

(function(){
  // Dismissible announcement bar
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('.announce-x');
    if (!btn) return;
    const bar = btn.closest('.announce');
    if (bar) bar.style.display = 'none';
  });

  // Auto-apply hero glow to the first hero card
  const heroFirstCard = document.querySelector('.hero .card');
  if (heroFirstCard && !heroFirstCard.classList.contains('hero-glow')) {
    heroFirstCard.classList.add('hero-glow');
  }

  // Scroll reveal for .reveal elements
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const io = new IntersectionObserver((entries)=>{
      for (const ent of entries) {
        if (ent.isIntersecting) {
          ent.target.classList.add('in');
          io.unobserve(ent.target);
        }
      }
    }, {rootMargin:'0px 0px -10% 0px', threshold:0.1});
    reveals.forEach(el=>io.observe(el));
  }

  // Lightweight tilt (optional): elements with .tilt
  document.querySelectorAll('.tilt').forEach(el=>{
    const strength = 8;
    function move(e){
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const rx = (0.5 - y) * strength;
      const ry = (x - 0.5) * strength;
      el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
    function reset(){ el.style.transform = ''; }
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', reset);
    el.addEventListener('blur', reset, true);
  });
})();
