
import React from "react";
import { Button } from "@/components/ui/button";
import { Waves } from "lucide-react";

interface CtaSectionProps {
  navigateToAuth: () => void;
}

export const CtaSection = ({ navigateToAuth }: CtaSectionProps) => {
  return (
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
          onClick={navigateToAuth}
        >
          Join the Community
        </Button>
      </div>
    </section>
  );
};
