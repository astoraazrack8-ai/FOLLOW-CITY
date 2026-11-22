import * as THREE from 'three';

// FOLLOW CITY traffic: lightweight two-way traffic for the player's road segments.
// Cars are generated locally from Three.js primitives; no external assets required.
export class TrafficSystem {
  constructor(scene, getRoads) {
    this.scene = scene;
    this.getRoads = getRoads;
    this.roads = new Map();
    this.cars = [];
    this.materials = {
      body: [0xe64b3c, 0x2878c7, 0xf0c541, 0xe9ecef, 0x263238, 0x28a879].map(color =>
        new THREE.MeshStandardMaterial({ color, roughness: .72, metalness: .08 })),
      glass: new THREE.MeshStandardMaterial({ color: 0x9fc7d8, roughness: .25, metalness: .15 }),
      tire: new THREE.MeshStandardMaterial({ color: 0x20252a, roughness: 1 }),
      lamp: new THREE.MeshBasicMaterial({ color: 0xfff1bd }),
      tail: new THREE.MeshBasicMaterial({ color: 0xe33b32 })
    };
  }

  makeCar(colorIndex) {
    const car = new THREE.Group();
    const paint = this.materials.body[colorIndex % this.materials.body.length];
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.45, .55, 2.65), paint);
    body.position.y = .55; body.castShadow = true; car.add(body);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.18, .55, 1.35), this.materials.glass);
    cabin.position.set(0, .98, -.12); cabin.castShadow = true; car.add(cabin);
    for (const x of [-.76, .76]) for (const z of [-.82, .82]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(.29, .29, .16, 10), this.materials.tire);
      wheel.rotation.z = Math.PI / 2; wheel.position.set(x, .32, z); car.add(wheel);
    }
    for (const x of [-.48, .48]) {
      const front = new THREE.Mesh(new THREE.BoxGeometry(.22, .13, .04), this.materials.lamp);
      front.position.set(x, .57, 1.34); car.add(front);
      const rear = new THREE.Mesh(new THREE.BoxGeometry(.22, .13, .04), this.materials.tail);
      rear.position.set(x, .57, -1.34); car.add(rear);
    }
    car.scale.setScalar(.78);
    this.scene.add(car);
    return car;
  }

  addRoad(road) {
    const length = road?.geometry?.parameters?.depth || 0;
    if (length < 5) return;
    const count = Math.max(2, Math.min(5, Math.floor(length / 17)));
    const cars = [];
    for (let i = 0; i < count; i++) {
      for (const direction of [-1, 1]) {
        const car = this.makeCar((this.cars.length + i + (direction > 0 ? 2 : 0)) % this.materials.body.length);
        const laneOffset = direction > 0 ? -.9 : .9;
        const item = { mesh: car, road, length, direction, laneOffset,
          progress: (i + .35) / count, speed: .055 + Math.random() * .025 };
        cars.push(item); this.cars.push(item);
      }
    }
    this.roads.set(road, cars);
  }

  refresh() {
    for (const road of this.getRoads()) if (!this.roads.has(road)) this.addRoad(road);
  }

  update(delta) {
    this.refresh();
    const dt = Math.min(Math.max(delta || 0, 0), .05);
    for (const item of this.cars) {
      item.progress += item.direction * item.speed * dt;
      if (item.progress > 1.08) item.progress = -.08;
      if (item.progress < -.08) item.progress = 1.08;
      const angle = item.road.rotation.y;
      const axisX = Math.sin(angle), axisZ = Math.cos(angle);
      const sideX = Math.cos(angle), sideZ = -Math.sin(angle);
      const distance = (item.progress - .5) * item.length;
      item.mesh.position.set(
        item.road.position.x + axisX * distance + sideX * item.laneOffset,
        .16,
        item.road.position.z + axisZ * distance + sideZ * item.laneOffset
      );
      item.mesh.rotation.y = angle + (item.direction < 0 ? Math.PI : 0);
    }
  }

  dispose() {
    for (const item of this.cars) this.scene.remove(item.mesh);
    this.cars.length = 0; this.roads.clear();
  }
}
