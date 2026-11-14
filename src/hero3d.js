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

export function initHero3D(canvas, { lite = false, reduced = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lite, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lite ? 1.25 : 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 6);

  const uniforms = {
    uTime: { value: 0 }, uScroll: { value: 0 }, uMouse: { value: new THREE.Vector2() },
    uColA: { value: new THREE.Color() }, uColB: { value: new THREE.Color() }, uColC: { value: new THREE.Color() },
    uLight: { value: 0 },
  };

  // ── Morphing blob ──
  const blobGeo = new THREE.IcosahedronGeometry(1.5, lite ? 48 : 128);
  const blobMat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: noise + /* glsl */ `
      uniform float uTime, uScroll; uniform vec2 uMouse;
      varying float vN; varying vec3 vNormal; varying vec3 vView;
      void main(){
        float t = uTime * .25;
        float amp = .28 + uScroll * .55 + length(uMouse) * .12;
        float n = snoise(normal * (1.1 + uScroll * 1.5) + vec3(t, t*.7, uMouse.x*.6));
        n += .45 * snoise(normal * 3. + t * 1.4);
        vN = n;
        vec3 pos = position + normal * n * amp;
        vec4 mv = modelViewMatrix * vec4(pos, 1.);
        vNormal = normalize(normalMatrix * normal); vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColA, uColB, uColC; uniform float uTime, uLight;
      varying float vN; varying vec3 vNormal; varying vec3 vView;
      void main(){
        float fres = pow(1. - max(dot(vNormal, vView), 0.), 2.2);
        vec3 col = mix(uColA, uColB, smoothstep(-.6, .8, vN));
        col = mix(col, uColC, fres);
        float bands = .5 + .5 * sin(vN * 14. + uTime);
        col += bands * .06;
        gl_FragColor = vec4(col, mix(.92, .85, uLight));
      }`,
    transparent: true,
  });
  const blob = new THREE.Mesh(blobGeo, blobMat);
  scene.add(blob);

  // ── Particle field ──
  const count = lite ? 900 : 2600;
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = 3 + Math.random() * 7, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph) - 2], i * 3);
    seed[i] = Math.random();
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pGeo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const pMat = new THREE.ShaderMaterial({
    uniforms: { ...uniforms, uSize: { value: 26 * renderer.getPixelRatio() } },
    vertexShader: /* glsl */ `
      uniform float uTime, uScroll, uSize; attribute float aSeed; varying float vSeed;
      void main(){
        vec3 p = position; float a = uTime * .05 * (aSeed + .3) + uScroll * 2.;
        p.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * p.xz;
        p.y += sin(uTime * .5 + aSeed * 20.) * .15 - uScroll * 1.5;
        vec4 mv = modelViewMatrix * vec4(p, 1.); vSeed = aSeed;
        gl_PointSize = uSize * (.3 + aSeed) / -mv.z; gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColA, uColC; varying float vSeed;
      void main(){ float d = length(gl_PointCoord - .5); if (d > .5) discard;
        gl_FragColor = vec4(mix(uColA, uColC, vSeed), smoothstep(.5, 0., d) * .8); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  // theme-aware palette
  const setTheme = (theme) => {
    const light = theme === 'light';
    uniforms.uLight.value = light ? 1 : 0;
    uniforms.uColA.value.set(light ? '#7c4dff' : '#6d3cf5');
    uniforms.uColB.value.set(light ? '#ff5fa2' : '#e8479a');
    uniforms.uColC.value.set(light ? '#14b8d4' : '#5ee7ff');
    pMat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
  };
  setTheme(document.documentElement.dataset.theme);

  const state = { scroll: 0, mouse: new THREE.Vector2(), target: new THREE.Vector2() };
  let wide = true, baseX = 1.6, baseY = 0;
  const resize = () => {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    wide = w > 900; baseX = wide ? 1.6 : 0; baseY = wide ? 0 : 1.2;
    blob.scale.setScalar(w > 900 ? 1 : 0.75);
  };
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', (e) => {
    state.target.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  }, { passive: true });

  const clock = new THREE.Clock();
  let visible = true, raf;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) loop(); });
  function loop() {
    if (!visible) return;
    const t = clock.getElapsedTime();
    state.mouse.lerp(state.target, 0.05);
    uniforms.uTime.value = reduced ? 0 : t;
    uniforms.uMouse.value.copy(state.mouse);
    uniforms.uScroll.value += (state.scroll - uniforms.uScroll.value) * 0.08;
    const s = uniforms.uScroll.value;
    blob.rotation.y = t * 0.1 + state.mouse.x * 0.4 + s * 2.5;
    blob.rotation.x = state.mouse.y * 0.3 + s * 1.2;
    // drift to the right edge and recede as the page scrolls past the hero
    const k = Math.min(s * 6, 1);
    blob.position.x = baseX + k * (wide ? 1.9 : 1.2);
    blob.position.y = baseY - k * (wide ? 0.4 : 1.4);
    blob.position.z = -k * 2.2 - s * 1.5;
    camera.position.x += (state.mouse.x * 0.3 - camera.position.x) * 0.05;
    camera.position.y += (state.mouse.y * 0.2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    if (!reduced) raf = requestAnimationFrame(loop);
  }
  loop();

  return {
    setScroll(v) { state.scroll = v; if (reduced) loop(); },
    setTheme(t) { setTheme(t); if (reduced) loop(); },
  };
}
