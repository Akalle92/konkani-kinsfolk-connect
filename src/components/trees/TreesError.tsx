import { useNavigate } from 'react-router-dom';

export function TreesError() {
  const navigate = useNavigate();
  
  return (
    <div className="bg-destructive/10 p-4 rounded-lg">
      <h1 className="text-xl font-semibold text-destructive mb-2">
        Error loading trees
      </h1>
      <p className="text-destructive">
        Please try refreshing the page or sign in again.
      </p>
      <button 
        onClick={() => navigate('/auth')}
        className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
      >
        Sign In
      </button>
    </div>
  );
}