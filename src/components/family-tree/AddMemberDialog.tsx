import { useState } from "react";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { BasicInfoFields } from "./member-form/BasicInfoFields";
import { RelationshipSelect } from "./member-form/RelationshipSelect";
import { PhotoUpload } from "./member-form/PhotoUpload";

interface AddMemberDialogProps {
  onAddMember: (member: {
    firstName: string;
    lastName: string;
    birthDate: string;
    birthPlace: string;
    gender: string;
    photoUrl?: string;
    relationshipType?: string;
    relatedMemberId?: string;
  }) => void;
  isLoading: boolean;
  existingMembers?: Array<{
    id: string;
    first_name: string;
    last_name: string;
  }>;
}

export function AddMemberDialog({
  onAddMember,
  isLoading,
  existingMembers,
}: AddMemberDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    birthPlace: "",
    gender: "",
    photoUrl: "",
    relationshipType: "",
    relatedMemberId: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handlePhotoUpload = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("member-photos")
      .upload(fileName, file);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload photo",
      });
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("member-photos").getPublicUrl(fileName);

    return publicUrl;
  };

  const handleFieldChange = (field: string, value: string) => {
    setNewMember({ ...newMember, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.firstName || !newMember.lastName) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "First name and last name are required",
      });
      return;
    }

    let photoUrl = "";
    if (photoFile) {
      photoUrl = (await handlePhotoUpload(photoFile)) || "";
    }

    onAddMember({ ...newMember, photoUrl });
    setIsOpen(false);
    setNewMember({
      firstName: "",
      lastName: "",
      birthDate: "",
      birthPlace: "",
      gender: "",
      photoUrl: "",
      relationshipType: "",
      relatedMemberId: "",
    });
    setPhotoFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Family Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Family Member</DialogTitle>
          <DialogDescription>
            Enter the details of the family member.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <BasicInfoFields
              firstName={newMember.firstName}
              lastName={newMember.lastName}
              birthDate={newMember.birthDate}
              birthPlace={newMember.birthPlace}
              gender={newMember.gender}
              onFieldChange={handleFieldChange}
            />
            <RelationshipSelect
              existingMembers={existingMembers || []}
              relationshipType={newMember.relationshipType}
              relatedMemberId={newMember.relatedMemberId}
              onRelationshipTypeChange={(value) =>
                handleFieldChange("relationshipType", value)
              }
              onRelatedMemberChange={(value) =>
                handleFieldChange("relatedMemberId", value)
              }
            />
            <PhotoUpload
              photoFile={photoFile}
              onPhotoChange={setPhotoFile}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              Add Member
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}