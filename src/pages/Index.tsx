
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  TreePine, Users, ShieldCheck, ArrowRight, Globe, Heart, 
  MapPin, Calendar, ChevronLeft, ChevronRight, ArrowUp,
  Facebook, Twitter, Instagram, Linkedin, Waves
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AnimatedHero } from "@/components/homepage/AnimatedHero";
import { FeatureCard } from "@/components/homepage/FeatureCard";
import { TestimonialSlider } from "@/components/homepage/TestimonialSlider";
import { GlobalCommunityMap } from "@/components/homepage/GlobalCommunityMap";
import { ParallaxStats } from "@/components/homepage/ParallaxStats";
import { StickyHeader } from "@/components/homepage/StickyHeader";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const statsRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
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

  const nextTestimonial = () => {
    setActiveTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
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
        {/* Hero Section */}
        <AnimatedHero 
          onExploreClick={handleTreesNavigation}
          user={user}
        />

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <h3 className="text-4xl font-playfair font-bold text-center mb-16 text-primary animate-fade-in">
              Why Create Your Konkani Family Tree?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <FeatureCard 
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Community Stats Section */}
        <ParallaxStats stats={stats} statsRef={statsRef} />

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-playfair font-bold text-center mb-12 text-primary">
              Community Success Stories
            </h3>
            <div className="relative">
              <TestimonialSlider 
                testimonials={testimonials} 
                activeIndex={activeTestimonialIndex}
              />
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded-full"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded-full"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </section>

        {/* Global Community Map */}
        <section className="py-16 bg-accent">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-playfair font-bold text-center mb-8 text-primary">
              Our Global Konkani Community
            </h3>
            <p className="text-center text-gray-700 max-w-2xl mx-auto mb-12">
              Discover Konkani families across the world and connect with your extended community.
            </p>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <GlobalCommunityMap />
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Waves className="w-full h-full text-white animate-[wave_15s_ease-in-out_infinite]" />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h3 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-6">
              Ready to Connect With Your Konkani Roots?
            </h3>
            <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
              Join our community today and start building your family tree, connecting with relatives, and preserving your heritage for generations to come.
            </p>
            <Button 
              className="bg-secondary text-black hover:bg-secondary/90 px-8 py-6 text-lg font-semibold transform transition-transform duration-300 hover:scale-105"
              onClick={() => navigate("/auth")}
            >
              Join the Community
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-primary/90 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h4 className="font-playfair text-2xl mb-4">About Konkannect</h4>
              <p className="text-white/80 leading-relaxed">
                Dedicated to preserving and connecting Konkani families worldwide through our innovative family tree platform.
              </p>
              <div className="flex space-x-4 pt-4">
                <a href="#" className="text-white/80 hover:text-secondary transition-colors" aria-label="Facebook">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-white/80 hover:text-secondary transition-colors" aria-label="Twitter">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-white/80 hover:text-secondary transition-colors" aria-label="Instagram">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-white/80 hover:text-secondary transition-colors" aria-label="LinkedIn">
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-playfair text-2xl mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/80 hover:text-secondary transition-colors story-link">How It Works</a></li>
                <li><a href="#" className="text-white/80 hover:text-secondary transition-colors story-link">Privacy Policy</a></li>
                <li><a href="#" className="text-white/80 hover:text-secondary transition-colors story-link">Contact Us</a></li>
                <li><a href="#" className="text-white/80 hover:text-secondary transition-colors story-link">Help & Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-playfair text-2xl mb-4">Newsletter</h4>
              <p className="text-white/80 mb-4">Stay updated with the latest features and community events.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 rounded-l-md w-full focus:outline-none text-gray-800"
                />
                <button className="bg-secondary text-black px-4 py-2 rounded-r-md hover:bg-secondary/90">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-12 pt-6 text-center text-white/60 text-sm">
            &copy; {new Date().getFullYear()} Konkannect. All rights reserved.
          </div>
        </div>
      </footer>

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

const features = [
  {
    icon: <TreePine className="w-8 h-8 text-primary" />,
    title: "Build Your Tree",
    description: "Create and visualize your family connections with our intuitive tree builder.",
  },
  {
    icon: <Globe className="w-8 h-8 text-primary" />,
    title: "Global Network",
    description: "Connect with Konkani families across the world and discover your extended family.",
  },
  {
    icon: <Heart className="w-8 h-8 text-primary" />,
    title: "Preserve Heritage",
    description: "Document family stories, traditions, and cultural practices for future generations.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Verify Members",
    description: "Ensure accuracy with our member verification system and privacy controls.",
  },
];

const stats = [
  { value: "5,000+", label: "Active Members" },
  { value: "120+", label: "Villages Represented" },
  { value: "450+", label: "Family Trees Created" },
  { value: "15+", label: "Countries Spanning" },
];

const testimonials = [
  {
    name: "Radha Kamath",
    location: "Mumbai, India",
    quote: "Through Konkannect, I discovered relatives I never knew existed in Goa. We've since reconnected and shared family stories spanning generations.",
    avatar: "/placeholder.svg",
  },
  {
    name: "Vinay Shenoy",
    location: "Mangalore, India",
    quote: "Building my family tree helped my children understand their roots. The platform's simplicity made it easy to document our heritage.",
    avatar: "/placeholder.svg",
  },
  {
    name: "Asha Pai",
    location: "San Francisco, USA",
    quote: "Living abroad, I felt disconnected from my Konkani culture. This platform helped me reconnect with my extended family and cultural identity.",
    avatar: "/placeholder.svg",
  },
];

export default Index;
