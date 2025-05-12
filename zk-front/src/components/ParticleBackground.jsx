import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ParticleBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Crear la escena
    const scene = new THREE.Scene();

    // Crear la cámara
    const camera = new THREE.PerspectiveCamera(
      40,
      mount.clientWidth / mount.clientHeight,
      0.1,
      10000
    );
    camera.position.z = 5;

    // Crear el renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff, 1); // Fondo blanco
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Generar una textura circular violeta
    const generateCircleTexture = () => {
      const size = 50;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");

      context.beginPath();
      context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      context.fillStyle = "#8e44ad"; // Violeta
      context.fill();

      return new THREE.CanvasTexture(canvas);
    };

    const circleTexture = generateCircleTexture();

    // Crear partículas
    const particleCount = 5000;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x8e44ad, // Violeta
      size: 0.02,
      sizeAttenuation: true,
      map: circleTexture,
      transparent: true,
      depthWrite: false,
    });

    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Animación: caída vertical
    const animate = () => {
      requestAnimationFrame(animate);

      const pos = particlesGeometry.attributes.position.array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] -= 0.002;
        if (pos[i] < -5) {
          pos[i] = 5;
        }
      }

      particlesGeometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    />
  );
};

export default ParticleBackground;
