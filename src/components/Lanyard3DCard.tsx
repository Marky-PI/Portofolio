import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { PROFILE_DATA } from '../data/portfolioData';
import {
  createLanyardPhysicsState,
  resetLanyardDrop,
  setLanyardAnchorX,
  stepLanyardPhysics,
} from '../utils/lanyardPhysics';

function computeWorldAnchorX(width: number, height: number): number {
  if (width < 1024) return 0;
  const visibleHeight = 2 * 12.5 * Math.tan((28 * Math.PI) / 360);
  const visibleWidth = visibleHeight * (width / height);
  const horizontalPad = width >= 1280 ? 128 : 96;
  const contentWidth = Math.min(width - horizontalPad, 1600);
  const rightColCenterOffsetPx = contentWidth * 0.29;
  return (rightColCenterOffsetPx / width) * visibleWidth;
}

function createLanyardStrapTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Matte jet-black strap background
  ctx.fillStyle = '#09090B';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle woven nylon texture lines
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 2;
  for (let x = 0; x < canvas.width; x += 8) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Repeating "MAHESA" print along the strap matching reference video
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 44px "Montserrat", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    'MAHESA      ★      MAHESA      ★',
    canvas.width / 2,
    canvas.height / 2 + 2
  );

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 1);
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

function drawCardFrontCanvas(
  canvas: HTMLCanvasElement,
  portraitImg?: HTMLImageElement
) {
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;

  // 1. Sleek Monochrome Studio Backdrop (like the reference video badge)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, '#27272A');
  bgGrad.addColorStop(0.55, '#18181B');
  bgGrad.addColorStop(1, '#09090B');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Subtle radial studio spotlight behind the subject
  const radial = ctx.createRadialGradient(
    w / 2,
    h * 0.44,
    50,
    w / 2,
    h * 0.44,
    w * 0.65
  );
  radial.addColorStop(0, 'rgba(255,255,255,0.22)');
  radial.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, w, h);

  // Top punch-slot cutout visual
  ctx.fillStyle = '#09090B';
  ctx.beginPath();
  ctx.roundRect(w / 2 - 85, 34, 170, 26, 13);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Top-left & Top-right Corner Typography (matching reference video badge layout)
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.font = '800 32px "Montserrat", sans-serif';
  ctx.fillText('MAHESA', 60, 130);
  ctx.fillStyle = '#A1A1AA';
  ctx.font = '600 18px "JetBrains Mono", monospace';
  ctx.fillText('ID · 2026', 60, 162);

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'right';
  ctx.font = '700 24px "Montserrat", sans-serif';
  ctx.fillText('POLTEKKES', w - 60, 128);
  ctx.fillStyle = '#A1A1AA';
  ctx.font = '500 18px "JetBrains Mono", monospace';
  ctx.fillText('SEMARANG', w - 60, 158);

  // Background subtle "PORTOFOLIO" outline across middle of card
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 3;
  ctx.font = '800 138px "Montserrat", sans-serif';
  ctx.textAlign = 'center';
  ctx.strokeText('PORTOFOLIO', w / 2, h * 0.46);

  // 2. Full-Bleed Portrait of Mahesa
  if (portraitImg && portraitImg.complete && portraitImg.naturalWidth > 0) {
    const imgAspect = portraitImg.naturalWidth / portraitImg.naturalHeight;
    const drawH = h * 0.78;
    const drawW = drawH * imgAspect;
    const drawX = w / 2 - drawW / 2;
    const drawY = h * 0.16;
    ctx.drawImage(portraitImg, drawX, drawY, drawW, drawH);
  }

  // 3. Bottom Dark Vignette Scrim for Signature & Role Overlay
  const bottomScrim = ctx.createLinearGradient(0, h * 0.56, 0, h);
  bottomScrim.addColorStop(0, 'rgba(9,9,11,0)');
  bottomScrim.addColorStop(0.45, 'rgba(9,9,11,0.78)');
  bottomScrim.addColorStop(1, 'rgba(9,9,11,0.98)');
  ctx.fillStyle = bottomScrim;
  ctx.fillRect(0, h * 0.56, w, h * 0.44);

  // Stylized Signature / Display Script Overlay ("Mahesa")
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0,0,0,0.65)';
  ctx.shadowBlur = 16;
  ctx.font = 'italic 700 118px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Mahesa', w / 2, h - 225);
  ctx.restore();

  // Horizontal Accent Line under signature
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 150, h - 168);
  ctx.lineTo(w / 2 + 150, h - 168);
  ctx.stroke();

  // Label requested by user: "Perekam Medis dan Informasi Kesehatan" with nothing below it
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = '700 27px "Montserrat", sans-serif';
  ctx.fillText('Perekam Medis dan Informasi Kesehatan', w / 2, h - 112);

  // Outer subtle border on card face
  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, w - 6, h - 6);
}

function createCardBackTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1400;
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#09090B';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(w / 2 - 130, 440, 260, 260, 38);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'italic 700 120px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('M', w / 2, 570);

  ctx.font = '700 30px "Montserrat", sans-serif';
  ctx.fillText('Perekam Medis dan Informasi Kesehatan', w / 2, 795);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

export const Lanyard3DCard: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const physicsRef = useRef(createLanyardPhysicsState(2.2));
  const isVisibleRef = useRef<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Trigger top-down drop animation & toggle WebGL active state based on viewport visibility
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            resetLanyardDrop(physicsRef.current);
          }
        }
      },
      { threshold: 0.05, rootMargin: '180px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || window.innerWidth || 1280;
    const height = container.clientHeight || 760;

    setLanyardAnchorX(physicsRef.current, computeWorldAnchorX(width, height));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 100);
    camera.position.set(0, 0, 12.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.96;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.setSize(width, height);
    renderer.domElement.style.pointerEvents = 'none';

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Environment Map (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 0.55;
    pmremGenerator.dispose();

    // 3-Point Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x3f3f46, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
    keyLight.position.set(4, 6, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe4e4e7, 1.1);
    rimLight.position.set(-5, 3, -6);
    scene.add(rimLight);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    // Procedural Textures
    const frontCanvas = document.createElement('canvas');
    frontCanvas.width = 1024;
    frontCanvas.height = 1400;
    drawCardFrontCanvas(frontCanvas);

    const frontTexture = new THREE.CanvasTexture(frontCanvas);
    frontTexture.colorSpace = THREE.SRGBColorSpace;
    frontTexture.anisotropy = maxAnisotropy;

    const portraitImage = new Image();
    portraitImage.crossOrigin = 'anonymous';
    portraitImage.onload = () => {
      drawCardFrontCanvas(frontCanvas, portraitImage);
      frontTexture.needsUpdate = true;
    };
    portraitImage.src = PROFILE_DATA.portraitSrc;

    const backTexture = createCardBackTexture(maxAnisotropy);
    const strapTexture = createLanyardStrapTexture(maxAnisotropy);

    // Composite 3D Card & Metallic Clip Group
    const cardGroup = new THREE.Group();
    scene.add(cardGroup);

    const cardW = 1.92;
    const cardH = 2.66;
    const cardDepth = 0.05;

    const frameGeo = new THREE.BoxGeometry(
      cardW + 0.06,
      cardH + 0.06,
      cardDepth
    );
    const frameMat = new THREE.MeshPhysicalMaterial({
      color: 0x111113,
      roughness: 0.25,
      metalness: 0.4,
      clearcoat: 0.85,
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    cardGroup.add(frameMesh);

    const faceGeo = new THREE.PlaneGeometry(cardW, cardH);
    const frontMat = new THREE.MeshPhysicalMaterial({
      map: frontTexture,
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.12,
    });
    const frontMesh = new THREE.Mesh(faceGeo, frontMat);
    frontMesh.position.z = cardDepth / 2 + 0.002;
    cardGroup.add(frontMesh);

    const backMat = new THREE.MeshPhysicalMaterial({
      map: backTexture,
      color: 0xffffff,
      roughness: 0.28,
      metalness: 0.2,
      clearcoat: 0.9,
      clearcoatRoughness: 0.15,
    });
    const backMesh = new THREE.Mesh(faceGeo, backMat);
    backMesh.rotation.y = Math.PI;
    backMesh.position.z = -(cardDepth / 2 + 0.002);
    cardGroup.add(backMesh);

    // Metallic Clip & Clamp Hardware
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.92,
      roughness: 0.2,
    });
    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.85,
      roughness: 0.28,
    });

    const tabGeo = new THREE.BoxGeometry(0.56, 0.16, 0.06);
    const tabMesh = new THREE.Mesh(tabGeo, frameMat);
    tabMesh.position.set(0, cardH / 2 + 0.08, 0);
    cardGroup.add(tabMesh);

    const clipJawGeo = new THREE.BoxGeometry(0.28, 0.24, 0.09);
    const clipJawMesh = new THREE.Mesh(clipJawGeo, metalMat);
    clipJawMesh.position.set(0, cardH / 2 + 0.16, 0);
    cardGroup.add(clipJawMesh);

    const ringGeo = new THREE.TorusGeometry(0.12, 0.028, 12, 24);
    const ringMesh = new THREE.Mesh(ringGeo, metalMat);
    ringMesh.position.set(0, cardH / 2 + 0.31, 0);
    cardGroup.add(ringMesh);

    const clampGeo = new THREE.BoxGeometry(0.4, 0.16, 0.08);
    const clampMesh = new THREE.Mesh(clampGeo, darkMetalMat);
    clampMesh.position.set(0, cardH / 2 + 0.44, 0);
    cardGroup.add(clampMesh);

    // Dynamic 3D Lanyard Ribbon Geometry
    const ribbonSegments = 36;
    const ribbonWidth = 0.36;
    const ribbonGeo = new THREE.BufferGeometry();
    const vertexCount = (ribbonSegments + 1) * 2;
    const positions = new Float32Array(vertexCount * 3);
    const uvs = new Float32Array(vertexCount * 2);
    const indices: number[] = [];

    for (let i = 0; i <= ribbonSegments; i++) {
      const v = i / ribbonSegments;
      uvs[i * 4 + 0] = v;
      uvs[i * 4 + 1] = 0;
      uvs[i * 4 + 2] = v;
      uvs[i * 4 + 3] = 1;
      if (i < ribbonSegments) {
        const a = i * 2;
        const b = i * 2 + 1;
        const c = (i + 1) * 2;
        const d = (i + 1) * 2 + 1;
        indices.push(a, b, c, b, d, c);
      }
    }
    ribbonGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    ribbonGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    ribbonGeo.setIndex(indices);

    const ribbonMat = new THREE.MeshStandardMaterial({
      map: strapTexture,
      color: 0xffffff,
      roughness: 0.65,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbonMesh.frustumCulled = false;
    scene.add(ribbonMesh);

    const curvePoints = [
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ];
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    curve.curveType = 'chordal';

    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    const unprojectedVec = new THREE.Vector3();
    const rayDir = new THREE.Vector3();
    const dragOffset = new THREE.Vector3();
    const interactables = [frameMesh, frontMesh, backMesh];

    const updateRibbonGeometry = () => {
      const st = physicsRef.current;
      const clampTopOffset = new THREE.Vector3(0, cardH / 2 + 0.48, 0);
      clampTopOffset.applyEuler(cardGroup.rotation);
      clampTopOffset.add(cardGroup.position);

      curvePoints[0].copy(clampTopOffset);
      curvePoints[1].set(
        st.nodes[2].lerped.x,
        st.nodes[2].lerped.y,
        st.nodes[2].lerped.z
      );
      curvePoints[2].set(
        st.nodes[1].lerped.x,
        st.nodes[1].lerped.y,
        st.nodes[1].lerped.z
      );
      curvePoints[3].set(
        st.nodes[0].pos.x,
        st.nodes[0].pos.y,
        st.nodes[0].pos.z
      );

      const sampled = curve.getPoints(ribbonSegments);
      const posAttr = ribbonGeo.getAttribute(
        'position'
      ) as THREE.BufferAttribute;

      for (let i = 0; i <= ribbonSegments; i++) {
        const pt = sampled[i];
        const t = 1 - i / ribbonSegments;
        const twistAngle = cardGroup.rotation.y * t * 0.5;
        const halfW = ribbonWidth * 0.5;
        const dx = Math.cos(twistAngle) * halfW;
        const dz = Math.sin(twistAngle) * halfW;

        posAttr.setXYZ(i * 2, pt.x - dx, pt.y, pt.z - dz);
        posAttr.setXYZ(i * 2 + 1, pt.x + dx, pt.y, pt.z + dz);
      }
      posAttr.needsUpdate = true;
      ribbonGeo.computeVertexNormals();
    };

    const getNdcFromEvent = (clientX: number, clientY: number): boolean => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );
    };

    const projectPointerToCardPlane = (out: THREE.Vector3) => {
      unprojectedVec.set(pointerNdc.x, pointerNdc.y, 0.5).unproject(camera);
      rayDir.copy(unprojectedVec).sub(camera.position).normalize();
      const dist = camera.position.z / Math.max(0.001, -rayDir.z);
      out.copy(camera.position).add(rayDir.multiplyScalar(dist));
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!getNdcFromEvent(e.clientX, e.clientY)) return;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(interactables, false);
      if (hits.length > 0) {
        e.preventDefault();
        const st = physicsRef.current;
        st.isDragged = true;
        setIsDragging(true);
        renderer.domElement.style.pointerEvents = 'auto';
        renderer.domElement.style.cursor = 'grabbing';
        const worldPt = new THREE.Vector3();
        projectPointerToCardPlane(worldPt);
        dragOffset.set(
          worldPt.x - st.nodes[4].pos.x,
          worldPt.y - st.nodes[4].pos.y,
          worldPt.z - st.nodes[4].pos.z
        );
        st.dragTarget = { ...st.nodes[4].pos };
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const inBounds = getNdcFromEvent(e.clientX, e.clientY);
      const st = physicsRef.current;
      if (st.isDragged) {
        const worldPt = new THREE.Vector3();
        projectPointerToCardPlane(worldPt);
        st.dragTarget = {
          x: Math.max(-5.5, Math.min(5.5, worldPt.x - dragOffset.x)),
          y: Math.max(-2.6, Math.min(2.6, worldPt.y - dragOffset.y)),
          z: Math.max(-1.0, Math.min(1.0, worldPt.z - dragOffset.z)),
        };
        return;
      }

      if (!inBounds) {
        setIsHovered(false);
        renderer.domElement.style.pointerEvents = 'none';
        renderer.domElement.style.cursor = 'default';
        return;
      }

      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(interactables, false);
      const hovered = hits.length > 0;
      setIsHovered(hovered);
      renderer.domElement.style.pointerEvents = hovered ? 'auto' : 'none';
      renderer.domElement.style.cursor = hovered ? 'grab' : 'default';
    };

    const onPointerUp = () => {
      const st = physicsRef.current;
      if (st.isDragged) {
        st.isDragged = false;
        setIsDragging(false);
        renderer.domElement.style.pointerEvents = 'none';
        renderer.domElement.style.cursor = 'default';
      }
    };

    window.addEventListener('pointerdown', onPointerDown, { passive: false });
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const onResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth || 1280;
      const newH = container.clientHeight || 760;
      setLanyardAnchorX(physicsRef.current, computeWorldAnchorX(newW, newH));
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', onResize);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let frameId = 0;
    let disposed = false;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync
        ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0)
        : null;
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    let hasRenderedFirstFrame = false;

    function tick() {
      if (disposed) return;
      const now = performance.now();
      const elapsed = Math.min((now - lastTime) / 1000, 0.14);
      lastTime = now;

      if (hasRenderedFirstFrame && (!isVisibleRef.current || document.hidden)) {
        frameId = requestAnimationFrame(tick);
        return;
      }
      hasRenderedFirstFrame = true;

      const st = physicsRef.current;
      const subSteps = Math.max(1, Math.ceil(elapsed / 0.018));
      const subDt = elapsed / subSteps;
      for (let s = 0; s < subSteps; s++) {
        stepLanyardPhysics(st, subDt);
      }

      cardGroup.position.set(
        st.nodes[4].pos.x,
        st.nodes[4].pos.y - (cardH / 2 + 0.18),
        st.nodes[4].pos.z
      );
      cardGroup.rotation.set(st.rot.x, st.rot.y, st.rot.z);

      updateRibbonGeometry();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);

      frontTexture.dispose();
      backTexture.dispose();
      strapTexture.dispose();
      envTexture.dispose();
      frameGeo.dispose();
      faceGeo.dispose();
      tabGeo.dispose();
      clipJawGeo.dispose();
      ringGeo.dispose();
      clampGeo.dispose();
      ribbonGeo.dispose();
      frameMat.dispose();
      frontMat.dispose();
      backMat.dispose();
      metalMat.dispose();
      darkMetalMat.dispose();
      ribbonMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-[580px] sm:h-[640px] lg:h-[760px] pointer-events-none overflow-visible flex items-start justify-center"
    >
      <div
        ref={canvasMountRef}
        data-testid="lanyard-3d-canvas"
        className={`w-full h-full select-none pointer-events-none ${
          isDragging
            ? 'cursor-grabbing'
            : isHovered
              ? 'cursor-grab'
              : 'cursor-default'
        }`}
      />
    </div>
  );
};
