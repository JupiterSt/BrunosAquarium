// assets/js/main.js — Bruno’s Aquarium motion + helpers
(function(){
  'use strict';

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Auto-apply helper classes so you don't have to edit HTML
  function autoDecorate(){
    // Make all .card and .btn reveal/tilt by default
    document.querySelectorAll('.card').forEach((el, i)=>{
      el.classList.add('reveal','tilt');
      el.dataset.delay = String(i % 3); // nice stagger
    });
    document.querySelectorAll('.btn').forEach((el, i)=>{
      el.classList.add('tilt');
      el.dataset.delay = String((i+1) % 3);
    });
    // Hero glow on the first card in the hero
    const heroFirstCard = document.querySelector('.hero .card');
    if(heroFirstCard) heroFirstCard.classList.add('hero-glow','reveal');
  }

  // Scroll reveal using IntersectionObserver
  function setupReveal(){
    if(prefersReduced) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries)=>{
      for(const entry of entries){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.14 });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  // Lightweight 3D tilt (mouse only; disabled on touch / reduced motion)
  function setupTilt(){
    if(prefersReduced) return;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if(isTouch) return;

    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
    const RAF = window.requestAnimationFrame;

    document.querySelectorAll('.tilt').forEach(el=>{
      let rect = null, rx = 0, ry = 0, tFrame = null;

      const maxDeg = el.classList.contains('btn') ? 4 : 8;

      function onEnter(){
        rect = el.getBoundingClientRect();
      }
      function onMove(e){
        if(!rect) rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        const dx = (e.clientX - cx) / (rect.width/2);
        const dy = (e.clientY - cy) / (rect.height/2);
        ry = clamp(dx * maxDeg, -maxDeg, maxDeg);   // rotateY (left/right)
        rx = clamp(-dy * maxDeg, -maxDeg, maxDeg);  // rotateX (up/down)
        if(!tFrame) tFrame = RAF(apply);
      }
      function apply(){
        tFrame = null;
        el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      }
      function onLeave(){
        el.style.transform = '';
      }

      el.addEventListener('mouseenter', onEnter, {passive:true});
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave, {passive:true});
    });
  }

  // Run after DOM is ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init(){
    autoDecorate();
    setupReveal();
    setupTilt();
  }

})();
