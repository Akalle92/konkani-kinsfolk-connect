
import { GraphNode, GraphLink } from "../types/graph-types";
import { getRelationshipStyle } from "../utils/graph-constants";

// Custom node rendering function for the graph
export const nodeCanvasObject = (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
  const { x, y, name, color, photoUrl, gender, isCurrentUser } = node;
  if (typeof x !== "number" || typeof y !== "number") return;

  // Make the current user's node slightly larger
  const baseSize = isCurrentUser ? 18 : 16;
  const size = baseSize / globalScale;
  const fontSize = 12 / globalScale;
  const nameYOffset = size + fontSize;

  // Draw highlight/glow for current user
  if (isCurrentUser) {
    ctx.beginPath();
    ctx.arc(x, y, size + 3 / globalScale, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255, 215, 0, 0.3)"; // Golden glow
    ctx.fill();
  }

  // Draw node circle
  ctx.beginPath();
  ctx.arc(x, y, size, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  
  // Special border for current user
  if (isCurrentUser) {
    ctx.strokeStyle = "#FFD700"; // Gold border
    ctx.lineWidth = 2.5 / globalScale;
  } else {
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5 / globalScale;
  }
  ctx.stroke();

  // Draw photo if available
  if (photoUrl) {
    try {
      const img = new Image();
      img.src = photoUrl;
      
      // Only draw the image if it's loaded
      if (img.complete) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, size - 1 / globalScale, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(img, x - size + 1 / globalScale, y - size + 1 / globalScale, 
                    (size - 1 / globalScale) * 2, (size - 1 / globalScale) * 2);
        ctx.restore();
      }
    } catch (e) {
      console.error("Error loading member photo:", e);
    }
  }

  // Draw "You" label for current user
  if (isCurrentUser) {
    const youLabel = "YOU";
    ctx.font = `bold ${fontSize}px Inter`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Draw background for "You" label
    const labelWidth = ctx.measureText(youLabel).width;
    ctx.fillStyle = "rgba(255, 215, 0, 0.8)";
    ctx.fillRect(x - labelWidth / 2 - 2, y - size - fontSize - 4, labelWidth + 4, fontSize + 2);
    
    // Draw "You" text
    ctx.fillStyle = "#000000";
    ctx.fillText(youLabel, x, y - size - fontSize / 2 - 3);
  }

  // Draw name
  ctx.font = `${fontSize}px Inter`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  // Draw text with white background for better readability
  const textWidth = ctx.measureText(name).width;
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fillRect(x - textWidth / 2 - 2, y + size, textWidth + 4, fontSize + 2);
  
  ctx.fillStyle = "#000000";
  ctx.fillText(name, x, y + nameYOffset);
};

// Custom link rendering with support for notes and custom relationships
export const linkCanvasObject = (link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
  const { source, target, type, notes } = link;
  if (!source || !target || typeof source.x !== 'number' || typeof target.x !== 'number') return;

  const start = { x: source.x, y: source.y };
  const end = { x: target.x, y: target.y };
  
  // Get style based on relationship type
  const style = getRelationshipStyle(type);
  
  // Draw link
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  
  // Apply style
  ctx.strokeStyle = style.color;
  ctx.lineWidth = style.width / globalScale;
  
  // Apply dashed line if needed
  if (style.dashed) {
    ctx.setLineDash([5 / globalScale, 5 / globalScale]);
  } else {
    ctx.setLineDash([]);
  }
  
  ctx.stroke();
  
  // Reset line dash
  ctx.setLineDash([]);
  
  // Draw relationship type text when zoomed in enough
  if (globalScale > 1.2 && type) {
    const textPos = {
      x: start.x + (end.x - start.x) * 0.5,
      y: start.y + (end.y - start.y) * 0.5
    };
    
    const fontSize = 10 / globalScale;
    ctx.font = `${fontSize}px Inter`;
    
    // Format the relationship text
    const displayType = type.charAt(0).toUpperCase() + type.slice(1);
    
    // Background for relationship type
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    const textWidth = ctx.measureText(displayType).width;
    ctx.fillRect(
      textPos.x - textWidth / 2 - 2,
      textPos.y - fontSize / 2 - 1,
      textWidth + 4,
      fontSize + 2
    );
    
    // Draw relationship type
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = style.color;
    ctx.fillText(displayType, textPos.x, textPos.y);
    
    // Show notes if present and zoom is sufficient
    if (notes && globalScale > 1.5) {
      const notePos = {
        x: textPos.x,
        y: textPos.y + fontSize + 2
      };
      
      const smallerFontSize = 8 / globalScale;
      ctx.font = `italic ${smallerFontSize}px Inter`;
      
      // Truncate long notes
      const noteText = notes.length > 20 ? `${notes.substring(0, 20)}...` : notes;
      const noteWidth = ctx.measureText(noteText).width;
      
      // Draw note background
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillRect(
        notePos.x - noteWidth / 2 - 2,
        notePos.y - smallerFontSize / 2 - 1,
        noteWidth + 4,
        smallerFontSize + 2
      );
      
      // Draw note text
      ctx.fillStyle = "#666666";
      ctx.fillText(noteText, notePos.x, notePos.y);
    }
  }
};
