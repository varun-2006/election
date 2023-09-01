import { db } from "@/lib/db";
import { studentsSchema } from "@/lib/validators/students";
import { z } from "zod";
import { getAuthSession } from "../../auth/[...nextauth]/route";

export const POST = async (req: Request) => {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email)
      return new Response("Unauthorized", { status: 403 });

    const body = await req.json();
    const data = studentsSchema.parse(body);

    await db.student.createMany({
      data,
    });
    return new Response("Student created successfully", { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError)
      return new Response("Wrong data", {
        status: 400,
      });
    return new Response("Something went wrong!", { status: 500 });
  }
};
