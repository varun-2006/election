import { db } from "@/lib/db";
import { studentSchema } from "@/lib/validators/student";
import { z } from "zod";
import { getAuthSession } from "../../auth/[...nextauth]/route";

export const POST = async (req: Request) => {
  try {
    const session = await getAuthSession();
    if (!session?.user?.isAdmin)
      return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const data = studentSchema.parse(body);

    try {
      await db.student.create({
        data,
      });
    } catch (err) {
      return new Response("Student exists", { status: 422 });
    }
    return new Response("Student created successfully", { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError)
      return new Response("Wrong data", {
        status: 400,
      });
    return new Response("Something went wrong!", { status: 500 });
  }
};
