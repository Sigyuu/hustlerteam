import { GameLevel, LevelGoal } from "./stores/useLevelStore";
import { GameBlock } from "./stores/useGameStore";

/**
 * Generate an empty level template
 */
export function generateEmptyLevel(): GameLevel {
  return {
    id: `level-${Date.now()}`,
    name: "New Level",
    description: "A custom level waiting to be designed",
    difficulty: "easy",
    blocks: [],
    goal: {
      type: "move_blocks",
      targetPositions: []
    }
  };
}

/**
 * Create sample levels for tutorial and demonstration
 */
export function generateSampleLevels(): GameLevel[] {
  return [
    {
      id: "tutorial-1",
      name: "First Steps",
      description: "Learn the basics - move the blue block to the goal",
      difficulty: "easy",
      blocks: [
        {
          id: "block-1",
          x: 1,
          y: 0,
          z: 1,
          color: "#3B82F6",
          type: "movable"
        }
      ],
      goal: {
        type: "move_blocks",
        targetPositions: [{ x: 6, z: 6 }]
      }
    },
    {
      id: "tutorial-2",
      name: "Two Blocks",
      description: "Move both blocks to their matching goal areas",
      difficulty: "easy",
      blocks: [
        {
          id: "block-1",
          x: 1,
          y: 0,
          z: 1,
          color: "#3B82F6",
          type: "movable"
        },
        {
          id: "block-2",
          x: 2,
          y: 0,
          z: 1,
          color: "#EF4444",
          type: "movable"
        }
      ],
      goal: {
        type: "move_blocks",
        targetPositions: [
          { x: 5, z: 5 },
          { x: 6, z: 5 }
        ]
      }
    },
    {
      id: "tutorial-3",
      name: "Navigation Challenge",
      description: "Navigate around obstacles to reach the goal",
      difficulty: "medium",
      blocks: [
        {
          id: "movable-1",
          x: 0,
          y: 0,
          z: 0,
          color: "#3B82F6",
          type: "movable"
        },
        {
          id: "obstacle-1",
          x: 3,
          y: 0,
          z: 1,
          color: "#6B7280",
          type: "fixed"
        },
        {
          id: "obstacle-2",
          x: 3,
          y: 0,
          z: 2,
          color: "#6B7280",
          type: "fixed"
        },
        {
          id: "obstacle-3",
          x: 3,
          y: 0,
          z: 3,
          color: "#6B7280",
          type: "fixed"
        }
      ],
      goal: {
        type: "move_blocks",
        targetPositions: [{ x: 7, z: 2 }]
      }
    },
    {
      id: "tutorial-4",
      name: "Color Coordination",
      description: "Place each colored block in its matching area",
      difficulty: "medium",
      blocks: [
        {
          id: "red-block",
          x: 0,
          y: 0,
          z: 0,
          color: "#EF4444",
          type: "movable"
        },
        {
          id: "blue-block",
          x: 1,
          y: 0,
          z: 0,
          color: "#3B82F6",
          type: "movable"
        },
        {
          id: "green-block",
          x: 2,
          y: 0,
          z: 0,
          color: "#10B981",
          type: "movable"
        }
      ],
      goal: {
        type: "move_blocks",
        targetPositions: [
          { x: 5, z: 3 },
          { x: 5, z: 4 },
          { x: 5, z: 5 }
        ]
      }
    }
  ];
}

/**
 * Generate a random level with specified difficulty
 */
