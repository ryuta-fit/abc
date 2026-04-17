import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { PARTS, SYSTEM_LABELS } from './parts.js';

// --- DOM ---
const viewport  = document.getElementById('viewport');
const infoTitle = document.getElementById('info-title');
const infoEn    = document.getElementById('info-en');
const infoBadge = document.getElementById('info-badge');
const infoDesc  = document.getElementById('info-desc');
const infoHint  = document.getElementById('info-hint');
const loadingEl = document.getElementById('loading');

// --- Scene / Camera / Renderer ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0e1116);

const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
camera.position.set(0, 1.2, 3.6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
viewport.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
labelRenderer.domElement.style.left = '0';
labelRenderer.domElement.style.pointerEvents = 'none';
viewport.appendChild(labelRenderer.domElement);

// --- Lights ---
scene.add(new THREE.HemisphereLight(0xdbeaff, 0x1a1a22, 0.9));
const key = new THREE.DirectionalLight(0xffffff, 1.1);
key.position.set(2.5, 4, 3); scene.add(key);
const fill = new THREE.DirectionalLight(0xaad4ff, 0.45);
fill.position.set(-3, 2, -2); scene.add(fill);

// --- Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.0, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 1.2;
controls.maxDistance = 6.5;
controls.update();

const INITIAL_CAM = camera.position.clone();
const INITIAL_TARGET = controls.target.clone();

// --- Groups ---
const skinGroup     = new THREE.Group(); skinGroup.name = 'skin';
const skeletonGroup = new THREE.Group(); skeletonGroup.name = 'skeleton';
const organGroup    = new THREE.Group(); organGroup.name = 'organ';
const muscleGroup   = new THREE.Group(); muscleGroup.name = 'muscle';
scene.add(skinGroup, skeletonGroup, organGroup, muscleGroup);

// --- Helpers ---
function makeMesh(geom, color, partId, { emissive = 0x000000, opacity = 1, metalness = 0.1, roughness = 0.55 } = {}) {
  const mat = new THREE.MeshStandardMaterial({
    color, emissive, metalness, roughness,
    transparent: opacity < 1, opacity,
  });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.userData.partId = partId;
  mesh.userData.baseEmissive = new THREE.Color(emissive);
  return mesh;
}

function addLabel(mesh, text) {
  const div = document.createElement('div');
  div.className = 'part-label';
  div.textContent = text;
  const label = new CSS2DObject(div);
  label.position.set(0, 0, 0);
  mesh.add(label);
  mesh.userData.label = label;
  label.visible = false;
  return label;
}

function registerPart(mesh, parent) {
  parent.add(mesh);
  const id = mesh.userData.partId;
  if (id && PARTS[id]) addLabel(mesh, PARTS[id].ja);
  return mesh;
}

// --- Build skeleton ---
function buildSkeleton() {
  const BONE = 0xf2ead6;

  // 頭蓋骨
  registerPart(makeMesh(new THREE.SphereGeometry(0.11, 32, 24), BONE, 'cranium'), skeletonGroup)
    .position.set(0, 1.63, 0);

  // 脊椎: 12 個の椎体を積層
  const spine = new THREE.Group();
  spine.userData.partId = 'spine';
  for (let i = 0; i < 14; i++) {
    const v = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.04, 16),
      new THREE.MeshStandardMaterial({ color: BONE, roughness: 0.6 }),
    );
    v.position.y = 0.95 + i * 0.05;
    v.userData.partId = 'spine';
    v.userData.baseEmissive = new THREE.Color(0x000000);
    spine.add(v);
  }
  skeletonGroup.add(spine);
  // ラベルを脊椎中央に
  const spineAnchor = new THREE.Object3D();
  spineAnchor.position.set(0.08, 1.25, 0);
  spineAnchor.userData.partId = 'spine';
  skeletonGroup.add(spineAnchor);
  addLabel(spineAnchor, PARTS.spine.ja);

  // 鎖骨
  const clavGeom = new THREE.CylinderGeometry(0.012, 0.012, 0.22, 12);
  const cL = registerPart(makeMesh(clavGeom, BONE, 'clavicle_l'), skeletonGroup);
  cL.position.set(-0.11, 1.48, 0.05); cL.rotation.z = Math.PI / 2.4;
  const cR = registerPart(makeMesh(clavGeom, BONE, 'clavicle_r'), skeletonGroup);
  cR.position.set(0.11, 1.48, 0.05); cR.rotation.z = -Math.PI / 2.4;

  // 胸郭 (10 対の肋骨 + 胸骨)
  const ribcage = new THREE.Group();
  ribcage.userData.partId = 'ribcage';
  const ribMat = new THREE.MeshStandardMaterial({ color: BONE, roughness: 0.6 });
  for (let i = 0; i < 10; i++) {
    const y = 1.42 - i * 0.04;
    const radius = 0.14 - Math.abs(i - 4) * 0.008;
    for (const side of [-1, 1]) {
      const rib = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.008, 8, 24, Math.PI),
        ribMat,
      );
      rib.position.set(0, y, 0);
      rib.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
      rib.rotation.x = Math.PI;
      rib.userData.partId = 'ribcage';
      rib.userData.baseEmissive = new THREE.Color(0x000000);
      ribcage.add(rib);
    }
  }
  // 胸骨
  const sternum = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 0.22, 0.02),
    ribMat,
  );
  sternum.position.set(0, 1.30, 0.135);
  sternum.userData.partId = 'ribcage';
  sternum.userData.baseEmissive = new THREE.Color(0x000000);
  ribcage.add(sternum);
  skeletonGroup.add(ribcage);
  const ribAnchor = new THREE.Object3D();
  ribAnchor.position.set(0, 1.38, 0.16);
  ribAnchor.userData.partId = 'ribcage';
  skeletonGroup.add(ribAnchor);
  addLabel(ribAnchor, PARTS.ribcage.ja);

  // 骨盤
  const pelvis = registerPart(
    makeMesh(new THREE.TorusGeometry(0.14, 0.035, 10, 24), BONE, 'pelvis'),
    skeletonGroup,
  );
  pelvis.position.set(0, 0.95, 0);
  pelvis.rotation.x = Math.PI / 2;
  pelvis.scale.set(1.0, 0.7, 1.0);

  // 上腕骨
  const armGeom = new THREE.CapsuleGeometry(0.028, 0.28, 6, 12);
  const hL = registerPart(makeMesh(armGeom, BONE, 'humerus_l'), skeletonGroup);
  hL.position.set(-0.25, 1.28, 0); hL.rotation.z = 0.05;
  const hR = registerPart(makeMesh(armGeom, BONE, 'humerus_r'), skeletonGroup);
  hR.position.set(0.25, 1.28, 0); hR.rotation.z = -0.05;

  // 前腕骨
  const faGeom = new THREE.CapsuleGeometry(0.024, 0.26, 6, 12);
  const faL = registerPart(makeMesh(faGeom, BONE, 'forearm_l'), skeletonGroup);
  faL.position.set(-0.28, 0.98, 0);
  const faR = registerPart(makeMesh(faGeom, BONE, 'forearm_r'), skeletonGroup);
  faR.position.set(0.28, 0.98, 0);

  // 大腿骨
  const femGeom = new THREE.CapsuleGeometry(0.035, 0.40, 6, 12);
  const fL = registerPart(makeMesh(femGeom, BONE, 'femur_l'), skeletonGroup);
  fL.position.set(-0.09, 0.70, 0);
  const fR = registerPart(makeMesh(femGeom, BONE, 'femur_r'), skeletonGroup);
  fR.position.set(0.09, 0.70, 0);

  // 脛骨
  const tibGeom = new THREE.CapsuleGeometry(0.028, 0.38, 6, 12);
  const tL = registerPart(makeMesh(tibGeom, BONE, 'tibia_l'), skeletonGroup);
  tL.position.set(-0.09, 0.28, 0);
  const tR = registerPart(makeMesh(tibGeom, BONE, 'tibia_r'), skeletonGroup);
  tR.position.set(0.09, 0.28, 0);
}

