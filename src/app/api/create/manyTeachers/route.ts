import { db } from "@/lib/db";
import { manyTeachersSchema } from "@/lib/validators/manyTeachers";
import { z } from "zod";
import { getAuthSession } from "../../auth/[...nextauth]/route";
import { hashSync } from "bcryptjs";

export const POST = async (req: Request) => {
  try {
    const session = await getAuthSession();
    if (!session?.user?.isAdmin)
      return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const data = manyTeachersSchema.parse(body);

    data.forEach((teacher) => {
      teacher.password = hashSync(teacher.password, 10);
    });

    try {
      await db.teacher.createMany({
        data,
      });
    } catch (err) {
      return new Response("Teachers data overlapping", { status: 422 });
    }
    return new Response("Teachers created successfully", { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError)
      return new Response("Wrong data", {
        status: 400,
      });
    return new Response("Something went wrong!", { status: 500 });
  }
};
