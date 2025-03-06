
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function TreeNotFoundState() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Tree Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            The requested family tree could not be found.
          </p>
          <Button asChild>
            <Link to="/trees">Back to Trees</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
