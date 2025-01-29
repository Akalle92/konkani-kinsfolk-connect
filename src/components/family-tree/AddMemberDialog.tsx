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
    first_name: string;
    middle_name?: string;
    last_name: string;
    birth_date?: string;
    birth_place?: string;
    gender?: string;
    photo_url?: string;
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
    middleName: "",
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
      console.error("Photo upload error:", error);
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
    console.log("Submitting member:", newMember);
    
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

    const memberData = {
      first_name: newMember.firstName,
      middle_name: newMember.middleName || undefined,
      last_name: newMember.lastName,
      birth_date: newMember.birthDate || undefined,
      birth_place: newMember.birthPlace || undefined,
      gender: newMember.gender || undefined,
      photo_url: photoUrl || undefined,
      relationshipType: newMember.relationshipType || undefined,
      relatedMemberId: newMember.relatedMemberId || undefined,
    };

    console.log("Sending member data:", memberData);
    onAddMember(memberData);
    
    setIsOpen(false);
    setNewMember({
      firstName: "",
      lastName: "",
      middleName: "",
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
              middleName={newMember.middleName}
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
              {isLoading ? "Adding..." : "Add Member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}