// --- Build organs ---
function buildOrgans() {
  // 脳
  const brain = registerPart(
    makeMesh(new THREE.SphereGeometry(0.085, 24, 20), 0xd4a8a8, 'brain', { emissive: 0x331111 }),
    organGroup,
  );
  brain.position.set(0, 1.65, 0);
  brain.scale.set(1.0, 0.9, 1.05);

  // 心臓
  const heart = registerPart(
    makeMesh(new THREE.SphereGeometry(0.055, 20, 16), 0xcc2a2a, 'heart', { emissive: 0x220000 }),
    organGroup,
  );
  heart.position.set(-0.03, 1.30, 0.04);
  heart.scale.set(1.0, 1.2, 0.9);

  // 肺
  const lungGeom = new THREE.SphereGeometry(0.09, 20, 16);
  const lungL = registerPart(makeMesh(lungGeom, 0xe6a0a4, 'lung_l', { emissive: 0x1a0405 }), organGroup);
  lungL.position.set(-0.09, 1.33, 0.01); lungL.scale.set(0.85, 1.4, 0.9);
  const lungR = registerPart(makeMesh(lungGeom, 0xe6a0a4, 'lung_r', { emissive: 0x1a0405 }), organGroup);
  lungR.position.set(0.09, 1.33, 0.01); lungR.scale.set(0.85, 1.4, 0.9);

  // 肝臓
  const liver = registerPart(
    makeMesh(new THREE.BoxGeometry(0.22, 0.08, 0.13), 0x8a3a2a, 'liver', { emissive: 0x160604 }),
    organGroup,
  );
  liver.position.set(0.05, 1.12, 0.03);
  liver.rotation.y = 0.25;

  // 胃
  const stomach = registerPart(
    makeMesh(new THREE.SphereGeometry(0.065, 20, 16), 0xcfae86, 'stomach', { emissive: 0x1a120a }),
    organGroup,
  );
  stomach.position.set(-0.07, 1.08, 0.02);
  stomach.scale.set(1.2, 1.0, 0.8);

  // 腎臓
  const kidneyGeom = new THREE.SphereGeometry(0.035, 16, 12);
  const kL = registerPart(makeMesh(kidneyGeom, 0x7a2a2a, 'kidney_l', { emissive: 0x150505 }), organGroup);
  kL.position.set(-0.07, 1.00, -0.05); kL.scale.set(0.9, 1.4, 0.8);
  const kR = registerPart(makeMesh(kidneyGeom, 0x7a2a2a, 'kidney_r', { emissive: 0x150505 }), organGroup);
  kR.position.set(0.07, 1.00, -0.05); kR.scale.set(0.9, 1.4, 0.8);

  // 腸
  const intestines = registerPart(
    makeMesh(new THREE.TorusKnotGeometry(0.075, 0.028, 100, 12, 2, 5), 0xd69a86, 'intestines', { emissive: 0x150706 }),
    organGroup,
  );
  intestines.position.set(0, 0.92, 0.02);
  intestines.scale.set(1.0, 0.6, 0.8);
}

