import z from "zod";
import { getAuthSession } from "../../auth/[...nextauth]/route";
import { electionSchema } from "@/lib/validators/election";
import { db } from "@/lib/db";

export const POST = async (req: Request) => {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email)
      return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const data = electionSchema.parse(body);

    const categories = data.category;

    await db.election.create({
      data: {
        name: data.name,
        filters: data.filters,
        complete: data.complete,
      },
    });

    const categoryPromises = categories.map(async (category) => {
      return db.category.create({
        data: {
          name: category.name,
          house: category.house,
          elections: {
            connect: { name: data.name },
          },
        },
      });
    });

    await Promise.all(categoryPromises);

    return new Response("Successful", { status: 201 });
  } catch (err) {
    console.log(err);
    if (err instanceof z.ZodError)
      return new Response("Bad data", {
        status: 400,
      });
    return new Response("Something went wrong!", { status: 500 });
  }
};
