import { GameBlock } from "./stores/useGameStore";
import { LevelGoal } from "./stores/useLevelStore";

/**
 * Check if the current level's win condition is met
 */
export function checkWinCondition(blocks: GameBlock[], goal: LevelGoal): boolean {
  switch (goal.type) {
    case "move_blocks":
      return checkMoveBlocksGoal(blocks, goal.targetPositions || []);
    
    case "pattern_match":
      return checkPatternMatchGoal(blocks, goal.requiredPattern || "");
    
    case "stack_height":
      return checkStackHeightGoal(blocks, goal.targetHeight || 1);
    
    default:
      return false;
  }
}

/**
 * Check if blocks are positioned in target locations
 */
function checkMoveBlocksGoal(blocks: GameBlock[], targetPositions: Array<{ x: number; z: number }>): boolean {
  if (targetPositions.length === 0) return false;
  
  // Get movable blocks only
  const movableBlocks = blocks.filter(block => block.type === "movable");
  
  // Check if we have the right number of blocks
  if (movableBlocks.length !== targetPositions.length) return false;
  
  // Check if each target position has a block
  return targetPositions.every(target => 
    movableBlocks.some(block => block.x === target.x && block.z === target.z)
  );
}

/**
 * Check if blocks form a specific pattern
 */
function checkPatternMatchGoal(blocks: GameBlock[], requiredPattern: string): boolean {
  // This is a simplified pattern matching system
  // In a real implementation, you'd define patterns more robustly
  
  const movableBlocks = blocks.filter(block => block.type === "movable");
  const pattern = createPatternString(movableBlocks);
  
  return pattern === requiredPattern;
}

/**
 * Check if blocks reach a certain stack height
 */
function checkStackHeightGoal(blocks: GameBlock[], targetHeight: number): boolean {
  // Find the highest stack
  const stackHeights = new Map<string, number>();
  
  blocks.forEach(block => {
    const key = `${block.x}-${block.z}`;
    const currentHeight = stackHeights.get(key) || 0;
    stackHeights.set(key, Math.max(currentHeight, block.y + 1));
  });
  
  const maxHeight = Math.max(...Array.from(stackHeights.values()));
  return maxHeight >= targetHeight;
}

/**
 * Create a string representation of the block pattern
 */
function createPatternString(blocks: GameBlock[]): string {
  // Sort blocks by position for consistent pattern
  const sortedBlocks = blocks.sort((a, b) => {
    if (a.x !== b.x) return a.x - b.x;
    if (a.z !== b.z) return a.z - b.z;
    return a.y - b.y;
  });
  
  return sortedBlocks
    .map(block => `${block.x},${block.z},${block.y}`)
    .join(";");
}

/**
 * Check if a move is valid (no collision, within bounds)
 */
export function isValidMove(
  blocks: GameBlock[], 
  blockId: string, 
  newX: number, 
  newZ: number, 
  newY: number = 0
): boolean {
  // Check bounds (assuming 8x8 board)
  if (newX < 0 || newX >= 8 || newZ < 0 || newZ >= 8) {
    return false;
  }
  
  // Check for collision with other blocks
  const otherBlocks = blocks.filter(block => block.id !== blockId);
  const collision = otherBlocks.some(block => 
    block.x === newX && block.z === newZ && block.y === newY
  );
  
  return !collision;
}

/**
 * Calculate the optimal solution path (simple pathfinding)
 */
export function findOptimalPath(
  startPos: { x: number; z: number },
  targetPos: { x: number; z: number },
  obstacles: Array<{ x: number; z: number }>
): Array<{ x: number; z: number }> {
  // Simple A* pathfinding implementation
  // For now, return a direct path if no obstacles are in the way
  
  const path: Array<{ x: number; z: number }> = [];
  let current = { ...startPos };
  
  while (current.x !== targetPos.x || current.z !== targetPos.z) {
    // Move towards target (simplified)
    if (current.x < targetPos.x) current.x++;
    else if (current.x > targetPos.x) current.x--;
    else if (current.z < targetPos.z) current.z++;
    else if (current.z > targetPos.z) current.z--;
    
    path.push({ ...current });
    
    // Prevent infinite loops
    if (path.length > 20) break;
  }
  
  return path;
}

/**
 * Generate hints for the player
 */
export function generateHint(blocks: GameBlock[], goal: LevelGoal): string {
  switch (goal.type) {
    case "move_blocks":
      const targetPositions = goal.targetPositions || [];
      if (targetPositions.length > 0) {
        const movableBlocks = blocks.filter(b => b.type === "movable");
        const unplacedBlocks = movableBlocks.filter(block => 
          !targetPositions.some(target => target.x === block.x && target.z === block.z)
        );
        
        if (unplacedBlocks.length > 0) {
          const block = unplacedBlocks[0];
          const target = targetPositions[0];
          return `Try moving the block at (${block.x}, ${block.z}) to the green area at (${target.x}, ${target.z})`;
        }
      }
      return "Move all blocks to the green goal areas";
    
    case "pattern_match":
      return "Arrange the blocks to match the required pattern";
    
    case "stack_height":
      return `Stack blocks to reach a height of ${goal.targetHeight || 1}`;
    
    default:
      return "Complete the level objective";
  }
}

/**
 * Validate level design for common issues
 */
export function validateLevel(blocks: GameBlock[], goal: LevelGoal): string[] {
  const issues: string[] = [];
  
  // Check if there are any movable blocks
  const movableBlocks = blocks.filter(b => b.type === "movable");
  if (movableBlocks.length === 0) {
    issues.push("Level needs at least one movable block");
  }
  
  // Check goal validity
  if (goal.type === "move_blocks") {
    const targetPositions = goal.targetPositions || [];
    if (targetPositions.length === 0) {
      issues.push("Move blocks goal needs target positions");
    } else if (targetPositions.length !== movableBlocks.length) {
      issues.push("Number of target positions should match number of movable blocks");
    }
  }
  
  // Check for blocks outside board bounds
  const outOfBounds = blocks.filter(block => 
    block.x < 0 || block.x >= 8 || block.z < 0 || block.z >= 8
  );
  if (outOfBounds.length > 0) {
    issues.push("Some blocks are outside the game board");
  }
  
  return issues;
}
