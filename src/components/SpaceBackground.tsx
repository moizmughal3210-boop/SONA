"use client";
import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float time;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

float noise(vec2 x) {
    vec2 i = floor(x);
    vec2 f = fract(x);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; ++i) {
        v += a * noise(p);
        p = rot * p * 2.0 + vec2(100.0);
        a *= 0.5;
    }
    return v;
}

void main() {
  float latitude = vUv.y * 3.14159;
  float longitude = vUv.x * 6.28318;
  
  // Cloud bands
  float bandNoise = fbm(vec2(longitude * 3.0, latitude * 10.0 + time * 0.05));
  float band = sin(latitude * 15.0 + bandNoise * 2.0) * 0.5 + 0.5;
  
  // Great Red Spot
  vec2 spotCenter = vec2(0.65, 0.4);
  vec2 delta = vec2(vUv.x - spotCenter.x, (vUv.y - spotCenter.y) * 2.0);
  if(delta.x > 0.5) delta.x -= 1.0;
  if(delta.x < -0.5) delta.x += 1.0;
  float distToSpot = length(delta * vec2(3.0, 1.0));
  float spotSwirl = fbm(vec2(longitude * 10.0, latitude * 10.0 + time * 0.1));
  float spot = smoothstep(0.15, 0.05, distToSpot + spotSwirl * 0.05);

  // Palette: Cream, Beige, Tan, Brown
  vec3 colorCream = vec3(0.95, 0.92, 0.86);
  vec3 colorTan = vec3(0.85, 0.78, 0.68);
  vec3 colorBrown = vec3(0.65, 0.52, 0.43);
  vec3 colorRedSpot = vec3(0.75, 0.45, 0.35);

  vec3 surfaceColor = mix(colorCream, colorTan, band);
  surfaceColor = mix(surfaceColor, colorBrown, fbm(vec2(longitude * 5.0, latitude * 8.0)) * 0.8);
  surfaceColor = mix(surfaceColor, colorRedSpot, spot);

  // Volumetric Lighting
  vec3 lightDir = normalize(vec3(-2.0, 1.0, 2.0));
  float diffuse = max(dot(vNormal, lightDir), 0.0);
  float terminator = smoothstep(0.0, 0.5, diffuse);
  
  // Atmospheric scattering Rim
  float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
  rim = smoothstep(0.6, 1.0, rim) * terminator;
  vec3 rimColor = vec3(0.9, 0.8, 0.7) * rim * 0.4;

  vec3 finalColor = surfaceColor * terminator * 1.2 + vec3(0.02, 0.02, 0.03);
  
  gl_FragColor = vec4(finalColor + rimColor, 1.0);
}
`;

function Jupiter() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ time: { value: 0 } }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime * 0.3;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={[6, 0, -15]} rotation={[0.1, 0, 0.1]}>
      <sphereGeometry args={[8, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

function Starfield() {
  const pointsRef = useRef<THREE.Points>(null);
  const [positions, colors] = useMemo(() => {
    const pos = [];
    const col = [];
    for (let i = 0; i < 3000; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 60 - 20;
      pos.push(x, y, z);
      const intensity = 0.5 + Math.random() * 0.5;
      col.push(intensity, intensity * 0.95, intensity * 0.9);
    }
    return [new Float32Array(pos), new Float32Array(col)];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.005;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach={"attributes-position"} count={positions.length / 3} array={positions} itemSize={3} args={[positions, 3]} />
        <bufferAttribute attach={"attributes-color"} count={colors.length / 3} array={colors} itemSize={3} args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.1} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

function CameraRig() {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, (state.pointer.x * state.viewport.width) / 40, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, (state.pointer.y * state.viewport.height) / 40, 0.05);
    state.camera.lookAt(0, 0, -10);
  });
  return null;
}

export default function SpaceBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="fixed inset-0 bg-[#0A0B0E] -z-10" />;

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-[#0A0B0E]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.1} />
        <Starfield />
        <CameraRig />
      </Canvas>
    </div>
  );
}
