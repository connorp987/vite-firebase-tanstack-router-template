import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useAuthContext } from "@/helpers/authContext";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const { user } = useAuthContext();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Vite + Firebase + TanStack Router Template
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A modern React template with TypeScript, featuring real-time data
          synchronization, authentication, and a beautiful UI right out of the
          box.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          title="Firebase Integration"
          description="Built-in authentication and real-time database functionality with Firebase."
          icon="🔥"
        />
        <FeatureCard
          title="TanStack Router"
          description="Type-safe routing with built-in loading states and data handling."
          icon="🛣️"
        />
        <FeatureCard
          title="Dark Mode"
          description="Automatic dark mode support with theme persistence."
          icon="🌓"
        />
        <FeatureCard
          title="Tailwind CSS"
          description="Utility-first CSS framework for rapid UI development."
          icon="🎨"
        />
        <FeatureCard
          title="TypeScript"
          description="Full type safety and improved developer experience."
          icon="📝"
        />
        <FeatureCard
          title="Vite"
          description="Lightning fast development server and build tool."
          icon="⚡"
        />
      </div>

      <div className="mt-16 text-center">
        {!user ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Ready to get started?</h2>
            <div className="space-x-4">
              <Button asChild>
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/signup">Create Account</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Welcome back!</h2>
            <Button asChild>
              <Link to="/settings">Go to Settings</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-xs p-6 space-y-2">
      <div className="text-3xl">{icon}</div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
