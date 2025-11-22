import React, { useState, useEffect } from "react";

// ================= STYLES =================
const styles = {
  container: {
    fontFamily: "'Segoe UI', Helvetica, Arial, sans-serif",
    backgroundColor: "#f4f7f6",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px",
    color: "#333",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
    maxWidth: "800px",
  },
  title: {
    fontSize: "2rem",
    color: "#2c3e50",
    margin: "0 0 10px 0",
  },
  subtitle: {
    color: "#7f8c8d",
    fontSize: "1.1rem",
    fontWeight: "300",
  },
  simulationBox: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "800px",
  },
  controls: {
    display: "flex",
    gap: "20px",
    marginTop: "30px",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  button: {
    padding: "15px 30px",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textTransform: "uppercase",
    letterSpacing: "1px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  specSheet: {
    marginTop: "40px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    width: "100%",
    maxWidth: "800px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
  },
  specItem: {
    fontSize: "14px",
    borderBottom: "1px solid #f0f0f0",
    padding: "10px 0",
    display: "flex",
    justifyContent: "space-between",
  },
};

// ================= SVG GRADIENTS & TEXTURES =================
const MetallicDefs = () => (
  <defs>
    {/* Aluminum Body Gradient */}
    <linearGradient id="alumBody" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#e0e0e0" />
      <stop offset="20%" stopColor="#ffffff" />
      <stop offset="50%" stopColor="#d6d6d6" />
      <stop offset="100%" stopColor="#b0b0b0" />
    </linearGradient>

    {/* Chrome Rod Gradient (Horizontal reflection) */}
    <linearGradient id="chromeRod" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#888" />
      <stop offset="30%" stopColor="#fff" />
      <stop offset="50%" stopColor="#eee" />
      <stop offset="70%" stopColor="#fff" />
      <stop offset="100%" stopColor="#777" />
    </linearGradient>

    {/* Dark Shadow for Holes */}
    <radialGradient id="holeShadow">
      <stop offset="80%" stopColor="#333" />
      <stop offset="100%" stopColor="#666" />
    </radialGradient>
  </defs>
);

