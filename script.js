const phrases = [
"Biological foundation models",
"Autonomous scientific agents",
"NeuroAI & brain-inspired learning",
"Multimodal biomedical intelligence",
"Artificial life & synthetic biology",
"New architectures for intelligent systems"
];
const ticker = document.getElementById("ticker");
let phraseIndex = 0;
setInterval(() => {
phraseIndex = (phraseIndex + 1) % phrases.length;
ticker.animate(
[{opacity:1,transform:"translateY(0)"},{opacity:0,transform:"translateY(-8px)"}],
{duration:220,fill:"forwards"}
).onfinish = () => {
ticker.textContent = phrases[phraseIndex];
ticker.animate(
[{opacity:0,transform:"translateY(8px)"},{opacity:1,transform:"translateY(0)"}],
{duration:260,fill:"forwards"}
);
};
}, 2600);
const io = new IntersectionObserver(entries => {
entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
}, {threshold:0.12});
document.querySelectorAll(".reveal").forEach(el => io.observe(el));
const canvas = document.getElementById("field");
const ctx = canvas.getContext("2d");
let w = 0, h = 0, dpr = 1;
let particles = [];
let mouse = {x:-1000, y:-1000, vx:0, vy:0};
let lastMouse = {x:-1000, y:-1000};
let t = 0;
function rand(min,max){ return Math.random()*(max-min)+min; }
function resize(){
dpr = Math.min(window.devicePixelRatio || 1, 2);
w = window.innerWidth;
h = window.innerHeight;
canvas.width = Math.floor(w*dpr);
canvas.height = Math.floor(h*dpr);
canvas.style.width = w+"px";
canvas.style.height = h+"px";
ctx.setTransform(dpr,0,0,dpr,0,0);
const count = Math.max(58, Math.min(150, Math.floor((w*h)/13000)));
particles = Array.from({length:count}, () => ({
x:Math.random()*w,
y:Math.random()*h,
px:0,
py:0,
speed:rand(.18,.52),
life:rand(0,500),
size:rand(.55,1.45),
phase:rand(0,Math.PI*2)
}));
}
window.addEventListener("resize",resize);
window.addEventListener("mousemove",e=>{
mouse.x = e.clientX;
mouse.y = e.clientY;
mouse.vx = e.clientX - lastMouse.x;
mouse.vy = e.clientY - lastMouse.y;
lastMouse.x = e.clientX;
lastMouse.y = e.clientY;
});
window.addEventListener("mouseleave",()=>{
mouse.x = -1000;
mouse.y = -1000;
});
resize();
function flowAngle(x,y,time){
const nx = x / Math.max(w,1);
const ny = y / Math.max(h,1);
return (
Math.sin(nx*8.0 + time*.00055)*1.15 +
Math.cos(ny*6.3 - time*.00042)*1.05 +
Math.sin((nx+ny)*5.2 + time*.00023)*.72
);
}
function resetParticle(p){
p.x = Math.random()*w;
p.y = Math.random()*h;
p.px = p.x;
p.py = p.y;
p.life = 0;
}
function draw(time){
t = time || 0;
ctx.fillStyle = "rgba(9,10,16,.16)";
ctx.fillRect(0,0,w,h);
const gy = h*(0.44 + Math.sin(t*.00018)*.03);
const grad = ctx.createLinearGradient(0, gy-120, 0, gy+120);
grad.addColorStop(0, "rgba(88,92,255,0)");
grad.addColorStop(.5, "rgba(88,92,255,.025)");
grad.addColorStop(1, "rgba(71,186,255,0)");
ctx.fillStyle = grad;
ctx.fillRect(0, gy-120, w, 240);
for(const p of particles){
p.px = p.x;
p.py = p.y;
const a = flowAngle(p.x,p.y,t) + p.phase*.05;
let vx = Math.cos(a)*p.speed;
let vy = Math.sin(a)*p.speed;
const dx = p.x-mouse.x;
const dy = p.y-mouse.y;
const dm = Math.hypot(dx,dy);
if(dm < 180){
const force = (1-dm/180)*1.6;
vx += (dx/Math.max(dm,1))*force + mouse.vx*.012;
vy += (dy/Math.max(dm,1))*force + mouse.vy*.012;
}
p.x += vx;
p.y += vy;
p.life += 1;
if(p.x < -30 || p.x > w+30 || p.y < -30 || p.y > h+30 || p.life > 1100){
resetParticle(p);
continue;
}
const hueMix = .5 + .5*Math.sin(p.phase+t*.00035);
const r = Math.round(92 + hueMix*18);
const g = Math.round(108 + hueMix*64);
const b = 255;
ctx.beginPath();
ctx.moveTo(p.px,p.py);
ctx.lineTo(p.x,p.y);
ctx.strokeStyle = `rgba(${r},${g},${b},${0.09 + p.size*0.045})`;
ctx.lineWidth = p.size;
ctx.stroke();
if(p.size > 1.12){
ctx.beginPath();
ctx.arc(p.x,p.y,p.size*.7,0,Math.PI*2);
ctx.fillStyle = `rgba(98,118,255,.18)`;
ctx.fill();
}
}
if(mouse.x > 0){
const rg = ctx.createRadialGradient(mouse.x,mouse.y,0,mouse.x,mouse.y,140);
rg.addColorStop(0,"rgba(96,112,255,.07)");
rg.addColorStop(.45,"rgba(66,96,255,.035)");
rg.addColorStop(1,"rgba(66,96,255,0)");
ctx.fillStyle = rg;
ctx.beginPath();
ctx.arc(mouse.x,mouse.y,140,0,Math.PI*2);
ctx.fill();
}
requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
document.querySelectorAll(".project").forEach(card => {
card.addEventListener("mousemove", e => {
const r = card.getBoundingClientRect();
card.style.setProperty("--mx", `${e.clientX-r.left}px`);
card.style.setProperty("--my", `${e.clientY-r.top}px`);
});
});
(() => {
const canvas = document.getElementById("cellCanvas");
if (!canvas) return;
const c = canvas.getContext("2d");
let W=0,H=0,DPR=1,pts=[],mouse={x:-999,y:-999};
const clusterDefs = [
{x:.30,y:.40,rx:.17,ry:.13,color:[111,124,255],label:"T / NK"},
{x:.68,y:.34,rx:.14,ry:.12,color:[78,203,255],label:"B cell"},
{x:.57,y:.70,rx:.19,ry:.13,color:[154,114,255],label:"Myeloid"}
];
function gauss(){
let u=0,v=0;
while(!u)u=Math.random();
while(!v)v=Math.random();
return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
}
function rebuild(){
const r = canvas.getBoundingClientRect();
W = Math.max(1,r.width); H = Math.max(1,r.height);
DPR = Math.min(devicePixelRatio||1,2);
canvas.width = W*DPR; canvas.height=H*DPR;
c.setTransform(DPR,0,0,DPR,0,0);
pts=[];
clusterDefs.forEach((cl,ci)=>{
const n = ci===0 ? 62 : 48;
for(let i=0;i<n;i++){
const gx=gauss(), gy=gauss();
pts.push({ci,bx:(cl.x + gx*cl.rx*.43)*W,by:(cl.y + gy*cl.ry*.43)*H,x:0,y:0,phase:Math.random()*Math.PI*2,s:.75+Math.random()*1.6});
}
});
pts.forEach(p=>{p.x=p.bx;p.y=p.by});
}
canvas.addEventListener("mousemove",e=>{
const r=canvas.getBoundingClientRect();
mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;
});
canvas.addEventListener("mouseleave",()=>{mouse.x=-999;mouse.y=-999});
new ResizeObserver(rebuild).observe(canvas);
rebuild();
function drawCell(time){
c.clearRect(0,0,W,H);
c.strokeStyle="rgba(119,133,165,.08)";
c.lineWidth=1;
for(let i=1;i<5;i++){c.beginPath();c.moveTo(W*i/5,0);c.lineTo(W*i/5,H);c.stroke();}
for(let i=1;i<4;i++){c.beginPath();c.moveTo(0,H*i/4);c.lineTo(W,H*i/4);c.stroke();}
clusterDefs.forEach(cl=>{
const x=cl.x*W,y=cl.y*H;
const rg=c.createRadialGradient(x,y,0,x,y,Math.max(W,H)*.19);
rg.addColorStop(0,`rgba(${cl.color.join(",")},.055)`);
rg.addColorStop(1,`rgba(${cl.color.join(",")},0)`);
c.fillStyle=rg;c.fillRect(0,0,W,H);
c.font="11px Consolas";
c.fillStyle=`rgba(${cl.color.join(",")},.55)`;
c.fillText(cl.label.toUpperCase(),x+18,y-13);
});
pts.forEach(p=>{
const cl=clusterDefs[p.ci];
const wobbleX=Math.cos(time*.00055+p.phase)*2.1;
const wobbleY=Math.sin(time*.00047+p.phase)*1.8;
let tx=p.bx+wobbleX, ty=p.by+wobbleY;
const dx=tx-mouse.x,dy=ty-mouse.y,d=Math.hypot(dx,dy);
if(d<88){const f=(1-d/88)*18;tx += (dx/Math.max(d,1))*f;ty += (dy/Math.max(d,1))*f;}
p.x += (tx-p.x)*.075;p.y += (ty-p.y)*.075;
c.beginPath();c.arc(p.x,p.y,p.s,0,Math.PI*2);c.fillStyle=`rgba(${cl.color.join(",")},${.38+p.s*.10})`;c.fill();
if(p.s>1.7){c.beginPath();c.arc(p.x,p.y,p.s*3.2,0,Math.PI*2);c.fillStyle=`rgba(${cl.color.join(",")},.035)`;c.fill();}
});
if(mouse.x>0){c.beginPath();c.arc(mouse.x,mouse.y,28,0,Math.PI*2);c.strokeStyle="rgba(151,161,255,.18)";c.stroke();c.beginPath();c.arc(mouse.x,mouse.y,2,0,Math.PI*2);c.fillStyle="rgba(180,188,255,.8)";c.fill();}
requestAnimationFrame(drawCell);
}
requestAnimationFrame(drawCell);
})();
(() => {
const graph=document.getElementById("agentGraph");
if(!graph)return;
const nodes=[...graph.querySelectorAll(".agent-node")];
const sequence=["task","plan","search","code","critic","task"];
const names={task:"SYNTHESIZING",plan:"PLANNING",search:"RETRIEVING",code:"EXECUTING",critic:"CRITIQUING"};
const state=document.getElementById("agentState");
const iteration=document.getElementById("agentIteration");
let k=0,it=1;
function advance(){
nodes.forEach(n=>n.classList.toggle("active",n.dataset.agent===sequence[k]));
state.textContent=names[sequence[k]];
if(sequence[k]==="task" && k>0){it=(it%9)+1;iteration.textContent=String(it).padStart(2,"0");}
k=(k+1)%sequence.length;
}
advance();setInterval(advance,1150);
nodes.forEach(n=>{n.addEventListener("mouseenter",()=>{nodes.forEach(x=>x.classList.remove("active"));n.classList.add("active");state.textContent=names[n.dataset.agent] || "ACTIVE";});});
})();
(() => {
const host=document.getElementById("bpeTokens");
if(!host)return;
const states=[
{tokens:["A","C","G","T","G","A","C"], fresh:[], op:"initialize byte / base vocabulary", vocab:256, model:"embed"},
{tokens:["AC","G","T","G","A","C"], fresh:[0], op:"most frequent pair → AC", vocab:257, model:"embed"},
{tokens:["AC","GT","G","A","C"], fresh:[1], op:"next merge → GT", vocab:258, model:"attn"},
{tokens:["AC","GT","GA","C"], fresh:[2], op:"next merge → GA", vocab:259, model:"predict"}
];
const op=document.getElementById("bpeOperation");
const step=document.getElementById("bpeStep");
const vocab=document.getElementById("bpeVocab");
const count=document.getElementById("bpeCounter");
const modelBlocks=[...document.querySelectorAll("[data-model-stage]")];
let s=0;
function render(){
const st=states[s];
host.innerHTML=st.tokens.map((tok,i)=>`<span class="bpe-token ${st.fresh.includes(i)?"new-token":""}">${tok}</span>`).join("");
op.textContent=st.op;
step.textContent=s===0 ? "TOKENIZE" : `MERGE ${String(s).padStart(2,"0")}`;
vocab.textContent=st.vocab;
count.textContent=`${s+1} / ${states.length}`;
modelBlocks.forEach(b=>b.classList.toggle("active",b.dataset.modelStage===st.model));
s=(s+1)%states.length;
}
render();setInterval(render,1650);
})();
(() => {
const steps=[...document.querySelectorAll("[data-flow-step]")];
const progress=document.getElementById("flowProgress");
const log=document.getElementById("flowLog");
const status=document.getElementById("flowStatus");
if(!steps.length)return;
const logs=["Staging biological input artifacts…","Running quality-control operators…","Executing reproducible processing modules…","Launching statistical / ML analysis…","Publishing reports, metrics and artifacts…"];
let i=0;
function tick(){
steps.forEach((el,j)=>{el.classList.toggle("active",j===i);el.classList.toggle("done",j<i);});
progress.style.width=`${(i/(steps.length-1))*100}%`;
log.textContent=logs[i];
status.textContent=i===steps.length-1 ? "FINALIZING" : "RUNNING";
i++;
if(i>=steps.length){setTimeout(()=>{i=0;steps.forEach(el=>el.classList.remove("active","done"));progress.style.width="0%";status.textContent="RESTART";},950);}
}
tick();setInterval(tick,1450);
})();