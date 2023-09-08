import { ReactNode } from "react";
import { getAuthSession } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: ReactNode }) => {
  const session = await getAuthSession();
  if (!session?.user?.isAdmin) redirect("/signin");

  return <>{children}</>;
};

export default layout;