// --- Build muscles ---
function buildMuscles() {
  const MUSCLE = 0xb04848;
  const EMI = 0x1a0404;

  // 大胸筋
  const pecGeom = new THREE.SphereGeometry(0.09, 16, 12);
  const pL = registerPart(makeMesh(pecGeom, MUSCLE, 'pectoralis_l', { emissive: EMI }), muscleGroup);
  pL.position.set(-0.08, 1.37, 0.12); pL.scale.set(1.0, 0.8, 0.4);
  const pR = registerPart(makeMesh(pecGeom, MUSCLE, 'pectoralis_r', { emissive: EMI }), muscleGroup);
  pR.position.set(0.08, 1.37, 0.12); pR.scale.set(1.0, 0.8, 0.4);

  // 三角筋
  const delGeom = new THREE.SphereGeometry(0.065, 16, 12);
  const dL = registerPart(makeMesh(delGeom, MUSCLE, 'deltoid_l', { emissive: EMI }), muscleGroup);
  dL.position.set(-0.23, 1.46, 0.02);
  const dR = registerPart(makeMesh(delGeom, MUSCLE, 'deltoid_r', { emissive: EMI }), muscleGroup);
  dR.position.set(0.23, 1.46, 0.02);

  // 上腕二頭筋
  const biGeom = new THREE.CapsuleGeometry(0.038, 0.18, 6, 12);
  const biL = registerPart(makeMesh(biGeom, MUSCLE, 'biceps_l', { emissive: EMI }), muscleGroup);
  biL.position.set(-0.25, 1.30, 0.04);
  const biR = registerPart(makeMesh(biGeom, MUSCLE, 'biceps_r', { emissive: EMI }), muscleGroup);
  biR.position.set(0.25, 1.30, 0.04);

  // 腹直筋 (1 つに統合してラベルもひとつ)
  const abs = registerPart(
    makeMesh(new THREE.BoxGeometry(0.14, 0.28, 0.04), MUSCLE, 'rectus_abdominis', { emissive: EMI }),
    muscleGroup,
  );
  abs.position.set(0, 1.10, 0.11);

  // 大腿四頭筋
  const qGeom = new THREE.CapsuleGeometry(0.06, 0.32, 6, 12);
  const qL = registerPart(makeMesh(qGeom, MUSCLE, 'quadriceps_l', { emissive: EMI }), muscleGroup);
  qL.position.set(-0.09, 0.72, 0.04);
  const qR = registerPart(makeMesh(qGeom, MUSCLE, 'quadriceps_r', { emissive: EMI }), muscleGroup);
  qR.position.set(0.09, 0.72, 0.04);

  // 下腿三頭筋
  const gGeom = new THREE.CapsuleGeometry(0.048, 0.22, 6, 12);
  const gL = registerPart(makeMesh(gGeom, MUSCLE, 'gastrocnemius_l', { emissive: EMI }), muscleGroup);
  gL.position.set(-0.09, 0.32, -0.03);
  const gR = registerPart(makeMesh(gGeom, MUSCLE, 'gastrocnemius_r', { emissive: EMI }), muscleGroup);
  gR.position.set(0.09, 0.32, -0.03);
}

