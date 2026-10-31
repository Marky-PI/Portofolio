export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface LanyardNode {
  pos: Vec3;
  prevPos: Vec3;
  lerped: Vec3;
  pinned: boolean;
}

export interface LanyardPhysicsState {
  nodes: LanyardNode[]; // [0]=fixed anchor at top edge, [1]=j1, [2]=j2, [3]=j3, [4]=card
  anchorX: number;
  segmentLength: number;
  rot: Vec3;
  angVel: Vec3;
  isDragged: boolean;
  dragTarget: Vec3;
}

export function createLanyardPhysicsState(anchorX = 0): LanyardPhysicsState {
  // Anchor [0] is pinned at the top edge of the About section frustum (y = 3.15).
  // Free nodes [1..4] start above the top edge so the lanyard drops down from above
  // when entering the About section and settles in the right-hand space.
  const anchorY = 3.15;
  const seg = 0.55;

  const state: LanyardPhysicsState = {
    nodes: [
      {
        pos: { x: anchorX, y: anchorY, z: 0 },
        prevPos: { x: anchorX, y: anchorY, z: 0 },
        lerped: { x: anchorX, y: anchorY, z: 0 },
        pinned: true,
      },
      {
        pos: { x: anchorX + 0.12, y: anchorY + 0.45, z: 0.03 },
        prevPos: { x: anchorX + 0.08, y: anchorY + 0.55, z: 0.03 },
        lerped: { x: anchorX + 0.12, y: anchorY + 0.45, z: 0.03 },
        pinned: false,
      },
      {
        pos: { x: anchorX + 0.24, y: anchorY + 0.85, z: 0.06 },
        prevPos: { x: anchorX + 0.18, y: anchorY + 1.0, z: 0.06 },
        lerped: { x: anchorX + 0.24, y: anchorY + 0.85, z: 0.06 },
        pinned: false,
      },
      {
        pos: { x: anchorX + 0.35, y: anchorY + 1.25, z: 0.09 },
        prevPos: { x: anchorX + 0.26, y: anchorY + 1.45, z: 0.09 },
        lerped: { x: anchorX + 0.35, y: anchorY + 1.25, z: 0.09 },
        pinned: false,
      },
      {
        pos: { x: anchorX + 0.46, y: anchorY + 1.65, z: 0.12 },
        prevPos: { x: anchorX + 0.34, y: anchorY + 1.9, z: 0.12 },
        lerped: { x: anchorX + 0.46, y: anchorY + 1.65, z: 0.12 },
        pinned: false,
      },
    ],
    anchorX,
    segmentLength: seg,
    rot: { x: -0.08, y: 0.28, z: 0.14 },
    angVel: { x: 0, y: -1.4, z: 0 },
    isDragged: false,
    dragTarget: { x: anchorX, y: 0, z: 0 },
  };

  return state;
}

export function setLanyardAnchorX(
  state: LanyardPhysicsState,
  newAnchorX: number
): void {
  const dx = newAnchorX - state.anchorX;
  state.anchorX = newAnchorX;
  for (const node of state.nodes) {
    node.pos.x += dx;
    node.prevPos.x += dx;
    node.lerped.x += dx;
  }
}

export function resetLanyardDrop(state: LanyardPhysicsState): void {
  const fresh = createLanyardPhysicsState(state.anchorX);
  state.nodes = fresh.nodes;
  state.rot = fresh.rot;
  state.angVel = fresh.angVel;
  state.isDragged = false;
}

