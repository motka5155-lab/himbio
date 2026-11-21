// Учебные сцены v2: текстуры-иллюстрации на срезах, цвета как в атласах
import * as THREE from 'three';
import {mergeGeometries} from './vendor/BufferGeometryUtils.js';
const V=(x,y,z=0)=>new THREE.Vector3(x,y,z);
let _s=7;const rnd=()=>{_s=(_s*16807)%2147483647;return _s/2147483647;};
const prep=g=>{g=g.index?g.toNonIndexed():g;for(const k of Object.keys(g.attributes))if(!['position','normal','uv'].includes(k))g.deleteAttribute(k);if(!g.attributes.normal)g.computeVertexNormals();if(!g.attributes.uv){g.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count*2),2));}return g;};
const merge=gs=>mergeGeometries(gs.map(prep));
export function ctex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');draw(x,w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;}
const M=(o)=>new THREE.MeshStandardMaterial({roughness:.62,metalness:0,envMapIntensity:.3,transparent:true,side:THREE.DoubleSide,emissive:o.map?'#ffffff':(o.color||'#ffffff'),emissiveMap:o.map||null,emissiveIntensity:.3,...o});
// part: col = цвет (или map), hl = цвет подсветки/метки
function part(G,root,k,ru,o,geos,anchor,sys){if(typeof o==='string')o={c:o};const geo=Array.isArray(geos)?merge(geos):prep(geos);geo.computeBoundingBox();geo.computeBoundingSphere();
  const tex=o.map;const m=new THREE.Mesh(geo,M(tex?{map:tex,color:'#ffffff'}:{color:o.c}));if(o.op!==undefined){m.material.opacity=o.op;}root.add(m);
  const g={k,ru,sys:sys||'sens',col:tex?'#ffffff':o.c,hl:o.hl||o.c,mesh:m,home:new THREE.Vector3(),proc:true,anchor,size:geo.boundingSphere.radius*2,op:o.op};m.userData=g;G[k]=g;return g;}
const tube=(pts,r,seg=64,rs=10)=>new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>V(...p))),seg,r,rs);
function shapeGeo(sh){const g=new THREE.ShapeGeometry(sh,24);g.computeBoundingBox();const b=g.boundingBox,p=g.attributes.position,uv=g.attributes.uv;
  for(let i=0;i<p.count;i++)uv.setXY(i,(p.getX(i)-b.min.x)/(b.max.x-b.min.x),(p.getY(i)-b.min.y)/(b.max.y-b.min.y));return g;}
const poly=pts=>{const s=new THREE.Shape();pts.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));return s;};
// ---- рисовалки
function cells(x,w,h,n,rMin,rMax,fill,edge,lw,dots){for(let i=0;i<n;i++){const cx=rnd()*w,cy=rnd()*h,r=rMin+rnd()*(rMax-rMin);x.beginPath();x.arc(cx,cy,r,0,7);x.fillStyle=typeof fill==='function'?fill():fill;x.fill();if(edge){x.lineWidth=lw;x.strokeStyle=edge;x.stroke();}if(dots){x.beginPath();x.arc(cx+r*.2,cy-r*.1,r*.25,0,7);x.fillStyle=dots;x.fill();}}}
function fibers(x,w,h,col,n,len,lw,vertical){x.strokeStyle=col;x.lineWidth=lw;for(let i=0;i<n;i++){const a=rnd()*w,b=rnd()*h;x.beginPath();if(vertical){x.moveTo(a,b);x.bezierCurveTo(a+8,b+len*.3,a-8,b+len*.6,a+3,b+len);}else{x.moveTo(a,b);x.bezierCurveTo(a+len*.3,b+6,a+len*.6,b-6,a+len,b+2);}x.stroke();}}
function vesselTree(x,x0,y0,ang,len,depth,col,lw){if(depth<=0||len<4)return;const x1=x0+Math.cos(ang)*len,y1=y0+Math.sin(ang)*len;x.strokeStyle=col;x.lineWidth=lw;x.lineCap='round';x.beginPath();x.moveTo(x0,y0);x.quadraticCurveTo((x0+x1)/2+(rnd()-.5)*len*.3,(y0+y1)/2+(rnd()-.5)*len*.3,x1,y1);x.stroke();
  vesselTree(x,x1,y1,ang-.35-rnd()*.3,len*.72,depth-1,col,lw*.72);vesselTree(x,x1,y1,ang+.35+rnd()*.3,len*.72,depth-1,col,lw*.72);}
const grad=(x,h,stops)=>{const g=x.createLinearGradient(0,0,0,h);stops.forEach(([o,c])=>g.addColorStop(o,c));return g;};

// ================= КОЖА =================
export function buildSkin(G,O){const root=new THREE.Group();root.position.copy(O);
  const W=2.2,D=1.1,Y=[.95,.72,-.15,-.95];// верх эпидермиса, низ эпидермиса, низ дермы, низ гиподермы
  const face=(kind)=>ctex(512,kind==='epi'?96:kind==='derm'?420:320,(x,w,h)=>{
    if(kind==='epi'){x.fillStyle=grad(x,h,[[0,'#b9875a'],[.35,'#d8a879'],[.55,'#e9c39a'],[1,'#c98d8a']]);x.fillRect(0,0,w,h);x.strokeStyle='rgba(120,70,40,.5)';x.lineWidth=1.5;for(let i=0;i<6;i++){x.beginPath();x.moveTo(0,4+i*5);for(let X=0;X<=w;X+=16)x.lineTo(X,4+i*5+Math.sin(X*.05+i)*2);x.stroke();}
      for(let X=4;X<w;X+=13){x.beginPath();x.ellipse(X,h-14,6,9,0,0,7);x.fillStyle='#b77b6d';x.fill();x.strokeStyle='#8a5248';x.stroke();x.beginPath();x.arc(X,h-14,2.5,0,7);x.fillStyle='#5a2e28';x.fill();}}
    if(kind==='derm'){x.fillStyle=grad(x,h,[[0,'#f4b2ad'],[.5,'#f2a7a2'],[1,'#eea39c']]);x.fillRect(0,0,w,h);fibers(x,w,h,'rgba(200,110,110,.35)',240,40,1.2);
      x.fillStyle='#c98d8a';x.beginPath();x.moveTo(0,0);for(let X=0;X<=w;X+=4)x.lineTo(X,10+8*Math.sin(X*.09));x.lineTo(w,0);x.fill();
      vesselTree(x,w*.12,h*.95,-1.45,60,5,'#d6303a',4);vesselTree(x,w*.2,h*.95,-1.7,55,5,'#2f5fc4',4);vesselTree(x,w*.88,h*.95,-1.6,60,5,'#d6303a',4);vesselTree(x,w*.8,h*.95,-1.45,55,5,'#2f5fc4',4);
      vesselTree(x,w*.6,h*.98,-1.5,55,4,'#f2c94c',2.5);}
    if(kind==='fat'){x.fillStyle='#f2cf5b';x.fillRect(0,0,w,h);cells(x,w,h,170,14,24,()=>['#f7dc6f','#f5d35f','#fae38a'][rnd()*3|0],'#d9a93a',2);
      x.strokeStyle='#d6303a';x.lineWidth=9;x.beginPath();x.moveTo(0,h*.72);x.bezierCurveTo(w*.3,h*.6,w*.6,h*.85,w,h*.7);x.stroke();x.strokeStyle='#2f5fc4';x.beginPath();x.moveTo(0,h*.84);x.bezierCurveTo(w*.35,h*.75,w*.65,h*.95,w,h*.82);x.stroke();}});
  const topT=ctex(512,256,(x,w,h)=>{x.fillStyle='#e2b388';x.fillRect(0,0,w,h);x.strokeStyle='rgba(150,95,60,.35)';for(let i=0;i<60;i++){x.lineWidth=1;x.beginPath();const a=rnd()*w,b=rnd()*h;x.moveTo(a,b);x.lineTo(a+30*(rnd()-.5),b+30*(rnd()-.5));x.stroke();}
    for(let i=0;i<14;i++){x.beginPath();x.arc(rnd()*w,rnd()*h,2.5,0,7);x.fillStyle='#6b3f26';x.fill();}});
  const slab=(y0,y1,tex,k,ru,hl,anc)=>{const g=new THREE.BoxGeometry(W,y0-y1,D);g.translate(0,(y0+y1)/2,0);
    const m=new THREE.Mesh(g,M({map:tex}));root.add(m);if(k==='skepi'){const tp=new THREE.PlaneGeometry(W,D);tp.rotateX(-Math.PI/2);tp.translate(0,y0+.002,0);root.add(new THREE.Mesh(tp,M({map:topT})));}
    const gg={k,ru,sys:'skin',col:'#ffffff',hl,mesh:m,home:new THREE.Vector3(),proc:true,anchor:anc,size:2};m.userData=gg;G[k]=gg;return gg;};
  slab(Y[0],Y[1],face('epi'),'skepi','Эпидермис','#d8a879',V(-.9,.86,D/2));
  slab(Y[1],Y[2],face('derm'),'skderm','Дерма','#f2a7a2',V(-.75,.2,D/2));
  slab(Y[2],Y[3],face('fat'),'skfat','Подкожная жировая клетчатка','#f2cf5b',V(-.7,-.45,D/2));
  const Z=D/2+.005;
  // волос, фолликул, луковица
  part(G,root,'skhair','Волос','#4a2a16',tube([[ .05,1.85,Z+.05],[.12,1.35,Z+.04],[.08,.95,Z],[.0,.5,Z],[-.1,0,Z],[-.14,-.18,Z]],.03,80),V(.1,1.45,Z+.05),'skin');
  const fol=tube([[.08,.95,Z],[.0,.5,Z],[-.1,0,Z],[-.14,-.2,Z]],.075,60);part(G,root,'skfol','Волосяной фолликул','#e8b28c',fol,V(.0,.45,Z+.07),'skin').mesh.material.opacity=.75;
  const bulb=new THREE.SphereGeometry(.11,24,18);bulb.scale(1,1.25,.6);bulb.translate(-.15,-.24,Z);part(G,root,'skbulb','Волосяная луковица','#5a3420',bulb,V(-.15,-.32,Z+.07),'skin');
  const seb=[];for(let i=0;i<14;i++){const s=new THREE.SphereGeometry(.055+rnd()*.02,14,10);s.translate(.18+(rnd()-.5)*.16,.32+(rnd()-.5)*.2,Z+.02);seb.push(s);}
  part(G,root,'skseb','Сальная железа','#f2c24f',seb,V(.25,.38,Z+.08),'skin');
  part(G,root,'skmusc','Мышца, поднимающая волос','#c8342e',tube([[-.06,.05,Z+.01],[.25,.25,Z+.01],[.45,.55,Z+.01],[.55,.68,Z+.01]],.022),V(.42,.5,Z+.03),'skin');
  const coil=[];for(let i=0;i<=90;i++){const t=i/90*Math.PI*8;coil.push([.75+.09*Math.cos(t)+i/900,-.05+.06*Math.sin(t*1.3),Z+.03+.04*Math.sin(t)]);}
  part(G,root,'sksweat','Потовая железа','#ffe7a3',[tube(coil,.022,240,8),tube([[.75,-.02,Z+.03],[.72,.3,Z+.02],[.8,.6,Z+.02],[.74,.8,Z+.02],[.78,.96,Z+.0]],.018,60,8)],V(.78,-.05,Z+.08),'skin');
  const pore=new THREE.RingGeometry(.012,.035,20);pore.rotateX(-Math.PI/2);pore.translate(.78,Y[0]+.003,Z-.03);part(G,root,'skpore','Пора','#5a3420',pore,V(.78,Y[0]+.01,Z-.02),'skin');
  const pc=new THREE.SphereGeometry(.09,20,14);pc.scale(1,1.5,.7);pc.translate(-.6,-.55,Z+.01);const mk=new THREE.SphereGeometry(.035,12,8);mk.scale(1,1.6,1);mk.translate(-.45,.62,Z+.01);
  part(G,root,'skrec','Рецепторы (нервные окончания)','#ffd84a',[pc,mk,tube([[-.6,-.42,Z+.01],[-.55,0,Z+.01],[-.5,.4,Z+.01],[-.45,.58,Z+.01]],.01,40,6)],V(-.6,-.55,Z+.08),'skin');
  return {root,keys:['skepi','skderm','skfat','skhair','skfol','skbulb','skseb','skmusc','sksweat','skpore','skrec']};}

