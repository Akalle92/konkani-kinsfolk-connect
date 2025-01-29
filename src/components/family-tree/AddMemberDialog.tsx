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
import { MemberFormFields } from "./member-form/MemberFormFields";

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
  existingMembers = [],
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

  const handleFieldChange = (field: string, value: string) => {
    setNewMember((prev) => ({ ...prev, [field]: value }));
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

    const memberData = {
      first_name: String(newMember.firstName),
      middle_name: newMember.middleName ? String(newMember.middleName) : undefined,
      last_name: String(newMember.lastName),
      birth_date: newMember.birthDate || undefined,
      birth_place: newMember.birthPlace || undefined,
      gender: newMember.gender || undefined,
      photo_url: newMember.photoUrl || undefined,
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
          <MemberFormFields
            newMember={newMember}
            onFieldChange={handleFieldChange}
            onPhotoUrlChange={(url) => handleFieldChange("photoUrl", url)}
            existingMembers={existingMembers}
          />
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