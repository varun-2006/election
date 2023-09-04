import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { searchStudentSchema } from "@/lib/validators/searchStudent";
import { NextResponse } from "next/server";
import z from "zod";

export const POST = async (req: Request) => {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email)
      return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const data = z.array(searchStudentSchema).parse(body);
    const standards = data.flatMap((d) => d.std);
    const sections = data.flatMap((d) => d.section);
    const rollNos = data.flatMap((d) => d.rollNo);

    const students = await db.student.findMany({
      where: {
        std: {
          in: standards,
        },
        section: {
          in: sections,
        },
        rollNo: {
          in: rollNos,
        },
      },
    });

    return NextResponse.json(students);
  } catch (err) {
    if (err instanceof z.ZodError)
      return new Response("Bad data", {
        status: 400,
      });
    return new Response("Something went wrong!", { status: 500 });
  }
};
