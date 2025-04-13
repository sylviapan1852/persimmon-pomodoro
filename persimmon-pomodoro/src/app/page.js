"use client";

import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function Model({ topRef }) {
  const { scene } = useGLTF("/persimmon.glb");

  useEffect(() => {
    if (scene && scene.children.length >= 2) {
      topRef.current = scene.children[0]; // Adjust this if the top part is a different child
    }
  }, [scene, topRef]);

  return <primitive object={scene} />;
}

export default function Home() {
  const topRef = useRef(null);

  const rotateTop = () => {
    if (topRef.current) {
      topRef.current.rotation.y += Math.PI / 2; // Rotate 90 degrees
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Static Text Overlay */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          width: "100%",
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "bold",
          color: "black",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        sylp's persimmon pomodoro
      </div>

      {/* Button */}
      <button
        onClick={rotateTop}
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px 20px",
          fontSize: "18px",
          zIndex: 10,
        }}
      >
        30
      </button>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 2]} intensity={1} />
        <Model topRef={topRef} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
