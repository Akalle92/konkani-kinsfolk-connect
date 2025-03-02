
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home,
  User,
  Users,
  TreePine,
  LogOut,
  LogIn,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MainNavigation = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
      toast("Signed out successfully", {
        description: "You have been logged out",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast("Error signing out", {
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navItems = [
    { path: "/", label: "Home", icon: <Home className="mr-2 h-4 w-4" /> },
    { path: "/dashboard", label: "Dashboard", icon: <User className="mr-2 h-4 w-4" /> },
    { path: "/trees", label: "Family Trees", icon: <TreePine className="mr-2 h-4 w-4" /> },
    // Add more nav items as they're developed
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center font-semibold text-xl">
              <TreePine className="mr-2 h-6 w-6" />
              <span className="hidden md:inline-block">Konkani Community</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                asChild
                variant={isActive(item.path) ? "default" : "ghost"}
                className={cn(
                  "h-10",
                  isActive(item.path) && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                <Link to={item.path}>
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:space-x-2">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground mr-2">
                  {user.email?.split('@')[0]}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild size="sm">
                <Link to="/auth">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="container mx-auto px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                asChild
                variant={isActive(item.path) ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive(item.path) && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
                onClick={closeMenu}
              >
                <Link to={item.path}>
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            ))}
            
            {user ? (
              <Button 
                variant="outline" 
                className="w-full justify-start mt-4"
                onClick={() => {
                  handleSignOut();
                  closeMenu();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button 
                asChild 
                className="w-full justify-start mt-4"
                onClick={closeMenu}
              >
                <Link to="/auth">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNavigation;
