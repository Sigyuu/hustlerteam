import { useState } from "react";
import { useLevelStore } from "../lib/stores/useLevelStore";
import { useGameStore } from "../lib/stores/useGameStore";
import { generateEmptyLevel } from "../lib/levelUtils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Save, Play, RotateCcw, Plus } from "lucide-react";

export function LevelEditor() {
  const { currentLevel, updateLevel, saveLevel } = useLevelStore();
  const { setGameMode } = useGameStore();
  const [levelName, setLevelName] = useState(currentLevel.name);
  const [levelDescription, setLevelDescription] = useState(currentLevel.description);
  const [difficulty, setDifficulty] = useState(currentLevel.difficulty);

  const handleSaveLevel = async () => {
    const updatedLevel = {
      ...currentLevel,
      name: levelName,
      description: levelDescription,
      difficulty: difficulty as "easy" | "medium" | "hard"
    };
    
    updateLevel(updatedLevel);
    await saveLevel(updatedLevel);
    console.log("Level saved:", updatedLevel);
  };

  const handleTestLevel = () => {
    handleSaveLevel();
    setGameMode("playing");
  };

  const handleNewLevel = () => {
    const newLevel = generateEmptyLevel();
    updateLevel(newLevel);
    setLevelName(newLevel.name);
    setLevelDescription(newLevel.description);
    setDifficulty(newLevel.difficulty);
  };

  const addGoalPosition = () => {
    const newGoal = currentLevel.goal || { type: "move_blocks", targetPositions: [] };
    newGoal.targetPositions = [
      ...(newGoal.targetPositions || []),
      { x: 3, z: 3 }
    ];
    updateLevel({ ...currentLevel, goal: newGoal });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Level Editor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Level Info */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="level-name" className="text-sm font-medium">
                Level Name
              </Label>
              <Input
                id="level-name"
                value={levelName}
                onChange={(e) => setLevelName(e.target.value)}
                placeholder="My Awesome Level"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="level-description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="level-description"
                value={levelDescription}
                onChange={(e) => setLevelDescription(e.target.value)}
                placeholder="Describe your level..."
                className="mt-1 h-20"
              />
            </div>

            <div>
              <Label htmlFor="difficulty" className="text-sm font-medium">
                Difficulty
              </Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Editor Tools */}
          <div className="border-t pt-4 space-y-3">
            <h4 className="font-medium text-sm">Editor Tools</h4>
            
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={addGoalPosition}
                className="justify-start"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Goal Area
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewLevel}
                className="justify-start"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New Level
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-sm mb-2">How to Edit</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Use arrow keys to move cursor</p>
              <p>• Press Space to place/remove blocks</p>
              <p>• Green areas are goal positions</p>
              <p>• Test your level before saving</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-4 space-y-2">
            <Button
              onClick={handleTestLevel}
              className="w-full"
              size="lg"
            >
              <Play className="w-4 h-4 mr-2" />
              Test Level
            </Button>
            
            <Button
              onClick={handleSaveLevel}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Level
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Level Stats */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold">{currentLevel.blocks.length}</div>
              <div className="text-xs text-muted-foreground">Blocks</div>
            </div>
            <div>
              <div className="text-lg font-bold">
                {currentLevel.goal?.targetPositions?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Goals</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
