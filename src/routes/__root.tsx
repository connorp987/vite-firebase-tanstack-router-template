import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { signOut } from "../helpers/auth";
import { useAuthContext } from "../helpers/authContext";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";

interface MyRouterContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any; //Make this any kind of user type
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const { user } = useAuthContext();

  return (
    <>
      <div className="p-4 flex gap-2 text-lg items-center">
        <Link
          to="/"
          activeProps={{
            className: "font-bold",
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{" "}
        <Link
          to={"/about"}
          activeProps={{
            className: "font-bold",
          }}
        >
          About
        </Link>
        {user ? (
          <Button
            onClick={() => {
              signOut();
            }}
          >
            Sign Out
          </Button>
        ) : (
          <Link
            to={"/signin"}
            activeProps={{
              className: "font-bold",
            }}
          >
            Sign In
          </Link>
        )}
      </div>
      <hr />
      <Outlet />
      <Toaster richColors />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
