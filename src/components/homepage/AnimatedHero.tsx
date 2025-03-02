import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface AnimatedHeroProps {
  onExploreClick: () => void;
  user: User | null;
}

export const AnimatedHero = ({ onExploreClick, user }: AnimatedHeroProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    
    const { left, top, width, height } = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    setMousePosition({ x, y });
  };

  useEffect(() => {
    const heroBg = document.querySelector('.hero-bg') as HTMLElement;
    const heroContent = document.querySelector('.hero-content') as HTMLElement;
    
    if (heroBg && heroContent) {
      const x = mousePosition.x * 20; // Subtle movement
      const y = mousePosition.y * 10;
      
      heroBg.style.transform = `translate(${-x}px, ${-y}px)`;
      heroContent.style.transform = `translate(${x / 2}px, ${y / 2}px)`;
    }
  }, [mousePosition]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const parallaxBg = document.querySelector('.parallax-bg') as HTMLElement;
      if (parallaxBg) {
        parallaxBg.style.transform = `translateY(${scrollY * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen pt-24 pb-16 relative flex items-center overflow-hidden"
    >
      {/* Background with parallax effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="hero-bg absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-accent w-[110%] h-[110%] transition-transform duration-200 ease-out"></div>
        <div className="parallax-bg absolute inset-0 bg-[url('/placeholder.svg')] opacity-10 bg-cover bg-center"></div>
        
        {/* Animated wave pattern */}
        <svg className="absolute bottom-0 left-0 w-full opacity-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#FF6600" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,186.7C960,192,1056,224,1152,229.3C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="hero-content transition-transform duration-200 ease-out">
            <div className="space-y-6">
              <div className="inline-block bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-primary font-medium animate-bounce">
                Welcome to Konkannect
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-primary leading-tight">
                Connect With Your{" "}
                <span className="text-secondary relative inline-block">
                  Sarawat Heritage
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 358 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9C72.6667 5 142.333 3 212 3C281.667 3 351.333 5 421 9" stroke="#FF6600" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                </span>
              </h2>
              <p className="text-xl font-inter text-gray-700 leading-relaxed md:pr-12 animate-fade-in">
                Discover and preserve your family's history through our interactive family tree platform. 
                Connect with relatives, share stories, and build your family's legacy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  className="bg-primary text-white hover:bg-primary/90 px-8 py-6 text-lg font-semibold flex items-center gap-2 group transform transition hover:translate-y-[-2px]"
                  onClick={onExploreClick}
                >
                  {user ? "View My Trees" : "Start Your Family Tree"}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  className="px-8 py-6 text-lg border-2 hover:bg-accent/50"
                  onClick={onExploreClick}
                >
                  Explore Trees
                </Button>
              </div>
            </div>
          </div>
          <div className="relative lg:pl-12 hidden md:block">
            <div className="absolute -top-8 -right-8 w-64 h-64 bg-secondary/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-primary/20 rounded-full blur-xl animate-pulse opacity-70"></div>
            <div className="relative z-10 bg-white p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 rotate-3 hover:rotate-0">
              <img src="/placeholder.svg" alt="Konkani Family Celebration" className="w-full rounded-lg" />
              <div className="absolute -bottom-6 -right-6 bg-primary text-white p-4 rounded-lg shadow-lg transform rotate-12 hover:rotate-0 transition-transform">
                <span className="block text-sm font-medium">Join 5,000+ members</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
