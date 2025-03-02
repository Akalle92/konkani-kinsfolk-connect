
import { TreeCard } from '@/components/trees/TreeCard';
import { EmptyState } from '@/components/ui/empty-state';
import { FolderTree } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  if (trees.length === 0) {
    return (
      <EmptyState
        title="No family trees yet"
        description="You haven't created any family trees yet. Click the button below to get started."
        icon={<FolderTree className="w-12 h-12 opacity-70" />}
        action={{
          label: "Create New Tree",
          onClick: () => document.getElementById("create-tree-trigger")?.click(),
        }}
        variant="outlined"
        className="py-12"
      />
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
