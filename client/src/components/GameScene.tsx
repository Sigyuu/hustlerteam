import { Canvas } from "@react-three/fiber";
import { OrbitControls, KeyboardControls } from "@react-three/drei";
import { Suspense, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "../lib/stores/useGameStore";
import { useLevelStore } from "../lib/stores/useLevelStore";
import { useAchievementStore } from "../lib/stores/useAchievementStore";
import { checkWinCondition } from "../lib/gameLogic";

// Control mapping for keyboard input
enum Controls {
  forward = 'forward',
  backward = 'backward',
  left = 'left',
  right = 'right',
  select = 'select',
  confirm = 'confirm',
  cancel = 'cancel'
}

const keyMap = [
  { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
  { name: Controls.backward, keys: ['ArrowDown', 'KeyS'] },
  { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
  { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
  { name: Controls.select, keys: ['Space'] },
  { name: Controls.confirm, keys: ['Enter'] },
  { name: Controls.cancel, keys: ['Escape'] }
];

// Game board component
function GameBoard() {
  const { gameMode, cursor, setCursor, selectedBlock, setSelectedBlock } = useGameStore();
  const { currentLevel, updateLevel } = useLevelStore();
  const { unlockAchievement } = useAchievementStore();
  const [subscribe, getState] = useKeyboardControls<Controls>();
  const boardRef = useRef<THREE.Group>(null);
  const lastKeyPress = useRef<number>(0);

  // Handle keyboard input with debouncing
  useFrame(() => {
    const now = Date.now();
    if (now - lastKeyPress.current < 150) return; // Debounce 150ms

    const controls = getState();
    let moved = false;

    if (controls.forward && cursor.z > 0) {
      setCursor({ ...cursor, z: cursor.z - 1 });
      moved = true;
    }
    if (controls.backward && cursor.z < 7) {
      setCursor({ ...cursor, z: cursor.z + 1 });
      moved = true;
    }
    if (controls.left && cursor.x > 0) {
      setCursor({ ...cursor, x: cursor.x - 1 });
      moved = true;
    }
    if (controls.right && cursor.x < 7) {
      setCursor({ ...cursor, x: cursor.x + 1 });
      moved = true;
    }

    if (moved) {
      lastKeyPress.current = now;
      console.log(`Cursor moved to: ${cursor.x}, ${cursor.z}`);
    }

    // Handle block selection and placement
    if (controls.select) {
      lastKeyPress.current = now;
      
      if (gameMode === "playing") {
        // In play mode, try to move blocks
        const blockAtCursor = currentLevel.blocks.find(
          block => block.x === cursor.x && block.z === cursor.z
        );
        
        if (blockAtCursor && !selectedBlock) {
          setSelectedBlock(blockAtCursor);
          console.log("Block selected:", blockAtCursor);
        } else if (selectedBlock) {
          // Try to move selected block to cursor position
          const newBlocks = currentLevel.blocks.map(block => 
            block.id === selectedBlock.id 
              ? { ...block, x: cursor.x, z: cursor.z }
              : block
          );
          
          updateLevel({ ...currentLevel, blocks: newBlocks });
          setSelectedBlock(null);
          
          // Check win condition
          if (checkWinCondition(newBlocks, currentLevel.goal)) {
            unlockAchievement("level_complete");
            console.log("Level completed!");
          }
        }
      } else if (gameMode === "editor") {
        // In editor mode, place/remove blocks
        const existingBlock = currentLevel.blocks.find(
          block => block.x === cursor.x && block.z === cursor.z
        );
        
        if (existingBlock) {
          // Remove block
          const newBlocks = currentLevel.blocks.filter(block => block.id !== existingBlock.id);
          updateLevel({ ...currentLevel, blocks: newBlocks });
        } else {
          // Add new block
          const newBlock = {
            id: Date.now().toString(),
            x: cursor.x,
            z: cursor.z,
            y: 0,
            color: '#3B82F6',
            type: 'movable' as const
          };
          updateLevel({ ...currentLevel, blocks: [...currentLevel.blocks, newBlock] });
        }
      }
    }

    if (controls.cancel && selectedBlock) {
      setSelectedBlock(null);
      lastKeyPress.current = now;
    }
  });

  return (
    <group ref={boardRef}>
      {/* Game board platform */}
      <mesh position={[3.5, -0.5, 3.5]} receiveShadow>
        <boxGeometry args={[8, 1, 8]} />
        <meshStandardMaterial color="#E5E7EB" />
      </mesh>

      {/* Grid lines */}
      {Array.from({ length: 9 }, (_, i) => (
        <group key={`grid-${i}`}>
          {/* Vertical lines */}
          <mesh position={[i, 0.01, 3.5]}>
            <boxGeometry args={[0.02, 0.02, 8]} />
            <meshBasicMaterial color="#9CA3AF" />
          </mesh>
          {/* Horizontal lines */}
          <mesh position={[3.5, 0.01, i]}>
            <boxGeometry args={[8, 0.02, 0.02]} />
            <meshBasicMaterial color="#9CA3AF" />
          </mesh>
        </group>
      ))}

      {/* Game blocks */}
      {currentLevel.blocks.map((block) => (
        <mesh
          key={block.id}
          position={[block.x, block.y + 0.5, block.z]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.8, 1, 0.8]} />
          <meshStandardMaterial 
            color={selectedBlock?.id === block.id ? "#F59E0B" : block.color}
            emissive={selectedBlock?.id === block.id ? "#F59E0B" : "#000000"}
            emissiveIntensity={selectedBlock?.id === block.id ? 0.2 : 0}
          />
        </mesh>
      ))}

      {/* Goal areas */}
      {currentLevel.goal?.targetPositions?.map((pos, index) => (
        <mesh
          key={`goal-${index}`}
          position={[pos.x, 0.02, pos.z]}
          receiveShadow
        >
          <boxGeometry args={[0.9, 0.04, 0.9]} />
          <meshStandardMaterial 
            color="#10B981" 
            transparent 
            opacity={0.6}
            emissive="#10B981"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}

      {/* Cursor indicator */}
      <mesh position={[cursor.x, 0.05, cursor.z]}>
        <boxGeometry args={[0.95, 0.1, 0.95]} />
        <meshBasicMaterial 
          color="#EF4444" 
          transparent 
          opacity={0.4}
          emissive="#EF4444"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

// Lighting setup
function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.3} />
    </>
  );
}

export function GameScene() {
  return (
    <div className="w-full h-full">
      <KeyboardControls map={keyMap}>
        <Canvas
          shadows
          camera={{
            position: [8, 8, 8],
            fov: 60,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            powerPreference: "default"
          }}
        >
          <color attach="background" args={["#F3F4F6"]} />
          <Lights />
          
          <Suspense fallback={null}>
            <GameBoard />
          </Suspense>
          
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={6}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2.2}
            target={[3.5, 0, 3.5]}
          />
        </Canvas>
      </KeyboardControls>
    </div>
  );
}
