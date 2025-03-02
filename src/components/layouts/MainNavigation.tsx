
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home,
  User,
  Users,
  TreePine,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DesktopNavigation from "./navigation/DesktopNavigation";
import AuthButtons from "./navigation/AuthButtons";
import MobileMenu from "./navigation/MobileMenu";
import { NavItem } from "./navigation/types";

const MainNavigation = () => {
  const { user, signOut, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      navigate('/auth');
      toast({
        title: "Signed out successfully",
        description: "You have been logged out"
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        style: { backgroundColor: 'red', color: 'white' }
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const navItems: NavItem[] = [
    { path: "/", label: "Home", icon: <Home className="mr-2 h-4 w-4" /> },
    { path: "/dashboard", label: "Dashboard", icon: <User className="mr-2 h-4 w-4" /> },
    { path: "/trees", label: "Family Trees", icon: <TreePine className="mr-2 h-4 w-4" /> },
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
              <span className="hidden md:inline-block">Saraswat Community</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <DesktopNavigation navItems={navItems} isActive={isActive} />

          <div className="hidden md:flex md:items-center md:space-x-2">
            <AuthButtons 
              user={user} 
              loading={loading} 
              isSigningOut={isSigningOut} 
              handleSignOut={handleSignOut} 
            />
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
      <MobileMenu 
        isMenuOpen={isMenuOpen}
        navItems={navItems}
        isActive={isActive}
        closeMenu={closeMenu}
        user={user}
        loading={loading}
        isSigningOut={isSigningOut}
        handleSignOut={handleSignOut}
      />
    </nav>
  );
};

export default MainNavigation;
