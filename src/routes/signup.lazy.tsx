import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { CreateAccount } from "@/components/createAccount";
import { useAuthContext } from "@/helpers/authContext";
import { useEffect } from "react";

export const Route = createFileRoute("/signup")({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Index,
});

function Index() {
  const navigate = useNavigate({ from: "/signup" });
  const { user } = useAuthContext();

  useEffect(() => {
    if (user !== null) navigate({ to: "/" });
  }, [navigate, user]);

  return (
    <div>
      <div className="p-4 mx-auto min-w-96 w-96 justify-center items-center">
        <CreateAccount />
      </div>
    </div>
  );
}
