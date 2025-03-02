
import React, { useEffect, useRef, useState } from "react";

export const GlobalCommunityMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only create the map when it's visible in viewport
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (mapRef.current) {
      observer.observe(mapRef.current);
    }
    
    return () => {
      if (mapRef.current) {
        observer.unobserve(mapRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (!isVisible || !mapRef.current) return;
    
    // Virtual map implementation
    const createVirtualMap = () => {
      const map = mapRef.current;
      if (!map) return;
      
      // Clear any existing content
      map.innerHTML = '';
      
      // Create a simple styled div to represent a map
      map.style.position = 'relative';
      map.style.height = '400px';
      map.style.backgroundColor = '#f0f8ff';
      map.style.borderRadius = '12px';
      map.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.1)';
      map.style.overflow = 'hidden';
      
      // Add a gradient background to simulate water
      const background = document.createElement('div');
      background.style.position = 'absolute';
      background.style.inset = '0';
      background.style.backgroundImage = 'linear-gradient(180deg, #e6f2ff 0%, #b3d9ff 100%)';
      background.style.transition = 'opacity 0.4s ease-in-out';
      background.classList.add('animate-smooth-fade-in');
      map.appendChild(background);
      
      // Add subtle continent silhouettes for better visual appeal
      const continents = document.createElement('div');
      continents.style.position = 'absolute';
      continents.style.inset = '0';
      continents.style.opacity = '0.15';
      continents.style.backgroundImage = 'url("https://i.imgur.com/97NbBE9.png")';
      continents.style.backgroundSize = 'cover';
      continents.style.backgroundPosition = 'center';
      continents.style.transition = 'opacity 0.6s ease-in-out';
      continents.classList.add('animate-smooth-fade-in');
      map.appendChild(continents);
      
      // Add dots for community members
      const locations = [
        { x: '20%', y: '30%', size: 'lg', color: '#FF6600', label: 'Mumbai' },
        { x: '22%', y: '35%', size: 'sm', color: '#FF6600' },
        { x: '25%', y: '32%', size: 'sm', color: '#FF6600' },
        
        { x: '80%', y: '25%', size: 'md', color: '#FF6600', label: 'San Francisco' },
        { x: '78%', y: '28%', size: 'sm', color: '#FF6600' },
        
        { x: '45%', y: '65%', size: 'md', color: '#FF6600', label: 'Mangalore' },
        { x: '47%', y: '67%', size: 'sm', color: '#FF6600' },
        
        // Konkani communities with enhanced visibility
        { x: '45.5%', y: '63%', size: 'md', color: '#FF6600', label: 'Mangaluru', highlight: true },
        { x: '44%', y: '60%', size: 'md', color: '#FF6600', label: 'Udipi', highlight: true },
        { x: '43%', y: '58%', size: 'md', color: '#FF6600', label: 'Karwar', highlight: true },
        { x: '42%', y: '62%', size: 'md', color: '#FF6600', label: 'Goa', highlight: true },
        { x: '46%', y: '57%', size: 'md', color: '#FF6600', label: 'Dharwad', highlight: true },
        
        { x: '55%', y: '20%', size: 'md', color: '#FF6600', label: 'London' },
        
        { x: '85%', y: '70%', size: 'md', color: '#FF6600', label: 'Sydney' },
        { x: '83%', y: '73%', size: 'sm', color: '#FF6600' },
        
        { x: '30%', y: '50%', size: 'md', color: '#FF6600', label: 'Dubai' },
      ];
      
      // Create container for dots to manage stacking context
      const dotsContainer = document.createElement('div');
      dotsContainer.style.position = 'absolute';
      dotsContainer.style.inset = '0';
      dotsContainer.style.pointerEvents = 'none';
      dotsContainer.style.zIndex = '10';
      map.appendChild(dotsContainer);
      
      // Add dots with staggered animation
      locations.forEach((loc, index) => {
        const dotContainer = document.createElement('div');
        dotContainer.style.position = 'absolute';
        dotContainer.style.left = loc.x;
        dotContainer.style.top = loc.y;
        dotContainer.style.transform = 'translate(-50%, -50%)';
        dotContainer.style.zIndex = '20';
        
        // Add delay to create staggered appearance
        dotContainer.style.animationDelay = `${index * 100}ms`;
        dotContainer.classList.add('animate-smooth-fade-in');
        
        const dot = document.createElement('div');
        
        let size = '8px';
        if (loc.size === 'md') size = '12px';
        if (loc.size === 'lg') size = '16px';
        if (loc.size === 'sm') size = '6px';
        
        dot.style.width = size;
        dot.style.height = size;
        dot.style.borderRadius = '50%';
        dot.style.backgroundColor = loc.color;
        dot.style.boxShadow = loc.highlight 
          ? `0 0 0 rgba(255, 102, 0, 0.4), 0 0 10px rgba(255, 102, 0, 0.6)` 
          : `0 0 0 rgba(255, 102, 0, 0.4)`;
        dot.style.animation = loc.highlight 
          ? 'pulse 2s infinite, float 3s infinite ease-in-out' 
          : 'pulse 2s infinite';
        
        dotContainer.appendChild(dot);
        dotsContainer.appendChild(dotContainer);
        
        // Add labels for larger dots
        if (loc.label) {
          const labelElement = document.createElement('div');
          labelElement.style.position = 'absolute';
          labelElement.style.left = '50%';
          labelElement.style.bottom = '-18px';
          labelElement.style.transform = 'translateX(-50%)';
          labelElement.style.color = loc.highlight ? '#333' : '#555';
          labelElement.style.fontSize = loc.highlight ? '13px' : '12px';
          labelElement.style.fontWeight = loc.highlight ? '600' : '500';
          labelElement.style.textShadow = '0 0 4px white';
          labelElement.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
          labelElement.style.padding = '2px 6px';
          labelElement.style.borderRadius = '10px';
          labelElement.style.whiteSpace = 'nowrap';
          labelElement.textContent = loc.label;
          
          // Add tooltip functionality
          if (loc.highlight) {
            labelElement.style.cursor = 'pointer';
            labelElement.style.transition = 'all 0.2s ease';
            
            // Hover effect
            labelElement.onmouseenter = () => {
              labelElement.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
              labelElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              labelElement.style.transform = 'translateX(-50%) scale(1.05)';
            };
            
            labelElement.onmouseleave = () => {
              labelElement.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
              labelElement.style.boxShadow = 'none';
              labelElement.style.transform = 'translateX(-50%) scale(1)';
            };
          }
          
          dotContainer.appendChild(labelElement);
        }
      });
      
      // Add a "Connecting Lines" effect with canvas for better performance
      const canvas = document.createElement('canvas');
      canvas.style.position = 'absolute';
      canvas.style.inset = '0';
      canvas.style.opacity = '0';
      canvas.style.transition = 'opacity 1s ease-in-out';
      canvas.width = map.clientWidth;
      canvas.height = map.clientHeight;
      map.appendChild(canvas);
      
      // Delayed opacity to create animated appearance
      setTimeout(() => {
        canvas.style.opacity = '1';
      }, 500);
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = 'rgba(255, 102, 0, 0.2)';
        ctx.lineWidth = 1;
        
        // Draw some connections
        const connections = [
          { from: { x: 0.2, y: 0.3 }, to: { x: 0.45, y: 0.65 } },
          { from: { x: 0.45, y: 0.65 }, to: { x: 0.8, y: 0.25 } },
          { from: { x: 0.2, y: 0.3 }, to: { x: 0.55, y: 0.2 } },
          { from: { x: 0.45, y: 0.65 }, to: { x: 0.3, y: 0.5 } },
          { from: { x: 0.3, y: 0.5 }, to: { x: 0.85, y: 0.7 } },
          
          // Konkani region connections with higher visibility
          { from: { x: 0.455, y: 0.63 }, to: { x: 0.44, y: 0.6 }, highlight: true },
          { from: { x: 0.44, y: 0.6 }, to: { x: 0.43, y: 0.58 }, highlight: true },
          { from: { x: 0.43, y: 0.58 }, to: { x: 0.42, y: 0.62 }, highlight: true },
          { from: { x: 0.42, y: 0.62 }, to: { x: 0.455, y: 0.63 }, highlight: true },
          { from: { x: 0.46, y: 0.57 }, to: { x: 0.44, y: 0.6 }, highlight: true },
        ];
        
        // Draw connections with animation
        connections.forEach((conn, index) => {
          setTimeout(() => {
            ctx.beginPath();
            ctx.moveTo(conn.from.x * canvas.width, conn.from.y * canvas.height);
            ctx.lineTo(conn.to.x * canvas.width, conn.to.y * canvas.height);
            
            if (conn.highlight) {
              ctx.strokeStyle = 'rgba(255, 102, 0, 0.4)';
              ctx.lineWidth = 1.5;
            } else {
              ctx.strokeStyle = 'rgba(255, 102, 0, 0.2)';
              ctx.lineWidth = 1;
            }
            
            ctx.stroke();
          }, index * 120); // Staggered drawing of connections
        });
      }
      
      // Add a legend
      const legend = document.createElement('div');
      legend.style.position = 'absolute';
      legend.style.right = '10px';
      legend.style.bottom = '10px';
      legend.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
      legend.style.padding = '8px';
      legend.style.borderRadius = '8px';
      legend.style.fontSize = '12px';
      legend.style.display = 'flex';
      legend.style.alignItems = 'center';
      legend.style.gap = '8px';
      legend.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      legend.style.zIndex = '30';
      
      const legendDot = document.createElement('div');
      legendDot.style.width = '10px';
      legendDot.style.height = '10px';
      legendDot.style.borderRadius = '50%';
      legendDot.style.backgroundColor = '#FF6600';
      
      const legendText = document.createElement('span');
      legendText.textContent = 'Konkani Communities';
      legendText.style.color = '#333';
      
      legend.appendChild(legendDot);
      legend.appendChild(legendText);
      map.appendChild(legend);
      
      // Add a "pulse" animation effect
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 102, 0, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 102, 0, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 102, 0, 0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `;
      document.head.appendChild(style);
    };
    
    createVirtualMap();
    
    // Redraw on resize for responsive behavior
    const handleResize = () => {
      createVirtualMap();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isVisible]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-96 bg-muted rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
        aria-label="Map showing global Konkani community locations"
        role="img"
      >
        {!isVisible && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" aria-hidden="true"></div>
          </div>
        )}
      </div>
      <div className="mt-4 text-sm text-center text-muted-foreground animate-smooth-fade-in">
        <p>Explore Konkani communities worldwide. The highlighted region shows the concentrated Konkani cultural heartland.</p>
      </div>
    </div>
  );
};
