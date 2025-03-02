
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TreePine, Users, ShieldCheck, ArrowRight, Globe, Heart, MapPin, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
      });
    }
  };

  const handleTreesNavigation = () => {
    if (user) {
      navigate("/trees");
    } else {
      navigate("/auth");
      toast({
        title: "Authentication Required",
        description: "Please sign in to view or create family trees.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-accent">
      <nav className="bg-primary shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-playfair text-white font-bold">Konkannect</h1>
          <div className="space-x-4">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-secondary hover:bg-primary/90"
                  onClick={() => navigate("/trees")}
                >
                  My Trees
                </Button>
                <Button 
                  className="bg-secondary text-black hover:bg-secondary/90 font-semibold"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-secondary hover:bg-primary/90"
                  onClick={() => navigate("/auth")}
                >
                  Login
                </Button>
                <Button 
                  className="bg-secondary text-black hover:bg-secondary/90 font-semibold"
                  onClick={() => navigate("/auth")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl font-playfair font-bold text-primary leading-tight">
                  Connect With Your Konkani Heritage
                </h2>
                <p className="text-xl font-inter text-gray-700 leading-relaxed">
                  Discover and preserve your family's history through our interactive family tree platform. 
                  Connect with relatives, share stories, and build your family's legacy.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-primary text-white hover:bg-primary/90 px-8 py-6 text-lg font-semibold flex items-center gap-2"
                  onClick={handleTreesNavigation}
                >
                  {user ? "View My Trees" : "Start Your Family Tree"}
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  className="px-8 py-6 text-lg border-2 hover:bg-accent/50"
                  onClick={handleTreesNavigation}
                >
                  Explore Trees
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-8 -right-8 w-64 h-64 bg-secondary/20 rounded-full blur-xl" />
              <div className="relative z-10 bg-white p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img src="/placeholder.svg" alt="Konkani Family Celebration" className="w-full rounded-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <h3 className="text-4xl font-playfair font-bold text-center mb-16 text-primary">
              Why Create Your Konkani Family Tree?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-accent p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h4 className="text-2xl font-playfair font-bold mb-4 text-primary">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Stats Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-playfair font-bold text-center mb-12 text-primary">
              Our Growing Community
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                  <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-playfair font-bold text-center mb-12 text-primary">
              Community Success Stories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-accent p-8 rounded-xl shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                    <div>
                      <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.location}</p>
                    </div>
                  </div>
                  <p className="italic text-gray-700">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-playfair font-bold text-white mb-6">
              Ready to Connect With Your Konkani Roots?
            </h3>
            <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
              Join our community today and start building your family tree, connecting with relatives, and preserving your heritage for generations to come.
            </p>
            <Button 
              className="bg-secondary text-black hover:bg-secondary/90 px-8 py-6 text-lg font-semibold"
              onClick={() => navigate("/auth")}
            >
              Join the Community
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h4 className="font-playfair text-2xl mb-4">About Us</h4>
              <p className="text-white/80 leading-relaxed">
                Dedicated to preserving and connecting Konkani families worldwide through our innovative family tree platform.
              </p>
            </div>
            <div>
              <h4 className="font-playfair text-2xl mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/80 hover:text-secondary transition-colors">How It Works</a></li>
                <li><a href="#" className="text-white/80 hover:text-secondary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-white/80 hover:text-secondary transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-playfair text-2xl mb-4">Connect With Us</h4>
              <div className="flex space-x-6">
                <a href="#" className="text-white/80 hover:text-secondary transition-colors">Twitter</a>
                <a href="#" className="text-white/80 hover:text-secondary transition-colors">Facebook</a>
                <a href="#" className="text-white/80 hover:text-secondary transition-colors">Instagram</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: <TreePine className="w-8 h-8 text-primary" />,
    title: "Build Your Tree",
    description: "Create and visualize your family connections with our intuitive tree builder.",
  },
  {
    icon: <Globe className="w-8 h-8 text-primary" />,
    title: "Global Network",
    description: "Connect with Konkani families across the world and discover your extended family.",
  },
  {
    icon: <Heart className="w-8 h-8 text-primary" />,
    title: "Preserve Heritage",
    description: "Document family stories, traditions, and cultural practices for future generations.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Verify Members",
    description: "Ensure accuracy with our member verification system and privacy controls.",
  },
];

const stats = [
  { value: "5,000+", label: "Active Members" },
  { value: "120+", label: "Villages Represented" },
  { value: "450+", label: "Family Trees Created" },
  { value: "15+", label: "Countries Spanning" },
];

const testimonials = [
  {
    name: "Radha Kamath",
    location: "Mumbai, India",
    quote: "Through Konkannect, I discovered relatives I never knew existed in Goa. We've since reconnected and shared family stories spanning generations.",
  },
  {
    name: "Vinay Shenoy",
    location: "Mangalore, India",
    quote: "Building my family tree helped my children understand their roots. The platform's simplicity made it easy to document our heritage.",
  },
  {
    name: "Asha Pai",
    location: "San Francisco, USA",
    quote: "Living abroad, I felt disconnected from my Konkani culture. This platform helped me reconnect with my extended family and cultural identity.",
  },
];

export default Index;
