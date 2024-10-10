// import "./style.css";
import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
//import * as THREE from "./three";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "https://unpkg.com/three@0.126.1/examples/jsm/loaders/OBJLoader.js";

// "./three/examples/js/loaders/OBJLoader.js"; "./three/addons/controls/OrbitControls.js"; //

// create instance of objloader
const loader = new OBJLoader();

// create scene, camera, renderer
const scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
let renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

// add detailed cow
var cow_model_detailed;
loader.load("models/cow.obj", function (object) {
  cow_model_detailed = object;
  const mat = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    wireframe: true,
  });

  cow_model_detailed.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.position.y = -window.innerHeight / 100;
      child.material = mat;
    }
  });

  scene.add(cow_model_detailed);
});

// add simplified cow
var cow_model_simplified;
loader.load("models/simple_cow.obj", function (object) {
  cow_model_simplified = object;
  const mat = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    wireframe: true,
  });

  cow_model_simplified.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.position.y = -window.innerHeight / 100;
      child.material = mat;
    }
  });

  scene.add(cow_model_simplified);
});

// set screen and camera
var radius = 30;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(radius);

// torus
const ringYs = [];
const ringRotations = [];
const planetRadius = 10;

function rotateRing(ring, xR, yR, zR) {
  ring.rotation.x += xR;
  ring.rotation.y += yR;
  ring.rotation.z += zR;
}

function addRing(x, y, z) {
  const innerRad = Math.floor(Math.random() * 10) + planetRadius + 3;
  const geometry = new THREE.RingGeometry(
    innerRad,
    innerRad + Math.random() * 4 + 0.5,
    32
  );
  //const geometry = new THREE.TorusGeometry(5, 0.5, 16, 100);

  const torus = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color: 0xb0611c,
    })
  );

  torus.position.set(x, y, z);

  ringYs.push(y);

  const rotX =
    (Math.floor(Math.random() * 2) + 1) *
    100 *
    (Math.floor(Math.random() * 2) * 2 - 1);
  const rotY =
    (Math.floor(Math.random()) + 1) *
    100 *
    (Math.floor(Math.random() * 2) * 2 - 1);
  const rotZ =
    (Math.floor(Math.random()) + 1) *
    100 *
    (Math.floor(Math.random() * 2) * 2 - 1);

  ringRotations.push({ x: 1.0 / rotX, y: 1.0 / rotY, z: 0 }); //1.0 / rotZ

  return torus;
}

const rings = [];
const numRings = 3;
for (let i = 0; i < numRings; i++) {
  const randX = (Math.floor(Math.random() * 3) - 1) * 0.5;
  const randY = (Math.floor(Math.random() * 3) - 1) * 0.5;
  const randZ = (Math.floor(Math.random() * 3) - 1) * 0.5;
  rings[i] = addRing(randX, randY, randZ);
  for (let j = 0; j < Math.floor(Math.random() * 1000) + 1; j++) {
    rotateRing(
      rings[i],
      ringRotations[i].x,
      ringRotations[i].y,
      ringRotations[i].z
    );
  }
  //scene.add(rings[i]);
}

// point light
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);

// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff);

// add lights
scene.add(pointLight, ambientLight);

// helpers
// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

// controls
const controls = new OrbitControls(camera, renderer.domElement);

// star
const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

function addStar() {
  const star = new THREE.Mesh(starGeometry, starMaterial);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(200));
  star.position.set(x, y, z);

  scene.add(star);
}

Array(300).fill().forEach(addStar);

// planet
// const planetTexture = new THREE.TextureLoader().load("images/planetTex.jpg");
// //const planetNormal = new THREE.TextureLoader().load("moonNormal.jpeg");

// const planet = new THREE.Mesh(
//   new THREE.SphereGeometry(planetRadius, 32, 32),
//   new THREE.MeshStandardMaterial({
//     map: planetTexture,
//     //normalMap: planetNormal,
//   })
// );

//scene.add(planet);

// space background
const spaceTexture = new THREE.TextureLoader().load("images/space.jpg");
scene.background = spaceTexture;

