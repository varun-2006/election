import { db } from "@/lib/db";
import { getAuthSession } from "../auth/[...nextauth]/route";

export const PUT = async (req: Request) => {
  try {
    const session = await getAuthSession();
    if (!session?.user?.isAdmin)
      return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const data = await db.election.update({
      where: {
        id: body.id,
      },
      data: {
        complete: true,
      },
    });
    return new Response("Election closed", { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Something went wrong!", { status: 500 });
  }
};

export const DELETE = async (req: Request) => {
  try {
    const session = await getAuthSession();
    if (!session?.user?.isAdmin)
      return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    console.log(body);
    const data = await db.election.delete({
      where: {
        id: body.id,
      },
    });
    return new Response(null, { status: 204 });
  } catch (err) {
    console.log(err);
    return new Response("Something went wrong!", { status: 500 });
  }
};
