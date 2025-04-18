import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useAuthContext } from "../helpers/authContext";
import { Toaster } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";

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
      <div className="border-b">
        <div className="container mx-auto px-4 py-4 flex gap-2 text-lg items-center">
          <Link
            to="/"
            activeProps={{ className: "font-bold" }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>{" "}
          <Link to={"/about"} activeProps={{ className: "font-bold" }}>
            About
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <UserNav />
            ) : (
              <Link to={"/signin"} activeProps={{ className: "font-bold" }}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
      <Outlet />
      <Toaster richColors />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
