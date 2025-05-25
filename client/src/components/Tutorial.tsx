import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ChevronLeft, ChevronRight, Play, Edit, Trophy, Share, CheckCircle } from "lucide-react";

interface TutorialStep {
  title: string;
  description: string;
  icon: any;
  content: string[];
  tip?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to Creative Blocks!",
    description: "A fun puzzle game designed for everyone",
    icon: Play,
    content: [
      "Creative Blocks is a puzzle game where you move colored blocks to solve challenges.",
      "You can also create your own levels and share them with friends and family.",
      "The game is designed to be accessible and enjoyable for all ages."
    ],
    tip: "Take your time - there's no rush! This game is all about creativity and fun."
  },
  {
    title: "How to Play",
    description: "Learn the basic game controls",
    icon: Play,
    content: [
      "Use Arrow Keys or WASD to move the cursor around the game board.",
      "Press Space to select a block or place it in a new position.",
      "Move blocks to the green goal areas to complete the level.",
      "Press Escape to cancel your selection at any time."
    ],
    tip: "The cursor is shown as a red highlight on the board. Watch for it!"
  },
  {
    title: "Creating Levels",
    description: "Design your own puzzles",
    icon: Edit,
    content: [
      "Click the 'Create' tab to access the level editor.",
      "Use Space to place or remove blocks anywhere on the board.",
      "Add goal areas where players need to move the blocks.",
      "Give your level a name and description, then test it before sharing."
    ],
    tip: "Start with simple levels and gradually add complexity. Test them yourself first!"
  },
  {
    title: "Achievements",
    description: "Track your progress and earn rewards",
    icon: Trophy,
    content: [
      "Complete levels to earn achievement points.",
      "Create and share levels to unlock special achievements.",
      "Help rate other players' levels to earn community points.",
      "Check the Awards tab to see your progress and unlock new achievements."
    ],
    tip: "Every action in the game can contribute to your achievements!"
  },
  {
    title: "Sharing & Community",
    description: "Connect with other players",
    icon: Share,
    content: [
      "Share your created levels with the community.",
      "Browse and play levels created by other players.",
      "Rate levels to help others discover the best content.",
      "Download levels you enjoy to play them anytime."
    ],
    tip: "The community makes the game even more fun - don't hesitate to share!"
  }
];

interface TutorialProps {
  onComplete: () => void;
}

export function Tutorial({ onComplete }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = tutorialSteps[currentStep];
  const IconComponent = step.icon;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center border-b">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <IconComponent className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">{step.title}</CardTitle>
          <p className="text-muted-foreground">{step.description}</p>
          <div className="flex justify-center gap-1 mt-4">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            {step.content.map((text, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-base leading-relaxed">{text}</p>
              </div>
            ))}
            
            {step.tip && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="text-xs">TIP</Badge>
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    {step.tip}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <div className="border-t p-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleSkip}
                className="text-sm"
              >
                Skip Tutorial
              </Button>
              {currentStep > 0 && (
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  className="text-sm"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {tutorialSteps.length}
            </div>
            
            <Button 
              onClick={handleNext}
              size="lg"
              className="text-sm px-6"
            >
              {isLastStep ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Start Playing!
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
