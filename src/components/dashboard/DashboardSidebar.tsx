
import { Link } from "react-router-dom";
import { TreePine, Clock, Star, User, Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/auth/hooks";

export function DashboardSidebar() {
  const { user } = useAuth();
  
  return (
    <div className="w-64 h-screen border-r bg-background flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-2">
          <TreePine className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Family Navigator</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search family members..." 
            className="w-full pl-8 pr-3 py-2 text-sm rounded-md border bg-background"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-xs uppercase text-muted-foreground tracking-wider mb-3">
              My Trees
            </h3>
            <div className="space-y-1">
              <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                <Link to="/trees">
                  <TreePine className="mr-2 h-4 w-4" />
                  <span>All Family Trees</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                <span>Recently Viewed</span>
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-xs uppercase text-muted-foreground tracking-wider mb-3">
              Favorites
            </h3>
            <div className="space-y-1">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Star className="mr-2 h-4 w-4" />
                <span>Favorite Members</span>
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-xs uppercase text-muted-foreground tracking-wider mb-3">
              User
            </h3>
            <div className="space-y-1">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t mt-auto">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.email?.split('@')[0] || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
