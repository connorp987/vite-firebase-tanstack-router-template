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
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/helpers/firebaseConfig";

// Default avatar from UI Avatars API
const getDefaultAvatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

export const Route = createLazyFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user, userData } = useAuthContext();
  const [displayName, setDisplayName] = useState(userData?.displayName || "");
  const [photoURL, setPhotoURL] = useState(userData?.photoURL || "");
  const [base64Image, setBase64Image] = useState(userData?.base64Image || "");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userData) {
      setDisplayName(userData.displayName || "");
      setPhotoURL(userData.photoURL || "");
      setBase64Image(userData.base64Image || "");
    }
  }, [userData]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) {
      console.log("No file selected or user not logged in");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 900KB)
    if (file.size > 900 * 1024) {
      toast.error("Image must be smaller than 900KB");
      return;
    }

    try {
      setIsProcessing(true);
      console.log(
        "Processing file:",
        file.name,
        "Size:",
        file.size,
        "Type:",
        file.type
      );

      // Convert image to Base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64String = e.target?.result as string;
          console.log("Base64 conversion successful");
          setBase64Image(base64String);
          // Generate a default avatar URL based on the user's name
          const avatarUrl = getDefaultAvatarUrl(
            displayName || user.email?.split("@")[0] || "User"
          );
          setPhotoURL(avatarUrl);
          toast.success("Profile picture processed successfully!");
        } catch (error) {
          console.error("Error in reader.onload:", error);
          toast.error("Failed to process profile picture");
        } finally {
          setIsProcessing(false);
        }
      };

      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        toast.error("Failed to read image file");
        setIsProcessing(false);
      };

      console.log("Starting file read...");
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error in handleFileUpload:", error);
      toast.error("Failed to handle profile picture");
      setIsProcessing(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (!user) return;

      // Generate avatar URL if none exists
      const avatarUrl =
        photoURL ||
        getDefaultAvatarUrl(displayName || user.email?.split("@")[0] || "User");

      // Update Firebase Auth profile with display name and avatar URL
      await updateProfile(user, {
        displayName,
        photoURL: avatarUrl,
      });

      // Update Firestore document with all data including base64 image
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          displayName,
          photoURL: avatarUrl,
          base64Image, // Store full base64 image data only in Firestore
          email: user.email,
        },
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

          <div className="space-y-4">
            <Label>Profile Picture</Label>
            {(base64Image || photoURL) && (
              <div className="mb-4 relative w-24 h-24 rounded-full overflow-hidden">
                <img
                  src={base64Image || photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
                onClick={(e) => {
                  // Reset the input value to ensure onChange fires even if the same file is selected
                  (e.target as HTMLInputElement).value = "";
                }}
              />
              <Button
                onClick={() => {
                  if (fileInputRef.current) {
                    console.log("Opening file picker...");
                    fileInputRef.current.click();
                  }
                }}
                disabled={isProcessing}
                variant="outline"
              >
                {isProcessing ? "Processing..." : "Upload New Picture"}
              </Button>
              <div className="text-sm text-muted-foreground">
                Or use an image URL:
              </div>
              <Input
                value={photoURL}
                onChange={(e) => {
                  setPhotoURL(e.target.value);
                  setBase64Image(""); // Clear base64 image when using URL
                }}
                placeholder="Enter URL for your profile picture"
              />
              <div className="text-xs text-muted-foreground">
                Note: Uploaded images must be smaller than 900KB
              </div>
            </div>
          </div>

          <Button onClick={handleUpdateProfile} disabled={isProcessing}>
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
