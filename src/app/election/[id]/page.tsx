import { db } from "@/lib/db";

import ElectionCarousel from "@/components/election/ElectionCarousel";
import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Category, Student } from "@prisma/client";

interface CategoryWithStudents extends Category {
  candidates: Student[];
}

const page = async ({ params: { id } }: { params: { id: string } }) => {
  const session = await getAuthSession();
  if (!session?.user) redirect("/student/signin");

  const election = await db.election.findUnique({
    where: {
      id,
    },
    include: {
      category: {
        include: {
          candidates: true,
        },
      },
    },
  });
  if (!election) return <p> There is no such election</p>;
  if (election.complete)
    return <p> The election is over you, you cannot vote anymore</p>;

  // if (session.user.std) {
  const canVoteCategories: CategoryWithStudents[] = [];
  election.category.forEach((category) => {
    if (!category.house || category.house == session.user.house)
      canVoteCategories.push(category);
  });

  election.category = canVoteCategories;
  // }
  return (
    <div className="text-center flex flex-col items-center justify-center ">
      <h1 className="text-4xl font-bold capitalize my-10">{election.name}</h1>
      <ElectionCarousel election={election} voter={session.user} />
    </div>
  );
};
export default page;
