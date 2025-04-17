import { Icons } from "@/components/icons";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { toast } from "sonner";
import signUp, { signInWithGithub, signInWithGoogle } from "@/helpers/auth";
import { Link, useNavigate } from "@tanstack/react-router";

export function CreateAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate({ from: "/signup" });

  const handleCreate = async () => {
    try {
      if (!email || !password) {
        toast.warning("Please enter a Email and a Password.");
        return;
      }
      const test = await signUp(email, password);
      if (!test) {
        toast.error("Sign in failed, please try again.");
        return;
      }
      console.log(test);
      return navigate({ to: "/" });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-6">
          <Button onClick={signInWithGithub} variant="outline">
            <Icons.gitHub className="mr-2 h-4 w-4" />
            Github
          </Button>
          <Button onClick={signInWithGoogle} variant="outline">
            <Icons.google className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            type="email"
            placeholder="m@example.com"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            type="password"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCreate} className="w-full">
          Create account
        </Button>
      </CardFooter>
      <CardFooter>
        <p>
          Already have an account?{" "}
          <Link className="text-blue-500" to="/signin">
            Sign in here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
