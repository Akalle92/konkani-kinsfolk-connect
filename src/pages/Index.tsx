
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { useAuth } from "@/contexts/auth/hooks";
import { useToast } from "@/hooks/use-toast";
import { StickyHeader } from "@/components/homepage/StickyHeader";
import { AnimatedHero } from "@/components/homepage/AnimatedHero";
import { FeatureSection } from "@/components/homepage/FeatureSection";
import { ParallaxStats } from "@/components/homepage/ParallaxStats";
import { TestimonialsSection } from "@/components/homepage/TestimonialsSection";
import { GlobalCommunitySection } from "@/components/homepage/GlobalCommunitySection";
import { CtaSection } from "@/components/homepage/CtaSection";
import { Footer } from "@/components/homepage/Footer";
import { features, stats, testimonials } from "@/components/homepage/data/homepageData";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
      });
    }
  };

  const handleTreesNavigation = () => {
    if (user) {
      navigate("/trees");
    } else {
      navigate("/auth");
      toast({
        title: "Authentication Required",
        description: "Please sign in to view or create family trees.",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-accent overflow-x-hidden">
      <StickyHeader 
        user={user} 
        onSignOut={handleSignOut} 
        navigateToAuth={() => navigate("/auth")}
        navigateToTrees={() => navigate("/trees")}
      />

      <main>
        <AnimatedHero 
          onExploreClick={handleTreesNavigation}
          user={user}
        />

        <FeatureSection features={features} />

        <ParallaxStats stats={stats} statsRef={statsRef} />

        <TestimonialsSection testimonials={testimonials} />

        <GlobalCommunitySection />

        <CtaSection navigateToAuth={() => navigate("/auth")} />
      </main>

      <Footer />

      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-primary p-3 rounded-full shadow-lg text-white hover:bg-primary/90 transition-all duration-300 animate-fade-in z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Index;
