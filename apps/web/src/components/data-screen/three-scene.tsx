import type { DataScreenScene, NodeStatus } from '@sa/visualization';
import { normalizeScene } from '@sa/visualization';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const statusColor: Record<NodeStatus, number> = {
  healthy: 0x22c55e,
  warning: 0xf59e0b,
  critical: 0xef4444
};

export function ThreeScene({
  scene,
  selectedNodeId,
  onSelectNode,
  reducedMotion
}: {
  scene: DataScreenScene;
  selectedNodeId?: string;
  onSelectNode: (id: string) => void;
  reducedMotion: boolean;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const normalized = useMemo(() => normalizeScene(scene), [scene]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const threeScene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 10);

    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(2, 4, 8);
    threeScene.add(light);
    threeScene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const group = new THREE.Group();
    threeScene.add(group);

    const nodeObjects = new Map<string, THREE.Mesh>();
    normalized.nodes.forEach(node => {
      const geometry = new THREE.SphereGeometry(node.radius, 32, 16);
      const material = new THREE.MeshStandardMaterial({
        color: statusColor[node.status],
        emissive: selectedNodeId === node.id ? 0x646cff : statusColor[node.status],
        emissiveIntensity: selectedNodeId === node.id ? 0.35 : 0.08,
        roughness: 0.38
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(node.position[0], node.position[1], node.position[2] + node.height * 0.08);
      mesh.userData.id = node.id;
      group.add(mesh);
      nodeObjects.set(node.id, mesh);
    });

    normalized.edges.forEach(edge => {
      const source = nodeObjects.get(edge.source);
      const target = nodeObjects.get(edge.target);
      if (!source || !target) return;

      const points = [source.position.clone(), target.position.clone()];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: edge.errorRate > 0.02 ? 0xef4444 : 0x94a3b8,
        transparent: true,
        opacity: 0.62
      });
      group.add(new THREE.Line(geometry, material));

      if (!reducedMotion) {
        const particleGeometry = new THREE.SphereGeometry(0.045 + edge.width, 12, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x646cff });
        for (let index = 0; index < edge.particleRate; index += 1) {
          const particle = new THREE.Mesh(particleGeometry, particleMaterial);
          particle.userData = { source: source.position.clone(), target: target.position.clone(), offset: index / edge.particleRate };
          group.add(particle);
        }
      }
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function handlePointer(event: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(Array.from(nodeObjects.values()))[0];
      if (hit?.object.userData.id) {
        onSelectNode(hit.object.userData.id);
      }
    }

    renderer.domElement.addEventListener('pointerdown', handlePointer);

    const resizeObserver = new ResizeObserver(() => {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
    });
    resizeObserver.observe(mount);

    let frame = 0;
    let raf = 0;

    function animate() {
      frame += 0.006;
      group.rotation.y = Math.sin(frame) * 0.12;
      group.children.forEach(child => {
        if (!('source' in child.userData)) return;
        const offset = (frame * 0.8 + child.userData.offset) % 1;
        child.position.lerpVectors(child.userData.source, child.userData.target, offset);
      });
      renderer.render(threeScene, camera);
      raf = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', handlePointer);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [normalized, onSelectNode, reducedMotion, selectedNodeId]);

  return <div ref={mountRef} className="h-[520px] min-h-[420px] w-full rounded-lg bg-[radial-gradient(circle_at_50%_40%,rgba(100,108,255,0.16),rgba(255,255,255,0)_54%)]" />;
}
