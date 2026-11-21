// Процедурные сцены: почка в разрезе и нефрон с анимацией образования мочи
import * as THREE from 'three';
import {mergeGeometries} from './vendor/BufferGeometryUtils.js';
const V=(x,y,z=0)=>new THREE.Vector3(x,y,z);
const mat=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.6,metalness:0,envMapIntensity:.3,transparent:true,side:THREE.DoubleSide,emissive:c,emissiveIntensity:.22,...o});
const prep=g=>{g=g.index?g.toNonIndexed():g;for(const k of Object.keys(g.attributes))if(!['position','normal'].includes(k))g.deleteAttribute(k);if(!g.attributes.normal)g.computeVertexNormals();return g;};
const merge=gs=>mergeGeometries(gs.map(prep));
function part(G,root,k,ru,col,geos,anchor,sys='uro'){
  const geo=Array.isArray(geos)?merge(geos):prep(geos);geo.computeBoundingBox();geo.computeBoundingSphere();
  const m=new THREE.Mesh(geo,mat(col));root.add(m);
  const g={k,ru,sys,col,mesh:m,home:new THREE.Vector3(),proc:true,anchor,size:geo.boundingSphere.radius*2};m.userData=g;G[k]=g;return g;}

// ---------- ПОЧКА (единицы ~ 1 = 10 см)
function bean(t,s=1){let a=((t+Math.PI)%(2*Math.PI))-Math.PI;const x=.42*Math.cos(t)-.2*Math.exp(-(a*a)/.22),y=.62*Math.sin(t);return V(x*s+(1-s)*.05,y*s);}
const shapeOf=(f,n=120)=>{const sh=new THREE.Shape();for(let i=0;i<=n;i++){const p=f(i/n*2*Math.PI);i?sh.lineTo(p.x,p.y):sh.moveTo(p.x,p.y);}return sh;};
export function buildKidney(G,O){
  const root=new THREE.Group();root.position.copy(O);
  // купол (задняя, нерассечённая половина)
  const R=40,N=96,pos=[],idx=[];
  for(let r=0;r<=R;r++){const ph=r/R*Math.PI/2,c=Math.cos(ph);for(let i=0;i<N;i++){const p=bean(i/N*2*Math.PI);pos.push((p.x+.03)*c-.03,p.y*c,-.32*Math.sin(ph));}}
  for(let r=0;r<R;r++)for(let i=0;i<N;i++){const a=r*N+i,b=r*N+(i+1)%N,c=a+N,d=b+N;idx.push(a,c,b,b,c,d);}
  const dome=new THREE.BufferGeometry();dome.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));dome.setIndex(idx);dome.computeVertexNormals();
  const rim=new THREE.ShapeGeometry(shapeOf(t=>bean(t)));
  part(G,root,'kcaps','Капсула почки','#d8c2ae',[dome,rim],bean(1.9).add(V(0,0,.01)));
  const cort=new THREE.ShapeGeometry(shapeOf(t=>bean(t,.965)));cort.translate(0,0,.004);
  part(G,root,'kcort','Корковое вещество','#c8594a',cort,bean(2.6,.9).add(V(0,0,.01)));
  const sinus=new THREE.ShapeGeometry(shapeOf(t=>V(.17+.15*Math.cos(t),.33*Math.sin(t))));sinus.translate(0,0,.008);
  const sinM=new THREE.Mesh(sinus,mat('#ead7a6'));root.add(sinM);
  // пирамиды
  const C=V(.14,0),pyr=[],tips=[],strokes=[];const angs=[];for(let i=0;i<7;i++)angs.push(.75+i*(2*Math.PI-1.5)/6);
  for(const th of angs){const sh=new THREE.Shape(),d=.3;const tip=C.clone().add(V(.2*Math.cos(th),.3*Math.sin(th)));
    for(let j=0;j<=12;j++){const p=bean(th-d+2*d*j/12,.8);j?sh.lineTo(p.x,p.y):sh.moveTo(p.x,p.y);}sh.lineTo(tip.x,tip.y);
    const g=new THREE.ShapeGeometry(sh);g.translate(0,0,.012);pyr.push(g);tips.push({tip,th});
    for(let j=1;j<12;j++){const b=bean(th-d+2*d*j/12,.8);strokes.push(b.x,b.y,.014,tip.x+(b.x-tip.x)*.12,tip.y+(b.y-tip.y)*.12,.014);}}
  part(G,root,'kmed','Мозговое вещество (пирамиды)','#8a2f2b',pyr,bean(angs[5],.74).add(V(0,0,.02)));
  const sl=new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(strokes,3)),new THREE.LineBasicMaterial({color:'#5c1a18',transparent:true,opacity:.6}));root.add(sl);
  // сосочки, чашечки, лоханка, мочеточник
  const pap=[],cal=[],pel=[];const P0=V(.24,-.02,.03);
  for(const {tip,th} of tips){const dir=V(Math.cos(th),Math.sin(th)*1.4).normalize();
    const s=new THREE.SphereGeometry(.035,14,10);s.translate(tip.x+dir.x*.01,tip.y+dir.y*.01,.02);pap.push(s);
    const cup=new THREE.TorusGeometry(.05,.016,8,20,Math.PI*1.1);cup.rotateZ(th+Math.PI/2-Math.PI*.55);cup.translate(tip.x-dir.x*.005,tip.y-dir.y*.005,.03);cal.push(cup);
    const end=tip.clone().add(dir.clone().multiplyScalar(-.06));const mid=end.clone().lerp(P0,.5).add(V(0,0,.01));
    cal.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(end.x,end.y,.03),mid,P0]),16,.022,8));}
  part(G,root,'kpap','Почечный сосочек','#a63c35',pap,tips[1].tip.clone().add(V(0,0,.04)));
  part(G,root,'kcalyx','Почечные чашечки','#f4e4b8',cal,tips[5].tip.clone().add(V(-.03,-.03,.04)));
  const pv=new THREE.SphereGeometry(.1,24,16);pv.scale(1,1.7,.55);pv.translate(P0.x,P0.y,P0.z);pel.push(pv);
  part(G,root,'kpelv','Почечная лоханка','#f7e9c0',pel,P0.clone().add(V(.02,.06,.05)));
  const ur=new THREE.CatmullRomCurve3([V(.3,-.12,.03),V(.42,-.25,.02),V(.5,-.5,0),V(.52,-.85,0),V(.5,-1.15,0)]);
  part(G,root,'kuret','Мочеточник','#f2deb0',new THREE.TubeGeometry(ur,40,.045,12),ur.getPoint(.7));
  // сосуды
  const art=[],vein=[];const aIn=new THREE.CatmullRomCurve3([V(.85,.16,.02),V(.55,.15,.03),V(.33,.13,.035),V(.22,.12,.04)]);art.push(new THREE.TubeGeometry(aIn,30,.04,10));
  const vIn=new THREE.CatmullRomCurve3([V(.85,.02,-.02),V(.55,.03,-.01),V(.33,.05,.0),V(.22,.06,.0)]);vein.push(new THREE.TubeGeometry(vIn,30,.05,10));
  angs.forEach((th,i)=>{if(i===6)return;const t2=th+(angs[1]-angs[0])/2;const a=bean(t2,.83),b=C.clone().add(V(.12*Math.cos(t2),.2*Math.sin(t2)));
    const cA=new THREE.CatmullRomCurve3([V(.22,.12,.04),V(b.x,b.y,.04),V(a.x,a.y,.035),V(bean(t2-.18,.84).x,bean(t2-.18,.84).y,.035)]);art.push(new THREE.TubeGeometry(cA,24,.012,6));
    const cV=new THREE.CatmullRomCurve3([V(.22,.06,.0),V(b.x+.02,b.y-.02,.025),V(a.x+.01,a.y-.01,.03),V(bean(t2+.18,.85).x,bean(t2+.18,.85).y,.03)]);vein.push(new THREE.TubeGeometry(cV,24,.012,6));});
  part(G,root,'kart','Почечная артерия','#e0302a',art,V(.72,.16,.06));
  part(G,root,'kvein','Почечная вена','#3c6fd1',vein,V(.72,.02,.03));
  return {root,keys:['kcaps','kcort','kmed','kpap','kcalyx','kpelv','kuret','kart','kvein'],extra:[sinM,sl]};
}

