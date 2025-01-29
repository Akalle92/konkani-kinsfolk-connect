import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface PhotoUploadFieldProps {
  onPhotoUrlChange: (url: string) => void;
}

export function PhotoUploadField({ onPhotoUrlChange }: PhotoUploadFieldProps) {
  const { toast } = useToast();
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handlePhotoUpload = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("member-photos")
      .upload(fileName, file);

    if (error) {
      console.error("Photo upload error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload photo",
      });
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("member-photos").getPublicUrl(fileName);

    onPhotoUrlChange(publicUrl);
  };

  return (
    <div>
      <Label htmlFor="photo">Photo</Label>
      <div className="flex items-center gap-2">
        <Input
          id="photo"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setPhotoFile(file);
              handlePhotoUpload(file);
            }
          }}
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