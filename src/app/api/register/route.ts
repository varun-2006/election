import { db } from "@/lib/db";
import { signupSchema } from "@/lib/validators/signup";
import { z } from "zod";
import { hash } from "bcryptjs";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const data = signupSchema.parse(body);

    const admin = await db.admin.findMany();
    if (admin[0]?.email) return new Response("Admin exists", { status: 409 });

    data.password = await hash(data.password, 10);

    await db.admin.create({
      data,
    });
    return new Response("Successful", { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError)
      return new Response("Wrong data", {
        status: 400,
      });
    return new Response("Something went wrong!", { status: 500 });
  }
};