// ================= КОСТЬ =================
export function buildBone(G,O){const root=new THREE.Group();root.position.copy(O);
  const P=[[1.5,0],[1.47,.16],[1.4,.28],[1.3,.36],[1.18,.39],[1.05,.36],[.95,.3],[.84,.23],[.7,.19],[0,.17],[-.6,.18],[-.8,.22],[-.95,.31],[-1.08,.38],[-1.2,.41],[-1.32,.39],[-1.42,.31],[-1.5,0]];
  const rO=y=>{for(let i=0;i<P.length-1;i++){const [y0,r0]=P[i],[y1,r1]=P[i+1];if(y<=y0&&y>=y1){const t=(y0-y)/(y0-y1),s=t*t*(3-2*t);return r0+(r1-r0)*s;}}return 0;};
  const sx=y=>y<-.78?1+.35*Math.min(1,(-.78-y)/.3):1;// дистальный конец шире
  const N=120,ys=[];for(let i=0;i<=N;i++)ys.push(1.5-3*i/N);
  // задняя половина кости (3D)
  const prof=ys.map(y=>new THREE.Vector2(rO(y),y));const lat=new THREE.LatheGeometry(prof,64,Math.PI/2,Math.PI);const lp=lat.attributes.position;for(let i=0;i<lp.count;i++)lp.setX(i,lp.getX(i)*sx(lp.getY(i)));lat.computeVertexNormals();
  const outT=ctex(256,512,(x,w,h)=>{x.fillStyle='#ecdcb6';x.fillRect(0,0,w,h);fibers(x,w,h,'rgba(170,140,90,.25)',140,60,1,true);for(let i=0;i<300;i++){x.fillStyle='rgba(150,120,80,.25)';x.fillRect(rnd()*w,rnd()*h,1.5,1.5);}});
  part(G,root,'bout','Кость (наружная поверхность)',{map:outT,hl:'#ecdcb6'},lat,V(-.32,1.25,-.2),'skel');
  // срез: слои по контуру
  const outline=(t,yA=1.5,yB=-1.5)=>{const L=[],R=[];for(const y of ys){if(y>yA||y<yB)continue;const r=Math.max(0,rO(y)-t(y));L.push([-r*sx(y),y]);R.push([r*sx(y),y]);}return poly([...R,...L.reverse()]);};
  const comp=ctex(256,512,(x,w,h)=>{x.fillStyle='#f1e4c4';x.fillRect(0,0,w,h);x.strokeStyle='rgba(190,160,110,.6)';x.lineWidth=1.2;for(let i=0;i<40;i++){x.beginPath();x.moveTo(i*7,0);for(let y=0;y<h;y+=20)x.lineTo(i*7+Math.sin(y*.05+i)*2,y);x.stroke();}for(let i=0;i<500;i++){x.fillStyle='rgba(120,90,50,.45)';x.fillRect(rnd()*w,rnd()*h,1.6,1);}});
  const cutC=shapeGeo(outline(()=>0));cutC.translate(0,0,.001);part(G,root,'bcomp','Компактное вещество',{map:comp,hl:'#f1e4c4'},cutC,V(.18,.1,.01),'skel');
  const spT=ctex(512,512,(x,w,h)=>{x.fillStyle='#f0dfbd';x.fillRect(0,0,w,h);cells(x,w,h,520,7,15,()=>['#b9443b','#a63a35','#c9584c'][rnd()*3|0],'#f3e3c2',3);});
  const sp1=shapeGeo(outline(y=>y>.75?.03:9,1.48,.72)),sp2=shapeGeo(outline(y=>y<-.75?.03:9,-.72,-1.48));sp1.translate(0,0,.003);sp2.translate(0,0,.003);
  part(G,root,'bspong','Губчатое вещество (красный костный мозг)',{map:spT,hl:'#b9443b'},[sp1,sp2],V(.05,1.15,.01),'skel');
  const marT=ctex(256,512,(x,w,h)=>{x.fillStyle='#e7b84a';x.fillRect(0,0,w,h);cells(x,w,h,140,12,26,()=>['#f4cf5d','#f7da74','#eec04f'][rnd()*3|0],'#d29b32',2);});
  const cav=shapeGeo(outline(y=>Math.abs(y)<.74?.065:9,.74,-.74));cav.translate(0,0,.004);part(G,root,'bmar','Жёлтый костный мозг',{map:marT,hl:'#f2c94c'},cav,V(-.03,-.25,.02),'skel');
  const ves=[tube([[.03,.74,.02],[.05,.3,.03],[.02,-.2,.03],[.05,-.74,.02]],.022),tube([[-.05,.74,.02],[-.06,.2,.03],[-.04,-.3,.03],[-.06,-.74,.02]],.022)];
  part(G,root,'bves','Кровеносные сосуды',{c:'#d6303a',hl:'#d6303a'},ves[0],V(.05,.0,.05),'skel');const vv=new THREE.Mesh(ves[1],M({color:'#2f5fc4'}));root.add(vv);
  // хрящ и пластинки роста
  const cart=(sgn)=>{const g=shapeGeo(sgn>0?outline(()=>0,1.5,1.3):outline(()=>0,-1.32,-1.5));g.translate(0,0,.002);return g;};const _old=(sgn)=>{const L=[],R=[];for(const y of ys){if(sgn>0?y<1.33:y>-1.36)continue;const r=rO(y)*sx(y);R.push([r,y]);L.push([-r,y]);}const inner=[];for(const y of ys.slice().reverse()){if(sgn>0?y<1.33:y>-1.36)continue;const r=Math.max(0,rO(y)-.035)*sx(y);inner.push([r,y-.035*sgn]);}
    const g=shapeGeo(poly([...R,...inner.reverse().map(([r,y])=>[r,y]),...inner.map(([r,y])=>[-r,y]).reverse(),...L.reverse()]));g.translate(0,0,.005);return g;};
  part(G,root,'bcart','Суставной хрящ',{c:'#bfe0ea',hl:'#9fd0e0'},[cart(1),cart(-1)],V(.0,1.47,.02),'skel');
  const plate=y=>{const r=rO(y)*sx(y)-.01;const g=new THREE.PlaneGeometry(2*r,.025);g.translate(0,y,.006);return g;};
  part(G,root,'bplate','Пластинка роста (хрящ)',{c:'#8fc8ee',hl:'#8fc8ee'},[plate(.86),plate(-.84)],V(.18,.86,.02),'skel');
  // надкостница — отогнутый лоскут
  const pg=new THREE.PlaneGeometry(.32,.6,8,8);const pp=pg.attributes.position;for(let i=0;i<pp.count;i++){const X=pp.getX(i),Yy=pp.getY(i);pp.setZ(i,.12*(X+.16)*(X+.16)*4);}pg.computeVertexNormals();pg.rotateY(-.6);pg.translate(.36,-.25,.12);
  const perT=ctex(256,512,(x,w,h)=>{x.fillStyle='rgba(246,226,214,1)';x.fillRect(0,0,w,h);vesselTree(x,w*.3,h,-1.6,90,5,'#d6303a',3);vesselTree(x,w*.7,h,-1.5,80,5,'#2f5fc4',3);});
  part(G,root,'bperi','Надкостница',{map:perT,hl:'#f0b9a8'},pg,V(.45,-.15,.2),'skel');
  return {root,keys:['bout','bcomp','bspong','bmar','bves','bcart','bplate','bperi']};}

