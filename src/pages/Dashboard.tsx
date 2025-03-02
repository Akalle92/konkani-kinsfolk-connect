
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Bell, 
  Calendar, 
  MessageSquare, 
  Users, 
  User, 
  Edit,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const { user, userRole } = useAuth();
  
  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please log in to view your dashboard</h1>
          <Button asChild className="mt-4">
            <Link to="/auth">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.email?.split('@')[0]}
          </p>
        </div>
        <Button asChild>
          <Link to="/trees">View Your Family Trees</Link>
        </Button>
      </div>

      {/* Profile Summary Card */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Summary
              </span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Role</p>
                <Badge variant="outline" className="text-xs">
                  {userRole?.role || "User"}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Account since</p>
                <p className="text-sm text-muted-foreground">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Not available"}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              Complete Your Profile
            </Button>
          </CardFooter>
        </Card>

        {/* Community News Feed */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Community News Feed
            </CardTitle>
            <CardDescription>Latest updates from the community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Community Gathering</p>
                    <p className="text-xs text-muted-foreground">April 15, 2023</p>
                  </div>
                </div>
                <p className="text-sm">Join us for our monthly community meeting...</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New Members Welcome</p>
                    <p className="text-xs text-muted-foreground">April 10, 2023</p>
                  </div>
                </div>
                <p className="text-sm">10 new members joined our community this month...</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Platform Update</p>
                    <p className="text-xs text-muted-foreground">April 5, 2023</p>
                  </div>
                </div>
                <p className="text-sm">We've added new features to the family tree visualization...</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              View All Updates
            </Button>
          </CardFooter>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Community events in your area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded">APR</div>
                  <div className="text-lg font-bold">20</div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">Cultural Festival</h4>
                  <p className="text-xs text-muted-foreground">San Francisco, CA • 2:00 PM</p>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="outline" className="text-xs">Festival</Badge>
                    <Badge variant="outline" className="text-xs">Culture</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded">MAY</div>
                  <div className="text-lg font-bold">05</div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">Language Workshop</h4>
                  <p className="text-xs text-muted-foreground">Online • 6:00 PM</p>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="outline" className="text-xs">Workshop</Badge>
                    <Badge variant="outline" className="text-xs">Language</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              View All Events
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        {/* Quick Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activity Overview
            </CardTitle>
            <CardDescription>Your recent activity on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Updated Family Tree</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/trees">View</Link>
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Commented on Discussion</p>
                    <p className="text-xs text-muted-foreground">1 week ago</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">RSVP'd to Event</p>
                    <p className="text-xs text-muted-foreground">2 weeks ago</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              View All Activity
            </Button>
          </CardFooter>
        </Card>

        {/* Recommended Connections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recommended Connections
            </CardTitle>
            <CardDescription>People you might want to connect with</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Maria Fernandes</p>
                    <p className="text-xs text-muted-foreground">From Margao, Goa</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Connect</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sanjay Naik</p>
                    <p className="text-xs text-muted-foreground">From Panjim, Goa</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Connect</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Anita D'Souza</p>
                    <p className="text-xs text-muted-foreground">From Mapusa, Goa</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Connect</Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              Find More Connections
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
