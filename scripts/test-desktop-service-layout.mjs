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
route('Orientation → choice → AI → Methods', [[0,1],[8,1],[10,-2],[13,-2],[13,-9],[28,-9],[33.38,-9],[33.38,-24.75]]);
route('Choice → Together → Methods', [[8,1],[10,4],[13,4],[13,8.5],[29,8.5],[36.5,8.5],[36.5,-20.5],[32,-20.5],[33.38,-20.5],[33.38,-24.75]]);
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

// Both service exits land inside Methods, not in a shared approach junction.
const methods = zones.find(r => r.name === 'methods-room');
const insideMethods = ([x,z]) => x >= methods.xMin && x <= methods.xMax && z >= methods.zMin && z <= methods.zMax;
assert(insideMethods([32,-20.5]), 'Together must arrive in Methods proper');
assert(insideMethods([33.38,-20.5]), 'AI must arrive in Methods proper');
for (const x of [32.4, 33.38, 34.2]) {
  route('AI doorway clearance', [[x,-14],[x,-20.5]]);
}
for (const z of [-21.5,-20.5,-19.5]) {
  route('Together doorway clearance', [[36.5,z],[32,z]]);
}
for (const z of [-25.75,-24.75,-23.75]) {
  route('Who Is Joe doorway clearance', [[33.38,z],[38,z]]);
}
route('Deliberate backtracking via Methods', [[29,8.5],[36.5,8.5],[36.5,-20.5],[33.38,-20.5],[33.38,-9],[28,-9]]);
assert(!walkable(34.88,-17), 'Old Together/AI approach junction must be closed');
assert(!walkable(36.5,-22.2), 'Together corridor must end before the identity corridor');

// Check production wall-display extents, including frames, against room bounds.
vm.runInContext('var workOfferStatements = [0,1,2];' + fn('addMethodsGallery').match(/var galleryImages = \[[\s\S]*?\n      \];/)[0], ctx);
const westImages = ctx.galleryImages.filter(p => Math.abs(p.rotation-Math.PI/2)<0.01).sort((a,b)=>a.z-b.z);
for (const p of westImages) {
  const half=(p.width+0.22)/2;
  assert(p.z-half > ctx.methodsRoomLayout.south+0.3);
  assert(p.z+half < ctx.methodsRoomLayout.north-0.3);
}
assert(westImages[1].z-westImages[0].z > (westImages[0].width+westImages[1].width)/2+0.6);
const northImage=ctx.galleryImages.find(p=>p.rotation===Math.PI);
assert(northImage.x+(northImage.width+0.22)/2 < 11.1-4.55/2-0.2, 'Gallery and tool board need separate wall space');
assert(11.1+4.55/2 < 13.68-0.2, 'Tool board must clear the AI entry');
assert(!ctx.galleryImages.some(p=>Math.abs(p.rotation+Math.PI/2)<0.01), 'Keep east entry/identity wall free of artwork');
const north=ctx.workOfferPlacement.north;
assert(Math.abs((north.buildX+north.connectX)/2-ctx.workRoomLayout.centerX)<0.01, 'AI north exhibits centered in room');
assert(north.buildX-north.connectX > 3.72*ctx.workOfferPlacement.displayScale+0.6);
console.log('PASS: distinct arrivals, usable doorway widths, reversible routes and display clearances');

const choice=ctx.serviceRooms.find(r=>r.name==='service-choice');
assert((choice.xMax-choice.xMin)*(choice.zMax-choice.zMin)<=60, 'Choice area must be compact');
assert(choice.xMin-5.15<0.5, 'Orientation must enter choice directly');
for (const p of [[18,1],[10,-4.5],[10,6.5],[20,5]]) assert(!walkable(...p), 'Old empty vestibule/hall remains at '+p);
route('AI back to Orientation', [[28,-9],[13,-9],[13,-2],[10,-2],[8,1],[0,1]]);
route('Together back to Orientation', [[29,8.5],[13,8.5],[13,4],[10,4],[8,1],[0,1]]);
console.log('PASS: compact choice footprint and short orientation approach');
