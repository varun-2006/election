import z from "zod";
import { getAuthSession } from "../../auth/[...nextauth]/route";
import { electionSchema } from "@/lib/validators/election";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export const POST = async (req: Request) => {
  try {
    const session = await getAuthSession();
    if (!session?.user?.isAdmin)
      return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const data = electionSchema.parse(body);
    const id = nanoid(7);
    await db.election.create({
      data: {
        id,
        name: data.name,
        filters: data.filters,
        complete: data.complete,
      },
    });

    return new Response(id, { status: 201 });
  } catch (err) {
    console.log(err);
    if (err instanceof z.ZodError)
      return new Response("Bad data", {
        status: 400,
      });
    return new Response("Something went wrong!", { status: 500 });
  }
};