export function generateRandomLevel(difficulty: "easy" | "medium" | "hard"): GameLevel {
  const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"];
  
  let blockCount: number;
  let goalCount: number;
  
  switch (difficulty) {
    case "easy":
      blockCount = Math.floor(Math.random() * 3) + 1; // 1-3 blocks
      goalCount = blockCount;
      break;
    case "medium":
      blockCount = Math.floor(Math.random() * 4) + 3; // 3-6 blocks
      goalCount = blockCount;
      break;
    case "hard":
      blockCount = Math.floor(Math.random() * 6) + 5; // 5-10 blocks
      goalCount = blockCount;
      break;
  }
  
  const blocks: GameBlock[] = [];
  const usedPositions = new Set<string>();
  
  // Generate random blocks
  for (let i = 0; i < blockCount; i++) {
    let x, z;
    do {
      x = Math.floor(Math.random() * 8);
      z = Math.floor(Math.random() * 8);
    } while (usedPositions.has(`${x}-${z}`));
    
    usedPositions.add(`${x}-${z}`);
    
    blocks.push({
      id: `block-${i}`,
      x,
      y: 0,
      z,
      color: colors[i % colors.length],
      type: "movable"
    });
  }
  
  // Generate random goal positions
  const targetPositions: Array<{ x: number; z: number }> = [];
  const goalUsedPositions = new Set<string>();
  
  for (let i = 0; i < goalCount; i++) {
    let x, z;
    do {
      x = Math.floor(Math.random() * 8);
      z = Math.floor(Math.random() * 8);
    } while (goalUsedPositions.has(`${x}-${z}`) || usedPositions.has(`${x}-${z}`));
    
    goalUsedPositions.add(`${x}-${z}`);
    targetPositions.push({ x, z });
  }
  
  return {
    id: `random-${Date.now()}`,
    name: `Random ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level`,
    description: `A randomly generated ${difficulty} level with ${blockCount} blocks`,
    difficulty,
    blocks,
    goal: {
      type: "move_blocks",
      targetPositions
    }
  };
}

/**
 * Clone a level with a new ID
 */
export function cloneLevel(level: GameLevel, newName?: string): GameLevel {
  return {
    ...level,
    id: `clone-${Date.now()}`,
    name: newName || `Copy of ${level.name}`,
    blocks: level.blocks.map(block => ({
      ...block,
      id: `${block.id}-clone-${Date.now()}`
    }))
  };
}

/**
 * Export level to JSON string
 */
export function exportLevel(level: GameLevel): string {
  return JSON.stringify(level, null, 2);
}

/**
 * Import level from JSON string
 */
export function importLevel(jsonString: string): GameLevel | null {
  try {
    const level = JSON.parse(jsonString);
    
    // Validate required fields
    if (!level.id || !level.name || !level.blocks || !level.goal) {
      throw new Error("Invalid level format");
    }
    
    // Assign new ID to avoid conflicts
    level.id = `imported-${Date.now()}`;
    
    return level;
  } catch (error) {
    console.error("Failed to import level:", error);
    return null;
  }
}

/**
 * Calculate level difficulty based on block count and complexity
 */
export function calculateDifficulty(level: GameLevel): "easy" | "medium" | "hard" {
  const blockCount = level.blocks.filter(b => b.type === "movable").length;
  const goalCount = level.goal.targetPositions?.length || 0;
  
  // Simple heuristic for difficulty
  if (blockCount <= 2 && goalCount <= 2) return "easy";
  if (blockCount <= 5 && goalCount <= 5) return "medium";
  return "hard";
}

/**
 * Get level statistics
 */
export function getLevelStats(level: GameLevel): {
  movableBlocks: number;
  fixedBlocks: number;
  goalAreas: number;
  estimatedTime: string;
} {
  const movableBlocks = level.blocks.filter(b => b.type === "movable").length;
  const fixedBlocks = level.blocks.filter(b => b.type === "fixed").length;
  const goalAreas = level.goal.targetPositions?.length || 0;
  
  // Estimate completion time based on complexity
  let estimatedMinutes = movableBlocks * 0.5 + fixedBlocks * 0.2;
  if (level.difficulty === "medium") estimatedMinutes *= 1.5;
  if (level.difficulty === "hard") estimatedMinutes *= 2;
  
  const estimatedTime = estimatedMinutes < 1 
    ? "< 1 minute" 
    : `~${Math.ceil(estimatedMinutes)} minute${Math.ceil(estimatedMinutes) > 1 ? 's' : ''}`;
  
  return {
    movableBlocks,
    fixedBlocks,
    goalAreas,
    estimatedTime
  };
}
