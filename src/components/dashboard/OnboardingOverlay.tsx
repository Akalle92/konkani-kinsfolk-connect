
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface OnboardingOverlayProps {
  onDismiss: () => void;
}

export function OnboardingOverlay({ onDismiss }: OnboardingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps: OnboardingStep[] = [
    {
      title: "Welcome to Saraswat Family Tree",
      description: "Build, explore, and share your family's legacy with our intuitive platform.",
      icon: <span className="text-4xl">👋</span>
    },
    {
      title: "Create Your First Tree",
      description: "Start by creating a family tree and adding yourself as the first member.",
      icon: <span className="text-4xl">🌳</span>
    },
    {
      title: "Add Family Members",
      description: "Connect your relatives and build your family network with detailed profiles.",
      icon: <span className="text-4xl">👨‍👩‍👧‍👦</span>
    },
    {
      title: "Discover and Share",
      description: "Explore your family history and share it with relatives to collaborate.",
      icon: <span className="text-4xl">🔍</span>
    }
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onDismiss();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2" 
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex justify-center mb-4">
            {steps[currentStep].icon}
          </div>
          <CardTitle className="text-xl text-center">{steps[currentStep].title}</CardTitle>
          <CardDescription className="text-center">
            {steps[currentStep].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center space-x-1 mt-4">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`h-2 rounded-full ${
                  index === currentStep 
                    ? 'w-6 bg-primary' 
                    : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="ghost" 
            onClick={onDismiss}
          >
            Skip
          </Button>
          <Button onClick={handleNext}>
            {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