// ================= СОЕДИНЕНИЯ КОСТЕЙ =================
export function buildJoints(G,O){const root=new THREE.Group();root.position.copy(O);
  const boneT=ctex(256,256,(x,w,h)=>{x.fillStyle='#eadab4';x.fillRect(0,0,w,h);for(let i=0;i<400;i++){x.fillStyle='rgba(150,120,80,.3)';x.fillRect(rnd()*w,rnd()*h,2,2);}});
  // шов
  const zz=(sgn)=>{const pts=[];for(let i=0;i<=12;i++)pts.push([(i%2?.05:-.05)*sgn+0,-.3+i*.05]);return pts;};
  const s1=new THREE.ExtrudeGeometry(poly([[-.75,-.3],...zz(1).map(([x,y])=>[x,y]),[-.75,.3]]),{depth:.12,bevelEnabled:false});const s2=new THREE.ExtrudeGeometry(poly([[.75,-.3],[.75,.3],...zz(1).reverse()]),{depth:.12,bevelEnabled:false});
  [s1,s2].forEach(g=>g.translate(0,1.1,0));part(G,root,'jsut','Неподвижное соединение (шов)',{map:boneT,hl:'#eadab4'},[s1,s2],V(.1,1.32,.12),'skel');
  // полуподвижное
  const v1=new THREE.CylinderGeometry(.3,.3,.26,32);v1.translate(0,.42,0);const v2=v1.clone().translate(0,-.5,0);part(G,root,'jsemi','Полуподвижное соединение (позвонки)',{map:boneT,hl:'#eadab4'},[v1,v2],V(.3,.45,.15),'skel');
  const dk=new THREE.CylinderGeometry(.31,.31,.2,32);dk.translate(0,.18,0);part(G,root,'jdisc','Хрящевой диск',{c:'#9fd0ee',hl:'#9fd0ee'},dk,V(.31,.18,.1),'skel');
  // сустав
  const hd=new THREE.SphereGeometry(.26,32,24);hd.translate(0,-.62,0);const sh=new THREE.CylinderGeometry(.12,.12,.55,20);sh.translate(0,-1.1,0);const so=new THREE.SphereGeometry(.32,32,24,0,Math.PI*2,0,Math.PI*.42);so.translate(0,-.62,0);
  const top=new THREE.CylinderGeometry(.16,.2,.3,20);top.translate(0,-.18,0);
  part(G,root,'jsyn','Подвижное соединение (сустав)',{map:boneT,hl:'#eadab4'},[hd,sh,so,top],V(.3,-1.0,.12),'skel');
  const cc=new THREE.SphereGeometry(.275,32,24);cc.translate(0,-.62,0);part(G,root,'jcart','Суставной хрящ',{c:'#bfe0ea',hl:'#9fd0e0',op:.75},cc,V(-.27,-.62,.06),'skel');
  const cap=new THREE.SphereGeometry(.38,32,24);cap.scale(1,1.25,1);cap.translate(0,-.6,0);part(G,root,'jcap','Суставная сумка и синовиальная жидкость',{c:'#8fd0ff',hl:'#8fd0ff',op:.22},cap,V(-.36,-.4,.12),'skel');
  return {root,keys:['jsut','jsemi','jdisc','jsyn','jcart','jcap']};}

// ================= МЫШЦА =================
export function buildMuscle(G,O){const root=new THREE.Group();root.position.copy(O);
  const strT=(base,dark,dens)=>ctex(512,128,(x,w,h)=>{x.fillStyle=base;x.fillRect(0,0,w,h);x.strokeStyle=dark;for(let i=0;i<dens;i++){x.lineWidth=1+rnd()*1.5;x.globalAlpha=.35+rnd()*.4;const y=rnd()*h;x.beginPath();x.moveTo(0,y);x.bezierCurveTo(w*.3,y+4,w*.6,y-4,w,y+2);x.stroke();}x.globalAlpha=1;});
  const crossT=(n,r0,r1,fill,edge,dot)=>ctex(512,512,(x,w,h)=>{x.fillStyle=edge;x.fillRect(0,0,w,h);x.save();x.beginPath();x.arc(w/2,h/2,w/2-4,0,7);x.clip();x.fillStyle='#f6d9d2';x.fillRect(0,0,w,h);cells(x,w,h,n,r0,r1,fill,edge,3,dot);x.restore();x.lineWidth=8;x.strokeStyle=edge;x.beginPath();x.arc(w/2,h/2,w/2-6,0,7);x.stroke();});
  // кость и сухожилие
  const bn=new THREE.CylinderGeometry(.2,.22,.9,32);bn.rotateZ(Math.PI/2.6);bn.translate(-2.05,.62,0);part(G,root,'mbone','Кость',{c:'#ecdcb6',hl:'#ecdcb6'},bn,V(-2.25,.75,.2),'musc');
  const tdn=new THREE.CylinderGeometry(.12,.3,.75,24,1,true);tdn.rotateZ(Math.PI/2);tdn.translate(-1.35,.42,0);part(G,root,'mtend','Сухожилие',{map:strT('#f4f1ea','#cfc6b8',90),hl:'#f4f1ea'},tdn,V(-1.4,.52,.18),'musc');
  // брюшко
  const prof=[];for(let i=0;i<=40;i++){const t=i/40;prof.push(new THREE.Vector2(.3+.38*Math.sin(t*Math.PI*.6),-1+t*1.6));}
  const belly=new THREE.LatheGeometry(prof,48);belly.rotateZ(-Math.PI/2);belly.translate(0,.42,0);
  part(G,root,'mbelly','Брюшко мышцы',{map:strT('#c9534b','#8e2f2a',260),hl:'#c9534b'},belly,V(-.25,.82,.3),'musc');
  const fas=new THREE.LatheGeometry(prof.map(v=>new THREE.Vector2(v.x+.025,v.y)),48);fas.rotateZ(-Math.PI/2);fas.translate(0,.42,0);part(G,root,'mfasc','Фасция (оболочка мышцы)',{c:'#f3e6e0',hl:'#f3e6e0',op:.25},fas,V(.1,-.05,.32),'musc');
  const capR=prof[prof.length-1].x;const cf=new THREE.CircleGeometry(capR,48);cf.rotateY(Math.PI/2);cf.translate(.6,.42,0);
  part(G,root,'mcross','Пучки мышечных волокон (срез)',{map:crossT(90,14,24,()=>['#e6928c','#df857f','#ea9d97'][rnd()*3|0],'#b9605a','#8e3a36'),hl:'#e6928c'},cf,V(.61,.62,.12),'musc');
  // выдвинутые: пучок → волокно → миофибриллы
  const cyl=(r,l,x0,y0,map,k,ru,hl,anc,endMap)=>{const g=new THREE.CylinderGeometry(r,r,l,40,1,true);g.rotateZ(-Math.PI/2);g.translate(x0+l/2,y0,0);const e=new THREE.CircleGeometry(r,40);e.rotateY(Math.PI/2);e.translate(x0+l,y0,0);
    const a=part(G,root,k,ru,{map,hl},g,anc,'musc');const em=new THREE.Mesh(e,M({map:endMap}));root.add(em);return a;};
  cyl(.2,.7,.62,.2,strT('#e48a83','#a8473f',140),'mbund','Пучок мышечных волокон','#e48a83',V(1.0,.42,.2),crossT(40,22,34,'#ef9f98','#b9605a','#8e3a36'));
  cyl(.09,.6,1.34,.05,ctex(512,64,(x,w,h)=>{x.fillStyle='#f0a49c';x.fillRect(0,0,w,h);for(let X=0;X<w;X+=10){x.fillStyle=(X/10)%2?'#c8675f':'#f6bab3';x.fillRect(X,0,5,h);}for(let i=0;i<8;i++){x.beginPath();x.ellipse(rnd()*w,h*.5,7,4,0,0,7);x.fillStyle='#6a2c5a';x.fill();}}),'mfib','Мышечное волокно (многоядерное)','#f0a49c',V(1.55,.16,.12),crossT(30,10,18,'#f7c3bd','#c8675f'));
  const mf=[];for(let i=0;i<7;i++){const a=i/7*Math.PI*2,r=i?.045:0;const g=new THREE.CylinderGeometry(.022,.022,.75,12,1,true);g.rotateZ(-Math.PI/2);g.translate(1.94+.375,-.05+r*Math.sin(a),r*Math.cos(a));mf.push(g);}
  part(G,root,'mmyo','Миофибриллы (актин и миозин)',{map:ctex(512,32,(x,w,h)=>{x.fillStyle='#f3c0ba';x.fillRect(0,0,w,h);for(let X=0;X<w;X+=16){x.fillStyle='#a23c55';x.fillRect(X+3,0,8,h);x.fillStyle='#5a1830';x.fillRect(X+14,0,1.5,h);}}),hl:'#c25a6e'},mf,V(2.4,-.05,.1),'musc');
  return {root,keys:['mbone','mtend','mbelly','mfasc','mcross','mbund','mfib','mmyo']};}

