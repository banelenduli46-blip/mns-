const d=document.getElementById('dlg');
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>{document.getElementById('menu').classList.remove('open');d.showModal()}));
document.getElementById('cl').onclick=()=>d.close();
d.addEventListener('click',e=>{if(e.target===d)d.close()});
const bg=document.getElementById('bg'),mn=document.getElementById('menu');
bg.onclick=()=>{const o=mn.classList.toggle('open');bg.setAttribute('aria-expanded',o)};
mn.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mn.classList.remove('open');bg.setAttribute('aria-expanded',false)}));
function initServiceCarousel(stageId,countId){
 const stage=document.getElementById(stageId);
 if(!stage)return;
 const slides=[...stage.querySelectorAll('.service-slide')],count=document.getElementById(countId);
 if(!slides.length)return;
 let current=0,pointerStart=null;
 const showService=index=>{
  current=(index+slides.length)%slides.length;
  const width=stage.clientWidth,cardWidth=slides[0].offsetWidth;
  const step=Math.min(cardWidth*.8,width*.8);
  slides.forEach((slide,i)=>{
   let offset=(i-current+slides.length)%slides.length;
   if(offset>slides.length/2)offset-=slides.length;
   slide.style.left=`calc(50% - ${cardWidth/2}px)`;
   const distance=Math.abs(offset);
   const scale=Math.max(.62,1-distance*.12);
   const opacity=[1,.78,.52,.3,.12][Math.min(distance,4)];
   slide.style.transform=`translate3d(${offset*step}px,${distance*9}px,0) scale(${scale}) rotateY(${-offset*5}deg)`;
   slide.style.opacity=opacity;
   slide.style.zIndex=slides.length-distance;
   slide.setAttribute('aria-hidden',i!==current);
   slide.setAttribute('aria-label',`${i+1} of ${slides.length}: ${slide.querySelector('h3').textContent}`);
   slide.inert=i!==current;
  });
  if(count)count.textContent=`${String(current+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')} — ${slides[current].querySelector('h3').textContent}`;
 };
 const prev=stage.querySelector('.service-nav-prev');
 const next=stage.querySelector('.service-nav-next');
 prev?.addEventListener('click',()=>showService(current-1));
 next?.addEventListener('click',()=>showService(current+1));
 stage.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'){event.preventDefault();showService(current-1)}
  if(event.key==='ArrowRight'){event.preventDefault();showService(current+1)}
 });
 stage.addEventListener('pointerdown',event=>{
  if(event.isPrimary&&!event.target.closest('.service-nav')){pointerStart={id:event.pointerId,x:event.clientX,y:event.clientY};stage.setPointerCapture(event.pointerId)}
 });
 stage.addEventListener('pointerup',event=>{
  if(!pointerStart||pointerStart.id!==event.pointerId)return;
  const deltaX=event.clientX-pointerStart.x,deltaY=event.clientY-pointerStart.y;
  pointerStart=null;
  if(Math.abs(deltaX)>45&&Math.abs(deltaX)>Math.abs(deltaY))showService(current+(deltaX<0?1:-1));
 });
 stage.addEventListener('pointercancel',()=>{pointerStart=null});
 addEventListener('resize',()=>showService(current),{passive:true});
 showService(current);
}
initServiceCarousel('service-stage','service-count');
initServiceCarousel('b2b-stage','b2b-count');
const enquiryForm=document.getElementById('f');
if(enquiryForm){
 const status=document.getElementById('form-status'),submitButton=document.getElementById('form-submit');
 enquiryForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!enquiryForm.reportValidity())return;
  status.textContent='Sending your enquiry…';
  submitButton.disabled=true;
  const endpoint=new URL(enquiryForm.action);
  endpoint.pathname=`/ajax${endpoint.pathname}`;
  try{
   const response=await fetch(endpoint,{method:'POST',body:new FormData(enquiryForm),headers:{Accept:'application/json'}});
   const result=await response.json().catch(()=>null);
   if(!response.ok||!result||(result.success!==true&&result.success!=='true')){
    status.textContent=result?.message||'The enquiry service did not accept the submission. Please email operationsit@mnsinvestmentsholdings.co.za directly.';
    return;
   }
   status.textContent='Your enquiry has been sent to MNS Operations.';
   enquiryForm.reset();
  }catch(error){
   status.textContent='Could not connect to the enquiry service. Please email operationsit@mnsinvestmentsholdings.co.za directly.';
  }finally{
   submitButton.disabled=false;
  }
 });
}
const links=[...mn.querySelectorAll('a')],secs=links.map(a=>document.querySelector(a.getAttribute('href')));
addEventListener('scroll',()=>{let k=-1;secs.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<140)k=i});links.forEach((a,i)=>a.classList.toggle('on',i===k))},{passive:true});
if(matchMedia('(hover:hover)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
 document.querySelectorAll('.tilt').forEach(el=>{
  el.addEventListener('pointermove',e=>{const b=el.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;
   el.style.transform=`perspective(800px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateZ(6px)`});
  el.addEventListener('pointerleave',()=>el.style.transform='')})}
(function(){const h=document.querySelector('.hero'),a=document.querySelector('.hero-art');
 if(!h||!a||!matchMedia('(hover:hover)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 h.addEventListener('pointermove',e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;a.style.transform=`perspective(1200px) rotateY(${x*7}deg) rotateX(${-y*5}deg)`});
 h.addEventListener('pointerleave',()=>a.style.transform='')})();
