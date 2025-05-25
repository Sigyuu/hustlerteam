import { useEffect } from "react";
import { useAudio } from "../lib/stores/useAudio";
import { useAchievementStore } from "../lib/stores/useAchievementStore";
import { useGameStore } from "../lib/stores/useGameStore";

export function SoundManager() {
  const { setBackgroundMusic, setHitSound, setSuccessSound, playSuccess, playHit } = useAudio();
  const { achievements } = useAchievementStore();
  const { selectedBlock } = useGameStore();

  // Initialize audio on component mount
  useEffect(() => {
    const loadAudio = async () => {
      try {
        // Load background music
        const bgMusic = new Audio("/sounds/background.mp3");
        bgMusic.loop = true;
        bgMusic.volume = 0.3;
        setBackgroundMusic(bgMusic);

        // Load sound effects
        const hitAudio = new Audio("/sounds/hit.mp3");
        hitAudio.volume = 0.5;
        setHitSound(hitAudio);

        const successAudio = new Audio("/sounds/success.mp3");
        successAudio.volume = 0.7;
        setSuccessSound(successAudio);

        console.log("Audio loaded successfully");
      } catch (error) {
        console.log("Audio loading failed:", error);
      }
    };

    loadAudio();
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  // Play sound when blocks are selected
  useEffect(() => {
    if (selectedBlock) {
      playHit();
    }
  }, [selectedBlock, playHit]);

  // Play sound when achievements are unlocked
  useEffect(() => {
    const recentlyUnlocked = achievements.filter(a => a.justUnlocked);
    if (recentlyUnlocked.length > 0) {
      playSuccess();
      
      // Clear the justUnlocked flag after playing sound
      setTimeout(() => {
        // This would ideally be handled by the achievement store
        console.log("Achievement sound played for:", recentlyUnlocked.map(a => a.name));
      }, 1000);
    }
  }, [achievements, playSuccess]);

  // This component doesn't render anything visible
  return null;
}
