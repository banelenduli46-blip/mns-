(function(){
document.querySelectorAll('.light-pillar').forEach(function(canvas){
const host=canvas.parentElement;
if(!host)return;

const reduceMotion=matchMedia('(prefers-reduced-motion:reduce)').matches;
const gl=canvas.getContext('webgl',{alpha:true,antialias:false,powerPreference:'low-power',premultipliedAlpha:false});
if(!gl){
 console.warn('LightPillar could not start: WebGL is unavailable.');
 return;
}

const vertexSource='attribute vec2 position;void main(){gl_Position=vec4(position,0.0,1.0);}';
const fragmentSource=`
precision mediump float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform float intro;
uniform float pulse;

float hash(vec2 p){
 p=fract(p*vec2(123.34,456.21));
 p+=dot(p,p+45.32);
 return fract(p.x*p.y);
}
float noise(vec2 p){
 vec2 i=floor(p),f=fract(p);
 f=f*f*(3.0-2.0*f);
 return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),
            mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);
}
void main(){
 vec2 uv=gl_FragCoord.xy/resolution;
 vec2 p=(uv-0.5)*vec2(resolution.x/resolution.y,1.0);
 float angle=radians(25.0)+time*0.3;
 mat2 rotation=mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
 p=rotation*p;
 float pointer=length(p-mouse*vec2(resolution.x/resolution.y,1.0)*0.45);
 p.x-=sin(p.y*4.0+time*0.7)*0.4*0.11;
 p.x-=sin(time*0.3)*0.045;
 float width=0.11;
 float central=exp(-pow(p.x/width,2.0));
 float sideA=exp(-pow((p.x-0.31)/0.07,2.0))*0.28;
 float sideB=exp(-pow((p.x+0.31)/0.07,2.0))*0.28;
 float beam=central+sideA+sideB;
 float edgeGlow=exp(-abs(p.x)*3.2)*0.22;
 float height=0.32+0.68*smoothstep(-0.5,0.35,p.y);
 height*=1.0-0.24*smoothstep(0.45,0.95,p.y);
 float n=noise(vec2(p.x*18.0+time*0.4,p.y*7.0-time*0.22));
 float rays=mix(0.65,1.25,n);
 float interaction=exp(-pointer*4.0)*0.32;
 float energy=(beam+edgeGlow)*height*rays*(1.0+interaction+pulse);
 vec3 topColor=vec3(0.231,0.510,0.965);
 vec3 bottomColor=vec3(1.0,0.624,0.988);
 vec3 color=mix(bottomColor,topColor,clamp(uv.y,0.0,1.0));
 float halo=energy*0.5+edgeGlow*height*0.25;
 color*=energy+halo;
 color+=vec3(0.25,0.32,0.55)*pow(max(0.0,energy),2.0)*0.5;
 float grain=(hash(gl_FragCoord.xy+time)-0.5)*0.5;
 color+=grain*energy*0.5;
 float alpha=clamp(energy*0.72+halo*0.4,0.0,0.92)*intro;
 gl_FragColor=vec4(color,alpha);
}`;

function compile(type,source){
 const shader=gl.createShader(type);
 if(!shader)throw new Error('WebGL could not allocate a shader.');
 gl.shaderSource(shader,source);
 gl.compileShader(shader);
 if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
  const message=gl.getShaderInfoLog(shader)||'Unknown shader compilation error.';
  gl.deleteShader(shader);
  throw new Error(message);
 }
 return shader;
}

let program;
try{
 const vertex=compile(gl.VERTEX_SHADER,vertexSource);
 const fragment=compile(gl.FRAGMENT_SHADER,fragmentSource);
 program=gl.createProgram();
 if(!program)throw new Error('WebGL could not allocate a program.');
 gl.attachShader(program,vertex);
 gl.attachShader(program,fragment);
 gl.linkProgram(program);
 gl.deleteShader(vertex);
 gl.deleteShader(fragment);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
  throw new Error(gl.getProgramInfoLog(program)||'Unknown shader link error.');
 }
}catch(error){
 console.error('LightPillar failed to initialize.',error);
 return;
}

const buffer=gl.createBuffer();
if(!buffer){
 console.error('LightPillar failed to initialize: WebGL could not allocate a vertex buffer.');
 return;
}
gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
gl.useProgram(program);
const position=gl.getAttribLocation(program,'position');
gl.enableVertexAttribArray(position);
gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
const resolution=gl.getUniformLocation(program,'resolution');
const mouse=gl.getUniformLocation(program,'mouse');
const time=gl.getUniformLocation(program,'time');
const intro=gl.getUniformLocation(program,'intro');
const pulse=gl.getUniformLocation(program,'pulse');

let pointerX=0,pointerY=0,visible=true,frame=0,start=performance.now(),pulseStart=0;
function resize(){
 const bounds=host.getBoundingClientRect();
 const ratio=Math.min(window.devicePixelRatio||1,2);
 const width=Math.max(1,Math.round(bounds.width*ratio));
 const height=Math.max(1,Math.round(bounds.height*ratio));
 if(canvas.width!==width||canvas.height!==height){
  canvas.width=width;
  canvas.height=height;
  gl.viewport(0,0,width,height);
 }
 draw(performance.now());
}
function draw(now){
 if(!visible&&now!==0)return;
 gl.uniform2f(resolution,canvas.width,canvas.height);
 gl.uniform2f(mouse,pointerX,pointerY);
 gl.uniform1f(time,reduceMotion?0:(now-start)*0.0005);
 gl.uniform1f(intro,reduceMotion?1:Math.min(1,(now-start)/700));
 gl.uniform1f(pulse,pulseStart?Math.max(0,1-(now-pulseStart)/1400):0);
 gl.drawArrays(gl.TRIANGLES,0,3);
 canvas.style.opacity=reduceMotion?'1':String(Math.min(1,(now-start)/700));
}
function animate(now){
 if(!visible){
  frame=0;
  return;
 }
 draw(now);
 frame=requestAnimationFrame(animate);
}
function onPointerMove(event){
 const bounds=host.getBoundingClientRect();
 pointerX=(event.clientX-bounds.left)/bounds.width*2-1;
 pointerY=1-(event.clientY-bounds.top)/bounds.height*2;
 if(!reduceMotion&&!frame)frame=requestAnimationFrame(animate);
}
function onClick(){
 if(reduceMotion)return;
 pulseStart=performance.now();
 if(!frame)frame=requestAnimationFrame(animate);
}

if(!reduceMotion){
 host.addEventListener('pointermove',onPointerMove,{passive:true});
 host.addEventListener('click',onClick);
 frame=requestAnimationFrame(animate);
}
if('ResizeObserver' in window)new ResizeObserver(resize).observe(host);
else window.addEventListener('resize',resize,{passive:true});
if('IntersectionObserver' in window){
 new IntersectionObserver(entries=>{
  visible=entries[0].isIntersecting;
  if(visible&&!reduceMotion&&!frame)frame=requestAnimationFrame(animate);
 }).observe(host);
}
resize();
});
})();
