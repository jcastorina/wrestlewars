type AnimateProps = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  registry: any[];
};

export const run = ({ scene, camera, renderer, registry }: AnimateProps) => {
  console.log(registry, "cam")
  const animate = () => {
    requestAnimationFrame(animate);

    registry.forEach((r) => r.update());
    camera.rotation.y -= 0.005;
    renderer.render(scene, camera);
  };
  animate();
};
