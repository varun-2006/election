import axios, { AxiosError } from "axios";
import Image from "next/image";
import { getAuthSession } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function Home() {
  const session = await getAuthSession();
  console.log(session?.user);
  // @ts-ignore
  if (!session?.user) redirect("/student/signin");
  let canVoteElections;
  try {
    const elections = await db.election.findMany({
      where: {
        complete: false,
      },
    });

    canVoteElections = elections.map((election) => {
      if (election.filters === "ALL") return election;
      const filters = election.filters;
      // @ts-ignore
      if (filters[session.user.std] === "ALL") return election;
      // @ts-ignore
      if (filters[session.user.std].includes(session.user.section))
        return election;
    });
  } catch (err) {
    return <p>Something went wrong</p>;
  }
  console.log(canVoteElections);
  return (
    <div className="flex justify-center items-center min-h-[100dvh] w-full">
      {canVoteElections?.map((election) => (
        <Link
          href={`/${election?.name}`}
          key={election?.name}
          className="p-4 w-32 flex justify-center items-center rounded border border-border m-2"
        >
          {election?.name}
        </Link>
      ))}
    </div>
  );
}
