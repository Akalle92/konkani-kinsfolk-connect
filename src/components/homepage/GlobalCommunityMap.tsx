
import React, { useEffect, useRef } from "react";

export const GlobalCommunityMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Just a placeholder for the map implementation
    // In a real app, this would be replaced with an actual map library
    const createVirtualMap = () => {
      const map = mapRef.current;
      if (!map) return;
      
      // Clear any existing content
      map.innerHTML = '';
      
      // Create a simple styled div to represent a map
      map.style.position = 'relative';
      map.style.height = '400px';
      map.style.backgroundColor = '#f0f8ff';
      map.style.borderRadius = '8px';
      map.style.overflow = 'hidden';
      
      // Add a gradient background to simulate water
      const background = document.createElement('div');
      background.style.position = 'absolute';
      background.style.inset = '0';
      background.style.backgroundImage = 'linear-gradient(180deg, #e6f2ff 0%, #b3d9ff 100%)';
      map.appendChild(background);
      
      // Add dots for community members
      const locations = [
        { x: '20%', y: '30%', size: 'lg', color: '#FF6600', label: 'Mumbai' },
        { x: '22%', y: '35%', size: 'sm', color: '#FF6600' },
        { x: '25%', y: '32%', size: 'sm', color: '#FF6600' },
        
        { x: '80%', y: '25%', size: 'md', color: '#FF6600', label: 'San Francisco' },
        { x: '78%', y: '28%', size: 'sm', color: '#FF6600' },
        
        { x: '45%', y: '65%', size: 'md', color: '#FF6600', label: 'Mangalore' },
        { x: '47%', y: '67%', size: 'sm', color: '#FF6600' },
        
        // Add new city locations for Konkani communities
        { x: '45.5%', y: '63%', size: 'md', color: '#FF6600', label: 'Mangaluru' },
        { x: '44%', y: '60%', size: 'md', color: '#FF6600', label: 'Udipi' },
        { x: '43%', y: '58%', size: 'md', color: '#FF6600', label: 'Karwar' },
        { x: '42%', y: '62%', size: 'md', color: '#FF6600', label: 'Goa' },
        { x: '46%', y: '57%', size: 'md', color: '#FF6600', label: 'Dharwad' },
        
        { x: '55%', y: '20%', size: 'md', color: '#FF6600', label: 'London' },
        
        { x: '85%', y: '70%', size: 'md', color: '#FF6600', label: 'Sydney' },
        { x: '83%', y: '73%', size: 'sm', color: '#FF6600' },
        
        { x: '30%', y: '50%', size: 'md', color: '#FF6600', label: 'Dubai' },
      ];
      
      locations.forEach(loc => {
        const dot = document.createElement('div');
        dot.style.position = 'absolute';
        dot.style.left = loc.x;
        dot.style.top = loc.y;
        
        let size = '8px';
        if (loc.size === 'md') size = '12px';
        if (loc.size === 'lg') size = '16px';
        if (loc.size === 'sm') size = '6px';
        
        dot.style.width = size;
        dot.style.height = size;
        dot.style.borderRadius = '50%';
        dot.style.backgroundColor = loc.color;
        dot.style.transform = 'translate(-50%, -50%)';
        dot.style.boxShadow = '0 0 0 rgba(255, 102, 0, 0.4)';
        dot.style.animation = 'pulse 2s infinite';
        
        // Add pulse animation
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
        `;
        document.head.appendChild(style);
        
        map.appendChild(dot);
        
        // Add labels for larger dots
        if (loc.label) {
          const label = document.createElement('div');
          label.style.position = 'absolute';
          label.style.left = loc.x;
          label.style.top = loc.y;
          label.style.transform = 'translate(-50%, 10px)';
          label.style.color = '#333';
          label.style.fontSize = '12px';
          label.style.fontWeight = 'bold';
          label.style.textShadow = '0 0 2px white';
          label.textContent = loc.label;
          map.appendChild(label);
        }
      });
      
      // Add a "Connecting Lines" effect
      const canvas = document.createElement('canvas');
      canvas.style.position = 'absolute';
      canvas.style.inset = '0';
      canvas.width = map.clientWidth;
      canvas.height = map.clientHeight;
      map.appendChild(canvas);
      
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
          
          // Add more connections between the Konkani cities
          { from: { x: 0.455, y: 0.63 }, to: { x: 0.44, y: 0.6 } },
          { from: { x: 0.44, y: 0.6 }, to: { x: 0.43, y: 0.58 } },
          { from: { x: 0.43, y: 0.58 }, to: { x: 0.42, y: 0.62 } },
          { from: { x: 0.42, y: 0.62 }, to: { x: 0.455, y: 0.63 } },
          { from: { x: 0.46, y: 0.57 }, to: { x: 0.44, y: 0.6 } },
        ];
        
        connections.forEach(conn => {
          ctx.beginPath();
          ctx.moveTo(conn.from.x * canvas.width, conn.from.y * canvas.height);
          ctx.lineTo(conn.to.x * canvas.width, conn.to.y * canvas.height);
          ctx.stroke();
        });
      }
    };
    
    createVirtualMap();
    
    // Redraw on resize
    const handleResize = () => {
      createVirtualMap();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={mapRef} className="w-full h-96 bg-gray-100 rounded-lg"></div>
  );
};