// ---------- НЕФРОН
export function buildNephron(G,O){
  const root=new THREE.Group();root.position.copy(O);
  // зоны
  const zc=part(G,root,'nzc','Корковое вещество','#7a3a3a',new THREE.PlaneGeometry(2.6,1.1).translate(0,.75,-.4),V(-1.05,1.18,-.4));zc.op=.3;
  const zm=part(G,root,'nzm','Мозговое вещество','#3d2048',new THREE.PlaneGeometry(2.6,1.85).translate(0,-.72,-.4),V(-1.05,-.25,-.4));zm.op=.38;
  const G0=V(0,.85,0);
  // клубочек
  let rnd=7;const rr=()=>{rnd=(rnd*16807)%2147483647;return rnd/2147483647;};
  const tp=[V(-.05,1.02,0)];for(let i=0;i<34;i++){const u=rr()*2-1,t=rr()*6.283,r=.14*Math.cbrt(rr());tp.push(V(Math.sqrt(1-u*u)*Math.cos(t)*r,u*r+.85,Math.sqrt(1-u*u)*Math.sin(t)*r));}tp.push(V(.05,1.02,0));
  const tuft=new THREE.CatmullRomCurve3(tp);
  part(G,root,'nglom','Капиллярный клубочек','#e0302a',new THREE.TubeGeometry(tuft,300,.017,6),G0.clone().add(V(-.12,-.05,.08)));
  const cap=new THREE.SphereGeometry(.24,32,24,0,Math.PI*2,.5,Math.PI-.5);cap.translate(0,.85,0);
  const gc=part(G,root,'ncaps','Капсула нефрона','#ffd96a',cap,G0.clone().add(V(-.2,.08,.1)));gc.mesh.material.opacity=.35;gc.op=.35;
  const aff=new THREE.CatmullRomCurve3([V(-.85,1.3,0),V(-.4,1.22,0),V(-.12,1.12,0),V(-.05,1.02,0)]);
  const eff=new THREE.CatmullRomCurve3([V(.05,1.02,0),V(.15,1.13,0),V(.45,1.2,0),V(.62,1.18,.05)]);
  part(G,root,'naff','Приносящая артериола','#ff3b30',new THREE.TubeGeometry(aff,40,.04,10),aff.getPoint(.35));
  part(G,root,'neff','Выносящая артериола','#c4282a',new THREE.TubeGeometry(eff,40,.026,10),eff.getPoint(.6));
  // каналец
  const pts=[V(0,.61,0),V(.12,.52,.05),V(.3,.66,.08),V(.46,.55,.02),V(.32,.42,-.05),V(.52,.34,.03),V(.44,.2,0), // ПИК 0-6
    V(.44,-.3,0),V(.44,-.9,0),V(.4,-1.22,0),V(.3,-1.32,0),V(.22,-1.22,0),V(.22,-.6,0),V(.22,0,0),V(.22,.22,0), // петля 6-14
    V(.08,.4,.06),V(-.14,.46,-.04),V(-.3,.34,.05),V(-.22,.22,-.03),V(-.42,.16,0),V(-.6,.1,0)]; // ДИК 14-20
  const tub=new THREE.CatmullRomCurve3(pts);const n=pts.length-1;const S={pct:[0,6/n],loop:[6/n,14/n],dct:[14/n,1]};
  const seg=(a,b,r,div)=>{const ps=[];for(let i=0;i<=div;i++)ps.push(tub.getPoint(a+(b-a)*i/div));return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ps),div,r,10);};
  part(G,root,'npct','Извитой каналец 1-го порядка','#ffcf5c',seg(S.pct[0],S.pct[1],.04,90),tub.getPoint(.12).add(V(.02,.02,.06)));
  part(G,root,'nloop','Петля Генле','#62c8ff',seg(S.loop[0],S.loop[1],.034,120),tub.getPoint(.4));
  part(G,root,'ndct','Извитой каналец 2-го порядка','#7fe08a',seg(S.dct[0],S.dct[1],.036,80),tub.getPoint(.82).add(V(0,0,.05)));
  const cd=new THREE.CatmullRomCurve3([V(-.6,.1,0),V(-.66,.0,0),V(-.66,-.8,0),V(-.66,-1.6,0)]);
  part(G,root,'ncd','Собирательная трубочка','#c7a4ff',new THREE.TubeGeometry(cd,40,.06,12),cd.getPoint(.55));
  // перитубулярный капилляр: от выносящей артериолы вокруг канальцев → вена
  const cp=[V(.62,1.18,.05),V(.62,.72,.12),V(.6,.4,.12),V(.56,-.2,.08),V(.54,-1.0,.06),V(.36,-1.42,.06),V(.12,-1.0,.08),V(.1,.0,.1),V(-.05,.32,.14),V(-.35,.5,.12),V(-.5,.42,.1),V(-.78,.62,.05),V(-.95,1.3,0)];
  const capC=new THREE.CatmullRomCurve3(cp);const cg=new THREE.TubeGeometry(capC,200,.016,6);
  part(G,root,'ncap','Капилляры вокруг канальцев','#b04a7a',cg,capC.getPoint(.25));
  // частицы
  const MAX=420,pm=new THREE.InstancedMesh(new THREE.SphereGeometry(.02,8,6),new THREE.MeshBasicMaterial({toneMapped:false}),MAX);pm.frustumCulled=false;root.add(pm);
  const TY={water:['#46b4ff',1],glu:['#ffd23f',1],aa:['#4fe08a',1],salt:['#f0f4fa',.85],urea:['#c38bff',1],prot:['#ff8a3d',1.7],rbc:['#e0242a',1.8],sec:['#ff6a1f',1.1]};
  const P=[],capS=[];for(let i=0;i<=200;i++)capS.push(capC.getPoint(i/200));
  const near=p=>{let b=0,d=1e9;for(let i=0;i<capS.length;i++){const q=capS[i].distanceToSquared(p);if(q<d){d=q;b=i;}}return b/200;};
  const rule={glu:()=>[.02+rr()*.26,'pct'],aa:()=>[.02+rr()*.26,'pct'],water:()=>{const r=rr();return r<.62?[.03+rr()*.25,'pct']:r<.8?[.3+rr()*.15,'loop']:r<.93?[1.4,'cd']:[9,'']},
    salt:()=>{const r=rr();return r<.6?[.03+rr()*.25,'pct']:r<.85?[.5+rr()*.17,'loop']:r<.93?[.7+rr()*.2,'dct']:[9,'']},urea:()=>rr()<.3?[.05+rr()*.2,'pct']:[9,'']};
  let acc=0,emph=0;
  function spawn(){const r=rr();
    if(r<.16){const t=rr()<.55?'rbc':'prot';P.push({t,ph:'blood',c:aff,u:0,sp:.5});return;}
    if(r<.24){const u=.62+rr()*.14;P.push({t:'sec',ph:'cap',c:capC,u,sp:.15,goal:S.dct[0]+.15+rr()*.55*(S.dct[1]-S.dct[0])});return;}
    const ks=['water','water','water','glu','aa','salt','salt','urea'],t=ks[rr()*ks.length|0];const [ex,where]=rule[t]();
    P.push({t,ph:'aff',c:aff,u:0,sp:.55,ex});}
  const m4=new THREE.Matrix4(),col=new THREE.Color(),tmp=new THREE.Vector3();
  function update(dt){acc+=dt;while(acc>.045&&P.length<MAX-5){acc-=.045;spawn();}
    for(let i=P.length-1;i>=0;i--){const p=P[i];
      if(p.ph==='aff'||p.ph==='blood'){p.u+=dt*p.sp;if(p.u>=1){if(p.ph==='aff'){p.ph='glom';p.u=0;p.a=tuft.getPoint(rr()).clone();p.b=G0.clone().add(V(rr()-.5,rr()-.5,rr()-.5).normalize().multiplyScalar(.2));}
          else if(p.c===aff){p.c=tuft;p.u=0;p.sp=.35;}else if(p.c===tuft){p.c=eff;p.u=0;p.sp=.6;}else if(p.c===eff){p.c=capC;p.u=0;p.sp=.09;}else{P.splice(i,1);continue;}}}
      else if(p.ph==='glom'){p.u+=dt*1.1;if(p.u>=1){p.ph='cap2tub';p.a=p.b;p.b=tub.getPoint(0);p.u=0;}}
      else if(p.ph==='cap2tub'){p.u+=dt*1.4;if(p.u>=1){p.ph='tub';p.u=0;p.c=tub;p.sp=.06;}}
      else if(p.ph==='tub'){p.u+=dt*p.sp*(p.u<S.pct[1]?1.3:1);if(p.u>=p.ex&&p.ex<=1){p.ph='out';p.a=tub.getPoint(p.u).clone();const nu=near(p.a);p.b=capC.getPoint(nu);p.nu=nu;p.k=0;}
        else if(p.u>=1){p.ph='cd';p.c=cd;p.u=0;p.sp=.2;}}
      else if(p.ph==='out'){p.k+=dt*1.3;if(p.k>=1){p.ph='blood';p.c=capC;p.u=p.nu;p.sp=.09;p.rb=1;}}
      else if(p.ph==='cap'){p.u+=dt*p.sp;if(p.u>=.78||p.u>=p.goal+5){p.ph='in';p.a=capC.getPoint(p.u).clone();p.b=tub.getPoint(p.goal).clone();p.k=0;}}
      else if(p.ph==='in'){p.k+=dt*1.2;if(p.k>=1){p.ph='tub';p.c=tub;p.u=p.goal;p.sp=.06;p.ex=9;}}
      else if(p.ph==='cd'){p.u+=dt*p.sp;if(p.ex>1&&p.ex<2&&p.u>.25+rr()*.02&&rr()<.02){p.ph='out';p.a=cd.getPoint(p.u).clone();p.nu=.98;p.b=capC.getPoint(.97);p.k=0;continue;}if(p.u>=1){P.splice(i,1);continue;}}
    }
    for(let i=0;i<MAX;i++){const p=P[i];if(!p){m4.makeScale(0,0,0);pm.setMatrixAt(i,m4);continue;}
      if(p.ph==='glom'||p.ph==='cap2tub')tmp.lerpVectors(p.a,p.b,Math.min(1,p.u));else if(p.ph==='out'||p.ph==='in')tmp.lerpVectors(p.a,p.b,p.k);else tmp.copy(p.c.getPoint(Math.min(1,p.u)));
      const [c,s]=TY[p.t];let sc=s;const hot=emph===1&&(p.ph==='glom'||p.ph==='cap2tub')||emph===2&&p.ph==='out'||emph===3&&(p.ph==='in'||p.t==='sec')||emph===4&&p.ph==='cd';if(emph&&hot)sc*=1.7;if(p.rb)sc*=.75;
      m4.makeScale(sc,sc,sc).setPosition(tmp);pm.setMatrixAt(i,m4);col.set(c);if(emph&&!hot)col.multiplyScalar(.35);pm.setColorAt(i,col);}
    pm.instanceMatrix.needsUpdate=true;if(pm.instanceColor)pm.instanceColor.needsUpdate=true;}
  for(let i=0;i<400;i++)update(1/30);
  return {root,keys:['nzc','nzm','nglom','ncaps','naff','neff','npct','nloop','ndct','ncd','ncap'],extra:[pm],update,setEmph:e=>emph=e};
}
export const STEPS=[
 {k:'nglom',t:'1. Фильтрация',x:'В капсуле нефрона из крови клубочка под давлением выходят вода, глюкоза, аминокислоты, соли и мочевина. Белки и клетки крови остаются в крови. Так образуется первичная моча — около 150–180 л в сутки.',w:'Выносящая артериола уже приносящей, поэтому давление в клубочке высокое. В выносящей артериоле течёт артериальная кровь.',cam:[[0,.78,0],[.6,1.0,2.6]]},
 {k:'npct',t:'2. Обратное всасывание',x:'В извитых канальцах и петле Генле в кровь возвращаются вся глюкоза и аминокислоты, большая часть воды и солей. Вещества переходят в капилляры, оплетающие каналец.',w:'Глюкоза в моче — признак сахарного диабета: её больше, чем канальцы успевают всосать.',cam:[[.25,-.2,0],[1.4,.2,6.4]]},
 {k:'ndct',t:'3. Секреция',x:'Из крови в каналец 2-го порядка активно выделяются ионы водорода и калия, лекарства и некоторые яды.',w:'Секреция — из крови в каналец, обратное всасывание — из канальца в кровь.',cam:[[-.2,.3,0],[.4,.6,3.4]]},
 {k:'ncd',t:'4. Вторичная моча',x:'В собирательных трубочках всасывается ещё вода. Остаётся вторичная моча — около 1,5 л в сутки: вода, мочевина, соли. Путь: трубочка → сосочек → чашечки → лоханка → мочеточник.',w:'Всасывание воды в собирательных трубочках усиливает антидиуретический гормон (вазопрессин).',cam:[[-.45,-.55,0],[1.3,-.2,6.4]]}];