// ================= COMPONENT: TWIN ROD CYLINDER =================
const TwinRodCylinder = ({ extensionPercent, isExtended }) => {
  // extensionPercent: 0 to 100
  // Visual Max Stroke in pixels
  const MAX_STROKE_PX = 120;
  const currentOffset = (extensionPercent / 100) * MAX_STROKE_PX;

  // Pressure Colors
  const pressureColor = "rgba(231, 76, 60, 0.6)"; // Red
  const exhaustColor = "rgba(52, 152, 219, 0.2)"; // Blue

  // Logic:
  // Extended = Pressure at Rear (Port A), Exhaust at Front (Port B)
  // Retracted = Pressure at Front (Port B), Exhaust at Rear (Port A)
  const rearPortHigh = isExtended;
  const frontPortHigh = !isExtended;

  return (
    <svg
      width="600"
      height="300"
      viewBox="0 0 600 300"
      style={{ overflow: "visible" }}
    >
      <MetallicDefs />

      {/* === TUBING CONNECTIONS (Behind cylinder) === */}
      {/* Rear Port Tubing (Left side of body) */}
      <path
        d="M 180,180 C 180,220 100,220 100,260"
        stroke={rearPortHigh ? "#e74c3c" : "#3498db"}
        strokeWidth="6"
        fill="none"
      />
      {/* Front Port Tubing (Right side of body) */}
      <path
        d="M 300,180 C 300,220 380,220 380,260"
        stroke={frontPortHigh ? "#e74c3c" : "#3498db"}
        strokeWidth="6"
        fill="none"
      />

      {/* === MAIN CYLINDER BODY (The Stator) === */}
      <g transform="translate(150, 80)">
        {/* Main Block */}
        <rect
          x="0"
          y="0"
          width="200"
          height="100"
          rx="5"
          fill="url(#alumBody)"
          stroke="#7f8c8d"
          strokeWidth="2"
        />

        {/* Mounting Holes (Top) - Matching the image */}
        <circle cx="50" cy="25" r="6" fill="url(#holeShadow)" stroke="#999" />
        <circle cx="150" cy="25" r="6" fill="url(#holeShadow)" stroke="#999" />
        <circle cx="100" cy="50" r="4" fill="url(#holeShadow)" stroke="#999" />
        <circle cx="50" cy="75" r="6" fill="url(#holeShadow)" stroke="#999" />
        <circle cx="150" cy="75" r="6" fill="url(#holeShadow)" stroke="#999" />

        {/* Side Ports (Visual representation on the side face) */}
        <circle cx="30" cy="100" r="5" fill="#333" />
        <text x="25" y="120" fontSize="10" fill="#555">
          Rear Port
        </text>

        <circle cx="150" cy="100" r="5" fill="#333" />
        <text x="145" y="120" fontSize="10" fill="#555">
          Front Port
        </text>

        {/* Rod Guide Holes (Front Face) */}
        <ellipse cx="200" cy="30" rx="5" ry="10" fill="#555" />
        <ellipse cx="200" cy="70" rx="5" ry="10" fill="#555" />
      </g>

      {/* === MOVING ASSEMBLY (Rods + Plate) === */}
      {/* Translate X moves the whole assembly based on stroke */}
      <g transform={`translate(${150 + currentOffset}, 80)`}>
        {/* Rod 1 (Top) - Drawn 'behind' the plate but logically connected */}
        {/* It slides INSIDE the body, so we clip it or just draw it starting from inside */}
        {/* To simulate sliding out, we draw the rod relative to the moving plate, extending backwards into the body */}
        <rect
          x="-180"
          y="22"
          width="200"
          height="16"
          fill="url(#chromeRod)"
          stroke="#555"
          strokeWidth="1"
        />

        {/* Rod 2 (Bottom) */}
        <rect
          x="-180"
          y="62"
          width="200"
          height="16"
          fill="url(#chromeRod)"
          stroke="#555"
          strokeWidth="1"
        />

        {/* Front Plate (The connecting block) */}
        <g transform="translate(20, 0)">
          {/* The Plate Block */}
          <rect
            x="0"
            y="10"
            width="30"
            height="80"
            rx="3"
            fill="url(#alumBody)"
            stroke="#7f8c8d"
            strokeWidth="2"
          />
          {/* Hex Bolts on Front Plate (as seen in image) */}
          <circle cx="15" cy="30" r="6" fill="#ddd" stroke="#777" />
          <circle cx="15" cy="70" r="6" fill="#ddd" stroke="#777" />
          {/* Hex detail */}
          <path
            d="M 15,26 L 18,28 L 18,32 L 15,34 L 12,32 L 12,28 Z"
            fill="none"
            stroke="#555"
          />
          <path
            d="M 15,66 L 18,68 L 18,72 L 15,74 L 12,72 L 12,68 Z"
            fill="none"
            stroke="#555"
          />
        </g>
      </g>

      {/* === SOLENOID VALVE SYMBOL === */}
      <g transform="translate(80, 260)">
        <rect
          x="0"
          y="0"
          width="320"
          height="60"
          rx="4"
          fill="#34495e"
          stroke="#2c3e50"
          strokeWidth="2"
        />
        <text
          x="160"
          y="35"
          textAnchor="middle"
          fill="white"
          fontFamily="monospace"
          fontSize="14"
        >
          5/2 SOLENOID VALVE
        </text>
        {/* Indicators */}
        <circle cx="20" cy="30" r="8" fill={isExtended ? "#e74c3c" : "#555"} />
        <text x="35" y="35" fill="white" fontSize="10">
          SOL A
        </text>
      </g>

      {/* Labels */}
      <text x="150" y="50" fontSize="12" fill="#7f8c8d">
        Fixed Body
      </text>
      <text x={180 + currentOffset} y="50" fontSize="12" fill="#7f8c8d">
        Moving Plate
      </text>
    </svg>
  );
};

