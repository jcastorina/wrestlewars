import * as THREE from "three";
import laughcry from "../assets/textures/laugh_cry.png";
import { casino } from "../assets/skybox";

type FloorTile = (
  scale?: number,
  color?: any,
  x?: number,
  z?: number
) => any;
type IMesh = THREE.Mesh<THREE.PlaneBufferGeometry, THREE.MeshBasicMaterial>;
type BuildProps = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  handleSetReady: (ready: boolean) => Promise<void>;
  handleSetRegistry: (registry: any[]) => Promise<void>;
};

export const createGameObject = (object: THREE.Mesh, rate: number) => {
  const gameObj = {
    ...object,
    update: () => {
      gameObj.rotation.x += rate;
    },
  };

  return gameObj;
};

export const createLaughCry = () => {
  const texture = new THREE.TextureLoader().load(laughcry);
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
};

export const createSnakeSkin = () => {
  const texture = new THREE.TextureLoader().load(
    "https://i2.wp.com/digital-photography-school.com/wp-content/uploads/2021/03/using-light-to-create-texture-photography-2.jpg"
  );
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = 2.5;
  return mesh;
};

export const createFloorTile = (
  scale: number = 2,
  color: THREE.Color,
  x: number = 0,
  z: number = 0
) => {
  const geometry = new THREE.PlaneBufferGeometry(scale, scale, scale);
  const material = new THREE.MeshBasicMaterial({
    color,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = -10;
  mesh.position.x = x;
  mesh.position.z = z;
  mesh.rotation.order = "YXZ";
  mesh.rotation.x = Math.PI / 2;
  const gameObj = {
    ...mesh,
    update: () => {
      gameObj.material.color === new THREE.Color(0,0,0) ?
      gameObj.material.color.setRGB(0,0,0) :
      gameObj.material.color.setRGB(0,0,0)
    }
  }
  return gameObj;
};

export const createFloor = (
  tile: FloorTile,
  breadth: number = 10,
  depth: number = 10,
  scale: number = 4
): IMesh[][] => {
  const obj = {};
  return new Array(breadth)
    .fill(new Array(depth).fill(obj))
    .map((arr: any[], i) => {
      return arr.map((_, j) => {
        const offsetX = i * scale - (scale * breadth) / 2;
        const offsetZ = j * scale - (scale * depth) / 2;
        const mesh = tile(
          scale,
          (i % 2 !== j % 2 ? new THREE.Color(1,1,1) : new THREE.Color(0,0,0)),
          offsetX,
          offsetZ
        );
        return mesh;
      });
    });
};

export const createLights = () => {
  const hemi = new THREE.HemisphereLight(0xffffbb, 0x080820, 1000);
  const point = new THREE.PointLight(0xff0000, 1000, 100);
  point.position.set(0, -2, 0);
  return [hemi, point];
};

export const createSkybox = () => {
  const reflectionCube = new THREE.CubeTextureLoader().load(casino);
  reflectionCube.format = THREE.RGBFormat;
  return reflectionCube;
};

export const build = async ({
  scene,
  camera,
  handleSetReady,
  handleSetRegistry,
}: BuildProps) => {
  scene.background = createSkybox();

  const tiles = createFloor(createFloorTile, 40, 40);
  const mesh = createLaughCry();
  const meshsnake = createSnakeSkin();
  const ftiles = tiles.flat();
  scene.add(...ftiles);
  scene.add(mesh, meshsnake);
  scene.add(...createLights());

  handleSetRegistry([
    createGameObject(mesh, 0.01),
    createGameObject(meshsnake, 0.05),
  ]);

  camera.position.z = 5;
  handleSetReady(true);
};
