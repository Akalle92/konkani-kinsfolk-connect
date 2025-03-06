
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function TreeErrorState() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Family Tree</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            There was an error loading this family tree. Please try again later.
          </p>
          <Button asChild>
            <Link to="/trees">Back to Trees</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
