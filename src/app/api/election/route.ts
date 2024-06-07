import { db } from "@/lib/db";
import { signupSchema } from "@/lib/validators/signup";
import { z } from "zod";
import { getAuthSession } from "../auth/[...nextauth]/route";
import { studentVoteSchema, teacherVoteSchema } from "@/lib/validators/vote";

export const POST = async (req: Request) => {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();

    if (session.user.email) {
      const data = teacherVoteSchema.parse(body);

      const election = await db.election.findUnique({
        where: {
          id: data[0].electionId,
        },
      });

      if (!election)
        return new Response("There is no such election", {
          status: 400,
        });

      if (election.complete)
        return new Response("Election is closed", {
          status: 400,
        });

      const alreadyVoted = await db.teacherVote.findFirst({
        where: {
          voterEmail: session.user.email,
          electionId: data[0].electionId,
        },
      });
      console.log(alreadyVoted);
      if (alreadyVoted) {
        return new Response(
          "You cannot vote for this as you have already voted before",
          {
            status: 400,
          }
        );
      }
      await db.teacherVote.createMany({
        data,
      });

      return new Response("Successful", { status: 201 });
    }

    const data = studentVoteSchema.parse(body);

    const election = await db.election.findUnique({
      where: {
        id: data[0].electionId,
      },
    });

    if (!election)
      return new Response("There is no such election", {
        status: 400,
      });

    if (election.complete)
      return new Response("Election is closed", {
        status: 400,
      });

    const alreadyVoted = await db.vote.findFirst({
      where: {
        voterId: session.user.id,
        electionId: data[0].electionId,
      },
    });
    console.log(alreadyVoted);
    if (alreadyVoted) {
      return new Response("You have already voted", {
        status: 400,
      });
    }
    await db.vote.createMany({
      data,
    });
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