// ---------- СПИННОЙ МОЗГ + РЕФЛЕКТОРНАЯ ДУГА
const shp=(pts)=>{const s=new THREE.Shape();pts.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));return s;};
export function buildSpinal(G,O){
  const root=new THREE.Group();root.position.copy(O);const L=.5,ex=g=>{g.translate(0,0,-L/2);return g;};
  const dors=[[-.2,.04],[-.19,.12],[-.24,.24],[-.29,.34],[-.26,.37],[-.21,.3],[-.15,.17],[-.07,.08],[0,.06],[.07,.08],[.15,.17],[.21,.3],[.26,.37],[.29,.34],[.24,.24],[.19,.12],[.2,.04]];
  const vent=[[.27,-.02],[.33,-.1],[.32,-.22],[.24,-.3],[.13,-.29],[.07,-.18],[.04,-.08],[0,-.06],[-.04,-.08],[-.07,-.18],[-.13,-.29],[-.24,-.3],[-.32,-.22],[-.33,-.1],[-.27,-.02]];
  const ell=new THREE.Shape();for(let i=0;i<=96;i++){const t=i/96*2*Math.PI;let x=.5*Math.cos(t),y=.4*Math.sin(t);if(Math.abs(Math.cos(t))<.04)y*=.93;i?ell.lineTo(x,y):ell.moveTo(x,y);}
  ell.holes.push(new THREE.Path(shp([...dors,...vent]).getPoints()));
  const E={depth:L,bevelEnabled:false,curveSegments:24};
  part(G,root,'scw','Белое вещество','#f3ede2',ex(new THREE.ExtrudeGeometry(ell,E)),V(.38,.2,L/2),'nerv');
  part(G,root,'scgd','Задние рога','#a99aa8',ex(new THREE.ExtrudeGeometry(shp(dors),E)),V(.24,.3,L/2),'nerv');
  part(G,root,'scga','Передние рога','#9a8aa0',ex(new THREE.ExtrudeGeometry(shp([[.2,.04],...vent,[-.2,.04]]),E)),V(.26,-.2,L/2),'nerv');
  const cc=new THREE.CylinderGeometry(.022,.022,L+.004,16);cc.rotateX(Math.PI/2);part(G,root,'sccan','Центральный канал','#5a4d6e',cc,V(0,0,L/2),'nerv');
  // корешки, узел, нерв
  const tube=(pts,r)=>new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>V(...p))),48,r,12);
  part(G,root,'scdr','Задний корешок','#f0dca8',tube([[-.24,.33,0],[-.45,.38,0],[-.72,.3,0]],.045),V(-.5,.4,.05),'nerv');
  const gg=new THREE.SphereGeometry(.12,24,16);gg.scale(1.3,1,1);gg.translate(-.82,.27,0);part(G,root,'scgang','Спинномозговой узел','#f2c86a',gg,V(-.82,.36,.08),'nerv');
  part(G,root,'scvr','Передний корешок','#e9d3a0',tube([[-.28,-.22,0],[-.55,-.24,0],[-.85,-.12,0],[-1.05,-.02,0]],.045),V(-.6,-.27,.05),'nerv');
  part(G,root,'scnrv','Спинномозговой нерв','#ecd7a4',[tube([[-.92,.22,0],[-1.05,.05,0],[-1.25,0,0],[-1.55,.25,0],[-1.95,.85,0]],.05),tube([[-1.25,0,0],[-1.6,-.3,0],[-1.95,-.78,0]],.05)],V(-1.35,.08,.06),'nerv');
  // кожа с рецептором и мышца
  const sk=new THREE.BoxGeometry(.6,.16,.36);sk.rotateZ(-.5);sk.translate(-2.12,1.02,0);part(G,root,'screc','Рецептор в коже','#f2b8a2',sk,V(-2.2,1.12,.2),'nerv');
  const rc=new THREE.SphereGeometry(.05,16,12);rc.translate(-2.02,.92,.12);const rcm=new THREE.Mesh(rc,mat('#ffe14a',{emissive:'#ffb800',emissiveIntensity:.6}));root.add(rcm);
  const mu=new THREE.SphereGeometry(.2,28,18);mu.scale(1,2.1,1);mu.translate(0,0,0);const mg=part(G,root,'scmus','Рабочий орган — мышца','#c2453c',mu,V(-1.98,-.82,.2),'nerv');mg.anchorW=1;mg.mesh.position.set(-2.08,-1.05,0);mg.mesh.rotation.z=.6;
  // нейроны
  const sp=[[-2.02,.92,.12],[-1.9,.8,.12],[-1.55,.27,.12],[-1.25,.06,.12],[-1.05,.1,.12],[-.82,.27,.13],[-.6,.34,.12],[-.4,.36,.12],[-.24,.32,.26],[-.18,.2,.27],[-.14,.08,.27]];
  const ip=[[-.14,.08,.27],[-.15,.0,.27],[-.18,-.1,.27]];
  const mp=[[-.18,-.1,.27],[-.22,-.18,.27],[-.3,-.22,.12],[-.55,-.22,.1],[-.85,-.1,.1],[-1.05,-.04,.1],[-1.25,-.06,.12],[-1.6,-.36,.12],[-1.95,-.86,.12],[-2.03,-.98,.1]];
  const nc=p=>new THREE.CatmullRomCurve3(p.map(q=>V(...q)));const cS=nc(sp),cI=nc(ip),cM=nc(mp);
  part(G,root,'nsens','Чувствительный нейрон','#4fb3ff',[new THREE.TubeGeometry(cS,120,.014,8),new THREE.SphereGeometry(.04,14,10).translate(-.82,.27,.13)],V(-1.6,.42,.14),'nerv');
  part(G,root,'nint','Вставочный нейрон','#6fe08a',[new THREE.TubeGeometry(cI,30,.014,8),new THREE.SphereGeometry(.03,14,10).translate(-.15,.0,.27)],V(-.15,0,.28),'nerv');
  part(G,root,'nmot','Двигательный нейрон','#ff7a45',[new THREE.TubeGeometry(cM,120,.016,8),new THREE.SphereGeometry(.04,14,10).translate(-.22,-.18,.27)],V(-1.6,-.42,.14),'nerv');
  // импульс
  const pulse=new THREE.Mesh(new THREE.SphereGeometry(.05,16,12),new THREE.MeshBasicMaterial({color:'#fff6a0',toneMapped:false}));pulse.visible=false;root.add(pulse);
  const trail=[];for(let i=0;i<10;i++){const t=new THREE.Mesh(new THREE.SphereGeometry(.035*(1-i/12),10,8),new THREE.MeshBasicMaterial({color:'#ffd84a',transparent:true,opacity:.5*(1-i/10),toneMapped:false}));t.visible=false;root.add(t);trail.push(t);}
  const SEG=[[cS,1.6,1],[cI,.45,2],[cM,1.6,3]];let run=-1,u=0,hist=[],mt=0,onStage=null,lastSt=0;
  function fire(){run=0;u=0;hist=[];mt=0;lastSt=0;onStage&&onStage(0);}
  function update(dt){rcm.scale.setScalar(1+.15*Math.sin(performance.now()/200));
    if(run>=0){const [c,dur,st]=SEG[run];u+=dt/dur;if(u>=1){run++;u=0;if(run>=SEG.length){run=-1;mt=1;onStage&&onStage(4);}}
      if(run>=0){const [c2,,st2]=SEG[run];const p=c2.getPoint(Math.min(u,1));pulse.position.copy(p);pulse.visible=true;hist.unshift(p.clone());hist.length=Math.min(hist.length,10);
        const stg=run===0?(u<.42?0:1):st2;if(stg!==lastSt){lastSt=stg;onStage&&onStage(stg);}}}
    else pulse.visible=false;
    trail.forEach((t,i)=>{t.visible=pulse.visible&&!!hist[i*1];if(hist[i])t.position.copy(hist[i]);});
    if(mt>0){mt-=dt*.9;const k=Math.sin(Math.max(0,mt)*Math.PI);mg.mesh.scale.set(1+.25*k,1-.3*k,1+.25*k);}else mg.mesh.scale.set(1,1,1);}
  return {root,keys:['scw','scgd','scga','sccan','scdr','scgang','scvr','scnrv','screc','scmus','nsens','nint','nmot'],update,fire,set onStage(f){onStage=f;}};
}
export const REFLEX=[
 {t:'1. Рецептор',x:'Рецептор в коже воспринимает раздражение (укол, жар) и превращает его в нервный импульс.',w:'Рецептор — начало рефлекторной дуги, а не нейрон центральной нервной системы.'},
 {t:'2. Чувствительный нейрон',x:'Импульс идёт по чувствительному нейрону через задний корешок в спинной мозг. Тело этого нейрона лежит в спинномозговом узле.',w:'Тела чувствительных нейронов — в спинномозговых узлах, вне спинного мозга.'},
 {t:'3. Вставочный нейрон',x:'В сером веществе спинного мозга импульс передаётся вставочному нейрону — это центр рефлекса.',w:'Вставочные нейроны лежат в сером веществе, их нет в периферических нервах.'},
 {t:'4. Двигательный нейрон',x:'Двигательный нейрон (тело — в передних рогах) проводит импульс через передний корешок к мышце.',w:'Передние корешки двигательные, задние — чувствительные.'},
 {t:'5. Рабочий орган',x:'Мышца сокращается — рука отдёргивается. Весь путь — рефлекторная дуга из 5 звеньев.',w:'Коленный рефлекс — двухнейронная дуга, без вставочного нейрона.'}];

