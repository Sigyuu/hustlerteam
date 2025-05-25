import { useGameStore } from "../lib/stores/useGameStore";
import { useLevelStore } from "../lib/stores/useLevelStore";
import { useAchievementStore } from "../lib/stores/useAchievementStore";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Home, RotateCcw, Trophy, Volume2, VolumeX } from "lucide-react";
import { useAudio } from "../lib/stores/useAudio";

export function GameUI() {
  const { gameMode, setGameMode, cursor, selectedBlock } = useGameStore();
  const { currentLevel, resetLevel } = useLevelStore();
  const { achievements, totalScore } = useAchievementStore();
  const { isMuted, toggleMute } = useAudio();

  const handleReturnToMenu = () => {
    setGameMode("menu");
  };

  const handleResetLevel = () => {
    resetLevel();
  };

  // Calculate completion percentage
  const completedAchievements = achievements.filter(a => a.unlocked).length;
  const completionPercentage = (completedAchievements / achievements.length) * 100;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto z-10">
        {/* Left side - Level info */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-2 shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-bold text-lg">{currentLevel.name}</h3>
              <p className="text-sm text-muted-foreground">{currentLevel.description}</p>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  {currentLevel.difficulty}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {currentLevel.blocks.length} blocks
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right side - Score and progress */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-2 shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-2 min-w-[200px]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-xs text-muted-foreground">
                  {completedAchievements}/{achievements.length}
                </span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Score</span>
                <span className="text-lg font-bold text-primary">{totalScore}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-auto z-10">
        {/* Left side - Game status */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-2 shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Cursor:</span> ({cursor.x}, {cursor.z})
              </div>
              {selectedBlock && (
                <div className="text-sm">
                  <span className="font-medium">Selected:</span> Block at ({selectedBlock.x}, {selectedBlock.z})
                </div>
              )}
              {gameMode === "editor" && (
                <div className="text-xs text-muted-foreground">
                  Space: Place/Remove • Arrow Keys: Move
                </div>
              )}
              {gameMode === "playing" && (
                <div className="text-xs text-muted-foreground">
                  Space: Select/Move • Arrow Keys: Navigate
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right side - Controls */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-2 shadow-lg">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                onClick={toggleMute}
                className="px-4 py-3"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              
              {gameMode === "playing" && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleResetLevel}
                  className="px-4 py-3"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              )}
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleReturnToMenu}
                className="px-4 py-3"
              >
                <Home className="w-5 h-5 mr-2" />
                Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement popup */}
      {achievements.some(a => a.justUnlocked) && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-20">
          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 shadow-xl animate-in slide-in-from-top-4 duration-500">
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Achievement Unlocked!</h3>
              {achievements
                .filter(a => a.justUnlocked)
                .map(achievement => (
                  <div key={achievement.id} className="space-y-1">
                    <p className="font-medium">{achievement.name}</p>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <Badge className="bg-yellow-500 text-white">+{achievement.points} points</Badge>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
