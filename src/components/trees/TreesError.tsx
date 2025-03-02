
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '@/components/ui/empty-state';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TreesError() {
  const navigate = useNavigate();
  
  return (
    <EmptyState
      title="Error loading tree"
      description="There was a problem loading the family tree. Please try refreshing the page or go back to your trees."
      icon={<AlertTriangle className="w-12 h-12 text-destructive opacity-80" />}
      className="bg-destructive/5 rounded-lg"
      variant="outlined"
    >
      <div className="flex gap-2 mt-4">
        <Button 
          onClick={() => window.location.reload()}
          variant="secondary"
        >
          Refresh
        </Button>
        <Button 
          onClick={() => navigate('/trees')}
          variant="default"
        >
          Back to Trees
        </Button>
      </div>
    </EmptyState>
  );
}
