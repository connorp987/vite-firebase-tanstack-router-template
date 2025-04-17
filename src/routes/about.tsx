import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  beforeLoad: ({ context }) => {
    console.log("beforeLoad", context.user.user);
    if (!context.user.user) {
      throw redirect({ to: "/signin" });
    }
  },
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome about!</h3>
    </div>
  );
}
