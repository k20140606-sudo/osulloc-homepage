/* =====================================================
   main.js  (수정 가이드: 각 번호 블록은 독립적이라 필요 없는 기능은 블록째 삭제 가능)
   ===================================================== */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

/* 1. 메인 배너 슬라이드 ------------------------------------
   INTERVAL: 자동 전환 시간(ms). 마우스 올림/키보드 포커스 시 일시정지, 모바일은 좌우 스와이프 */
const INTERVAL=4000;
const hero=$('#hero'), slides=$$('.slide',hero), dots=$('.dots',hero);
let cur=0, timer=null;
slides.forEach((_,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',(i+1)+'번 배너');b.onclick=()=>show(i);dots.appendChild(b)});
function show(i){cur=(i+slides.length)%slides.length;
  slides.forEach((s,k)=>s.classList.toggle('on',k===cur));
  $$('button',dots).forEach((d,k)=>d.classList.toggle('on',k===cur));}
const start=()=>{if(!reduce){stop();timer=setInterval(()=>show(cur+1),INTERVAL)}}, stop=()=>clearInterval(timer);
$('.prev',hero).onclick=()=>show(cur-1); $('.next',hero).onclick=()=>show(cur+1);
['mouseenter','focusin'].forEach(e=>hero.addEventListener(e,stop));
['mouseleave','focusout'].forEach(e=>hero.addEventListener(e,start));
let sx=0; hero.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
hero.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>40)show(cur+(d<0?1:-1))});
show(0); start();

/* 2. 스크롤 등장 효과 (Intersection Observer) -------------
   data-reveal 이 붙은 요소가 화면에 20% 보이면 .in 클래스를 붙여 CSS 애니메이션 실행 */
const io=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.2});
$$('[data-reveal]').forEach(el=>io.observe(el));

/* 3. 부드러운 이동 : data-scroll="섹션id" 또는 href="#id" */
const goTo=id=>{const t=document.getElementById(id);t&&t.scrollIntoView({behavior:reduce?'auto':'smooth'})};
$$('[data-scroll]').forEach(b=>b.onclick=()=>goTo(b.dataset.scroll));

/* 4. 모바일 햄버거 메뉴 : #mnav 에 .open 토글, 링크 클릭/ESC 시 닫힘 */
const burger=$('#burger'), mnav=$('#mnav');
const menu=o=>{mnav.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);burger.textContent=o?'✕':'☰';document.body.style.overflow=o?'hidden':''};
burger.onclick=()=>menu(!mnav.classList.contains('open'));
$$('a',mnav).forEach(a=>a.onclick=()=>menu(false));

/* 5. 모달 : 제품 카드(.card) 상세 보기용. ESC/바깥 클릭/✕ 로 닫기
   (콘텐츠 카드 4개는 모달 없이 <a> 링크로 공식 페이지가 새 탭에서 열림) */
const ov=$('#ov'); let lastBtn=null;
function open(btn){
  lastBtn=btn;
  $('#mImg').src=btn.dataset.img; $('#mImg').alt=btn.dataset.name;
  $('#mTitle').textContent=btn.dataset.name; $('#mDesc').textContent=btn.dataset.desc;
  $('#mMore').textContent=btn.dataset.more||'';
  ov.hidden=false; $('#mClose').focus();}
const close=()=>{ov.hidden=true;lastBtn&&lastBtn.focus()};
$$('.card').forEach(b=>b.onclick=()=>open(b));
$('#mClose').onclick=close; ov.onclick=e=>{if(e.target===ov)close()};
addEventListener('keydown',e=>{if(e.key==='Escape'){close();menu(false)}});

/* 6. TOP 버튼 : 400px 이상 스크롤하면 표시 */
const topBtn=$('#topBtn');
addEventListener('scroll',()=>topBtn.classList.toggle('show',scrollY>400),{passive:true});
topBtn.onclick=()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'});
})();
