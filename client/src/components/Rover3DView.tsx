import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Stage } from '@react-three/drei';
import Widget from '../components/Widget';
import { useSocket } from '../hooks/useSocket';
import * as THREE from 'three';
import { BrainCircuit } from 'lucide-react';

// Simple low-poly rover model component
const RoverModel = ({ orientation }: { orientation: { pitch: number, roll: number, yaw: number } }) => {
    const meshRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (meshRef.current) {
            // Smoothly interpolate rotation
            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, orientation.pitch, 0.1);
            meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, orientation.roll, 0.1);
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, THREE.MathUtils.degToRad(orientation.yaw), 0.1);
        }
    });

    return (
        <group ref={meshRef}>
            {/* Chassis - White Modern Look */}
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[1.5, 0.5, 2]} />
                <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.2} />
            </mesh>

            {/* Solar Panel - Dark Blue Glass */}
            <mesh position={[0, 0.76, 0]} rotation={[-0.1, 0, 0]}>
                <boxGeometry args={[1.4, 0.05, 1.8]} />
                <meshStandardMaterial color="#002244" roughness={0.1} metalness={0.9} />
            </mesh>
            <gridHelper args={[1.4, 4, 0x00ccff, 0x00ccff]} position={[0, 0.79, 0]} rotation={[-0.1, 0, 0]} />

            {/* Wheels - Technical Grey */}
            {[[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([x, z], i) => (
                <mesh key={i} position={[x, 0.4, z]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.4, 0.4, 0.5, 16]} />
                    <meshStandardMaterial color="#334155" />
                </mesh>
            ))}

            {/* Camera/Sensor Mast - Accent Color */}
            <mesh position={[0, 1, 0.8]}>
                <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
                <meshStandardMaterial color="#cbd5e1" />
            </mesh>
            <mesh position={[0, 1.5, 0.8]}>
                <boxGeometry args={[0.6, 0.3, 0.3]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
            {/* Sensor Eyes */}
            <mesh position={[0.15, 1.5, 0.95]}>
                <sphereGeometry args={[0.08]} />
                <meshStandardMaterial color="#00ccff" emissive="#00ccff" emissiveIntensity={2} />
            </mesh>
            <mesh position={[-0.15, 1.5, 0.95]}>
                <sphereGeometry args={[0.08]} />
                <meshStandardMaterial color="#00ccff" emissive="#00ccff" emissiveIntensity={2} />
            </mesh>
        </group>
    );
};

const Rover3DView = () => {
    const { socket } = useSocket();
    const [orientation, setOrientation] = useState({ pitch: 0, roll: 0, yaw: 0 });
    const [aiState, setAiState] = useState("ANALYZING TERRAIN");

    useEffect(() => {
        if (!socket) return;
        const handleTelemetry = (data: any) => {
            if (data.orientation) setOrientation(data.orientation);
            if (data.mode === 'AUTONOMOUS') {
                if (Math.random() > 0.7) setAiState("CALCULATING PATH");
                else if (Math.random() > 0.8) setAiState("AVOIDING OBSTACLE");
                else setAiState("ANALYZING TERRAIN");
            } else {
                setAiState("STANDBY - MANUAL OVERRIDE");
            }
        };
        socket.on('rover:telemetry', handleTelemetry);
        return () => { socket.off('rover:telemetry', handleTelemetry); };
    }, [socket]);

    return (
        <Widget
            title="Digital Twin Visualization"
            className="h-[400px] border-neo-primary/20 shadow-lg"
            action={
                <div className="flex items-center gap-2 px-3 py-1 bg-neo-primary/10 rounded-full border border-neo-primary/20">
                    <BrainCircuit className="w-4 h-4 text-neo-primary animate-pulse" />
                    <span className="text-xs font-bold text-neo-primary tracking-wide">{aiState}</span>
                </div>
            }
        >
            <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-input relative">
                <Canvas shadows camera={{ position: [3, 3, 3], fov: 50 }}>
                    <ambientLight intensity={0.8} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} />
                    <spotLight position={[-10, 10, -5]} angle={0.3} penumbra={1} intensity={2} castShadow color="#ffffff" />

                    <Stage environment="city" intensity={0.5} adjustCamera={false}>
                        <RoverModel orientation={orientation} />
                    </Stage>

                    <Grid infiniteGrid fadeDistance={40} sectionColor="#94a3b8" cellColor="#cbd5e1" sectionThickness={1} cellThickness={0.5} />
                    <OrbitControls autoRotate autoRotateSpeed={0.5} />
                </Canvas>

                {/* Data Overlay */}
                <div className="absolute top-4 right-4 text-right font-mono text-xs text-slate-500 space-y-1 bg-white/80 p-2 rounded backdrop-blur-sm border border-slate-200 shadow-sm">
                    <div className="font-bold text-slate-700 mb-1">IMU DATA</div>
                    <div>PITCH: <span className="text-neo-primary">{(orientation.pitch * 57.29).toFixed(1)}°</span></div>
                    <div>ROLL: <span className="text-neo-primary">{(orientation.roll * 57.29).toFixed(1)}°</span></div>
                    <div>YAW: <span className="text-neo-primary">{orientation.yaw.toFixed(1)}°</span></div>
                </div>
            </div>
        </Widget>
    );
};

export default Rover3DView;
