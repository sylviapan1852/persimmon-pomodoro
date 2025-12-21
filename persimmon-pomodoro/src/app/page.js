"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function Model({ topRef, animate, reset, resetDuration }) {
  const { scene } = useGLTF("/persimmon-pomodoro/persimmon.glb");
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
  const [activeButton, setActiveButton] = useState(null);
  const [durations, setDurations] = useState([5, 15, 30]);
  const [showSettings, setShowSettings] = useState(false);
  const [durationInput, setDurationInput] = useState(durations.join(", "));


  const handleClick = (minutes) => {
    setResetDuration(minutes); // Set the duration for reset based on the selected button
    setAnimate(true);
    setActiveButton(minutes);
    setReset(false);
    setTimeout(() => {
      setReset(true);     // Start the reset after animation
      setAnimate(false);  // Clear animate so it can be triggered again later
  
      setTimeout(() => {
        setReset(false);       // Clear reset to allow retriggering
        setActiveButton(null); // Unhighlight the button
      }, minutes * 60 * 1000);  // Wait for full duration of the timer
    }, 2000);
    
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Static Text Overlay */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          width: "100%",
          textAlign: "center",
          fontSize: "30px",
          fontWeight: "bold",
          color: "black",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        a persimmon pomodoro
      </div>

      {/* Buttons */}
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
        }}
      >
        {durations.map((minutes) => (
          <button
            key={minutes}
            onClick={() => handleClick(minutes)}
            style={{
              padding: "10px 20px",
              fontSize: "25px",
              fontWeight: "bold",
              margin: "10px",
              color: activeButton === minutes ? "#E79F51FF" : "black",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            {minutes}
          </button>
        ))}

        {showSettings && (
          <div
            style={{
              position: "absolute",
              bottom: "27%",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#f5f5f5",
              padding: "12px 16px",
              borderRadius: "8px",
              zIndex: 11,
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            }}
          >
            <div style={{ fontSize: "14px", marginBottom: "6px", color: "#666" }}>
              Edit durations (minutes, comma-separated)
            </div>

            <input
              value={durationInput}
              onChange={(e) => setDurationInput(e.target.value)}
              style={{
                width: "200px",
                padding: "6px",
                fontSize: "14px",
              }}
            />

            <div style={{ marginTop: "8px", textAlign: "right" }}>
              <button
                onClick={() => {
                  const parsed = durationInput
                    .split(",")
                    .map((v) => parseInt(v.trim(), 10))
                    .filter((v) => !isNaN(v) && v > 0);

                  if (parsed.length) {
                    setDurations(parsed);
                    setShowSettings(false);
                  }
                }}
                style={{
                  fontSize: "14px",
                  border: "none",
                  background: "#ddd",
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </div>
        )}


        {/* Cog button */}
        <button
          onClick={() => setShowSettings((v) => !v)}
          style={{
            marginLeft: "10px",
            fontSize: "18px",
            color: "#999",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          aria-label="Edit durations"
        >
          ⚙️
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
