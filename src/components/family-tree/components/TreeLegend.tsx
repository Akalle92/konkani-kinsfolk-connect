
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GENDER_COLORS } from "../utils/graph-constants";

export function TreeLegend() {
  const relationshipTypes = [
    { type: 'Spouse', color: '#E74C3C', dashed: false },
    { type: 'Parent/Child', color: '#3498DB', dashed: false },
    { type: 'Sibling', color: '#2ECC71', dashed: false },
    { type: 'Other', color: '#999999', dashed: true },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Legend</CardTitle>
        <CardDescription>Person and relationship types</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-medium mb-2">Person Types</p>
          <div className="space-y-2">
            {Object.entries(GENDER_COLORS).map(([gender, color]) => (
              gender !== 'default' && (
                <div key={gender} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: color }}
                  />
                  <span>{gender}</span>
                </div>
              )
            ))}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-yellow-400 bg-yellow-100" />
              <span>Current User</span>
            </div>
          </div>
        </div>
        
        <div>
          <p className="font-medium mb-2">Relationship Types</p>
          <div className="space-y-2">
            {relationshipTypes.map(({ type, color, dashed }) => (
              <div key={type} className="flex items-center gap-2">
                <div className="w-8 h-0 flex items-center">
                  <div 
                    className={`w-full h-0.5 ${dashed ? 'border-t border-dashed' : ''}`}
                    style={{ 
                      backgroundColor: dashed ? 'transparent' : color,
                      borderColor: dashed ? color : 'transparent'
                    }}
                  />
                </div>
                <span>{type}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
