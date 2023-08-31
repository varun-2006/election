import Link from "next/link";

import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="create/student"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Add students
      </Link>
      <Link
        href="create/teacher"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Add teachers
      </Link>
      <Link
        href="create/election"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        New election
      </Link>
      <Link
        href="/dashboard"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Settings
      </Link>
    </nav>
  );
}
