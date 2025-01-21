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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddMemberDialogProps {
  onAddMember: (member: {
    firstName: string;
    lastName: string;
    birthDate: string;
    birthPlace: string;
    gender: string;
  }) => void;
  isLoading: boolean;
}

export function AddMemberDialog({ onAddMember, isLoading }: AddMemberDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    birthPlace: "",
    gender: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.firstName || !newMember.lastName) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "First name and last name are required",
      });
      return;
    }
    onAddMember(newMember);
    setIsOpen(false);
    setNewMember({
      firstName: "",
      lastName: "",
      birthDate: "",
      birthPlace: "",
      gender: "",
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Family Member</DialogTitle>
          <DialogDescription>
            Enter the details of the family member.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Input
              id="gender"
              value={newMember.gender}
              onChange={(e) =>
                setNewMember({ ...newMember, gender: e.target.value })
              }
              placeholder="Male/Female/Other"
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