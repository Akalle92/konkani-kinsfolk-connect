
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TreePine } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface StickyHeaderProps {
  user: User | null;
  onSignOut: () => void;
  navigateToAuth: () => void;
  navigateToTrees: () => void;
}

export const StickyHeader = ({ user, onSignOut, navigateToAuth, navigateToTrees }: StickyHeaderProps) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full py-4 z-50 transition-all duration-300 ${
        isSticky
          ? "fixed top-0 bg-white/95 backdrop-blur-sm shadow-md"
          : "bg-primary absolute top-0 left-0 right-0"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TreePine className={`mr-2 h-8 w-8 ${isSticky ? "text-primary" : "text-white"}`} />
            <h1 className={`text-3xl font-playfair font-bold ${isSticky ? "text-primary" : "text-white"}`}>
              Konkannect
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  className={`${
                    isSticky ? "text-primary hover:text-primary hover:bg-primary/10" : "text-white hover:text-secondary hover:bg-primary/90"
                  }`}
                  onClick={navigateToTrees}
                >
                  My Trees
                </Button>
                <Button
                  className="bg-secondary text-black hover:bg-secondary/90 font-semibold"
                  onClick={onSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className={`${
                    isSticky ? "text-primary hover:text-primary hover:bg-primary/10" : "text-white hover:text-secondary hover:bg-primary/90"
                  }`}
                  onClick={navigateToAuth}
                >
                  Login
                </Button>
                <Button
                  className="bg-secondary text-black hover:bg-secondary/90 font-semibold"
                  onClick={navigateToAuth}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              className={`${isSticky ? "text-primary" : "text-white"}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 bg-white rounded-lg shadow-lg animate-fade-in">
            <div className="flex flex-col space-y-2 p-4">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    className="text-primary justify-start"
                    onClick={navigateToTrees}
                  >
                    My Trees
                  </Button>
                  <Button
                    className="bg-secondary text-black hover:bg-secondary/90 font-semibold justify-start"
                    onClick={onSignOut}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-primary justify-start"
                    onClick={navigateToAuth}
                  >
                    Login
                  </Button>
                  <Button
                    className="bg-secondary text-black hover:bg-secondary/90 font-semibold justify-start"
                    onClick={navigateToAuth}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
