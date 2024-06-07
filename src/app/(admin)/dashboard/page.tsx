import { Metadata } from "next";

import { Button } from "@/components/ui/button";

import { MainNav } from "@/components/dashboard/main-nav";
import { db } from "@/lib/db";
import ElectionCards from "@/components/dashboard/ElectionCards";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

const page = async () => {
  const elections = await db.election.findMany();
  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            {/* <div className="ml-auto flex items-center space-x-4">
              <Search />
            </div> */}
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-lightest">
              Elections
            </h2>
            <div className="flex items-center space-x-2">
              <Button>Download</Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ElectionCards elections={elections} />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
