import { useState } from "react";
import { Plus, ArrowLeft, ImagePlus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

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

export function AddMemberDialog({ onAddMember, isLoading, existingMembers }: AddMemberDialogProps) {
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
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('member-photos')
      .upload(fileName, file);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload photo",
      });
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('member-photos')
      .getPublicUrl(fileName);

    return publicUrl;
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
      photoUrl = await handlePhotoUpload(photoFile) || "";
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
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={newMember.firstName}
                onChange={(e) =>
                  setNewMember({ ...newMember, firstName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={newMember.lastName}
                onChange={(e) =>
                  setNewMember({ ...newMember, lastName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input
                id="birthDate"
                type="date"
                value={newMember.birthDate}
                onChange={(e) =>
                  setNewMember({ ...newMember, birthDate: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="birthPlace">Birth Place</Label>
              <Input
                id="birthPlace"
                value={newMember.birthPlace}
                onChange={(e) =>
                  setNewMember({ ...newMember, birthPlace: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={newMember.gender}
                onValueChange={(value) =>
                  setNewMember({ ...newMember, gender: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {existingMembers && existingMembers.length > 0 && (
              <>
                <div>
                  <Label htmlFor="relationshipType">Relationship Type</Label>
                  <Select
                    value={newMember.relationshipType}
                    onValueChange={(value) =>
                      setNewMember({ ...newMember, relationshipType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="relatedMember">Related To</Label>
                  <Select
                    value={newMember.relatedMemberId}
                    onValueChange={(value) =>
                      setNewMember({ ...newMember, relatedMemberId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select family member" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.first_name} {member.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div>
              <Label htmlFor="photo">Photo</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
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