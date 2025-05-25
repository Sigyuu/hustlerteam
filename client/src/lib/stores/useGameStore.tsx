import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GameMode = "menu" | "playing" | "editor";

export interface GameBlock {
  id: string;
  x: number;
  y: number;
  z: number;
  color: string;
  type: "movable" | "fixed" | "goal";
}

export interface Cursor {
  x: number;
  z: number;
}

interface GameState {
  gameMode: GameMode;
  cursor: Cursor;
  selectedBlock: GameBlock | null;
  showTutorial: boolean;
  
  // Actions
  setGameMode: (mode: GameMode) => void;
  setCursor: (cursor: Cursor) => void;
  setSelectedBlock: (block: GameBlock | null) => void;
  setShowTutorial: (show: boolean) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    gameMode: "menu",
    cursor: { x: 3, z: 3 }, // Start in center of 8x8 board
    selectedBlock: null,
    showTutorial: false,
    
    setGameMode: (mode) => {
      console.log("Game mode changed to:", mode);
      set({ gameMode: mode });
    },
    
    setCursor: (cursor) => {
      // Ensure cursor stays within bounds
      const boundedCursor = {
        x: Math.max(0, Math.min(7, cursor.x)),
        z: Math.max(0, Math.min(7, cursor.z))
      };
      set({ cursor: boundedCursor });
    },
    
    setSelectedBlock: (block) => {
      console.log("Selected block:", block);
      set({ selectedBlock: block });
    },
    
    setShowTutorial: (show) => {
      set({ showTutorial: show });
    },
    
    resetGame: () => {
      set({
        gameMode: "menu",
        cursor: { x: 3, z: 3 },
        selectedBlock: null,
        showTutorial: false
      });
    }
  }))
);

// Subscribe to game mode changes for additional logic
useGameStore.subscribe(
  (state) => state.gameMode,
  (gameMode) => {
    // Reset selection when changing modes
    if (gameMode !== "playing") {
      useGameStore.getState().setSelectedBlock(null);
    }
  }
);