// ================= ЖЕЛУДОК (целиком, разрез) + ЖЕЛЕЗА =================
export function buildStomach(G,O){const root=new THREE.Group();root.position.copy(O);
  const C=new THREE.CatmullRomCurve3([V(-.75,.95),V(-.62,.55),V(-.45,.05),V(-.15,-.42),V(.3,-.62),V(.75,-.5),V(1.05,-.22),V(1.2,.02),V(1.36,.08),V(1.55,-.08),V(1.6,-.45),V(1.52,-.8)]);
  const RAD=t=>t<.04?.46*Math.sqrt(t/.04):t<.42?.46-.05*(t-.04)/.38:t<.66?.41-.17*(t-.42)/.24:t<.71?.24-.13*(t-.66)/.05:t<.74?.11:.15;
  const sweep=(rf,th0,th1,U=160,Vn=40)=>{const pos=[],uv=[],idx=[];for(let i=0;i<=U;i++){const t=i/U,c=C.getPoint(t),T=C.getTangent(t),Nn=new THREE.Vector3(-T.y,T.x,0).normalize(),B=V(0,0,1);const r=rf(t);
      for(let j=0;j<=Vn;j++){const th=th0+(th1-th0)*j/Vn;const p=c.clone().addScaledVector(Nn,r*Math.cos(th)).addScaledVector(B,r*Math.sin(th));pos.push(p.x,p.y,p.z);uv.push(t,j/Vn);}}
    for(let i=0;i<U;i++)for(let j=0;j<Vn;j++){const a=i*(Vn+1)+j,b=a+Vn+1;idx.push(a,b,a+1,b,b+1,a+1);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;};
  const rugT=ctex(1024,256,(x,w,h)=>{x.fillStyle='#d9706e';x.fillRect(0,0,w,h);for(let i=0;i<46;i++){const y=4+i*(h/46);x.strokeStyle=i%2?'#f2a7a0':'#a8403f';x.lineWidth=i%2?4:3;x.beginPath();x.moveTo(0,y);for(let X=0;X<=w;X+=20)x.lineTo(X,y+Math.sin(X*.02+i)*5+Math.sin(X*.07+i*2)*2);x.stroke();}});
  const musT=ctex(1024,256,(x,w,h)=>{x.fillStyle='#c9534b';x.fillRect(0,0,w,h);x.strokeStyle='rgba(120,30,30,.5)';for(let i=0;i<500;i++){x.lineWidth=1.2;const a=rnd()*w,b=rnd()*h;x.beginPath();x.moveTo(a,b);x.lineTo(a+40,b+(i%3?0:14));x.stroke();}});
  const inner=sweep(t=>RAD(t)*.9,Math.PI,2*Math.PI);part(G,root,'gmuc','Слизистая оболочка (складки)',{map:rugT,hl:'#d9706e'},inner,V(.05,-.32,-.18),'dig');
  const outer=sweep(RAD,Math.PI,2*Math.PI);part(G,root,'gmus','Мышечная оболочка (3 слоя)',{map:musT,hl:'#c9534b'},outer,V(.62,-.95,-.05),'dig');
  // срез стенки: слои по краю разреза
  const layT=ctex(64,512,(x,w,h)=>{const L=[['#e98a8f',.3],['#f6d4c8',.18],['#b9443b',.42],['#f4ecd8',.1]];let y=0;for(const [c,f] of L){x.fillStyle=c;x.fillRect(0,y,w,h*f+1);y+=h*f;}});
  const rim=(th)=>{const pos=[],uv=[],idx=[];const U=160;for(let i=0;i<=U;i++){const t=i/U,c=C.getPoint(t),T=C.getTangent(t),Nn=new THREE.Vector3(-T.y,T.x,0).normalize();const r=RAD(t);
      for(const [f,v] of [[.9,0],[1,1]]){const p=c.clone().addScaledVector(Nn,r*f*Math.cos(th));pos.push(p.x,p.y,p.z+.002);uv.push(t,v);}}for(let i=0;i<U;i++){const a=i*2;idx.push(a,a+2,a+1,a+1,a+2,a+3);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;};
  part(G,root,'glay','Слои стенки: слизистая, подслизистая, мышечная, серозная',{map:layT,hl:'#e98a8f'},[rim(Math.PI),rim(0)],V(-.36,.45,.01),'dig');
  const ser=sweep(t=>RAD(t)*1.012,Math.PI*1.05,Math.PI*1.6,60,16);const sp=ser.attributes.position;// только дно
  part(G,root,'gser','Серозная оболочка',{c:'#f5e3a8',hl:'#f5e3a8',op:.55},sweep(t=>t<.25?RAD(t)*1.015:0.0001,Math.PI*1.15,Math.PI*1.75,60,16),V(-.85,.75,-.2),'dig');
  part(G,root,'geso','Пищевод',{c:'#e0908a',hl:'#e0908a'},tube([[-.25,1.55,-.05],[-.3,1.2,-.05],[-.42,.82,-.1]],.11,30,24),V(-.22,1.35,.08),'dig');
  const py=new THREE.TorusGeometry(.115,.04,12,32);const pT=C.getTangent(.72),pc=C.getPoint(.72);py.lookAt(pT);py.translate(pc.x,pc.y,pc.z);
  part(G,root,'gpyl','Привратник (сфинктер)',{c:'#a8403f',hl:'#a8403f'},py,pc.clone().add(V(.02,.14,.08)),'dig');
  part(G,root,'gduo','Двенадцатиперстная кишка',{c:'#e8a27a',hl:'#e8a27a'},sweep(t=>t>.74?.15:.0001,Math.PI,2*Math.PI,80,20),V(1.66,-.5,-.05),'dig');
  return {root,keys:['gmuc','gmus','glay','gser','geso','gpyl','gduo']};}
export function buildGland(G,O){const root=new THREE.Group();root.position.copy(O);
  const top=new THREE.BoxGeometry(1.6,.22,.5);top.translate(0,1.0,0);
  part(G,root,'gsurf','Поверхностный эпителий',{map:ctex(512,96,(x,w,h)=>{x.fillStyle='#8c5aa8';x.fillRect(0,0,w,h);for(let X=0;X<w;X+=12){x.fillStyle='#a77bc0';x.fillRect(X+1,4,10,h-8);x.beginPath();x.arc(X+6,h*.7,3,0,7);x.fillStyle='#4a2a5a';x.fill();}}),hl:'#9a6ab8'},top,V(-.6,1.12,.25),'dig');
  const cellRow=(y0,y1,col,k,ru,anc,big)=>{const gs=[];for(let s of [-1,1])for(let y=y0;y>y1;y-=big?.14:.1){const g=new THREE.SphereGeometry(big?.075:.055,16,12);g.scale(1,1.2,1);g.translate(s*(.16+(big?.04:0)),y,0);gs.push(g);}return part(G,root,k,ru,{c:col,hl:col},gs,anc,'dig');};
  cellRow(.86,.35,'#9b6cc0','gcmuc','Добавочные клетки — слизь',V(.2,.62,.08));
  cellRow(.3,-.4,'#d23c3c','gcpar','Обкладочные клетки — соляная кислота',V(.27,-.05,.1),1);
  cellRow(-.42,-1.0,'#4d86d6','gcchf','Главные клетки — пепсиноген',V(.2,-.7,.08));
  const en=new THREE.SphereGeometry(.06,16,12);en.translate(-.24,-.3,.04);part(G,root,'gcend','Эндокринные клетки — гастрин',{c:'#ffd23f',hl:'#ffd23f'},en,V(-.25,-.3,.08),'dig');
  const lum=tube([[0,.95,0],[0,0,0],[0,-1.05,0]],.07,20,12);part(G,root,'glum','Просвет железы (желудочный сок)',{c:'#cfe8ff',hl:'#cfe8ff',op:.5},lum,V(0,.1,.08),'dig');
  const ring=new THREE.RingGeometry(1.2,1.26,64);ring.translate(0,0,-.3);root.add(new THREE.Mesh(ring,new THREE.MeshBasicMaterial({color:'#4fd6ff',transparent:true,opacity:.45})));
  return {root,keys:['gsurf','gcmuc','gcpar','gcchf','gcend','glum']};}

// ================= ВОРСИНКИ =================
export function buildVillus(G,O){const root=new THREE.Group();root.position.copy(O);
  const epiT=ctex(512,512,(x,w,h)=>{x.fillStyle='#f0b3a6';x.fillRect(0,0,w,h);for(let X=0;X<w;X+=14)for(let Y=0;Y<h;Y+=24){x.strokeStyle='#c98278';x.lineWidth=1.5;x.strokeRect(X,Y,14,24);x.beginPath();x.ellipse(X+7,Y+15,3,5,0,0,7);x.fillStyle='#7a3a5a';x.fill();}});
  const base=new THREE.BoxGeometry(3.2,.6,.6);base.translate(0,-.35,-.05);
  const baseT=ctex(512,128,(x,w,h)=>{const L=[['#e58f87',.35],['#f3c7b7',.25],['#c9534b',.4]];let y=0;for(const [c,f] of L){x.fillStyle=c;x.fillRect(0,y,w,h*f+1);y+=h*f;}
    x.lineWidth=5;x.strokeStyle='#d6303a';x.beginPath();x.moveTo(0,h*.55);x.lineTo(w,h*.55);x.stroke();x.strokeStyle='#2f5fc4';x.beginPath();x.moveTo(0,h*.65);x.lineTo(w,h*.65);x.stroke();x.strokeStyle='#f2c230';x.beginPath();x.moveTo(0,h*.75);x.lineTo(w,h*.75);x.stroke();});
  const bm=part(G,root,'vbase','Стенка тонкой кишки (подслизистая и мышцы)',{map:baseT,hl:'#e58f87'},base,V(-1.3,-.4,.7),'dig');
  // целые ворсинки (задний ряд)
  const vg=[];for(let i=0;i<6;i++){const g=new THREE.CapsuleGeometry(.2,.9+rnd()*.25,10,24);g.translate(-1.35+i*.55,.55,-.35+(i%2)*.15);vg.push(g);}
  part(G,root,'vvil','Ворсинки',{map:epiT,hl:'#f0b3a6'},vg,V(1.4,1.2,-.2),'dig');
  // ворсинка в разрезе (передний ряд)
  const X=-.15,R=.32,H=1.3;const prof=[];for(let i=0;i<=20;i++){const a=i/20*Math.PI/2;prof.push(new THREE.Vector2(R*Math.cos(a)+(i===20?0:0),H*.62+R*Math.sin(a)));}const lat=[new THREE.Vector2(R,-.05),...prof];
  const half=new THREE.LatheGeometry(lat,40,Math.PI/2,Math.PI);half.translate(X,0,.25);part(G,root,'vepi','Однослойный эпителий с микроворсинками',{map:epiT,hl:'#f0b3a6'},half,V(X-.3,.95,.3),'dig');
  const cut=[];for(let i=0;i<=40;i++){const a=i/40*Math.PI;cut.push([X+(R-.06)*Math.cos(a),H*.62+(R-.06)*Math.sin(a)]);}const cs=shapeGeo(poly([[X+R-.06,-.05],...cut,[X-R+.06,-.05]]));cs.translate(0,0,.252);
  part(G,root,'vlam','Соединительная ткань ворсинки',{c:'#f7cfc3',hl:'#f7cfc3'},cs,V(X+.12,.3,.26),'dig');
  const ep=shapeGeo(poly([[X+R,-.05],...Array.from({length:41},(_,i)=>{const a=i/40*Math.PI;return [X+R*Math.cos(a),H*.62+R*Math.sin(a)];}),[X-R,-.05],[X-R+.06,-.05],...cut.slice().reverse(),[X+R-.06,-.05]]));ep.translate(0,0,.251);
  const em=new THREE.Mesh(ep,M({map:ctex(64,512,(x,w,h)=>{x.fillStyle='#e7a092';x.fillRect(0,0,w,h);for(let Y=0;Y<h;Y+=10){x.strokeStyle='#b8706a';x.strokeRect(0,Y,w,10);}})}));root.add(em);
  const loopC=(sx,col)=>{const pts=[[X+sx*.16,-.3,.27],[X+sx*.16,.4,.27],[X+sx*.13,.95,.27],[X,1.08,.27]];return tube(pts,.022,40,8);};
  part(G,root,'vart','Кровеносные капилляры (артериальная часть)',{c:'#d6303a',hl:'#d6303a'},[loopC(-1),tube([[X-.16,-.3,.27],[X-.16,-.45,.27],[X-1.6,-.45,.27]],.03,20,8)],V(X-.17,.45,.29),'dig');
  part(G,root,'vven','Кровеносные капилляры (венозная часть)',{c:'#2f5fc4',hl:'#2f5fc4'},[loopC(1),tube([[X+.16,-.3,.27],[X+.16,-.55,.27],[X+1.7,-.55,.27]],.03,20,8)],V(X+.17,.55,.29),'dig');
  const net=[];for(let i=0;i<7;i++){const y=.0+i*.15;net.push(tube([[X-.15,y,.27],[X,y+.04,.275],[X+.15,y,.27]],.009,10,6));}root.add(new THREE.Mesh(merge(net),M({color:'#b04a7a'})));
  part(G,root,'vlym','Лимфатический капилляр',{c:'#f2c230',hl:'#f2c230'},[tube([[X,-.3,.28],[X,.4,.28],[X,1.0,.28]],.04,20,10),tube([[X,-.3,.28],[X,-.65,.28],[X+1.7,-.65,.28]],.035,20,8)],V(X+.02,.78,.3),'dig');
  const crypt=new THREE.CylinderGeometry(.08,.06,.35,16);crypt.translate(X+.55,-.2,.25);part(G,root,'vcry','Крипта (кишечная железа)',{c:'#c9746c',hl:'#c9746c'},crypt,V(X+.55,-.1,.3),'dig');
  // частицы
  const N=36,pm=new THREE.InstancedMesh(new THREE.SphereGeometry(.03,8,6),new THREE.MeshBasicMaterial({toneMapped:false}),N);root.add(pm);const P=[];for(let i=0;i<N;i++)P.push({t:rnd(),f:i%3===0,s:rnd()});
  const m4=new THREE.Matrix4(),c=new THREE.Color();
  function update(dt){P.forEach((p,i)=>{p.t+=dt*.22;if(p.t>1){p.t=0;p.s=rnd();}const y0=.2+p.s*1.0,yy=p.t<.4?y0:y0-(p.t-.4)*1.6;const sx=p.f?0:(i%2?-.16:.16);
      const x=p.t<.4?X+(p.s<.5?-1:1)*(R+.25-(R+.25-Math.abs(sx))*p.t/.4):X+sx;m4.makeTranslation(x,Math.max(yy,-.6),.33);pm.setMatrixAt(i,m4);pm.setColorAt(i,c.set(p.f?'#ffe066':(i%2?'#4fe08a':'#ffffff')));});
    pm.instanceMatrix.needsUpdate=true;pm.instanceColor.needsUpdate=true;}
  return {root,keys:['vbase','vvil','vepi','vlam','vart','vven','vlym','vcry'],update};}

// ================= ГЛАЗ (разрез + по слоям) =================
export function buildEye(G,O){const root=new THREE.Group();root.position.copy(O);const D=Math.PI/180;
  const cap=(R,t0,t1,xc=0,seg=64)=>{const g=new THREE.SphereGeometry(R,seg,40,0,Math.PI*2,t0,t1-t0);g.rotateZ(Math.PI/2);g.translate(xc,0,0);return g;};
  const scT=ctex(1024,512,(x,w,h)=>{x.fillStyle='#f4f1ec';x.fillRect(0,0,w,h);for(let i=0;i<14;i++)vesselTree(x,rnd()*w,h*.98,-1.57+(rnd()-.5),80,4,'rgba(200,60,60,.55)',2);});
  const chT=ctex(1024,512,(x,w,h)=>{x.fillStyle='#5a2430';x.fillRect(0,0,w,h);for(let i=0;i<40;i++)vesselTree(x,rnd()*w,rnd()*h,rnd()*6.28,40,4,i%2?'#c83a3a':'#3a5ad0',3);});
  const reT=ctex(1024,512,(x,w,h)=>{x.fillStyle=grad(x,h,[[0,'#f08a3a'],[1,'#d8602a']]);x.fillRect(0,0,w,h);const ox=w*.5,oy=h*.9;for(let i=0;i<10;i++)vesselTree(x,ox,oy,-1.57+(i-4.5)*.3,90,5,i%2?'#b81e1e':'#8a1830',3);
    x.beginPath();x.arc(ox,oy,16,0,7);x.fillStyle='#ffe7a0';x.fill();x.beginPath();x.arc(w*.5,h*.995,10,0,7);x.fillStyle='#8a3a10';x.fill();});
  const irT=ctex(512,512,(x,w,h)=>{const c=w/2;x.fillStyle='#3d6f8f';x.fillRect(0,0,w,h);for(let i=0;i<360;i++){const a=i*D,r0=c*.3,r1=c*(.9+rnd()*.1);x.strokeStyle=['#5d8fb0','#2e5470','#c8963c','#86b4cc'][i%4];x.lineWidth=2;x.beginPath();x.moveTo(c+r0*Math.cos(a),c+r0*Math.sin(a));x.lineTo(c+r1*Math.cos(a+.05),c+r1*Math.sin(a+.05));x.stroke();}
    x.beginPath();x.arc(c,c,c*.28,0,7);x.fillStyle='#0a0a0e';x.fill();});
  const L={};
  L.esclera=part(G,root,'esclera','Склера (белочная оболочка)',{map:scT,hl:'#f4f1ec'},cap(1,40*D,180*D),V(.3,.92,.2),'sens');
  L.echor=part(G,root,'echor','Сосудистая оболочка',{map:chT,hl:'#7a2c3c'},cap(.965,48*D,180*D),V(.55,-.72,.2),'sens');
  L.eret=part(G,root,'eret','Сетчатка',{map:reT,hl:'#f08a3a'},cap(.935,58*D,180*D),V(.72,.45,.25),'sens');
  L.ecorn=part(G,root,'ecorn','Роговица',{c:'#cfeeff',hl:'#9fdcff',op:.4},cap(.916,0,44.6*D,-.114),V(-1.0,.25,.25),'sens');
  L.eaq=part(G,root,'eaq','Передняя камера (водянистая влага)',{c:'#8fd0ff',hl:'#8fd0ff',op:.3},cap(.86,0,44*D,-.12),V(-.88,-.2,.2),'sens');
  const ir=new THREE.CircleGeometry(.62,64);ir.rotateY(Math.PI/2);ir.translate(-.66,0,0);L.eiris=part(G,root,'eiris','Радужка',{map:irT,hl:'#3d6f8f'},ir,V(-.66,.4,.2),'sens');
  const pu=new THREE.CircleGeometry(.17,32);pu.rotateY(Math.PI/2);pu.translate(-.67,0,0);L.epup=part(G,root,'epup','Зрачок',{c:'#050507',hl:'#888'},pu,V(-.68,0,.05),'sens');
  const le=new THREE.SphereGeometry(.38,48,32);le.scale(.45,1,1);le.translate(-.47,0,0);L.elens=part(G,root,'elens','Хрусталик',{c:'#fff7da',hl:'#fff0b0',op:.7},le,V(-.47,-.25,.2),'sens');
  const zo=[];for(let i=0;i<36;i++){const a=i/36*Math.PI*2;zo.push(tube([[-.47,.37*Math.cos(a),.37*Math.sin(a)],[-.54,.6*Math.cos(a),.6*Math.sin(a)]],.006,2,4));}L.ezon=part(G,root,'ezon','Ресничные связки',{c:'#f4efe4',hl:'#f4efe4'},zo,V(-.5,-.5,.2),'sens');
  const cb=new THREE.TorusGeometry(.68,.07,14,64);cb.rotateY(Math.PI/2);cb.scale(1.6,1,1);cb.translate(-.55,0,0);L.ecil=part(G,root,'ecil','Ресничное тело',{c:'#c0493f',hl:'#c0493f'},cb,V(-.55,.7,.2),'sens');
  L.evit=part(G,root,'evit','Стекловидное тело',{c:'#e6f6ff',hl:'#cfeaff',op:.22},cap(.9,62*D,180*D),V(.15,-.2,.25),'sens');
  const nv=new THREE.CylinderGeometry(.15,.17,.8,24);nv.rotateZ(Math.PI/2);nv.translate(1.32,-.16,0);L.eopt=part(G,root,'eopt','Зрительный нерв',{map:ctex(256,128,(x,w,h)=>{x.fillStyle='#f2cf5b';x.fillRect(0,0,w,h);fibers(x,w,h,'#d9a93a',60,90,1.5);x.strokeStyle='#d6303a';x.lineWidth=5;x.beginPath();x.moveTo(0,h*.45);x.lineTo(w,h*.45);x.stroke();}),hl:'#f2cf5b'},nv,V(1.5,-.05,.15),'sens');
  const bs=new THREE.CircleGeometry(.09,24);bs.rotateY(-Math.PI/2);bs.translate(.92,-.16,0);L.eblind=part(G,root,'eblind','Слепое пятно (диск зрительного нерва)',{c:'#ffe7a0',hl:'#ffe7a0'},bs,V(.92,-.16,.06),'sens');
  const ms=new THREE.CircleGeometry(.07,24);ms.rotateY(-Math.PI/2);ms.translate(.93,.08,0);L.emac=part(G,root,'emac','Жёлтое пятно',{c:'#b85a10',hl:'#e8a020'},ms,V(.93,.1,.06),'sens');
  // плоский срез: каждая оболочка — своей полосой (утолщено для наглядности)
  const caps=new THREE.Group();const CZ=.003;
  const capM=(c,op=1)=>new THREE.MeshBasicMaterial({color:c,transparent:op<1,opacity:op,side:THREE.DoubleSide});
  const addCap=(geo,c,g,dz=0,op=1)=>{geo.translate(0,0,CZ+dz);const m=new THREE.Mesh(geo,capM(c,op));m.userData=g;caps.add(m);return m;};
  const ring=(R1,R2,a0,a1,xc=0,n=90)=>{const pts=[];for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;pts.push([xc-R1*Math.cos(a),R1*Math.sin(a)]);}for(let i=n;i>=0;i--){const a=a0+(a1-a0)*i/n;pts.push([xc-R2*Math.cos(a),R2*Math.sin(a)]);}return new THREE.ShapeGeometry(poly(pts));};
  const disc=(cx,cy,rx,ry,n=48)=>{const pts=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2;pts.push([cx+rx*Math.cos(a),cy+ry*Math.sin(a)]);}return new THREE.ShapeGeometry(poly(pts));};
  const gap=9*D;// выход нерва: разрыв сетчатки и сосудистой
  addCap(disc(0,0,.86,.86,96),'#e4f1fb',L.evit,-.002,.9);
  addCap(ring(1.0,.94,40*D,360*D-40*D),'#f7f5ef',L.esclera,.0006);
  addCap(ring(.94,.9,48*D,180*D-gap),'#8e2f3f',L.echor,.0008);addCap(ring(.94,.9,180*D+gap*1.6,360*D-48*D),'#8e2f3f',L.echor,.0008);
  addCap(ring(.9,.86,58*D,180*D-gap),'#f39a3c',L.eret,.001);addCap(ring(.9,.86,180*D+gap*1.6,360*D-58*D),'#f39a3c',L.eret,.001);
  addCap(ring(.916,.87,-44.6*D,44.6*D,-.114),'#9fdcff',L.ecorn,.0012);
  const aq=[];for(let i=0;i<=40;i++){const a=-44*D+88*D*i/40;aq.push([-.114-.87*Math.cos(a),.87*Math.sin(a)]);}aq.push([-.64,-.6],[-.64,.6]);
  addCap(new THREE.ShapeGeometry(poly(aq)),'#cdeeff',L.eaq,-.001,.8);
  addCap(new THREE.PlaneGeometry(.05,.45).translate(-.66,.395,0),'#3d6f8f',L.eiris,.0015);addCap(new THREE.PlaneGeometry(.05,.45).translate(-.66,-.395,0),'#3d6f8f',L.eiris,.0015);
  addCap(disc(-.47,0,.17,.38),'#fff3c0',L.elens,.0016);
  addCap(disc(-.55,.69,.12,.075),'#c0493f',L.ecil,.0017);addCap(disc(-.55,-.69,.12,.075),'#c0493f',L.ecil,.0017);
  const zl=[];for(const sg of [1,-1])for(let i=0;i<5;i++){zl.push(-.47+(i-2)*.03,sg*.36,CZ+.002,-.55+(i-2)*.02,sg*.62,CZ+.002);}caps.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(zl,3)),new THREE.LineBasicMaterial({color:'#e9e1cf'})));
  const nvP=[[.9,-.05],[1.72,-.02],[1.72,-.3],[.9,-.27]];addCap(new THREE.ShapeGeometry(poly(nvP)),'#f2cf5b',L.eopt,.0012);addCap(new THREE.PlaneGeometry(.82,.025).translate(1.31,-.16,0),'#d6303a',L.eopt,.0016);
  addCap(disc(.885,.06,.035,.07),'#c86f12',L.emac,.0018);addCap(disc(.88,-.16,.03,.09),'#fff1b8',L.eblind,.0018);
  root.add(caps);
  // ход лучей
  const rays=new THREE.Group();const RM=new THREE.LineBasicMaterial({color:'#ffe066'});
  const arrow=(x,y0,y1,c)=>{const g=new THREE.Group();const s=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,Math.abs(y1-y0),8),new THREE.MeshBasicMaterial({color:c}));s.position.set(x,(y0+y1)/2,0);const h=new THREE.Mesh(new THREE.ConeGeometry(.07,.16,12),new THREE.MeshBasicMaterial({color:c}));h.position.set(x,y1,0);if(y1<y0)h.rotation.z=Math.PI;g.add(s,h);return g;};
  rays.add(arrow(-3.2,-.05,.75,'#ffe066'));for(const [cy,cl] of [[.3,.1],[.12,0],[-.08,-.12]])rays.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(-3.2,.75),V(-1.02,cy),V(-.47,cl),V(.9,-.2)]),RM));
  for(const [cy,cl] of [[.2,.08],[-.02,-.02]])rays.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(-3.2,-.05),V(-1.02,cy),V(-.47,cl),V(.92,.01)]),new THREE.LineBasicMaterial({color:'#9fe0ff'})));
  const im=arrow(0,.02,-.2,'#ffe066');im.scale.set(.6,1,.6);im.position.x=.9;rays.add(im);rays.visible=false;root.add(rays);
  // слои: смещения по оси
  const EX={ecorn:-2.7,eaq:-2.15,eiris:-1.6,epup:-1.6,elens:-1.05,ezon:-.6,ecil:-.25,evit:.3,eret:.85,eblind:.85,emac:.85,echor:1.35,esclera:1.85,eopt:1.85};
  let ex=0,exT=0;function update(dt){caps.visible=ex<.02&&exT===0;if(Math.abs(exT-ex)>.001){ex+=(exT-ex)*Math.min(1,dt*3);for(const k in EX)if(L[k])L[k].mesh.position.x=EX[k]*ex;}}
  return {root,keys:Object.keys(L),rays,update,setExplode:v=>{exT=v?1:0;},get exploded(){return exT>0;}};}

