import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TreePine, Users, Search, ShieldCheck } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-accent">
      <nav className="bg-primary p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-playfair text-white">Konkani Family Tree</h1>
          <div className="space-x-4">
            <Button variant="ghost" className="text-white hover:text-secondary" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button className="bg-secondary text-black hover:bg-secondary/90" onClick={() => navigate("/register")}>
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-playfair font-bold text-primary mb-6">
              Connect With Your Konkani Heritage
            </h2>
            <p className="text-lg font-inter text-gray-700 mb-8">
              Discover and preserve your family's history through our interactive family tree platform. Connect with relatives, share stories, and build your family's legacy.
            </p>
            <div className="space-x-4">
              <Button className="bg-primary text-white hover:bg-primary/90 px-8 py-6 text-lg" onClick={() => navigate("/register")}>
                Start Your Family Tree
              </Button>
              <Button variant="outline" className="px-8 py-6 text-lg" onClick={() => navigate("/explore")}>
                Explore Trees
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-secondary/20 rounded-full absolute -top-8 -right-8 w-64 h-64" />
            <div className="relative z-10 bg-white p-8 rounded-lg shadow-xl">
              <img src="/placeholder.svg" alt="Family Tree Example" className="w-full rounded" />
            </div>
          </div>
        </div>

        <section className="py-16">
          <h3 className="text-3xl font-playfair font-bold text-center mb-12">
            Why Create Your Konkani Family Tree?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-playfair font-bold mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-primary text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-playfair text-xl mb-4">About Us</h4>
              <p className="text-sm opacity-80">
                Dedicated to preserving and connecting Konkani families worldwide through our innovative family tree platform.
              </p>
            </div>
            <div>
              <h4 className="font-playfair text-xl mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-secondary">How It Works</a></li>
                <li><a href="#" className="hover:text-secondary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-secondary">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-playfair text-xl mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-secondary">Twitter</a>
                <a href="#" className="hover:text-secondary">Facebook</a>
                <a href="#" className="hover:text-secondary">Instagram</a>
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
    icon: <TreePine className="w-6 h-6 text-primary" />,
    title: "Build Your Tree",
    description: "Create and visualize your family connections with our intuitive tree builder.",
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: "Connect Families",
    description: "Link your tree with other Konkani families and discover new connections.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    title: "Verify Members",
    description: "Ensure accuracy with our member verification system.",
  },
];

export default Index;