// ---------- ГЛАЗ (сагиттальный разрез, свет слева)
export function buildEye(G,O){
  const root=new THREE.Group();root.position.copy(O);
  const lathe=(prof,seg=64)=>{const g=new THREE.LatheGeometry(prof.map(([r,y])=>new THREE.Vector2(Math.max(r,0),y)),seg,Math.PI/2,Math.PI);g.rotateZ(Math.PI/2);return g;};
  const arc=(R,a0,a1,n=40,cy=0)=>{const o=[];for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;o.push([R*Math.sin(a),cy+R*Math.cos(a)]);}return o;};
  const shell=(R1,R2,a0,a1)=>lathe([...arc(R1,a0,a1),...arc(R2,a1,a0)]);
  const D=Math.PI/180;
  part(G,root,'esclera','Белочная оболочка','#f4f1ea',shell(1,.95,38*D,180*D),V(.35,.92,.02),'sens');
  part(G,root,'echor','Сосудистая оболочка','#7a2c2c',shell(.95,.925,48*D,180*D),V(.62,-.66,.02),'sens');
  part(G,root,'eret','Сетчатка','#f08aa2',shell(.925,.895,55*D,180*D),V(.42,-.75,.02),'sens');
  const cor=lathe([...arc(.8,0,49*D,30,.2),...arc(.76,49*D,0,30,.2)]);part(G,root,'ecorn','Роговица','#bfe6ff',cor,V(-1.0,.0,.02),'sens').op=.45;
  part(G,root,'eaq','Передняя камера (водянистая влага)','#9fd8ff',lathe([[0,.98],[.5,.86],[.6,.69],[.15,.67],[0,.64]]),V(-.82,.22,.01),'sens').op=.22;
  part(G,root,'eiris','Радужная оболочка','#6b4a2b',lathe([[.15,.66],[.66,.66],[.66,.62],[.15,.62]]),V(-.64,.45,.02),'sens');
  const lens=[];for(let i=0;i<=24;i++){const t=i/24*Math.PI;lens.push([.36*Math.sin(t),.45+.17*Math.cos(t)]);}
  part(G,root,'elens','Хрусталик','#fff3c4',lathe(lens),V(-.45,.2,.02),'sens').op=.75;
  part(G,root,'ecil','Ресничное тело','#9a3a3a',lathe([[.62,.6],[.82,.56],[.86,.44],[.7,.42],[.6,.5]]),V(-.5,.78,.02),'sens');
  part(G,root,'evit','Стекловидное тело','#cfeaff',lathe([...arc(.893,55*D,180*D),[0,.29],[.3,.33],[.72,.5]]),V(.15,.2,.01),'sens').op=.16;
  const zl=[];for(let i=0;i<7;i++){const a=(-.5+i/6)*.0;zl.push(-.47,.36,0,-.48,.74,0, -.45,-.36,0,-.46,-.74,0);}
  root.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(zl,3)),new THREE.LineBasicMaterial({color:'#e8d9c0'})));
  const nv=new THREE.CylinderGeometry(.12,.13,.75,20);nv.rotateZ(Math.PI/2);nv.rotateZ(-.18);nv.translate(1.28,-.32,0);
  part(G,root,'eopt','Зрительный нерв','#f3e0b0',nv,V(1.45,-.36,.12),'sens');
  const bs=new THREE.CylinderGeometry(.1,.1,.03,20);bs.rotateZ(Math.PI/2);bs.translate(.88,-.26,0);part(G,root,'eblind','Слепое пятно','#fffdf0',bs,V(.86,-.26,.03),'sens');
  const ys=new THREE.CylinderGeometry(.08,.08,.03,20);ys.rotateZ(Math.PI/2);ys.translate(.885,.04,0);part(G,root,'emac','Жёлтое пятно','#ffd84a',ys,V(.87,.06,.03),'sens');
  // ход лучей: предмет слева, перевёрнутое изображение на сетчатке
  const rays=new THREE.Group();const RM=new THREE.LineBasicMaterial({color:'#ffe066',transparent:true,opacity:.9});
  const arrow=(x,y0,y1,c)=>{const g=new THREE.Group();const s=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,Math.abs(y1-y0),8),new THREE.MeshBasicMaterial({color:c}));s.position.set(x,(y0+y1)/2,0);
    const h=new THREE.Mesh(new THREE.ConeGeometry(.07,.16,12),new THREE.MeshBasicMaterial({color:c}));h.position.set(x,y1,0);if(y1<y0)h.rotation.z=Math.PI;g.add(s,h);return g;};
  rays.add(arrow(-3.2,-.05,.75,'#ffe066'));
  const img=[.885,-.2],img0=[.9,.01];
  for(const [cy,cl] of [[.3,.1],[.12,0],[-.08,-.12]]){const pts=[V(-3.2,.75,0),V(-1.02,cy,0),V(-.45,cl,0),V(img[0],img[1],0)];rays.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),RM));}
  for(const [cy,cl] of [[.2,.08],[-.02,-.02]]){const pts=[V(-3.2,-.05,0),V(-1.02,cy,0),V(-.45,cl,0),V(img0[0],img0[1],0)];rays.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:'#9fe0ff',transparent:true,opacity:.8})));}
  const im=arrow(.86,.02,-.2,'#ffe066');im.scale.set(.6,1,.6);im.position.x=.35;rays.add(im);rays.visible=false;root.add(rays);
  return {root,keys:['esclera','echor','eret','ecorn','eaq','eiris','elens','ecil','evit','eopt','eblind','emac'],rays};
}