// ================= РЕФЛЕКТОРНАЯ ДУГА =================
export function buildSpinal(G,O){const root=new THREE.Group();root.position.copy(O);const L=.5,ex=g=>{g.translate(0,0,-L/2);return g;};
  const dors=[[-.13,.05],[-.17,.14],[-.22,.25],[-.27,.33],[-.24,.36],[-.18,.3],[-.11,.19],[-.05,.09],[0,.07],[.05,.09],[.11,.19],[.18,.3],[.24,.36],[.27,.33],[.22,.25],[.17,.14],[.13,.05]];
  const vent=[[.2,.0],[.3,-.06],[.34,-.16],[.3,-.26],[.2,-.3],[.12,-.27],[.07,-.15],[.03,-.07],[0,-.06],[-.03,-.07],[-.07,-.15],[-.12,-.27],[-.2,-.3],[-.3,-.26],[-.34,-.16],[-.3,-.06],[-.2,0]];
  const ell=new THREE.Shape();for(let i=0;i<=120;i++){const t=i/120*2*Math.PI;let x=.5*Math.cos(t),y=.42*Math.sin(t);if(Math.abs(Math.cos(t))<.03)y*=.88;i?ell.lineTo(x,y):ell.moveTo(x,y);}
  ell.holes.push(new THREE.Path(poly([...dors,...vent]).getPoints()));const E={depth:L,bevelEnabled:false,curveSegments:24};
  const wT=ctex(256,256,(x,w,h)=>{x.fillStyle='#f6e7b8';x.fillRect(0,0,w,h);fibers(x,w,h,'rgba(200,170,100,.25)',60,30,1);});
  const gT=ctex(256,256,(x,w,h)=>{x.fillStyle='#d9ae6a';x.fillRect(0,0,w,h);for(let i=0;i<220;i++){x.fillStyle='rgba(140,90,40,.45)';x.beginPath();x.arc(rnd()*w,rnd()*h,1.5+rnd()*2,0,7);x.fill();}});
  part(G,root,'scw','Белое вещество',{map:wT,hl:'#f6e7b8'},ex(new THREE.ExtrudeGeometry(ell,E)),V(.4,.18,L/2),'nerv');
  part(G,root,'scgd','Задние рога',{map:gT,hl:'#d9ae6a'},ex(new THREE.ExtrudeGeometry(poly(dors),E)),V(.25,.33,L/2),'nerv');
  part(G,root,'scga','Передние рога',{map:gT,hl:'#c99a58'},ex(new THREE.ExtrudeGeometry(poly([[.13,.05],...vent.slice(0,-1),[-.13,.05]]),E)),V(.3,-.2,L/2),'nerv');
  const cc=new THREE.CylinderGeometry(.022,.022,L+.004,16);cc.rotateX(Math.PI/2);part(G,root,'sccan','Центральный канал',{c:'#6a4a2a',hl:'#6a4a2a'},cc,V(0,0,L/2),'nerv');
  part(G,root,'scdr','Задний корешок',{c:'#efd29a',hl:'#efd29a'},tube([[-.24,.34,0],[-.45,.4,0],[-.72,.3,0]],.05),V(-.5,.42,.06),'nerv');
  const gg=new THREE.SphereGeometry(.13,24,16);gg.scale(1.35,1,1);gg.translate(-.82,.27,0);part(G,root,'scgang','Спинномозговой узел',{c:'#e9c07a',hl:'#e9c07a'},gg,V(-.82,.37,.1),'nerv');
  part(G,root,'scvr','Передний корешок',{c:'#efd29a',hl:'#efd29a'},tube([[-.3,-.2,0],[-.55,-.24,0],[-.85,-.12,0],[-1.05,-.02,0]],.05),V(-.6,-.28,.06),'nerv');
  part(G,root,'scnrv','Спинномозговой нерв',{c:'#efd29a',hl:'#efd29a'},[tube([[-.92,.22,0],[-1.05,.05,0],[-1.25,0,0],[-1.55,.25,0],[-1.92,.82,0]],.055),tube([[-1.25,0,0],[-1.6,-.3,0],[-1.95,-.78,0]],.055)],V(-1.35,.08,.07),'nerv');
  // палец с болевым рецептором
  const fg=new THREE.CapsuleGeometry(.16,.5,10,24);fg.rotateZ(-.9);fg.translate(-2.2,1.05,0);const nail=new THREE.BoxGeometry(.2,.05,.2);nail.rotateZ(-.9);nail.translate(-2.03,1.33,.05);
  part(G,root,'screc','Болевой рецептор (в коже пальца)',{c:'#f1c4a8',hl:'#ff5a5a'},[fg,nail],V(-2.38,1.25,.2),'nerv');
  const rc=new THREE.Mesh(new THREE.SphereGeometry(.05,16,12),new THREE.MeshBasicMaterial({color:'#ff4040',toneMapped:false}));rc.position.set(-2.02,.93,.14);root.add(rc);
  const mu=new THREE.SphereGeometry(.2,28,18);mu.scale(1,2.2,1);const mg=part(G,root,'scmus','Рабочий орган — мышца',{map:ctex(256,256,(x,w,h)=>{x.fillStyle='#c9534b';x.fillRect(0,0,w,h);fibers(x,w,h,'#8e2f2a',120,120,1.5,true);}),hl:'#c9534b'},mu,V(-1.95,-.78,.2),'nerv');mg.mesh.position.set(-2.08,-1.05,0);mg.mesh.rotation.z=.6;mg.anchorW=1;
  const sp=[[-2.02,.93,.14],[-1.9,.8,.13],[-1.55,.27,.12],[-1.25,.06,.12],[-1.05,.1,.12],[-.82,.27,.15],[-.6,.36,.12],[-.4,.38,.12],[-.24,.32,.26],[-.18,.22,.27],[-.12,.12,.27]];
  const ip=[[-.12,.12,.27],[-.13,.03,.27],[-.16,-.08,.27]];const mp=[[-.16,-.08,.27],[-.22,-.16,.27],[-.3,-.2,.12],[-.55,-.22,.1],[-.85,-.1,.1],[-1.05,-.04,.1],[-1.25,-.06,.12],[-1.6,-.36,.12],[-1.95,-.86,.12],[-2.03,-.98,.1]];
  const nc=p=>new THREE.CatmullRomCurve3(p.map(q=>V(...q)));const cS=nc(sp),cI=nc(ip),cM=nc(mp);
  const body=(p,r)=>new THREE.SphereGeometry(r,14,10).translate(...p);
  part(G,root,'nsens','Чувствительный нейрон (тело — в узле)',{c:'#3fa34d',hl:'#3fa34d'},[new THREE.TubeGeometry(cS,120,.016,8),body([-.82,.27,.16],.045)],V(-1.6,.42,.15),'nerv');
  part(G,root,'nint','Вставочный нейрон',{c:'#e0364a',hl:'#e0364a'},[new THREE.TubeGeometry(cI,30,.016,8),body([-.13,.03,.28],.035)],V(-.13,.03,.29),'nerv');
  part(G,root,'nmot','Двигательный нейрон (тело — в переднем роге)',{c:'#2f6fd6',hl:'#2f6fd6'},[new THREE.TubeGeometry(cM,120,.018,8),body([-.22,-.16,.28],.045)],V(-1.6,-.42,.15),'nerv');
  const pulse=new THREE.Mesh(new THREE.SphereGeometry(.055,16,12),new THREE.MeshBasicMaterial({color:'#fff6a0',toneMapped:false}));pulse.visible=false;root.add(pulse);
  const trail=[];for(let i=0;i<10;i++){const t=new THREE.Mesh(new THREE.SphereGeometry(.038*(1-i/12),10,8),new THREE.MeshBasicMaterial({color:'#ffd84a',transparent:true,opacity:.5*(1-i/10),toneMapped:false}));t.visible=false;root.add(t);trail.push(t);}
  const SEG=[[cS,1.6],[cI,.45],[cM,1.6]];let run=-1,u=0,hist=[],mt=0,onStage=null,lastSt=0;
  function fire(){run=0;u=0;hist=[];mt=0;lastSt=0;onStage&&onStage(0);}
  function update(dt){rc.scale.setScalar(1+.25*Math.sin(performance.now()/180));
    if(run>=0){u+=dt/SEG[run][1];if(u>=1){run++;u=0;if(run>=SEG.length){run=-1;mt=1;onStage&&onStage(4);}}
      if(run>=0){const p=SEG[run][0].getPoint(Math.min(u,1));pulse.position.copy(p);pulse.visible=true;hist.unshift(p.clone());hist.length=Math.min(hist.length,10);const stg=run===0?(u<.42?0:1):run+1;if(stg!==lastSt){lastSt=stg;onStage&&onStage(stg);}}}
    else pulse.visible=false;trail.forEach((t,i)=>{t.visible=pulse.visible&&!!hist[i];if(hist[i])t.position.copy(hist[i]);});
    if(mt>0){mt-=dt*.9;const k=Math.sin(Math.max(0,mt)*Math.PI);mg.mesh.scale.set(1+.25*k,1-.3*k,1+.25*k);}else mg.mesh.scale.set(1,1,1);}
  return {root,keys:['scw','scgd','scga','sccan','scdr','scgang','scvr','scnrv','screc','scmus','nsens','nint','nmot'],update,fire,set onStage(f){onStage=f;}};}