// function changeColor(ring, red, green, blue) {
//   if (ring.material.color.r > 0.9) {
//     red = -0.01;
//   } else if (ring.material.color.r < 0.1) {
//     red = 0.01;
//   }
//   ring.material.color.r += red;

//   if (ring.material.color.g > 0.9) {
//     green = -0.01;
//   } else if (ring.material.color.g < 0.1) {
//     green = 0.01;
//   }
//   ring.material.color.g += green;

//   if (ring.material.color.b > 0.9) {
//     blue = -0.005;
//   } else if (ring.material.color.b < 0.1) {
//     blue = 0.005;
//   }
//   ring.material.color.b += blue;

//   return [red, green, blue];
// }

// move camera
// function shiftRing(ring, whenToMove, jump, originalY, compare) {
//   if (window.pageYOffset > whenToMove && !scrollUp) {
//     ring.position.y +=
//       jump *
//       ((window.pageYOffset - prevOff) / document.documentElement.scrollHeight);
//   } else if (ring.position.y != originalY && scrollUp) {
//     ring.position.y +=
//       jump *
//       ((window.pageYOffset - prevOff) / document.documentElement.scrollHeight);
//   }
//   if (compare(ring.position.y, originalY)) {
//     ring.position.y = originalY;
//   }
// }

// function lessThan(ringPos, oriY) {
//   return ringPos < oriY;
// }

// function greaterThan(ringPos, oriY) {
//   return ringPos > oriY;
// }

let prevOff = 0;
let scrollUp = true;
var angle = 0;
document.body.onscroll = function moveCamera() {
  // check direction of scroll
  scrollUp = window.pageYOffset < prevOff;

  // shift rings
  // for (let i = 0; i < rings.length; i++) {
  //   let j = Math.floor((i % 2) * 2) * 2 - 1;
  //   shiftRing(
  //     rings[i],
  //     i * 100 + 200,
  //     j * 40,
  //     ringYs[i],
  //     j > 0 ? lessThan : greaterThan
  //   );
  // }

  // rotate camera
  const ratio =
    (window.pageYOffset - prevOff) / document.documentElement.scrollHeight;
  console.log("scrollHeight: %d", document.documentElement.scrollHeight);
  camera.position.x = radius * Math.cos(angle);
  camera.position.z = radius * Math.sin(angle);
  console.log(ratio);
  if (scrollUp) {
    angle += ratio * 10;
    if (radius > 30) {
      radius += ratio * 30;
    }
  } else {
    angle += ratio * 10;
    if (radius < 70) {
      radius += ratio * 30;
    }
  }

  // cows
  //cow_model_detailed.position.y += ratio * 3;
  cow_model_detailed.position.x += ratio * 15;
  //cow_model_simplified.position.y -= ratio * 3;
  cow_model_simplified.position.x -= ratio * 15;
  console.log("ratio: " + ratio);
  rotateRing(cow_model_detailed, 0, -ratio * 12, 0);
  rotateRing(cow_model_simplified, 0, -ratio * 12, 0);

  // set new previous
  prevOff = window.pageYOffset;
};

let prevAspect = camera.aspect;

// animate each frame
function animate() {
  requestAnimationFrame(animate);

  // rings
  for (let i = 0; i < rings.length; i++) {
    rotateRing(
      rings[i],
      ringRotations[i].x,
      ringRotations[i].y,
      ringRotations[i].z
    );
  }

  // cow
  rotateRing(cow_model_detailed, 0, -0.01, 0);
  rotateRing(cow_model_simplified, 0, -0.01, 0);

  // camera
  camera.position.x = radius * Math.cos(angle);
  camera.position.z = radius * Math.sin(angle);
  angle += 0.001;

  controls.update();

  if (window.innerWidth / window.innerHeight != prevAspect) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    prevAspect = camera.aspect;
  }
  //console.log("width: %d, height: %d", window.innerWidth, window.innerHeight);

  renderer.render(scene, camera);
}

animate();
