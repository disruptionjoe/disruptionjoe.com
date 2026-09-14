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
    const dx = parent === workRoom ? ctx.workRoomOffset.x : 0;
    const dz = parent === workRoom ? ctx.workRoomOffset.z : 0;
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
const placardSource = source.slice(source.indexOf('    var servicePlacards ='), source.indexOf('    servicePlacards.forEach('));
vm.runInContext(placardSource, ctx);
ctx.makeServicePlacardTexture = dummy();
ctx.exhibitAnchors = [];
ctx.visibleExhibitIndexes = [];
ctx.exhibitIndex = title => ctx.servicePlacards.findIndex(p => p.title === title);

const builders = ['addOrientationHallway', 'addSupportingHallway', 'addServiceChoiceArchitecture', 'addMethodsAndToolsWing', 'addWhoIsJoeExperience'];
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
  ctx[name](name === 'addMethodsAndToolsWing' ? workRoom : undefined);
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
route('Orientation → choice → AI → Methods', [[0,1],[7.75,1],[7.75,-9],[41.5,-9],[41.5,0]]);
route('Choice → Together → Methods', [[7.75,1],[7.75,8.5],[29,9.5],[41.5,9.5],[41.5,0]]);
route('Methods → Who Is Joe → elevator', [[41.5,0],[43.5,-2],[50,-2],[51.5,.25],[72.7,.25]]);
route('Who Is Joe → Control hallway', [[68.62,.25],[68.62,25],[-21.2,25],[-21.2,10]]);
route('Who Is Joe → identity exhibits', [[63.5,.25],[63.5,-5]]);
for (const [x,z] of [[25,1],[36.5,0],[32.38,-1.5]]) {
  assert(!walkable(x,z),`Unintended passage remains at ${x},${z}`);
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
assert(insideMethods([41.5,4]), 'Together arrives in Methods proper');
assert(insideMethods([41.5,-3]), 'AI arrives in Methods proper');
for (const x of [40.5,41.5,42.5]) {
  route('AI doorway clearance', [[x,-8],[x,-3]]);
  route('Together doorway clearance', [[x,9.5],[x,4]]);
}
for (const z of [-.75,.25,1.25]) route('Who Is Joe doorway clearance', [[52,z],[56.5,z]]);
route('Deliberate backtracking via Methods', [[29,9.5],[41.5,9.5],[41.5,-8],[28,-8]]);
assert(!walkable(36.5,0), 'Service approaches only connect through Methods');
vm.runInContext('var workOfferStatements = [0,1,2];' + fn('addMethodsGallery').match(/var galleryImages = \[[\s\S]*?\n      \];/)[0], ctx);
for (const p of ctx.galleryImages) {
  const half=(p.width+0.22)/2;
  assert(p.y+(p.height+0.22)/2<4.6, 'Gallery clears ceiling');
  assert(p.y-p.height/2>1.34, 'Gallery clears its caption');
  if (p.rotation===0 || p.rotation===Math.PI) {
    assert(p.x-half>6.18, 'Gallery clears Methods entry');
    assert(p.x+half<ctx.methodsRoomLayout.east);
  } else {
    assert(p.z-half> -19.75, 'East gallery clears identity doorway');
    assert(p.z+half<ctx.methodsRoomLayout.north);
  }
}
console.log('PASS: distinct arrivals, usable doorway widths, reversible routes and display clearances');

const choice=ctx.serviceRooms.find(r=>r.name==='service-choice');
assert((choice.xMax-choice.xMin)*(choice.zMax-choice.zMin)<=60, 'Choice area must be compact');
assert(choice.xMin-5.15<0.5, 'Orientation must enter choice directly');
for (const p of [[25,1],[10,-4.5],[10,6.5],[20,5]]) assert(!walkable(...p), 'Old empty vestibule/hall remains at '+p);
route('AI back to Orientation', [[28,-9],[7.75,-9],[7.75,1],[0,1]]);
route('Together back to Orientation', [[29,8.5],[7.75,8.5],[7.75,1],[0,1]]);
console.log('PASS: compact choice footprint and short orientation approach');

assert.equal(ctx.servicePlacards.length, 2);
assert.deepEqual(ctx.visibleExhibitIndexes, [0,1], 'Both wall placards must register for inspection');
assert.equal(ctx.exhibitAnchors.length, 2, 'Both need proximity anchors');
assert.equal(ctx.servicePlacards[0].staticTitle, 'Buying tools is the easy part.');
assert.equal(ctx.servicePlacards[1].staticTitle, 'Reach decisions people understand, support, and take responsibility for delivering.');
assert(!JSON.stringify(ctx.servicePlacards).includes('—'), 'Approved copy contains no em dashes');
assert(!source.includes('/ My point of view'), 'Retired placard labels must be removed');
ctx.document = { createElement(tag) { return {tag, children: [], appendChild(child) { this.children.push(child); }}; } };
vm.runInContext(fn('appendServicePainQuotes'), ctx);
for (const exhibit of ctx.servicePlacards) {
  assert.equal(exhibit.dynamicQuotes.length, 6);
  const target=ctx.document.createElement('p');
  assert(ctx.appendServicePainQuotes(target, exhibit));
  assert.equal(target.children.length,6);
  target.children.forEach((row,i) => {
    assert.equal(row.tag,'span', 'Valid inline content inside existing paragraph container');
    assert.equal(row.children[0].tag,'strong');
    assert.equal(row.children[0].textContent,'“'+exhibit.dynamicQuotes[i].quote+'”');
    assert.equal(row.children[1].textContent,' '+exhibit.dynamicQuotes[i].explanation);
  });
}
assert(fn('openProximity').includes('appendServicePainQuotes(proximityBody, exhibit)'));
assert(fn('openInspector').includes('appendServicePainQuotes(inspectorBody, exhibit)'));
console.log('PASS: two inspectable placards, all twelve quotes and both dynamic render paths');

assert(!walkable(10.1,1), 'T junction must have a closed facing wall');
assert(!choice.east, 'No forward service exits');
for (const x of [6.6,7.75,8.9]) {
  route('Left T exit width', [[x,1],[x,-9]]);
  route('Right T exit width', [[x,1],[x,8.5]]);
}
assert(source.includes('placard(9.94, -1.6, -Math.PI / 2, 2.5, 2.7'));
assert(source.includes('placard(9.94, 3.6, -Math.PI / 2, 2.5, 2.7'));
assert(3.6-(-1.6)>4.5+0.5, 'Facing displays have breathing room');
assert(source.includes('x: 7.75, z: -4.5, rotation: 0, title: "AI Activation Playbook"'));
assert(source.includes('x: 7.75, z: 6.5, rotation: Math.PI, title: "Thinking Better Together"'));
console.log('PASS: left/right T junction with paired facing displays');

const aiStations=ctx.serviceExhibitPositions.slice(0,5);
assert(aiStations.slice(0,3).every(p=>p.rotation===0 && p.z===-10.34));
assert(aiStations.slice(3).every(p=>p.rotation===Math.PI && p.z===-5.66 && p.x>23));
assert(aiStations.every((p,i)=>i===0 || p.x>aiStations[i-1].x));
assert(aiStations[4].x+3.72*0.72/2<34.88, 'Station5 clears Methods doorway');
route('AI stations then right turn into Methods', [[7.75,-9],[13,-8],[18,-8],[23,-8],[26.2,-8],[30.2,-8],[41.5,-8],[41.5,0]]);
route('Soundcheck optional alcove', [[19.5,-8],[19.5,-2],[19.5,-8]]);
route('Together ordered exhibits to Methods', [[7.75,8.5],[15,9.5],[22,9.5],[29,9.5],[41.5,9.5],[41.5,0]]);
assert(!walkable(28,0), 'Old AI room footprint removed');
assert(!walkable(28,14), 'Old Together room footprint removed');
assert(source.includes('panel.position.set(7.75, 1.8, -10.44)'), 'Start Here faces first turn');
console.log('PASS: ordered exhibit hallways, Soundcheck alcove and removed room footprints');