// --- Skin (GLTF with fallback) ---
function buildSkinFallback() {
  const mat = new THREE.MeshStandardMaterial({
    color: 0xe0c8b0, transparent: true, opacity: 0.22, roughness: 0.7,
  });
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.55, 6, 14), mat);
  torso.position.set(0, 1.25, 0);
  const head  = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 20), mat);
  head.position.set(0, 1.65, 0);
  const legL  = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.7, 6, 12), mat);
  legL.position.set(-0.09, 0.48, 0);
  const legR  = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.7, 6, 12), mat);
  legR.position.set(0.09, 0.48, 0);
  const armL  = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.55, 6, 12), mat);
  armL.position.set(-0.27, 1.13, 0);
  const armR  = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.55, 6, 12), mat);
  armR.position.set(0.27, 1.13, 0);
  skinGroup.add(torso, head, legL, legR, armL, armR);
}

function loadSkin() {
  const url = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/models/gltf/Soldier.glb';
  const loader = new GLTFLoader();
  loader.load(
    url,
    (gltf) => {
      const body = gltf.scene;
      // Soldier.glb は原点基準で、身長 ≒ 1.8 なのでそのまま
      body.traverse((o) => {
        if (o.isMesh) {
          o.material = new THREE.MeshStandardMaterial({
            color: 0xe0c8b0,
            transparent: true,
            opacity: 0.22,
            roughness: 0.7,
            depthWrite: false,
          });
        }
      });
      skinGroup.add(body);
      loadingEl.classList.add('hidden');
    },
    undefined,
    (err) => {
      console.warn('Soldier.glb load failed, using fallback silhouette.', err);
      buildSkinFallback();
      loadingEl.classList.add('hidden');
    },
  );
}

