import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: number;
  justUnlocked?: boolean;
  progress?: number;
  target?: number;
}

interface AchievementState {
  achievements: Achievement[];
  totalScore: number;
  
  // Actions
  unlockAchievement: (achievementId: string) => void;
  updateProgress: (achievementId: string, progress: number) => void;
  getAchievement: (achievementId: string) => Achievement | undefined;
  clearJustUnlocked: () => void;
}

const initialAchievements: Achievement[] = [
  {
    id: "level_complete",
    name: "First Success!",
    description: "Complete your first level",
    points: 10,
    unlocked: false
  },
  {
    id: "first_creation",
    name: "Creative Mind",
    description: "Create your first custom level",
    points: 15,
    unlocked: false
  },
  {
    id: "level_shared",
    name: "Community Builder",
    description: "Share a level with the community",
    points: 20,
    unlocked: false
  },
  {
    id: "blocks_moved",
    name: "Block Mover",
    description: "Move 50 blocks in total",
    points: 25,
    unlocked: false,
    progress: 0,
    target: 50
  },
  {
    id: "speed_run",
    name: "Speed Demon",
    description: "Complete a level in under 30 seconds",
    points: 30,
    unlocked: false
  },
  {
    id: "helpful_rating",
    name: "Helpful Community Member",
    description: "Rate 10 community levels",
    points: 15,
    unlocked: false,
    progress: 0,
    target: 10
  },
  {
    id: "level_master",
    name: "Level Master",
    description: "Complete 25 levels",
    points: 50,
    unlocked: false,
    progress: 0,
    target: 25
  },
  {
    id: "creative_genius",
    name: "Creative Genius",
    description: "Create 10 custom levels",
    points: 75,
    unlocked: false,
    progress: 0,
    target: 10
  }
];

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      achievements: initialAchievements,
      totalScore: 0,
      
      unlockAchievement: (achievementId) => {
        const { achievements } = get();
        const achievement = achievements.find(a => a.id === achievementId);
        
        if (achievement && !achievement.unlocked) {
          const updatedAchievements = achievements.map(a =>
            a.id === achievementId
              ? { 
                  ...a, 
                  unlocked: true, 
                  unlockedAt: Date.now(),
                  justUnlocked: true,
                  progress: a.target || undefined // Set progress to target if it exists
                }
              : a
          );
          
          const newTotalScore = get().totalScore + achievement.points;
          
          set({ 
            achievements: updatedAchievements,
            totalScore: newTotalScore
          });
          
          console.log(`Achievement unlocked: ${achievement.name} (+${achievement.points} points)`);
          
          // Clear the justUnlocked flag after a delay
          setTimeout(() => {
            get().clearJustUnlocked();
          }, 3000);
        }
      },
      
      updateProgress: (achievementId, progress) => {
        const { achievements } = get();
        const achievement = achievements.find(a => a.id === achievementId);
        
        if (achievement && !achievement.unlocked && achievement.target) {
          const updatedAchievements = achievements.map(a =>
            a.id === achievementId
              ? { ...a, progress: Math.min(progress, a.target || progress) }
              : a
          );
          
          set({ achievements: updatedAchievements });
          
          // Check if target reached
          if (progress >= achievement.target) {
            get().unlockAchievement(achievementId);
          }
        }
      },
      
      getAchievement: (achievementId) => {
        return get().achievements.find(a => a.id === achievementId);
      },
      
      clearJustUnlocked: () => {
        const { achievements } = get();
        const updatedAchievements = achievements.map(a => ({
          ...a,
          justUnlocked: false
        }));
        set({ achievements: updatedAchievements });
      }
    }),
    {
      name: "creative-blocks-achievements",
      partialize: (state) => ({
        achievements: state.achievements,
        totalScore: state.totalScore
      })
    }
  )
);

// Auto-increment progress for certain achievements
const originalStore = useAchievementStore.getState();

// Example: Increment blocks moved counter
export const incrementBlocksMoved = () => {
  const { updateProgress, getAchievement } = useAchievementStore.getState();
  const achievement = getAchievement("blocks_moved");
  if (achievement) {
    updateProgress("blocks_moved", (achievement.progress || 0) + 1);
  }
};

// Example: Increment levels completed counter
export const incrementLevelsCompleted = () => {
  const { updateProgress, getAchievement } = useAchievementStore.getState();
  const achievement = getAchievement("level_master");
  if (achievement) {
    updateProgress("level_master", (achievement.progress || 0) + 1);
  }
};

// Example: Increment levels created counter
export const incrementLevelsCreated = () => {
  const { updateProgress, getAchievement } = useAchievementStore.getState();
  const achievement = getAchievement("creative_genius");
  if (achievement) {
    updateProgress("creative_genius", (achievement.progress || 0) + 1);
  }
};

// Example: Increment ratings given counter
export const incrementRatingsGiven = () => {
  const { updateProgress, getAchievement } = useAchievementStore.getState();
  const achievement = getAchievement("helpful_rating");
  if (achievement) {
    updateProgress("helpful_rating", (achievement.progress || 0) + 1);
  }
};
