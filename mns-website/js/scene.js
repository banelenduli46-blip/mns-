(function(){
const c=document.getElementById('scene');if(!c||!window.THREE)return;
let r;try{r=new THREE.WebGLRenderer({canvas:c,antialias:true,alpha:true})}catch(e){return}
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const sc=new THREE.Scene();sc.fog=new THREE.FogExp2(0x0b1730,.02);
const cam=new THREE.PerspectiveCamera(50,1,.1,200);
sc.add(new THREE.AmbientLight(0x7088b8,.9));
const dl=new THREE.DirectionalLight(0xffe2a8,1.2);dl.position.set(8,14,6);sc.add(dl);
const city=new THREE.Group();sc.add(city);
const fill=new THREE.MeshStandardMaterial({color:0x17294a,roughness:.55,metalness:.35});
const edge=new THREE.LineBasicMaterial({color:0xb8944f,transparent:true,opacity:.65});
let s=7;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
for(let x=-9;x<=9;x+=1.5)for(let z=-9;z<=9;z+=1.5){
 const d=Math.hypot(x,z);if(d>10.5||rnd()<.18)continue;
 const h=.6+Math.pow(rnd(),2)*6*(1.25-d/12),w=.8+rnd()*.3;
 const g=new THREE.BoxGeometry(w,h,w),m=new THREE.Mesh(g,fill);
 m.position.set(x,h/2,z);m.add(new THREE.LineSegments(new THREE.EdgesGeometry(g),edge));city.add(m);
}
const grid=new THREE.GridHelper(32,32,0xb8944f,0x22365a);grid.material.transparent=true;grid.material.opacity=.35;city.add(grid);
const rings=[];[[12,.05],[13.4,.03]].forEach(([rad,t])=>{
 const m=new THREE.Mesh(new THREE.TorusGeometry(rad,t,8,160),new THREE.MeshBasicMaterial({color:0xb8944f}));
 m.rotation.x=Math.PI/2;m.position.y=.02;city.add(m);rings.push(m)});
let mx=0,my=0,vis=true;
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
function size(){const w=c.clientWidth,h=c.clientHeight;r.setPixelRatio(Math.min(devicePixelRatio,2));r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();city.position.x=w>900?5.5:0;draw(performance.now())}
function draw(t){
 const sy=Math.min(scrollY/innerHeight,1),a=t*.00007+mx*.5,rad=21-6*sy;
 cam.position.set(Math.sin(a)*rad,9+4*sy-my*3,Math.cos(a)*rad);cam.lookAt(city.position.x,1.8,0);
 rings[0].rotation.z=t*.00012;rings[1].rotation.z=-t*.00009;
 r.render(sc,cam)}
function loop(t){if(vis)draw(t);requestAnimationFrame(loop)}
new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(c);
addEventListener('resize',size);size();
if(!reduce)requestAnimationFrame(loop);else addEventListener('scroll',()=>draw(0),{passive:true});
})();
