
import React, { ReactNode, useEffect, useRef, useState } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay: number;
}

export const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay * 1000);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`bg-accent p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6 transform transition-transform group-hover:rotate-6">
        {icon}
      </div>
      <h4 className="text-2xl font-playfair font-bold mb-4 text-primary">{title}</h4>
      <p className="text-gray-600 leading-relaxed">{description}</p>
      
      <div className="mt-6 h-1 w-12 bg-secondary/50 rounded-full transform origin-left transition-all duration-300 group-hover:w-full"></div>
    </div>
  );
};
