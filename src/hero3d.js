import * as THREE from 'three';

const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}
`;


/**
 * Elegant point-cloud sphere: Fibonacci-distributed dots, gently displaced by simplex noise,
 * neutral tone with an accent rim. Reacts subtly to pointer and scroll.
 */
export function initHero3D(canvas, { lite = false, reduced = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lite ? 1 : 1.25));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  const N = lite ? 1800 : 4200;
  const pos = new Float32Array(N * 3), rnd = new Float32Array(N);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i;
    pos.set([Math.cos(th) * r, y, Math.sin(th) * r], i * 3);
    rnd[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 1));

  const uniforms = {
    uTime: { value: 0 }, uScroll: { value: 0 }, uMouse: { value: new THREE.Vector2() },
    uBase: { value: new THREE.Color() }, uAccent: { value: new THREE.Color() },
    uSize: { value: 3.6 * renderer.getPixelRatio() }, uAlpha: { value: 1 },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false,
    vertexShader: noise + /* glsl */ `
      uniform float uTime, uScroll, uSize; uniform vec2 uMouse; attribute float aRnd;
      varying float vRim; varying float vN; varying float vDepth;
      void main(){
        vec3 p = position;
        float t = uTime * .12;
        float n = snoise(p * 1.6 + vec3(t, t * .8, uMouse.x * .3));
        vN = n;
        float r = 1.75 + n * (.12 + uScroll * .35) ;
        p *= r;
        p += normalize(position) * uScroll * aRnd * 1.6; // gentle dispersal on scroll
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        vec3 nrm = normalize(normalMatrix * position);
        vRim = 1. - abs(dot(nrm, vec3(0., 0., 1.)));
        vDepth = smoothstep(-9.5, -5., mv.z);
        gl_PointSize = uSize * (0.7 + aRnd * .6) * (7. / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uBase, uAccent; uniform float uAlpha;
      varying float vRim; varying float vN; varying float vDepth;
      void main(){
        float d = length(gl_PointCoord - .5); if (d > .5) discard;
        vec3 col = mix(uBase, uAccent, clamp(smoothstep(-.4, .8, vN) * .8 + smoothstep(.6, 1., vRim) * .3, 0., 1.));
        float a = smoothstep(.5, .1, d) * mix(.25, .95, vDepth) * uAlpha;
        gl_FragColor = vec4(col, a);
      }`,
  });
  const sphere = new THREE.Points(geo, mat);
  const group = new THREE.Group();
  group.add(sphere);

  // thin orbit rings
  const ringMat = new THREE.LineBasicMaterial({ transparent: true, opacity: .12 });
  [2.5, 3.1].forEach((rad, i) => {
    const pts = []; for (let k = 0; k <= 128; k++) { const a = (k / 128) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * rad, 0, Math.sin(a) * rad)); }
    const ring = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), ringMat);
    ring.rotation.x = Math.PI / 2.25 + i * .25; ring.rotation.z = i * .5;
    group.add(ring);
  });
  scene.add(group);

  const setTheme = () => {
    const cs = getComputedStyle(document.documentElement);
    const v = (n, d) => (cs.getPropertyValue(n).trim() || d);
    uniforms.uBase.value.set(v('--sphere-a', '#8E82FE'));
    uniforms.uAccent.value.set(v('--sphere-b', '#FF9F6E'));
    mat.blending = THREE.NormalBlending;
    ringMat.color.set(v('--sphere-ring', '#2E2A54'));
  };
  setTheme(document.documentElement.dataset.theme);

  let wide = true, baseX = 2.2, baseY = 0;
  const resize = () => {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    wide = w > 960; baseX = wide ? 2.5 : 0.9; baseY = wide ? 0 : 1.6;
    group.scale.setScalar(wide ? .86 : .72);
    uniforms.uAlpha.value = wide ? 1 : .55;
  };
  resize(); addEventListener('resize', resize);

  const target = new THREE.Vector2(), mouse = new THREE.Vector2();
  addEventListener('pointermove', (e) => target.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1), { passive: true });

  let scroll = 0, visible = true, inView = true;
  const clock = new THREE.Clock();
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) kick(); });
  function frame() {
    const t = clock.getElapsedTime();
    mouse.lerp(target, .04);
    uniforms.uTime.value = reduced ? 0 : t;
    uniforms.uMouse.value.copy(mouse);
    uniforms.uScroll.value += (scroll - uniforms.uScroll.value) * .07;
    const s = uniforms.uScroll.value;
    group.rotation.y = t * .05 + mouse.x * .25 + s * 1.2;
    group.rotation.x = .25 + mouse.y * .15 + s * .4;
    group.position.set(baseX, baseY + s * 1.2, -s * 2);
    renderer.render(scene, camera);
  }
  // frame-rate cap: 30fps on low-end/mobile, 60 elsewhere; skip frames instead of rendering every rAF
  const minDt = lite ? 1000 / 30 : 1000 / 60 - 1;
  let last = 0, running = false;
  function loop(now = performance.now()) {
    if (!visible || !inView || reduced) { running = false; return; }
    running = true;
    if (now - last >= minDt) { last = now; frame(); }
    requestAnimationFrame(loop);
  }
  const kick = () => { if (!running) requestAnimationFrame(loop); };
  frame(); kick();

  return {
    setScroll(v) { scroll = v; if (reduced) frame(); },
    setTheme(t) { setTheme(t); frame(); },
    setActive(v) { inView = v; if (v) kick(); },
  };
}