// ================= НЕРВ И НЕЙРОН =================
export function buildNeuron(G,O){const root=new THREE.Group();root.position.copy(O);
  const nb=new THREE.SphereGeometry(.28,40,30);const np=nb.attributes.position;for(let i=0;i<np.count;i++){const v=V(np.getX(i),np.getY(i),np.getZ(i));const k=1+.18*Math.sin(v.x*12)*Math.sin(v.y*10);np.setXYZ(i,v.x*k,v.y*k,v.z*k*.6);}nb.computeVertexNormals();nb.translate(1.6,.55,0);
  part(G,root,'nbody','Тело нейрона',{c:'#f2b44a',hl:'#f2b44a'},nb,V(1.75,.82,.15),'nerv');
  const nu=new THREE.SphereGeometry(.09,24,16);nu.translate(1.6,.55,.14);part(G,root,'nnuc','Ядро',{c:'#b8562a',hl:'#b8562a'},nu,V(1.6,.55,.24),'nerv');
  const den=[];const br=(p,a,l,d,r)=>{if(d<=0)return;const q=[p[0]+Math.cos(a)*l,p[1]+Math.sin(a)*l,(rnd()-.5)*.1];den.push(tube([p,[(p[0]+q[0])/2+(rnd()-.5)*.05,(p[1]+q[1])/2+(rnd()-.5)*.05,q[2]/2],q],r,8,6));br(q,a-.45,l*.7,d-1,r*.7);br(q,a+.45,l*.7,d-1,r*.7);};
  for(const a of [.3,1.1,1.9,2.7,-.4]){br([1.6+.26*Math.cos(a),.55+.26*Math.sin(a),0],a,.35,4,.035);}
  part(G,root,'nden','Дендриты',{c:'#f2b44a',hl:'#f2b44a'},den,V(2.2,1.1,.05),'nerv');
  const ax=new THREE.CatmullRomCurve3([V(1.5,.3),V(1.3,-.1),V(.9,-.35),V(.3,-.4),V(-.3,-.35),V(-.9,-.3),V(-1.3,-.2)]);
  part(G,root,'naxon','Аксон (нервное волокно)',{c:'#f2b44a',hl:'#f2b44a'},new THREE.TubeGeometry(ax,120,.03,10),V(1.32,-.12,.06),'nerv');
  const my=[],nodes=[];for(let i=0;i<7;i++){const t0=.3+i*.095,t1=t0+.08;const pts=[];for(let k=0;k<=6;k++)pts.push(ax.getPoint(t0+(t1-t0)*k/6));my.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),12,.075,16));nodes.push(t1+.0075);}
  part(G,root,'nmyel','Миелиновая оболочка (шванновские клетки)',{c:'#cfe9f7',hl:'#9fd0ee'},my,ax.getPoint(.45).add(V(0,.1,.08)),'nerv');
  part(G,root,'nranv','Перехваты Ранвье',{c:'#ffd23f',hl:'#ffd23f'},nodes.slice(0,6).map(t=>new THREE.SphereGeometry(.04,12,8).translate(...ax.getPoint(t).toArray())),ax.getPoint(nodes[2]).add(V(0,-.1,.05)),'nerv');
  // нервный ствол
  const X=-1.35;const ep=new THREE.CylinderGeometry(.55,.55,1.1,48,1,true);ep.rotateZ(Math.PI/2);ep.translate(X-.55,-.2,0);
  part(G,root,'nepi','Эпиневрий (оболочка нерва)',{c:'#a9d4ee',hl:'#a9d4ee',op:.55},ep,V(X-.6,.33,.1),'nerv');
  const fT=ctex(256,256,(x,w,h)=>{x.fillStyle='#f6dfa8';x.fillRect(0,0,w,h);cells(x,w,h,160,6,10,'#e9963a','#fff1d0',2);x.lineWidth=10;x.strokeStyle='#8fc8ee';x.beginPath();x.arc(w/2,h/2,w/2-5,0,7);x.stroke();});
  const fs=[];for(const [y,z,r] of [[.1,.15,.2],[-.2,-.2,.22],[-.45,.18,.17],[.12,-.28,.15],[-.25,.05,.12]]){const c=new THREE.CircleGeometry(r,32);c.rotateY(-Math.PI/2);c.translate(X-1.1,y-.2+.2,z);fs.push(c);const b=new THREE.CylinderGeometry(r,r,1.1,24,1,true);b.rotateZ(Math.PI/2);b.translate(X-.55,y,z);fs.push(b);}
  part(G,root,'nfas','Пучки нервных волокон (периневрий)',{map:fT,hl:'#f6dfa8'},fs,V(X-1.12,.15,.18),'nerv');
  const vs=new THREE.CylinderGeometry(.05,.05,1.15,12);vs.rotateZ(Math.PI/2);vs.translate(X-.55,.25,.3);part(G,root,'nves','Кровеносные сосуды нерва',{c:'#d6303a',hl:'#d6303a'},vs,V(X-.9,.3,.36),'nerv');
  // окончание на мышце
  const mf=[];for(let i=0;i<3;i++){const g=new THREE.CylinderGeometry(.09,.09,1.0,20);g.translate(-.2+i*.22,1.2,0);mf.push(g);}
  part(G,root,'nmus','Мышечные волокна',{map:ctex(64,256,(x,w,h)=>{x.fillStyle='#d9645c';x.fillRect(0,0,w,h);for(let Y=0;Y<h;Y+=8){x.fillStyle='#9a3a34';x.fillRect(0,Y,w,3);}}),hl:'#d9645c'},mf,V(-.45,1.6,.12),'nerv');
  const term=[];for(let i=0;i<3;i++)term.push(tube([[.35,.7,0],[.25,.9,0],[-.2+i*.22+.09,1.05,0]],.018,10,6));term.push(tube([[-1.2,-.22,0],[-.6,.2,0],[.1,.5,0],[.35,.7,0]],.022,30,8));
  part(G,root,'nsyn','Нервно-мышечный синапс (окончание аксона)',{c:'#f2b44a',hl:'#f2b44a'},term,V(.3,.95,.08),'nerv');
  const pulse=new THREE.Mesh(new THREE.SphereGeometry(.06,16,12),new THREE.MeshBasicMaterial({color:'#fff6a0',toneMapped:false}));pulse.visible=false;root.add(pulse);
  let run=-1;function fire(){run=0;}
  function update(dt){if(run<0){pulse.visible=false;return;}run+=dt*.6;const i=Math.floor(run*8);const t=.3+Math.min(i,7)*.095;pulse.visible=true;pulse.position.copy(ax.getPoint(Math.min(t,.98)));if(run>1.05)run=-1;}
  return {root,keys:['nbody','nnuc','nden','naxon','nmyel','nranv','nepi','nfas','nves','nmus','nsyn'],update,fire};}
