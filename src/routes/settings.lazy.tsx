import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthContext } from "@/helpers/authContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/helpers/firebaseConfig";

export const Route = createLazyFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user, userData } = useAuthContext();
  const [displayName, setDisplayName] = useState(userData?.displayName || "");
  const [photoURL, setPhotoURL] = useState(userData?.photoURL || "");

  useEffect(() => {
    if (userData) {
      setDisplayName(userData.displayName || "");
      setPhotoURL(userData.photoURL || "");
    }
  }, [userData]);

  const handleUpdateProfile = async () => {
    try {
      if (!user) return;

      // Update Firebase Auth profile
      await updateProfile(user, { displayName, photoURL });

      // Update Firestore document
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        { displayName, photoURL, email: user.email },
        { merge: true }
      );

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your account settings and profile preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photoURL">Profile Picture URL</Label>
            <Input
              id="photoURL"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="Enter URL for your profile picture"
            />
          </div>

          <Button onClick={handleUpdateProfile}>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
