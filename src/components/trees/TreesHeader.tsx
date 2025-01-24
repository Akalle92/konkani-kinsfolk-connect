import { CreateTreeDialog } from '@/components/trees/CreateTreeDialog';

interface TreesHeaderProps {
  userId: string;
  isAdmin?: boolean;
}

export function TreesHeader({ userId, isAdmin }: TreesHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-playfair">My Family Trees</h1>
        {isAdmin && (
          <p className="text-sm text-muted-foreground">Admin Access</p>
        )}
      </div>
      {userId && <CreateTreeDialog userId={userId} />}
    </div>
  );
}