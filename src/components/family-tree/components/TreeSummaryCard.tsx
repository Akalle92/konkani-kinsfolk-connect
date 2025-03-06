
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface TreeSummaryCardProps {
  description: string | null;
  membersCount: number;
  relationshipsCount: number;
  createdAt: string;
  updatedAt: string;
}

export function TreeSummaryCard({
  description,
  membersCount,
  relationshipsCount,
  createdAt,
  updatedAt
}: TreeSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">About This Tree</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {description || 'No description available for this family tree.'}
        </p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium">Members</p>
            <p className="text-2xl font-bold">{membersCount}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Relationships</p>
            <p className="text-2xl font-bold">{relationshipsCount}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Created</p>
            <p className="text-sm">
              {new Date(createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Last Updated</p>
            <p className="text-sm">
              {new Date(updatedAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
