"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function Model({ topRef, animate, reset, resetDuration }) {
  const { scene } = useGLTF("/persimmon.glb");
  const [topPart, setTopPart] = useState(null);
  const [bottomPart, setBottomPart] = useState(null);

  useEffect(() => {
    if (scene && scene.children.length >= 2) {
      const top = scene.children[0]; // Assuming top part is the first child
      const bottom = scene.children[1]; // Assuming bottom part is the second child
      setTopPart(top);
      setBottomPart(bottom);
      topRef.current = top;
    }
  }, [scene, topRef]);

  useEffect(() => {
    if (topPart && animate) {
      // Lift and rotate 90 degrees over 2 seconds
      let startTime = null;
      const duration = 2000; // Animation duration (2 seconds)
      const initialPosition = topPart.position.clone();
      const initialRotation = topPart.rotation.clone();
      const finalPosition = new THREE.Vector3(0, 0.1, 0); // Slight lift, just a tad
      const finalRotation = new THREE.Euler(0, Math.PI / 2, 0); // Rotate 90 degrees

      const animateRotationAndLift = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsedTime = timestamp - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // Interpolate the position and rotation
        topPart.position.lerpVectors(initialPosition, finalPosition, progress);
        topPart.rotation.set(
          initialRotation.x + (finalRotation.x - initialRotation.x) * progress,
          initialRotation.y + (finalRotation.y - initialRotation.y) * progress,
          initialRotation.z + (finalRotation.z - initialRotation.z) * progress
        );

        if (progress < 1) {
          requestAnimationFrame(animateRotationAndLift);
        }
      };

      // Start the animation
      requestAnimationFrame(animateRotationAndLift);
    }
  }, [animate, topPart]);

  useEffect(() => {
    if (topPart && reset) {
      // Slow rotation back to the original position over the given duration
      let startTime = null;
      const duration = resetDuration * 60 * 1000; // Convert minutes to milliseconds
      const initialRotation = topPart.rotation.clone();
      const finalRotation = new THREE.Euler(0, 0, 0); // Rotate back to original angle

      const animateResetRotation = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsedTime = timestamp - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        topPart.rotation.set(
          initialRotation.x + (finalRotation.x - initialRotation.x) * progress,
          initialRotation.y + (finalRotation.y - initialRotation.y) * progress,
          initialRotation.z + (finalRotation.z - initialRotation.z) * progress
        );

        if (progress < 1) {
          requestAnimationFrame(animateResetRotation);
        }
      };

      // Start the slow reset rotation
      requestAnimationFrame(animateResetRotation);
    }
  }, [reset, topPart, resetDuration]);

  return (
    <>
      {/* Render both top and bottom parts */}
      {topPart && <primitive object={topPart} />}
      {bottomPart && <primitive object={bottomPart} />}
    </>
  );
}

export default function Home() {
  const topRef = useRef(null);
  const [animate, setAnimate] = useState(false);
  const [reset, setReset] = useState(false);
  const [resetDuration, setResetDuration] = useState(30); // Default to 30 minutes

  const handleClick = (minutes) => {
    setResetDuration(minutes); // Set the duration for reset based on the selected button
    setAnimate(true);
    setTimeout(() => {
      setReset(true); // Start resetting after initial animation
    }, 2000); // Wait for the initial 2-second animation to complete before starting reset
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

      {/* Buttons */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <button
          onClick={() => handleClick(5)}
          style={{
            padding: "10px 20px",
            fontSize: "18px",
            margin: "5px",
          }}
        >
          5
        </button>
        <button
          onClick={() => handleClick(15)}
          style={{
            padding: "10px 20px",
            fontSize: "18px",
            margin: "5px",
          }}
        >
          15
        </button>
        <button
          onClick={() => handleClick(30)}
          style={{
            padding: "10px 20px",
            fontSize: "18px",
            margin: "5px",
          }}
        >
          30
        </button>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 2]} intensity={1} />
        <Model topRef={topRef} animate={animate} reset={reset} resetDuration={resetDuration} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
