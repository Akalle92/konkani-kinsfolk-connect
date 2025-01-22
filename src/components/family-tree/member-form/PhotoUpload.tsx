import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhotoUploadProps {
  photoFile: File | null;
  onPhotoChange: (file: File | null) => void;
}

export function PhotoUpload({ photoFile, onPhotoChange }: PhotoUploadProps) {
  return (
    <div>
      <Label htmlFor="photo">Photo</Label>
      <div className="flex items-center gap-2">
        <Input
          id="photo"
          type="file"
          accept="image/*"
          onChange={(e) => onPhotoChange(e.target.files?.[0] || null)}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("photo")?.click()}
        >
          <ImagePlus className="mr-2 h-4 w-4" />
          Upload Photo
        </Button>
        {photoFile && <span className="text-sm">{photoFile.name}</span>}
      </div>
    </div>
  );
}