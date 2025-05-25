import { useState } from "react";
import { GameScene } from "./GameScene";
import { LevelEditor } from "./LevelEditor";
import { GameUI } from "./GameUI";
import { AchievementSystem } from "./AchievementSystem";
import { LevelSharing } from "./LevelSharing";
import { Tutorial } from "./Tutorial";
import { useGameStore } from "../lib/stores/useGameStore";
import { useLevelStore } from "../lib/stores/useLevelStore";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Play, Edit, Trophy, Share, HelpCircle } from "lucide-react";

export function Game() {
  const { gameMode, setGameMode, showTutorial, setShowTutorial } = useGameStore();
  const { currentLevel } = useLevelStore();
  const [activeTab, setActiveTab] = useState("play");

  if (showTutorial) {
    return <Tutorial onComplete={() => setShowTutorial(false)} />;
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b-2 border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Creative Blocks
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowTutorial(true)}
              className="text-lg px-6 py-3"
            >
              <HelpCircle className="w-5 h-5 mr-2" />
              Help
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-80 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-r-2 border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4 h-12">
              <TabsTrigger value="play" className="text-sm">
                <Play className="w-4 h-4 mr-1" />
                Play
              </TabsTrigger>
              <TabsTrigger value="create" className="text-sm">
                <Edit className="w-4 h-4 mr-1" />
                Create
              </TabsTrigger>
              <TabsTrigger value="share" className="text-sm">
                <Share className="w-4 h-4 mr-1" />
                Share
              </TabsTrigger>
              <TabsTrigger value="achievements" className="text-sm">
                <Trophy className="w-4 h-4 mr-1" />
                Awards
              </TabsTrigger>
            </TabsList>

            <TabsContent value="play" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Game Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong>Arrow Keys / WASD:</strong> Move cursor</p>
                  <p><strong>Space:</strong> Select/Place block</p>
                  <p><strong>Enter:</strong> Confirm action</p>
                  <p><strong>Escape:</strong> Cancel/Menu</p>
                </CardContent>
              </Card>
              
              <Button
                size="lg"
                className="w-full text-lg py-6"
                onClick={() => setGameMode("playing")}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Playing
              </Button>
            </TabsContent>

            <TabsContent value="create">
              <LevelEditor />
            </TabsContent>

            <TabsContent value="share">
              <LevelSharing />
            </TabsContent>

            <TabsContent value="achievements">
              <AchievementSystem />
            </TabsContent>
          </Tabs>
        </aside>

        {/* Game Area */}
        <main className="flex-1 relative">
          {gameMode === "menu" && (
            <div className="flex items-center justify-center h-full">
              <Card className="w-96 p-8 text-center">
                <CardHeader>
                  <CardTitle className="text-2xl mb-4">Welcome to Creative Blocks!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg text-muted-foreground">
                    Create, share, and play puzzle levels with friends and family.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      size="lg"
                      onClick={() => setGameMode("playing")}
                      className="text-lg py-6"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Play
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setGameMode("editor")}
                      className="text-lg py-6"
                    >
                      <Edit className="w-5 h-5 mr-2" />
                      Create
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {(gameMode === "playing" || gameMode === "editor") && (
            <>
              <GameScene />
              <GameUI />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