// --- Picking ---
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let hovered = null;
let selected = null;
const HOVER_EMISSIVE = new THREE.Color(0x334466);
const SELECT_EMISSIVE = new THREE.Color(0x5a8cff);

function setEmissive(mesh, color) {
  if (!mesh || !mesh.material || !mesh.material.emissive) return;
  mesh.material.emissive.copy(color);
}
function restoreEmissive(mesh) {
  if (!mesh || !mesh.material || !mesh.material.emissive) return;
  const base = mesh.userData.baseEmissive || new THREE.Color(0x000000);
  mesh.material.emissive.copy(base);
}

function pickablesList() {
  const list = [];
  for (const g of [skeletonGroup, organGroup, muscleGroup]) {
    if (g.visible) list.push(g);
  }
  return list;
}

function onPointerMove(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(pickablesList(), true);
  const hit = hits.find(h => h.object.userData && h.object.userData.partId);
  const mesh = hit ? hit.object : null;
  if (mesh !== hovered) {
    if (hovered && hovered !== selected) restoreEmissive(hovered);
    hovered = mesh;
    if (hovered && hovered !== selected) setEmissive(hovered, HOVER_EMISSIVE);
    renderer.domElement.style.cursor = hovered ? 'pointer' : 'grab';
  }
}

function onPointerDown(e) {
  if (e.button !== 0) return;
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(pickablesList(), true);
  const hit = hits.find(h => h.object.userData && h.object.userData.partId);
  if (!hit) return;
  selectPart(hit.object);
}

function selectPart(mesh) {
  if (selected && selected !== mesh) restoreEmissive(selected);
  selected = mesh;
  setEmissive(selected, SELECT_EMISSIVE);
  const id = mesh.userData.partId;
  const p = PARTS[id];
  if (!p) return;
  infoHint.classList.add('hidden');
  infoTitle.textContent = p.ja;
  infoEn.textContent = p.en;
  infoBadge.textContent = SYSTEM_LABELS[p.system] || '';
  infoBadge.dataset.system = p.system;
  infoDesc.textContent = p.description;
}

renderer.domElement.addEventListener('pointermove', onPointerMove);
renderer.domElement.addEventListener('pointerdown', onPointerDown);

// --- UI bindings ---
function bindToggle(id, group) {
  const el = document.getElementById(id);
  el.addEventListener('change', () => { group.visible = el.checked; });
}
bindToggle('toggle-skin', skinGroup);
bindToggle('toggle-muscle', muscleGroup);
bindToggle('toggle-skeleton', skeletonGroup);
bindToggle('toggle-organ', organGroup);

const opacityEl = document.getElementById('skin-opacity');
opacityEl.addEventListener('input', () => {
  const v = Number(opacityEl.value) / 100;
  skinGroup.traverse((o) => {
    if (o.isMesh && o.material) {
      o.material.transparent = v < 1;
      o.material.opacity = v;
      o.material.needsUpdate = true;
    }
  });
});

const labelsEl = document.getElementById('toggle-labels');
labelsEl.addEventListener('change', () => {
  const on = labelsEl.checked;
  for (const g of [skeletonGroup, organGroup, muscleGroup]) {
    g.traverse((o) => {
      if (o.userData && o.userData.label) o.userData.label.visible = on;
    });
  }
});

document.getElementById('reset-view').addEventListener('click', () => {
  camera.position.copy(INITIAL_CAM);
  controls.target.copy(INITIAL_TARGET);
  controls.update();
});

// --- Resize ---
function resize() {
  const w = viewport.clientWidth;
  const h = viewport.clientHeight;
  renderer.setSize(w, h);
  labelRenderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);

// --- Init ---
buildSkeleton();
buildOrgans();
buildMuscles();
loadSkin();
resize();

// --- Animate ---
function tick() {
  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();