// общие помощники
const tubeP=(pts,r,seg=48)=>new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>V(...p))),seg,r,10);
const latheH=(prof,seg=56)=>{const g=new THREE.LatheGeometry(prof.map(([r,y])=>new THREE.Vector2(Math.max(r,0),y)),seg,Math.PI/2,Math.PI);return g;};
let _s=11;const rnd=()=>{_s=(_s*16807)%2147483647;return _s/2147483647;};

// ---------- КОЖА
export function buildSkin(G,O){const root=new THREE.Group();root.position.copy(O);const Z=.5;
  const slab=(y0,y1)=>{const g=new THREE.BoxGeometry(2.2,y1-y0,1);g.translate(0,(y0+y1)/2,0);return g;};
  const ep=slab(.6,.72);part(G,root,'skepi','Эпидермис','#f2c9a8',ep,V(-.85,.68,Z));
  part(G,root,'skderm','Дерма','#e8988a',slab(-.1,.6),V(-.9,.35,Z));
  const fat=[slab(-.75,-.1)];part(G,root,'skfat','Подкожная жировая клетчатка','#f5dc8e',fat,V(-.9,-.5,Z));
  const lob=[];for(let i=0;i<16;i++){const s=new THREE.SphereGeometry(.09+rnd()*.05,14,10);s.translate(-1+rnd()*2,-.65+rnd()*.5,Z-.02);lob.push(s);}root.add(new THREE.Mesh(merge(lob),mat('#fbe7a6')));
  const hair=[tubeP([[.3,1.25,Z],[.32,.72,Z],[.36,.2,Z],[.4,-.05,Z]],.028)];const bulb=new THREE.SphereGeometry(.07,16,12);bulb.translate(.4,-.08,Z);hair.push(bulb);
  part(G,root,'skhair','Волос и волосяная луковица','#5a3a22',hair,V(.33,.95,Z));
  const fol=tubeP([[.32,.6,Z-.03],[.36,.2,Z-.03],[.4,-.03,Z-.03]],.06);const fm=new THREE.Mesh(fol,mat('#d88a7a',{opacity:.6}));root.add(fm);
  const sb=new THREE.SphereGeometry(.09,16,12);sb.scale(1,1.3,.8);sb.translate(.5,.35,Z);const sb2=sb.clone();sb2.translate(-.36,0,0);part(G,root,'skseb','Сальная железа','#f7e9b0',[sb,sb2],V(.55,.4,Z+.05));
  const coil=[];for(let i=0;i<=60;i++){const t=i/60*Math.PI*6;coil.push([-.45+.08*Math.cos(t),-.22+i/60*.12,Z+.06*Math.sin(t)]);}
  part(G,root,'sksweat','Потовая железа','#9ad7ff',[tubeP(coil,.022,160),tubeP([[-.45,-.1,Z],[-.42,.2,Z],[-.48,.5,Z],[-.44,.72,Z]],.018)],V(-.45,-.2,Z+.08));
  part(G,root,'skmusc','Мышца, поднимающая волос','#c2453c',tubeP([[.36,.15,Z],[.55,.35,Z],[.75,.58,Z]],.018),V(.62,.46,Z+.03));
  part(G,root,'skvess','Кровеносные сосуды','#d23c34',[tubeP([[-1.1,.05,Z],[-.4,.1,Z],[.3,.0,Z],[1.1,.06,Z]],.03),tubeP([[-1.1,.45,Z],[-.5,.5,Z],[0,.42,Z],[1.1,.5,Z]],.02),tubeP([[-1.1,-.02,Z-.04],[0,.03,Z-.04],[1.1,-.02,Z-.04]],.032)],V(-.8,.48,Z+.03));
  const pc=new THREE.SphereGeometry(.07,16,12);pc.scale(1,1.6,1);pc.translate(.85,-.35,Z);const fe=tubeP([[-.1,.62,Z],[-.12,.4,Z],[-.2,.0,Z],[-.25,-.3,Z]],.012);const mk=new THREE.SphereGeometry(.045,12,10);mk.translate(-.1,.52,Z);
  part(G,root,'skrec','Рецепторы кожи','#ffd84a',[pc,fe,mk],V(.85,-.3,Z+.05));
  return {root,keys:['skepi','skderm','skfat','skhair','skseb','sksweat','skmusc','skvess','skrec']};}

