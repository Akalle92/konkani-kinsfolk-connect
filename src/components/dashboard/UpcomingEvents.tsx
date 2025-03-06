
import { CalendarDays, Gift, Heart, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: string;
  personId: string;
  personName: string;
  type: 'birthday' | 'anniversary' | 'memorial' | 'other';
  date: string;
  title?: string;
}

interface UpcomingEventsProps {
  events: Event[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'birthday':
        return <Gift className="h-4 w-4" />;
      case 'anniversary':
        return <Heart className="h-4 w-4" />;
      case 'memorial':
        return <Award className="h-4 w-4" />;
      default:
        return <CalendarDays className="h-4 w-4" />;
    }
  };

  const getEventTitle = (event: Event) => {
    if (event.title) return event.title;
    
    switch (event.type) {
      case 'birthday':
        return `${event.personName}'s Birthday`;
      case 'anniversary':
        return `${event.personName}'s Anniversary`;
      case 'memorial':
        return `${event.personName}'s Memorial`;
      default:
        return 'Event';
    }
  };

  // Calculate days until event
  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    
    // Set both dates to the same year to compare just month and day
    eventDate.setFullYear(today.getFullYear());
    
    // If the date has already passed this year, check for next year
    if (eventDate < today) {
      eventDate.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No upcoming events</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => {
              const daysUntil = getDaysUntil(event.date);
              
              return (
                <div key={event.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {getEventIcon(event.type)}
                    </div>
                    <div>
                      <p className="font-medium">{getEventTitle(event)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {daysUntil === 0 
                      ? 'Today' 
                      : daysUntil === 1 
                        ? 'Tomorrow' 
                        : `${daysUntil} days`}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
