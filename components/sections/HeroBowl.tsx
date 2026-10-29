"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Mesh, MeshPhysicalMaterial } from "three";

type ViewerStatus = "loading" | "ready" | "fallback";

type HeroBowlProps = {
  progress: number;
  image: { src: string; alt: string };
  onStatusChange: (status: ViewerStatus) => void;
};

type Viewer = {
  setProgress: (progress: number) => void;
};

const MODEL_URL = "/models/hero-bowl.glb";
const COMPACT_MODEL_URL = "/models/hero-bowl-compact.glb";

export function HeroBowl({ progress, image, onStatusChange }: HeroBowlProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const latestProgress = useRef(progress);
  const [status, setStatus] = useState<ViewerStatus>("loading");

  useEffect(() => {
    latestProgress.current = progress;
    viewerRef.current?.setProgress(progress);
  }, [progress]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    // A restored browser/tab focus is not a new keyboard interaction.
    mount.dataset.input = "pointer";

    let disposed = false;
    let cleanUp = () => {};
    const changeStatus = (next: ViewerStatus) => {
      if (disposed) return;
      setStatus(next);
      onStatusChange(next);
    };

    async function initialize() {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
      if (disposed || !mount) return;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.5;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.domElement.className = "h-full w-full";
      renderer.domElement.setAttribute("aria-hidden", "true");
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(28, 1, 0.002, 4);
      const target = new THREE.Vector3(0, 0, 0);
      const cameraDirection = new THREE.Vector3(0, 0.13, 1).normalize();
      let baseDistance = 0.42;
      let zoomFactor = 1;
      const updateCamera = () => {
        camera.position.copy(cameraDirection).multiplyScalar(baseDistance * zoomFactor);
        camera.lookAt(target);
        camera.updateProjectionMatrix();
      };

      scene.add(new THREE.HemisphereLight(0xffffff, 0xe2d9d2, 1.5));
      const key = new THREE.DirectionalLight(0xffffff, 2.15);
      key.position.set(-0.32, 0.55, 0.65);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xffffff, 0.65);
      fill.position.set(0.5, 0.18, 0.4);
      scene.add(fill);
      const back = new THREE.DirectionalLight(0xfff4e8, 1.35);
      back.position.set(0.05, 0.3, -0.55);
      scene.add(back);

      const scrollGroup = new THREE.Group();
      const manualGroup = new THREE.Group();
      scrollGroup.add(manualGroup);
      scene.add(scrollGroup);

      let frame = 0;
      let visible = true;
      const requestRender = () => {
        if (disposed || !visible || frame) return;
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          if (!disposed && visible) renderer.render(scene, camera);
        });
      };

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const applyProgress = (value: number) => {
        scrollGroup.rotation.y = reduceMotion.matches ? 0 : value * Math.PI * 2;
        requestRender();
      };
      const motionChange = () => applyProgress(latestProgress.current);
      reduceMotion.addEventListener("change", motionChange);
      viewerRef.current = { setProgress: applyProgress };

      const resize = () => {
        const { width, height } = mount.getBoundingClientRect();
        if (!width || !height) return;
        camera.aspect = width / height;
        const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
        baseDistance = Math.max(0.42, 0.1 / (Math.tan(halfFov) * camera.aspect * 0.82));
        updateCamera();
        renderer.setSize(width, height, false);
        requestRender();
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
      const intersectionObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) requestRender();
      });
      intersectionObserver.observe(mount);

      const rotate = (dx: number, dy: number) => {
        const magnitude = Math.hypot(dx, dy);
        if (!magnitude) return;
        // Trackball rotation is independent of the page's scroll rotation.
        const axis = new THREE.Vector3(dy, dx, 0).normalize();
        axis.applyQuaternion(camera.quaternion);
        axis.applyQuaternion(scrollGroup.quaternion.clone().invert());
        const rotation = new THREE.Quaternion().setFromAxisAngle(axis, magnitude * 0.008);
        manualGroup.quaternion.premultiply(rotation).normalize();
        requestRender();
      };
      const zoom = (delta: number) => {
        zoomFactor = THREE.MathUtils.clamp(zoomFactor * Math.exp(delta * 0.008), 0.38, 2.4);
        updateCamera();
        requestRender();
      };

      type Point = { x: number; y: number };
      const touches = new Map<number, Point>();
      let mouse: { id: number; button: number; x: number; y: number } | null = null;
      let touchPair: { x: number; y: number; distance: number } | null = null;
      const pairState = () => {
        const pair = [...touches.values()].slice(0, 2);
        if (pair.length < 2) return null;
        return {
          x: (pair[0].x + pair[1].x) / 2,
          y: (pair[0].y + pair[1].y) / 2,
          distance: Math.hypot(pair[0].x - pair[1].x, pair[0].y - pair[1].y)
        };
      };
      const pointerDown = (event: PointerEvent) => {
        mount.dataset.input = "pointer";
        if (event.pointerType === "touch") {
          touches.set(event.pointerId, { x: event.clientX, y: event.clientY });
          touchPair = pairState();
          return;
        }
        if (event.button !== 0 && event.button !== 2) return;
        event.preventDefault();
        mount.focus({ preventScroll: true });
        mouse = { id: event.pointerId, button: event.button, x: event.clientX, y: event.clientY };
        mount.setPointerCapture(event.pointerId);
      };
      const pointerMove = (event: PointerEvent) => {
        if (event.pointerType === "touch") {
          const previous = touches.get(event.pointerId);
          if (!previous) return;
          touches.set(event.pointerId, { x: event.clientX, y: event.clientY });
          if (touches.size >= 2) {
            const next = pairState();
            if (next && touchPair) {
              rotate(next.x - touchPair.x, next.y - touchPair.y);
              if (next.distance > 0 && touchPair.distance > 0) {
                zoom(Math.log(touchPair.distance / next.distance) / 0.008);
              }
            }
            touchPair = next;
          } else {
            // The browser handles vertical movement as page scrolling.
            rotate(event.clientX - previous.x, 0);
          }
          return;
        }
        if (!mouse || mouse.id !== event.pointerId) return;
        const dx = event.clientX - mouse.x;
        const dy = event.clientY - mouse.y;
        if (mouse.button === 2) zoom(dy);
        else rotate(dx, dy);
        mouse.x = event.clientX;
        mouse.y = event.clientY;
      };
      const pointerEnd = (event: PointerEvent) => {
        if (event.pointerType === "touch") {
          touches.delete(event.pointerId);
          touchPair = pairState();
        } else if (mouse?.id === event.pointerId) {
          mouse = null;
        }
      };
      const contextMenu = (event: MouseEvent) => event.preventDefault();
      // Preserve pointer focus through window/tab switches. Only an actual
      // keyboard navigation action should reveal the focus indicator again.
      const keyboardNavigation = (event: KeyboardEvent) => {
        if (event.key === "Tab" && !event.metaKey && !event.ctrlKey && !event.altKey) {
          delete mount.dataset.input;
        }
      };
      const keyDown = (event: KeyboardEvent) => {
        if (event.metaKey || event.ctrlKey || event.altKey) return;
        delete mount.dataset.input;
        const step = 24;
        if (event.key === "ArrowLeft") rotate(-step, 0);
        else if (event.key === "ArrowRight") rotate(step, 0);
        else if (event.key === "ArrowUp") rotate(0, -step);
        else if (event.key === "ArrowDown") rotate(0, step);
        else if (event.key === "+" || event.key === "=") zoom(-20);
        else if (event.key === "-" || event.key === "_") zoom(20);
        else if (event.key === "Home") {
          manualGroup.quaternion.identity();
          zoomFactor = 1;
          updateCamera();
          requestRender();
        } else return;
        event.preventDefault();
      };
      mount.addEventListener("pointerdown", pointerDown);
      mount.addEventListener("pointermove", pointerMove);
      mount.addEventListener("pointerup", pointerEnd);
      mount.addEventListener("pointercancel", pointerEnd);
      mount.addEventListener("contextmenu", contextMenu);
      mount.addEventListener("keydown", keyDown);
      document.addEventListener("keydown", keyboardNavigation, true);

      const contextLost = (event: Event) => {
        event.preventDefault();
        changeStatus("fallback");
      };
      renderer.domElement.addEventListener("webglcontextlost", contextLost);

      cleanUp = () => {
        viewerRef.current = null;
        if (frame) window.cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        reduceMotion.removeEventListener("change", motionChange);
        mount.removeEventListener("pointerdown", pointerDown);
        mount.removeEventListener("pointermove", pointerMove);
        mount.removeEventListener("pointerup", pointerEnd);
        mount.removeEventListener("pointercancel", pointerEnd);
        mount.removeEventListener("contextmenu", contextMenu);
        mount.removeEventListener("keydown", keyDown);
        document.removeEventListener("keydown", keyboardNavigation, true);
        renderer.domElement.removeEventListener("webglcontextlost", contextLost);
        scene.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          for (const material of materials) {
            const map = (material as MeshPhysicalMaterial).map;
            if (map) {
              const source = map.source.data;
              if (typeof ImageBitmap !== "undefined" && source instanceof ImageBitmap) source.close();
              map.dispose();
            }
            material.dispose();
          }
        });
        renderer.dispose();
        renderer.domElement.remove();
      };

      resize();
      const needsCompactModel = renderer.capabilities.maxTextureSize < 8192 ||
        window.matchMedia("(pointer: coarse)").matches;
      const gltf = await new GLTFLoader().loadAsync(needsCompactModel ? COMPACT_MODEL_URL : MODEL_URL);
      if (disposed) {
        gltf.scene.traverse((object) => {
          const mesh = object as Mesh;
          if (mesh.isMesh) {
            mesh.geometry.dispose();
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((material) => material.dispose());
          }
        });
        return;
      }

      gltf.scene.traverse((object) => {
        const mesh = object as Mesh;
        if (!mesh.isMesh) return;
        const source = mesh.material as MeshPhysicalMaterial;
        const isInner = source.name === "porcelain";
        const isFoot = source.name === "foot";
        if (source.map) {
          source.map.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 16);
          source.map.needsUpdate = true;
        }
        // A clean warm-white interior stays evenly lit at every angle.
        const material = isInner
          ? new THREE.MeshBasicMaterial({ color: source.color, toneMapped: false })
          : new THREE.MeshPhysicalMaterial({
              map: source.map,
              color: source.color,
              metalness: 0,
              roughness: isFoot ? 0.42 : 0.35,
              clearcoat: isFoot ? 0.04 : 0.18,
              clearcoatRoughness: 0.28
            });
        material.name = source.name;
        // The outside keeps a subtle backlighting approximation rather than
        // appearing like transparent glass.
        if (!isInner) material.onBeforeCompile = (shader) => {
          shader.vertexShader = `varying vec3 vCeramicNormal;\nvarying vec3 vCeramicPosition;\n${shader.vertexShader}`;
          shader.vertexShader = shader.vertexShader.replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>\n vCeramicNormal = normalize(mat3(modelMatrix) * normal);\n vCeramicPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;`
          );
          shader.fragmentShader = `varying vec3 vCeramicNormal;\nvarying vec3 vCeramicPosition;\n${shader.fragmentShader}`;
          shader.fragmentShader = shader.fragmentShader.replace(
            "#include <opaque_fragment>",
            `vec3 ceramicNormal = normalize(vCeramicNormal);\n vec3 ceramicView = normalize(cameraPosition - vCeramicPosition);\n vec3 ceramicLight = normalize(vec3(0.05, 0.30, -0.55));\n float ceramicTransmission = pow(max(dot(-ceramicNormal, ceramicLight), 0.0), 1.3);\n float ceramicEdge = pow(1.0 - abs(dot(ceramicNormal, ceramicView)), 3.0);\n outgoingLight += diffuseColor.rgb * vec3(0.16, 0.105, 0.09) * ceramicTransmission * ${isFoot ? "0.18" : "1.0"};\n outgoingLight += vec3(0.025, 0.018, 0.014) * ceramicEdge;\n #include <opaque_fragment>`
          );
        };
        source.dispose();
        mesh.material = material;
      });
      gltf.scene.position.y = -0.0475;
      manualGroup.add(gltf.scene);
      applyProgress(latestProgress.current);
      // Compile and render before removing the photograph, so shader errors and
      // initialization failures leave a usable first screen.
      renderer.render(scene, camera);
      changeStatus("ready");
    }

    initialize().catch((error: unknown) => {
      console.error("Unable to initialize the porcelain viewer", error);
      cleanUp();
      changeStatus("fallback");
    });

    return () => {
      disposed = true;
      cleanUp();
    };
  }, [onStatusChange]);

  return (
    <div className="relative h-full w-full">
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${status === "ready" ? "opacity-0" : "opacity-100"}`}
        aria-hidden={status === "ready"}
      >
        {status === "fallback" ? (
          <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="object-contain object-center" />
        ) : (
          <div className="hero-bowl-poster">
            <picture>
              <source media="(min-aspect-ratio: 9/10)" srcSet="/images/hero-bowl-poster.webp" />
              <source media="(min-aspect-ratio: 13/20)" srcSet="/images/hero-bowl-poster-tablet.webp" />
              <Image
                src="/images/hero-bowl-poster-mobile.webp"
                alt={image.alt}
                width={588}
                height={316}
                priority
                unoptimized
                className="h-auto w-full"
              />
            </picture>
          </div>
        )}
      </div>
      <div
        ref={mountRef}
        tabIndex={status === "ready" ? 0 : -1}
        role="group"
        aria-label="薄胎瓷碗三维近似模型"
        aria-describedby="bowl-interaction-help"
        className={`hero-bowl-control absolute inset-0 touch-pan-y outline-none ${status === "ready" ? "cursor-grab opacity-100 active:cursor-grabbing" : "pointer-events-none opacity-0"}`}
      />
      <p id="bowl-interaction-help" className="sr-only">
        左键拖动旋转，右键上下拖动缩放；方向键旋转，加号和减号缩放，Home 键恢复视角。
        触屏上下滑动浏览页面，横向滑动旋转，双指调整视角和缩放。
      </p>
    </div>
  );
}