// ---------- ЛЁГКИЕ: механика дыхания + альвеолы
export function buildLungs(G,O){const root=new THREE.Group();root.position.copy(O);
  const lung=(sx)=>{const g=new THREE.SphereGeometry(.55,40,30);const p=g.attributes.position;for(let i=0;i<p.count;i++){let x=p.getX(i),y=p.getY(i),z=p.getZ(i);y*=1.55;if(y>0)x*=1-.35*(y/.85);if(x*sx<-.05)x*=.55;z*=.75;p.setXYZ(i,x+sx*.42,y,z);}g.computeVertexNormals();return g;};
  const R=part(G,root,'lrl','Правое лёгкое','#f19aa8',lung(-1),V(-.75,.3,.3),'resp');const L=part(G,root,'lll','Левое лёгкое','#f19aa8',lung(1),V(.75,.3,.3),'resp');
  part(G,root,'ltr','Трахея','#e9d6c8',tubeP([[0,1.45,0],[0,1.0,0],[0,.62,0]],.07),V(.0,1.25,.08),'resp');
  part(G,root,'lbr','Бронхи','#e9c4c8',[tubeP([[0,.62,0],[-.2,.45,.05],[-.38,.25,.08],[-.5,0,.1]],.05),tubeP([[0,.62,0],[.22,.48,.05],[.4,.3,.08],[.5,.05,.1]],.045),tubeP([[-.38,.25,.08],[-.6,.45,.12]],.03),tubeP([[.4,.3,.08],[.62,.5,.12]],.03)],V(-.3,.4,.15),'resp');
  const pl=part(G,root,'lpl','Плевра','#cfe8ff',[lung(-1).scale(1.06,1.04,1.08),lung(1).scale(1.06,1.04,1.08)],V(1.25,.6,.1),'resp');pl.op=.18;
  const dg=new THREE.SphereGeometry(1.15,48,16,0,Math.PI*2,0,Math.PI*.32);dg.scale(1,.55,.75);dg.translate(0,-1.35,0);
  const D=part(G,root,'ldia','Диафрагма','#b04a42',dg,V(.6,-.85,.3),'resp');
  // альвеолы (увеличено) справа
  const A=V(2.6,.2,0),alv=[],caps=[];for(let i=0;i<9;i++){const a=i/9*Math.PI*2,r=i?.32:0;const s=new THREE.SphereGeometry(.2,24,16);s.translate(A.x+r*Math.cos(a),A.y+r*Math.sin(a)*1.1,(i%2)*.08);alv.push(s);}
  part(G,root,'lalv','Альвеолы','#f6b4c0',[...alv,tubeP([[A.x-1.,A.y+.9,0],[A.x-.5,A.y+.55,0],[A.x-.15,A.y+.3,0]],.06)],A.clone().add(V(-.2,.45,.2)),'resp').op=.55;
  for(let k=0;k<6;k++){const pts=[];for(let i=0;i<=40;i++){const t=i/40;const a=t*Math.PI*2+k;pts.push([A.x+.5*Math.cos(a)+.05*Math.sin(t*20),A.y+.55*Math.sin(a),.18*Math.cos(t*9+k)]);}caps.push(tubeP(pts,.012,120));}
  const C=part(G,root,'lcap','Капилляры альвеол','#c0485a',caps,A.clone().add(V(.45,-.45,.15)),'resp');
  const ring=new THREE.RingGeometry(.95,1.0,64);ring.translate(A.x,A.y,-.05);root.add(new THREE.Mesh(ring,new THREE.MeshBasicMaterial({color:'#4fd6ff',transparent:true,opacity:.5})));
  const conn=new THREE.BufferGeometry().setFromPoints([V(.95,.0,.2),V(A.x-.98,A.y,0)]);root.add(new THREE.Line(conn,new THREE.LineDashedMaterial({color:'#4fd6ff',dashSize:.06,gapSize:.05})).computeLineDistances());
  // частицы O2 / CO2
  const N=40,pm=new THREE.InstancedMesh(new THREE.SphereGeometry(.03,8,6),new THREE.MeshBasicMaterial({toneMapped:false}),N);root.add(pm);const P=[];for(let i=0;i<N;i++)P.push({t:rnd(),o:i%2==0});
  const m4=new THREE.Matrix4(),c=new THREE.Color();let ph=0,auto=true,onPhase=null,lastP=-1;
  function update(dt){if(auto)ph=(ph+dt/5)%1;const b=.5-.5*Math.cos(ph*Math.PI*2);const ins=ph<.5;
    R.mesh.scale.set(1+.09*b,1+.07*b,1+.09*b);L.mesh.scale.copy(R.mesh.scale);pl.mesh.scale.copy(R.mesh.scale);D.mesh.position.y=-.2*b;D.mesh.scale.set(1,1-.45*b,1);
    const cur=ins?0:1;if(cur!==lastP){lastP=cur;onPhase&&onPhase(cur);}
    P.forEach((p,i)=>{p.t=(p.t+dt*.35)%1;const a=i*2.4;const from=V(A.x+.25*Math.cos(a),A.y+.25*Math.sin(a),.1),to=V(A.x+.5*Math.cos(a+.3),A.y+.55*Math.sin(a+.3),.1);
      const pos=p.o?from.lerp(to,p.t):to.lerp(from,p.t);m4.makeTranslation(pos.x,pos.y,pos.z);pm.setMatrixAt(i,m4);pm.setColorAt(i,c.set(p.o?'#4fb3ff':'#b8b8c8'));});
    pm.instanceMatrix.needsUpdate=true;pm.instanceColor.needsUpdate=true;}
  return {root,keys:['lrl','lll','ltr','lbr','lpl','ldia','lalv','lcap'],update,set onPhase(f){onPhase=f;},toggle(){auto=!auto;return auto;}};}
