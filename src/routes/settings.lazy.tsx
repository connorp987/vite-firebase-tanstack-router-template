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
import {
  updateProfile,
  linkWithPopup,
  unlink,
  GithubAuthProvider,
  GoogleAuthProvider,
  AuthProvider,
  ProviderId,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/helpers/firebaseConfig";
import { Icons } from "@/components/icons";
import { FirebaseError } from "firebase/app";
//TODO change this to not be a lazy route
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
  const [linkedProviders, setLinkedProviders] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userData) {
      setDisplayName(userData.displayName || "");
      setPhotoURL(userData.photoURL || "");
      setBase64Image(userData.base64Image || "");
    }
  }, [userData]);

  // Update linked providers whenever user changes
  useEffect(() => {
    if (user) {
      setLinkedProviders(
        user.providerData.map((provider) => provider.providerId)
      );
    }
  }, [user]);

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

  const handleLinkAccount = async (provider: AuthProvider) => {
    if (!user) return;

    try {
      await linkWithPopup(user, provider);
      // Update linked providers immediately after successful linking
      setLinkedProviders(
        user.providerData.map((provider) => provider.providerId)
      );
      toast.success("Account linked successfully!");
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/provider-already-linked") {
          toast.error("This account is already linked");
        } else if (error.code === "auth/credential-already-in-use") {
          toast.error("This account is already linked to another user");
        } else {
          console.error("Error linking account:", error);
          toast.error("Failed to link account");
        }
      } else {
        console.error("Unknown error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleUnlinkAccount = async (providerId: string) => {
    if (!user) return;

    // Don't allow unlinking if it's the only provider
    if (user.providerData.length <= 1) {
      toast.error("Cannot unlink the only authentication method");
      return;
    }

    try {
      await unlink(user, providerId);
      // Update linked providers immediately after successful unlinking
      setLinkedProviders(
        user.providerData.map((provider) => provider.providerId)
      );
      toast.success("Account unlinked successfully!");
    } catch (error) {
      console.error("Error unlinking account:", error);
      toast.error("Failed to unlink account");
    }
  };

  const getProviderName = (providerId: string) => {
    switch (providerId) {
      case ProviderId.GOOGLE:
        return "Google";
      case ProviderId.GITHUB:
        return "GitHub";
      case ProviderId.PASSWORD:
        return "Email/Password";
      default:
        return providerId;
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto py-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>
            Manage your connected accounts and authentication methods.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="text-sm font-medium">Currently Connected:</div>
            <div className="space-y-2">
              {linkedProviders.map((providerId) => (
                <div
                  key={providerId}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {providerId === ProviderId.GOOGLE && (
                      <Icons.google className="h-4 w-4" />
                    )}
                    {providerId === ProviderId.GITHUB && (
                      <Icons.gitHub className="h-4 w-4" />
                    )}
                    {getProviderName(providerId)}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleUnlinkAccount(providerId)}
                    disabled={linkedProviders.length <= 1}
                  >
                    Unlink
                  </Button>
                </div>
              ))}
            </div>

            <div className="text-sm font-medium mt-6">
              Link Additional Accounts:
            </div>
            <div className="grid grid-cols-2 gap-4">
              {!linkedProviders.includes(ProviderId.GOOGLE) && (
                <Button
                  variant="outline"
                  onClick={() => handleLinkAccount(new GoogleAuthProvider())}
                >
                  <Icons.google className="mr-2 h-4 w-4" />
                  Link Google
                </Button>
              )}
              {!linkedProviders.includes(ProviderId.GITHUB) && (
                <Button
                  variant="outline"
                  onClick={() => handleLinkAccount(new GithubAuthProvider())}
                >
                  <Icons.gitHub className="mr-2 h-4 w-4" />
                  Link GitHub
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
