import { useState } from "react";
import { useLevelStore } from "../lib/stores/useLevelStore";
import { useAchievementStore } from "../lib/stores/useAchievementStore";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Star, StarIcon, Download, Upload, Search, Users } from "lucide-react";

// Mock shared levels for demonstration
const mockSharedLevels = [
  {
    id: "shared-1",
    name: "Rainbow Bridge",
    description: "Create a colorful bridge across the gap",
    author: "GrandmaRose",
    difficulty: "easy" as const,
    rating: 4.5,
    downloads: 156,
    blocks: []
  },
  {
    id: "shared-2",
    name: "Tower Challenge",
    description: "Build the tallest tower possible",
    author: "PuzzleMaster",
    difficulty: "medium" as const,
    rating: 4.2,
    downloads: 89,
    blocks: []
  },
  {
    id: "shared-3",
    name: "Memory Palace",
    description: "Recreate the pattern from memory",
    author: "BrainTrainer",
    difficulty: "hard" as const,
    rating: 4.8,
    downloads: 234,
    blocks: []
  }
];

export function LevelSharing() {
  const { currentLevel, loadLevel } = useLevelStore();
  const { unlockAchievement } = useAchievementStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const handleShareLevel = async () => {
    // In a real app, this would upload to the server
    console.log("Sharing level:", currentLevel);
    unlockAchievement("level_shared");
    
    // Mock successful share
    alert("Level shared successfully! Other players can now discover and play your creation.");
  };

  const handleDownloadLevel = async (levelId: string) => {
    // In a real app, this would download from the server
    const level = mockSharedLevels.find(l => l.id === levelId);
    if (level) {
      // Convert mock level to proper format
      const downloadedLevel = {
        ...level,
        id: `downloaded-${Date.now()}`,
        blocks: [],
        goal: { type: "move_blocks" as const, targetPositions: [] }
      };
      
      loadLevel(downloadedLevel);
      console.log("Downloaded level:", downloadedLevel);
      alert(`Downloaded "${level.name}"! You can now play or edit this level.`);
    }
  };

  const handleRateLevel = (levelId: string, rating: number) => {
    console.log(`Rating level ${levelId} with ${rating} stars`);
    unlockAchievement("helpful_rating");
  };

  const filteredLevels = mockSharedLevels.filter(level => {
    const matchesSearch = level.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         level.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         level.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === "all" || level.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="space-y-4">
      {/* Share Current Level */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Share Your Level
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">{currentLevel.name}</h4>
            <p className="text-sm text-muted-foreground">{currentLevel.description}</p>
            <div className="flex gap-2">
              <Badge variant="secondary">{currentLevel.difficulty}</Badge>
              <Badge variant="outline">{currentLevel.blocks.length} blocks</Badge>
            </div>
          </div>
          
          <Button 
            onClick={handleShareLevel}
            className="w-full"
            size="lg"
          >
            <Upload className="w-4 h-4 mr-2" />
            Share with Community
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            Share your creation so others can enjoy and learn from your puzzle!
          </p>
        </CardContent>
      </Card>

      {/* Browse Community Levels */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Community Levels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search levels, authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              {["all", "easy", "medium", "hard"].map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className="capitalize"
                >
                  {difficulty}
                </Button>
              ))}
            </div>
          </div>

          {/* Level List */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {filteredLevels.map((level) => (
              <Card key={level.id} className="border">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{level.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{level.description}</p>
                        <p className="text-xs text-muted-foreground">by {level.author}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {level.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{level.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          <span>{level.downloads}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadLevel(level.id)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Play
                        </Button>
                        
                        {/* Rating buttons */}
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Button
                              key={star}
                              variant="ghost"
                              size="sm"
                              className="p-1 h-auto"
                              onClick={() => handleRateLevel(level.id, star)}
                            >
                              <StarIcon className="w-3 h-3" />
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredLevels.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No levels found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
