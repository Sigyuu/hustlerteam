import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameBlock } from "./useGameStore";
import { generateEmptyLevel } from "../levelUtils";

export interface LevelGoal {
  type: "move_blocks" | "pattern_match" | "stack_height";
  targetPositions?: Array<{ x: number; z: number }>;
  requiredPattern?: string;
  targetHeight?: number;
}

export interface GameLevel {
  id: string;
  name: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  blocks: GameBlock[];
  goal: LevelGoal;
  author?: string;
  rating?: number;
  downloads?: number;
  createdAt?: number;
}

interface LevelState {
  currentLevel: GameLevel;
  savedLevels: GameLevel[];
  levelHistory: GameLevel[];
  
  // Actions
  updateLevel: (level: GameLevel) => void;
  loadLevel: (level: GameLevel) => void;
  saveLevel: (level: GameLevel) => Promise<void>;
  resetLevel: () => void;
  getSavedLevels: () => GameLevel[];
  deleteLevel: (levelId: string) => void;
}

const defaultLevel: GameLevel = {
  id: "tutorial-1",
  name: "Getting Started",
  description: "Move the blue block to the green goal area",
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
      z: 2,
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
};

export const useLevelStore = create<LevelState>()(
  persist(
    (set, get) => ({
      currentLevel: defaultLevel,
      savedLevels: [defaultLevel],
      levelHistory: [],
      
      updateLevel: (level) => {
        console.log("Updating level:", level.name);
        set({ currentLevel: level });
      },
      
      loadLevel: (level) => {
        const { currentLevel } = get();
        set({ 
          currentLevel: level,
          levelHistory: [...get().levelHistory, currentLevel]
        });
        console.log("Loaded level:", level.name);
      },
      
      saveLevel: async (level) => {
        const { savedLevels } = get();
        const existingIndex = savedLevels.findIndex(l => l.id === level.id);
        
        let newSavedLevels;
        if (existingIndex >= 0) {
          // Update existing level
          newSavedLevels = [...savedLevels];
          newSavedLevels[existingIndex] = { ...level, createdAt: Date.now() };
        } else {
          // Add new level
          newSavedLevels = [...savedLevels, { ...level, createdAt: Date.now() }];
        }
        
        set({ 
          savedLevels: newSavedLevels,
          currentLevel: level
        });
        
        console.log("Saved level:", level.name);
        
        // In a real app, this would save to the server
        try {
          // Mock API call
          await new Promise(resolve => setTimeout(resolve, 500));
          console.log("Level saved to server");
        } catch (error) {
          console.error("Failed to save level to server:", error);
        }
      },
      
      resetLevel: () => {
        const { currentLevel } = get();
        // Reset blocks to their original positions
        // For now, we'll just reload the default level
        set({ currentLevel: { ...currentLevel } });
        console.log("Level reset");
      },
      
      getSavedLevels: () => {
        return get().savedLevels;
      },
      
      deleteLevel: (levelId) => {
        const { savedLevels } = get();
        const newSavedLevels = savedLevels.filter(l => l.id !== levelId);
        set({ savedLevels: newSavedLevels });
        console.log("Deleted level:", levelId);
      }
    }),
    {
      name: "creative-blocks-levels",
      partialize: (state) => ({
        savedLevels: state.savedLevels,
        currentLevel: state.currentLevel
      })
    }
  )
);
