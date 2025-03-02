
import React, { useEffect, useRef, RefObject } from "react";

interface Stat {
  value: string;
  label: string;
}

interface ParallaxStatsProps {
  stats: Stat[];
  statsRef: RefObject<HTMLDivElement>;
}

export const ParallaxStats = ({ stats, statsRef }: ParallaxStatsProps) => {
  const numbersRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateNumbers();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [statsRef]);

  const animateNumbers = () => {
    numbersRef.current.forEach((element, index) => {
      if (!element) return;
      
      const value = stats[index].value;
      const numericPart = value.replace(/\D/g, '');
      const suffix = value.replace(numericPart, '');
      
      let num = 0;
      const target = parseInt(numericPart, 10);
      const increment = Math.ceil(target / 50);
      const duration = 1500; // ms
      const stepTime = Math.floor(duration / (target / increment));
      
      const timer = setInterval(() => {
        num += increment;
        if (num >= target) {
          element.textContent = value;
          clearInterval(timer);
        } else {
          element.textContent = num + suffix;
        }
      }, stepTime);
    });
  };

  return (
    <section ref={statsRef} className="py-16 bg-primary/5 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-playfair font-bold text-center mb-12 text-primary relative z-10">
          Our Growing Community
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform"
            >
              <p 
                className="text-4xl font-bold text-primary mb-2"
                ref={el => numbersRef.current[index] = el}
              >
                0
              </p>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Parallax Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/5 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-secondary/5 animate-pulse"></div>
        <div className="absolute top-3/4 left-1/3 w-24 h-24 rounded-full bg-accent/40 animate-pulse"></div>
      </div>
    </section>
  );
};