// ================= MAIN APP COMPONENT =================
const DualRodCylinderDemo = () => {
  const [isExtended, setIsExtended] = useState(false);
  const [extensionLevel, setExtensionLevel] = useState(0);

  // Animation Physics Loop
  useEffect(() => {
    let animationFrame;
    const animate = () => {
      setExtensionLevel((prev) => {
        const target = isExtended ? 100 : 0;
        const speed = 4; // Animation speed
        const diff = target - prev;

        if (Math.abs(diff) < speed) return target;
        return prev + (diff > 0 ? speed : -speed);
      });
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [isExtended]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Dual Rod Pneumatic Cylinder</h1>
        <div style={styles.subtitle}>
          Series CXS / TN Style • Non-Rotating Double Piston
        </div>
      </div>

      <div style={styles.simulationBox}>
        {/* The Visual Component */}
        <TwinRodCylinder
          extensionPercent={extensionLevel}
          isExtended={isExtended}
        />

        {/* The Control Panel */}
        <div style={styles.controls}>
          <button
            style={{
              ...styles.button,
              backgroundColor: isExtended ? "#95a5a6" : "#2ecc71",
              color: "white",
            }}
            onClick={() => setIsExtended(true)}
            disabled={isExtended}
          >
            Example: Extend ➜
          </button>

          <button
            style={{
              ...styles.button,
              backgroundColor: !isExtended ? "#95a5a6" : "#e74c3c",
              color: "white",
            }}
            onClick={() => setIsExtended(false)}
            disabled={!isExtended}
          >
            Example: Retract ⬅
          </button>
        </div>

        <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
          Current Status:{" "}
          <strong>
            {extensionLevel === 0
              ? "Fully Retracted"
              : extensionLevel === 100
              ? "Fully Extended"
              : "Moving..."}
          </strong>
        </div>
      </div>

      {/* Technical Specs Section */}
      <div style={styles.specSheet}>
        <h3
          style={{
            gridColumn: "1 / -1",
            margin: "0 0 10px 0",
            color: "#2c3e50",
          }}
        >
          Technical Specifications
        </h3>

        <div style={styles.specItem}>
          <span>
            <strong>Mechanism:</strong>
          </span>
          <span>Double Acting, Twin Rod</span>
        </div>
        <div style={styles.specItem}>
          <span>
            <strong>Advantage:</strong>
          </span>
          <span>High Non-Rotating Accuracy (±0.1°)</span>
        </div>
        <div style={styles.specItem}>
          <span>
            <strong>Fluid:</strong>
          </span>
          <span>Compressed Air</span>
        </div>
        <div style={styles.specItem}>
          <span>
            <strong>Operating Pressure:</strong>
          </span>
          <span>0.15 ~ 0.7 MPa</span>
        </div>
        <div style={styles.specItem}>
          <span>
            <strong>Piston Speed:</strong>
          </span>
          <span>50 ~ 500 mm/s</span>
        </div>
        <div style={styles.specItem}>
          <span>
            <strong>Application:</strong>
          </span>
          <span>Pick & Place, Pushing, Lifting</span>
        </div>
      </div>

      <p
        style={{
          maxWidth: "600px",
          textAlign: "center",
          marginTop: "30px",
          lineHeight: "1.6",
          color: "#555",
        }}
      >
        <strong>How it works:</strong> This cylinder features two parallel
        piston rods integrated into a single body. This design prevents rotation
        of the tooling plate without needing external guides. When the{" "}
        <strong>Solenoid Valve</strong> activates, air pressure enters the rear
        port, pushing both pistons forward simultaneously.
      </p>
    </div>
  );
};

export default DualRodCylinderDemo;
