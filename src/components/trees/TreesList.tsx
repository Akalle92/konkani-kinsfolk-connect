import { TreeCard } from '@/components/trees/TreeCard';

interface Tree {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface TreesListProps {
  trees: Tree[];
}

export function TreesList({ trees }: TreesListProps) {
  if (trees.length === 0) {
    return (
      <div className="text-center py-12 bg-accent rounded-lg">
        <p className="text-accent-foreground">
          You haven't created any family trees yet.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Click the "Create New Tree" button to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trees.map((tree) => (
        <TreeCard
          key={tree.id}
          id={tree.id}
          name={tree.name}
          description={tree.description}
          created_at={tree.created_at}
        />
      ))}
    </div>
  );
}