
import React from "react";
import { FeatureCard } from "@/components/homepage/FeatureCard";

interface FeatureSectionProps {
  features: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }[];
}

export const FeatureSection = ({ features }: FeatureSectionProps) => {
  return (
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
  );
};
