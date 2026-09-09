import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Execute the production coordinate declarations and room builders without a
// browser or GPU. This checks walkability against the actual wall segments.
const source = fs.readFileSync(new URL('../assets/thinking-game.js', import.meta.url), 'utf8');
function fn(name) {
  const start = source.indexOf('    function ' + name + '(');
  assert(start >= 0, name);
  const end = source.indexOf('\n    function ', start + 10);
  return source.slice(start, end < 0 ? undefined : end);
}
function dummy() {
  const proxy = new Proxy(function () {}, {
    get: () => proxy, set: () => true, apply: () => proxy, construct: () => proxy
  });
  return proxy;
}
const walls = [];
const workRoom = dummy();
const ctx = vm.createContext({ THREE: dummy(), scene: dummy(), interactive: [], workRoom,
  makeServiceChoiceTexture: dummy(), makeOfferPlacardTexture: dummy(), makeElevatorPlacardTexture: dummy(),
  setElevatorIndicator: dummy(), addElevatorDoors: dummy(), addElevatorIndicator: dummy(),
  addDarkWall(spec, parent) {
    const dx = parent === workRoom ? 18.2 : 0;
    const dz = parent === workRoom ? -3.5 : 0;
    const x = spec.x + dx, z = spec.z + dz;
    const half = spec.length / 2;
    const ux = Math.cos(spec.rotation), uz = -Math.sin(spec.rotation);
    walls.push([x - half * ux, z - half * uz, x + half * ux, z + half * uz]);
  },
  addHallwayTransitionWall(x1, z1, x2, z2) { walls.push([x1, z1, x2, z2]); }
});
const declarations = source.slice(source.indexOf('    var centralObject ='), source.indexOf('    var proximityRange ='));
vm.runInContext(declarations, ctx);
// The production declarations initialize the parent later in buildScene.
ctx.workRoom = workRoom;
const builders = ['addOrientationHallway', 'addSupportingHallway', 'addWorkWithJoeRoom', 'addServiceChoiceArchitecture', 'addMethodsAndToolsWing', 'addWhoIsJoeExperience'];
for (const name of builders) {
  const code = fn(name);
  for (const helper of code.matchAll(/\b(add\w+)\(/g)) {
    if (!ctx[helper[1]]) ctx[helper[1]] = dummy();
  }
}
// Call each once; nested feature builders are stubs so walls aren't duplicated.
for (const name of builders) {
  const saved = ctx[name];
  vm.runInContext(fn(name), ctx);
  ctx[name](name === 'addWorkWithJoeRoom' || name === 'addMethodsAndToolsWing' ? workRoom : undefined);
  ctx[name] = saved;
}
const zones = ctx.walkableZones;
const walkable = (x, z) => zones.some(r => x >= r.xMin && x <= r.xMax && z >= r.zMin && z <= r.zMax);
function intersects(a, b, w) {
  const cross = (x, y, z) => (y[0]-x[0])*(z[1]-x[1])-(y[1]-x[1])*(z[0]-x[0]);
  const c = w.slice(0,2), d = w.slice(2);
  return cross(a,b,c)*cross(a,b,d) < -1e-8 && cross(c,d,a)*cross(c,d,b) < -1e-8;
}
function route(name, points) {
  for (let i=1; i<points.length; i++) {
    const a=points[i-1], b=points[i];
    const steps=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])*20);
    for(let k=0;k<=steps;k++) {
      const x=a[0]+(b[0]-a[0])*k/steps, z=a[1]+(b[1]-a[1])*k/steps;
      assert(walkable(x,z), `${name}: non-walkable ${x}, ${z}`);
    }
    assert(!walls.some(w=>intersects(a,b,w)), `${name}: wall crosses ${a} -> ${b}`);
  }
  console.log('PASS route:',name);
}
route('Orientation → choice → AI → Methods', [[0,1],[14,1],[18,-3],[21.5,-3],[21.5,-9],[28,-9],[33.38,-9],[33.38,-24.75]]);
route('Choice → Together → Methods', [[14,1],[18,5],[21.5,5],[21.5,8.5],[29,8.5],[36.5,8.5],[36.5,-17],[33.38,-17],[33.38,-24.75]]);
route('Methods → Who Is Joe → elevator', [[33.38,-24.75],[36,-24.75],[54.1,-24.75]]);
route('Who Is Joe → Control hallway', [[50,-24.75],[50,25],[-21.2,25],[-21.2,10]]);
route('Who Is Joe → identity exhibits', [[45,-24.75],[45,-30.5]]);
for (const [x,z] of [[20,1],[34.88,-8],[32.38,-1.5]]) {
  assert(!walkable(x,z),`Unintended old passage remains at ${x},${z}`);
}
assert(source.includes('camera.position.set(elevator.destinationCenter.x + 2.3'));
assert(!source.includes('camera.position.x <= 40.18'));
for (const title of ['Choose a direction','Make difficult tradeoffs','Build agreement across groups']) {
  assert(source.indexOf('title: "'+title+'"') > source.indexOf('function initMuseum(THREE)'));
}
assert(source.indexOf('initMobileStories();') < source.indexOf('function initMuseum(THREE)'));
console.log('PASS: isolated entrance, relocated elevator and desktop-only content');
