import z from "zod";
import { getAuthSession } from "../../auth/[...nextauth]/route";
import { categorySchema } from "@/lib/validators/election";
import { db } from "@/lib/db";

export const POST = async (req: Request) => {
  try {
    const session = await getAuthSession();
    if (!session?.user?.isAdmin)
      return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const data = categorySchema.parse(body);
    const category = { ...data, candidates: undefined };
    const candidates = data.candidates;

    await db.category.create({
      data: {
        ...category,
        candidates: {
          connect: candidates.flatMap((candidate) => ({ id: candidate.id })),
        },
      },
    });
    const student1 = db.student.update({
      where: { id: candidates[0].id },
      data: {
        image: candidates[0].image,
      },
    });
    const student2 = db.student.update({
      where: { id: candidates[1].id },
      data: {
        image: candidates[1].image,
      },
    });
    const students = await Promise.allSettled([student1, student2]);
    return new Response("Successful", { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError)
      return new Response("Bad data", {
        status: 400,
      });
    return new Response("Something went wrong!", { status: 500 });
  }
};
