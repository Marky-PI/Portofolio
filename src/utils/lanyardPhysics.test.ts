import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createLanyardPhysicsState,
  resetLanyardDrop,
  stepLanyardPhysics,
} from './lanyardPhysics';

test('lanyard physics starts above the anchor and drops down under gravity to equilibrium', () => {
  const state = createLanyardPhysicsState();
  // Card initially starts above the anchor Y so it drops from the top
  assert.ok(state.nodes[4].pos.y > state.nodes[0].pos.y);

  // Simulate 3 seconds at 60 FPS
  for (let i = 0; i < 180; i++) {
    stepLanyardPhysics(state, 1 / 60);
  }

  // Card should settle near x = 0 and hang below the fixed anchor at y = 3.15
  assert.ok(Math.abs(state.nodes[4].pos.x) < 0.25);
  assert.ok(state.nodes[4].pos.y < state.nodes[0].pos.y - 2.0);
});

test('lanyard physics responds to kinematic pointer drag, rebounds, and resets drop on section entry', () => {
  const state = createLanyardPhysicsState();
  state.isDragged = true;
  state.dragTarget = { x: -1.8, y: -0.2, z: 0.2 };

  for (let i = 0; i < 30; i++) {
    stepLanyardPhysics(state, 1 / 60);
  }

  assert.ok(state.nodes[4].pos.x < -1.0);

  state.isDragged = false;
  for (let i = 0; i < 120; i++) {
    stepLanyardPhysics(state, 1 / 60);
  }

  assert.ok(Math.abs(state.nodes[4].pos.x) < 0.6);

  // Trigger resetLanyardDrop when re-entering About section
  resetLanyardDrop(state);
  assert.ok(state.nodes[4].pos.y > state.nodes[0].pos.y);
});
