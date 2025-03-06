
import { useState } from "react";
import { 
  ZoomIn, 
  ZoomOut, 
  Target, 
  User, 
  Filter, 
  Image, 
  Maximize2, 
  Minimize2, 
  Search,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { GraphControls } from "../types/graph-types";

interface FamilyTreeControlsProps {
  controls: GraphControls;
  hasCurrentUser: boolean;
  currentUserId?: string | null;
}

export function FamilyTreeControls({ 
  controls, 
  hasCurrentUser, 
  currentUserId 
}: FamilyTreeControlsProps) {
  const [isCompact, setIsCompact] = useState(false);
  const [showImages, setShowImages] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleZoomIn = () => controls.zoom(1.2);
  const handleZoomOut = () => controls.zoom(0.8);
  const handleCenter = () => controls.center();
  const handleFocusUser = () => {
    if (currentUserId) {
      controls.focusNode(currentUserId);
    }
  };
  
  const handleToggleCompact = () => {
    setIsCompact(!isCompact);
    if (controls.toggleCompactMode) {
      controls.toggleCompactMode();
    }
  };
  
  const handleToggleImages = () => {
    setShowImages(!showImages);
    if (controls.toggleShowImages) {
      controls.toggleShowImages();
    }
  };
  
  const handleFilterByGender = (gender: string | null) => {
    if (controls.filterByGender) {
      controls.filterByGender(gender);
    }
  };
  
  const handleFilterByGeneration = (generation: number | null) => {
    if (controls.filterByGeneration) {
      controls.filterByGeneration(generation);
    }
  };
  
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <TooltipProvider>
        <div className="bg-background border rounded-lg shadow-sm p-1 flex flex-col gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleCenter}>
                <Target className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Center View</p>
            </TooltipContent>
          </Tooltip>
          
          {hasCurrentUser && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleFocusUser}>
                  <User className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Focus on You</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          <Separator className="my-1" />
          
          <Popover>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Search</p>
              </TooltipContent>
            </Tooltip>
            <PopoverContent side="left" className="w-64">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Search Member</h4>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type name..."
                    className="w-full pr-8 pl-2 py-1 text-sm rounded-md border"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <div className="max-h-40 overflow-y-auto border rounded-md p-1">
                    <p className="text-center text-sm text-muted-foreground p-2">
                      No results found
                    </p>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Filters</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent side="left" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleFilterByGender(null)}>
                  Show All Genders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterByGender('Male')}>
                  Show Males Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterByGender('Female')}>
                  Show Females Only
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <Separator className="my-1" />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleFilterByGeneration(null)}>
                  Show All Generations
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterByGeneration(1)}>
                  Show 1st Generation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterByGeneration(2)}>
                  Show 2nd Generation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterByGeneration(3)}>
                  Show 3rd Generation
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleToggleImages}
                className={!showImages ? "text-muted-foreground" : ""}
              >
                <Image className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{showImages ? "Hide" : "Show"} Photos</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleToggleCompact}
              >
                {isCompact ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{isCompact ? "Expanded" : "Compact"} View</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