export const BREATH=[
 {t:'Вдох',x:'Диафрагма и наружные межрёберные мышцы сокращаются. Объём грудной клетки растёт, давление в лёгких падает ниже атмосферного — воздух входит. Дыхательный объём ≈ 500 мл.',w:'При вдохе диафрагма сокращается и уплощается, а не поднимается.'},
 {t:'Выдох',x:'Спокойный выдох пассивный: мышцы расслабляются, диафрагма поднимается куполом, объём уменьшается — воздух выходит. ЖЕЛ = дыхательный объём + резервы вдоха и выдоха ≈ 3,5–4,5 л.',w:'Остаточный объём (≈1,2 л) не выдохнуть даже при максимальном выдохе — он не входит в ЖЕЛ.'}];

// ---------- КОСТЬ + соединения
export function buildBone(G,O){const root=new THREE.Group();root.position.copy(O);
  const out=[[0,1.32],[.18,1.3],[.3,1.2],[.32,1.0],[.24,.8],[.17,.65],[.15,.3],[.15,-.3],[.17,-.65],[.25,-.8],[.33,-1.0],[.3,-1.2],[.18,-1.3],[0,-1.32]];
  const inn=out.map(([r,y])=>[Math.max(0,r-(Math.abs(y)<.7?.06:.025)),y*.985]);
  const shell=latheH([...out,...inn.slice().reverse()]);part(G,root,'bcomp','Компактное вещество','#efe6cf',shell,V(.16,0,.02),'skel');
  const spg=(s)=>latheH([[0,1.29*s],[.17,1.27*s],[.28,1.18*s],[.3,1.0*s],[.22,.8*s],[.13,.66*s],[0,.66*s]].map(([r,y])=>[r,y]));
  const sp1=spg(1),sp2=spg(-1);part(G,root,'bspong','Губчатое вещество (красный костный мозг)','#d9806e',[sp1,sp2],V(.12,1.0,.02),'skel');
  const dots=[];for(let i=0;i<160;i++){const y=(rnd()<.5?1:-1)*(.72+rnd()*.52),r=rnd()*.24*(1-Math.abs(Math.abs(y)-1)*.4);const s=new THREE.SphereGeometry(.018,6,4);s.translate(-r*.9,y,.005);dots.push(s);}
  root.add(new THREE.Mesh(merge(dots),mat('#f3e2c8')));
  part(G,root,'bmar','Жёлтый костный мозг','#f2cf58',latheH([[0,.62],[.09,.6],[.09,-.6],[0,-.62]]),V(.0,.2,.02),'skel');
  part(G,root,'bcart','Суставной хрящ','#bfe0ea',[latheH([[0,1.36],[.2,1.33],[.3,1.22],[.3,1.19],[.18,1.3],[0,1.32]]),latheH([[0,-1.36],[.2,-1.33],[.3,-1.22],[.3,-1.19],[.18,-1.3],[0,-1.32]])],V(.24,1.3,.02),'skel');
  part(G,root,'bperi','Надкостница','#e8907f',latheH([[.165,.62],[.165,-.62],[.18,-.62],[.18,.62]]),V(-.18,-.3,.02),'skel');
  part(G,root,'bplate','Хрящевая пластинка роста','#9fd0ff',[latheH([[0,.67],[.2,.67],[.2,.64],[0,.64]]),latheH([[0,-.64],[.2,-.64],[.2,-.67],[0,-.67]])],V(-.12,.66,.02),'skel');
  // соединения костей
  const J=1.35;const s1=new THREE.BoxGeometry(.5,.32,.18);s1.translate(J-.27,.95,0);const s2=s1.clone().translate(.54,0,0);
  const zz=[];for(let i=0;i<=8;i++)zz.push(V(J+(i%2?.04:-.04),.8+i*.04,.1));root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(zz),new THREE.LineBasicMaterial({color:'#7a6a50'})));
  part(G,root,'jsut','Неподвижное соединение (шов)','#e6dcc4',[s1,s2],V(J+.2,1.1,.1),'skel');
  const v1=new THREE.CylinderGeometry(.24,.24,.2,24);v1.translate(J,.25,0);const v2=v1.clone().translate(0,-.4,0);const dk=new THREE.CylinderGeometry(.25,.25,.16,24);dk.translate(J,.05,0);
  part(G,root,'jsemi','Полуподвижное соединение','#e6dcc4',[v1,v2],V(J+.25,.3,.1),'skel');const dm=new THREE.Mesh(dk,mat('#9fd0ff'));root.add(dm);
  const hd=new THREE.SphereGeometry(.22,28,20);hd.translate(J,-.62,0);const sh=new THREE.CylinderGeometry(.09,.09,.45,16);sh.translate(J,-1.05,0);
  const so=new THREE.SphereGeometry(.27,28,20,0,Math.PI*2,0,Math.PI*.45);so.translate(J,-.62,0);
  part(G,root,'jsyn','Подвижное соединение (сустав)','#e6dcc4',[hd,sh,so],V(J+.28,-.65,.1),'skel');
  const cap=new THREE.SphereGeometry(.32,28,20);cap.scale(1,1.2,1);cap.translate(J,-.66,0);const cg=part(G,root,'jcap','Суставная сумка и жидкость','#9fd8ff',cap,V(J-.3,-.5,.15),'skel');cg.op=.22;
  return {root,keys:['bcomp','bspong','bmar','bcart','bperi','bplate','jsut','jsemi','jsyn','jcap']};}

