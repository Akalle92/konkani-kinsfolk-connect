
import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary/90 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h4 className="font-playfair text-2xl mb-4">About Konkannect</h4>
            <p className="text-white/80 leading-relaxed">
              Dedicated to preserving and connecting Sarawat families worldwide through our innovative family tree platform.
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
  );
};
