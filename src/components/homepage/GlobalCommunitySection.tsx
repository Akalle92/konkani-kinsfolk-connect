
import React from "react";
import { GlobalCommunityMap } from "@/components/homepage/GlobalCommunityMap";

export const GlobalCommunitySection = () => {
  return (
    <section className="py-16 bg-accent">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-playfair font-bold text-center mb-8 text-primary">
          Our Global Sarawat Community
        </h3>
        <p className="text-center text-gray-700 max-w-2xl mx-auto mb-12">
          Discover Sarawat families across the world and connect with your extended community.
        </p>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <GlobalCommunityMap />
        </div>
      </div>
    </section>
  );
};
