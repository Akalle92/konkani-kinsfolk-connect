
import { TreePine, Globe, Heart, ShieldCheck } from "lucide-react";
import React from "react";

export const features = [
  {
    icon: React.createElement(TreePine, { className: "w-8 h-8 text-primary" }),
    title: "Build Your Tree",
    description: "Create and visualize your family connections with our intuitive tree builder.",
  },
  {
    icon: React.createElement(Globe, { className: "w-8 h-8 text-primary" }),
    title: "Global Network",
    description: "Connect with Konkani families across the world and discover your extended family.",
  },
  {
    icon: React.createElement(Heart, { className: "w-8 h-8 text-primary" }),
    title: "Preserve Heritage",
    description: "Document family stories, traditions, and cultural practices for future generations.",
  },
  {
    icon: React.createElement(ShieldCheck, { className: "w-8 h-8 text-primary" }),
    title: "Verify Members",
    description: "Ensure accuracy with our member verification system and privacy controls.",
  },
];

export const stats = [
  { value: "5,000+", label: "Active Members" },
  { value: "120+", label: "Villages Represented" },
  { value: "450+", label: "Family Trees Created" },
  { value: "15+", label: "Countries Spanning" },
];

export const testimonials = [
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
