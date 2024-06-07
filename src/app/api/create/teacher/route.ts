import { db } from "@/lib/db";
import { teacherSchema } from "@/lib/validators/teacher";
import { z } from "zod";
import { getAuthSession } from "../../auth/[...nextauth]/route";
import { hash } from "bcryptjs";

export const POST = async (req: Request) => {
  try {
    const session = await getAuthSession();
    if (!session?.user?.isAdmin)
      return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const data = teacherSchema.parse(body);
    console.log("running");
    data.password = await hash(data.password, 10);

    try {
      await db.teacher.create({
        data,
      });
    } catch (err) {
      return new Response("Teacher exists", { status: 422 });
    }
    return new Response("Teacher created successfully", { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError)
      return new Response("Wrong data", {
        status: 400,
      });
    return new Response("Something went wrong!", { status: 500 });
  }
};
