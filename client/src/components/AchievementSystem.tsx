import { useAchievementStore } from "../lib/stores/useAchievementStore";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Trophy, Star, Award, Target, Zap, Heart } from "lucide-react";

const achievementIcons = {
  level_complete: Trophy,
  first_creation: Star,
  level_shared: Award,
  blocks_moved: Target,
  speed_run: Zap,
  helpful_rating: Heart,
};

export function AchievementSystem() {
  const { achievements, totalScore } = useAchievementStore();

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progressPercentage = (unlockedCount / achievements.length) * 100;

  return (
    <div className="space-y-4">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Your Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">{totalScore}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{unlockedCount}/{achievements.length}</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Achievement Categories */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm text-muted-foreground">Recent Achievements</h3>
        
        {achievements
          .filter(a => a.unlocked)
          .sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0))
          .slice(0, 3)
          .map((achievement) => {
            const IconComponent = achievementIcons[achievement.id as keyof typeof achievementIcons] || Trophy;
            
            return (
              <Card key={achievement.id} className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <IconComponent className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{achievement.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          +{achievement.points}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

        <h3 className="font-medium text-sm text-muted-foreground mt-6">All Achievements</h3>
        
        {achievements.map((achievement) => {
          const IconComponent = achievementIcons[achievement.id as keyof typeof achievementIcons] || Trophy;
          
          return (
            <Card 
              key={achievement.id} 
              className={`transition-colors ${
                achievement.unlocked 
                  ? 'border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800' 
                  : 'opacity-60'
              }`}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    achievement.unlocked 
                      ? 'bg-green-100 dark:bg-green-900' 
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <IconComponent className={`w-4 h-4 ${
                      achievement.unlocked 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">{achievement.name}</h4>
                      <Badge 
                        variant={achievement.unlocked ? "secondary" : "outline"} 
                        className="text-xs"
                      >
                        +{achievement.points}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {achievement.description}
                    </p>
                    {achievement.progress !== undefined && achievement.progress < achievement.target && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.target}</span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.target) * 100} 
                          className="h-1"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