export function stepLanyardPhysics(
  state: LanyardPhysicsState,
  dt: number
): void {
  const safeDt = Math.min(Math.max(dt, 0.001), 0.033);
  const gravityY = -38.0;
  const damping = Math.pow(0.22, safeDt);

  // 1. Verlet integration for free nodes
  for (let i = 1; i < state.nodes.length; i++) {
    const node = state.nodes[i];
    if (i === 4 && state.isDragged) {
      node.prevPos.x = node.pos.x;
      node.prevPos.y = node.pos.y;
      node.prevPos.z = node.pos.z;
      node.pos.x += (state.dragTarget.x - node.pos.x) * 0.45;
      node.pos.y += (state.dragTarget.y - node.pos.y) * 0.45;
      node.pos.z += (state.dragTarget.z - node.pos.z) * 0.45;
      continue;
    }

    const vx = (node.pos.x - node.prevPos.x) * damping;
    const vy = (node.pos.y - node.prevPos.y) * damping;
    const vz = (node.pos.z - node.prevPos.z) * damping;

    node.prevPos.x = node.pos.x;
    node.prevPos.y = node.pos.y;
    node.prevPos.z = node.pos.z;

    node.pos.x += vx;
    node.pos.y += vy + gravityY * safeDt * safeDt;
    node.pos.z += vz;
  }

  // 2. Solve rope distance constraints iteratively
  const iterations = 12;
  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < state.nodes.length - 1; i++) {
      const a = state.nodes[i];
      const b = state.nodes[i + 1];

      const dx = b.pos.x - a.pos.x;
      const dy = b.pos.y - a.pos.y;
      const dz = b.pos.z - a.pos.z;
      const dist = Math.hypot(dx, dy, dz) || 0.0001;
      const diff = (dist - state.segmentLength) / dist;

      const aLocked = a.pinned;
      const bLocked = i + 1 === 4 && state.isDragged;

      if (aLocked && !bLocked) {
        b.pos.x -= dx * diff;
        b.pos.y -= dy * diff;
        b.pos.z -= dz * diff;
      } else if (!aLocked && bLocked) {
        a.pos.x += dx * diff;
        a.pos.y += dy * diff;
        a.pos.z += dz * diff;
      } else if (!aLocked && !bLocked) {
        const weightA = i + 1 === 4 ? 0.72 : 0.5;
        const weightB = 1 - weightA;
        a.pos.x += dx * diff * weightA;
        a.pos.y += dy * diff * weightA;
        a.pos.z += dz * diff * weightA;
        b.pos.x -= dx * diff * weightB;
        b.pos.y -= dy * diff * weightB;
        b.pos.z -= dz * diff * weightB;
      }
    }
  }

  // 3. Smooth lerped positions for intermediate joints
  const minSpeed = 12;
  const maxSpeed = 55;
  for (let i = 1; i <= 2; i++) {
    const node = state.nodes[i];
    const dist = Math.hypot(
      node.pos.x - node.lerped.x,
      node.pos.y - node.lerped.y,
      node.pos.z - node.lerped.z
    );
    const clampedDist = Math.max(0.1, Math.min(1.0, dist));
    const factor = Math.min(
      1,
      safeDt * (minSpeed + clampedDist * (maxSpeed - minSpeed))
    );
    node.lerped.x += (node.pos.x - node.lerped.x) * factor;
    node.lerped.y += (node.pos.y - node.lerped.y) * factor;
    node.lerped.z += (node.pos.z - node.lerped.z) * factor;
  }
  state.nodes[0].lerped = { ...state.nodes[0].pos };
  state.nodes[3].lerped = { ...state.nodes[3].pos };
  state.nodes[4].lerped = { ...state.nodes[4].pos };

  // 4. Card rotational kinematics & spring return
  const j3 = state.nodes[3].pos;
  const card = state.nodes[4].pos;
  const cardVx = (card.x - state.nodes[4].prevPos.x) / safeDt;
  const cardVz = (card.z - state.nodes[4].prevPos.z) / safeDt;

  const targetRotZ = Math.max(
    -0.55,
    Math.min(0.55, (card.x - j3.x) * 0.65)
  );
  const targetRotX = Math.max(
    -0.35,
    Math.min(0.35, -(card.z - j3.z) * 0.65 + cardVz * 0.015)
  );

  state.rot.z += (targetRotZ - state.rot.z) * Math.min(1, safeDt * 12);
  state.rot.x += (targetRotX - state.rot.x) * Math.min(1, safeDt * 12);

  state.angVel.y += (-state.rot.y * 10.5 + cardVx * 0.45) * safeDt;
  state.angVel.y *= Math.pow(0.12, safeDt);
  state.rot.y += state.angVel.y * safeDt;
}
