
import { useNavigate } from 'react-router-dom';

export function TreesError() {
  const navigate = useNavigate();
  
  return (
    <div className="bg-destructive/10 p-4 rounded-lg">
      <h1 className="text-xl font-semibold text-destructive mb-2">
        Error loading tree
      </h1>
      <p className="text-destructive">
        There was a problem loading the family tree. Please try refreshing the page or go back to your trees.
      </p>
      <div className="flex gap-2 mt-4">
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
        >
          Refresh
        </button>
        <button 
          onClick={() => navigate('/trees')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Back to Trees
        </button>
      </div>
    </div>
  );
}