// ---------- ЖЕЛУДОК (стенка) + ВОРСИНКА
export function buildGut(G,O){const root=new THREE.Group();root.position.copy(O);const Z=.35;
  const slab=(y0,y1,w=1.6)=>{const g=new THREE.BoxGeometry(w,y1-y0,.7);g.translate(-1.1,(y0+y1)/2,0);return g;};
  const folds=[];for(let i=0;i<5;i++){const f=new THREE.CapsuleGeometry(.1,.25,6,12);f.translate(-1.75+i*.32,.75,Z-.05);folds.push(f);}
  part(G,root,'gmuc','Слизистая оболочка','#e98a8f',[slab(.3,.62),...folds],V(-1.75,.85,Z),'dig');
  const gl=[];for(let i=0;i<9;i++){gl.push(tubeP([[-1.8+i*.17,.62,Z],[-1.8+i*.17+.02,.45,Z],[-1.8+i*.17-.01,.34,Z]],.025,16));}part(G,root,'gglan','Желудочные железы','#fff0b0',gl,V(-1.4,.5,Z+.03),'dig');
  part(G,root,'gsub','Подслизистая основа','#f3cfc0',slab(.05,.3),V(-.5,.18,Z),'dig');
  const ms=[slab(-.12,.05),slab(-.3,-.12),slab(-.48,-.3)];part(G,root,'gmus','Мышечная оболочка (3 слоя)','#b9544b',ms,V(-.45,-.25,Z),'dig');
  const lines=[];for(let i=0;i<18;i++){const x=-1.85+i*.085;lines.push(x,-.12,Z+.001,x,.05,Z+.001);}for(let j=0;j<4;j++){const y=-.14-j*.04;lines.push(-1.9,y,Z+.001,-.3,y,Z+.001);}for(let i=0;i<14;i++){const x=-1.9+i*.11;lines.push(x,-.48,Z+.001,x+.12,-.3,Z+.001);}
  root.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(lines,3)),new THREE.LineBasicMaterial({color:'#7d2a24',transparent:true,opacity:.7})));
  part(G,root,'gser','Серозная оболочка','#f0e2d8',slab(-.53,-.48),V(-1.6,-.56,Z),'dig');
  // ворсинка тонкой кишки
  const X=1.2;const vb=new THREE.CapsuleGeometry(.32,1.2,12,28);vb.translate(X,.25,0);const vg=part(G,root,'vvil','Ворсинка тонкой кишки','#f3b49a',vb,V(X-.3,.95,.25),'dig');vg.op=.5;
  const mv=[];for(let i=0;i<120;i++){const a=rnd()*Math.PI*2,y=-.2+rnd()*1.15;const r=.32+(y>.85?-(y-.85)*.5:0);mv.push(X+r*Math.cos(a),y,r*Math.sin(a),X+(r+.04)*Math.cos(a),y,(r+.04)*Math.sin(a));}
  const mvl=new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(mv,3)),new THREE.LineBasicMaterial({color:'#ffd5c0'}));root.add(mvl);
  part(G,root,'vepi','Эпителий с микроворсинками','#ffd5c0',new THREE.TorusGeometry(.33,.012,6,40).rotateX(Math.PI/2).translate(X,.55,0),V(X+.34,.55,.05),'dig');
  const cp=[];for(let k=0;k<5;k++){const pts=[];for(let i=0;i<=40;i++){const t=i/40,a=t*Math.PI*6+k*1.2;pts.push([X+.22*Math.cos(a),-.3+t*1.1+(t>.95?0:0),.22*Math.sin(a)]);}cp.push(tubeP(pts,.014,140));}
  cp.push(tubeP([[X-.1,-.6,0],[X-.1,-.3,.05]],.03),tubeP([[X+.12,-.6,0],[X+.12,-.3,.05]],.03));
  part(G,root,'vcap','Кровеносные капилляры','#d23c34',cp,V(X+.25,.1,.2),'dig');
  part(G,root,'vlym','Лимфатический капилляр','#c9f28a',tubeP([[X,-.6,0],[X,0,0],[X,.9,0]],.045),V(X+.03,.4,.05),'dig');
  // частицы: глюкоза/аминокислоты → кровь, жиры → лимфа
  const N=30,pm=new THREE.InstancedMesh(new THREE.SphereGeometry(.028,8,6),new THREE.MeshBasicMaterial({toneMapped:false}),N);root.add(pm);const P=[];for(let i=0;i<N;i++)P.push({t:rnd(),f:i%3===0,a:rnd()*Math.PI*2,y:.0+rnd()*.8});
  const m4=new THREE.Matrix4(),c=new THREE.Color();
  function update(dt){P.forEach((p,i)=>{p.t+=dt*.3;if(p.t>1){p.t=0;p.a=rnd()*Math.PI*2;p.y=rnd()*.8;}const r0=.5,r1=p.f?.02:.22;const r=r0+(r1-r0)*Math.min(1,p.t*1.4);const y=p.y-(p.t>.7?(p.t-.7)*1.5:0);
    m4.makeTranslation(X+r*Math.cos(p.a),y,r*Math.sin(p.a));pm.setMatrixAt(i,m4);pm.setColorAt(i,c.set(p.f?'#c9f28a':(i%2?'#ffd23f':'#4fe08a')));});pm.instanceMatrix.needsUpdate=true;pm.instanceColor.needsUpdate=true;}
  return {root,keys:['gmuc','gglan','gsub','gmus','gser','vvil','vepi','vcap','vlym'],update};}
