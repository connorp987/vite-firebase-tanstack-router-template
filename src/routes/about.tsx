import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  loader: ({ context }) => {
    if (!context.user.user) {
      throw redirect({ to: "/signin" });
    }
  },
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome about! This is a protected route.</h3>
    </div>
  );
}
