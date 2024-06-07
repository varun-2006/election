"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "../ui/button";
import { toast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogClose } from "@radix-ui/react-dialog";
import Link from "next/link";
import { Election } from "@prisma/client";

const ElectionCards = ({ elections }: { elections: Election[] }) => {
  const deleteElection = (id: string) => {
    elections.forEach((election, i) => {
      if (election.id === id) elections.splice(i, 1);
    });
  };
  const { mutate } = useMutation({
    mutationFn: async (election: Election) => {
      if (election.complete) {
        await axios.delete("/api/dashboard", { data: { id: election.id } });
        deleteElection(election.id);
        return;
      }
      const { data } = await axios.put("/api/dashboard", { id: election.id });
      election.complete = true;
      return data;
    },
    onError: (err) => {
      console.log(err);
      return toast({
        title: "Internal error",
        description: "Something went wrong please try again later",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Successful",
        description: `The election has been ${data ? "closed" : "deleted"}`,
      });
    },
  });
  return (
    <>
      {elections.map((election) => (
        <Card key={election.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">
              {election.name}
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent className="flex justify-between mt-4">
            {election.complete ? (
              <Link
                href={`/result?id=${election.id}`}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                <Button>Result</Button>
              </Link>
            ) : (
              <Link
                href={`/create/category/${election.id}`}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                <Button>Add ministry</Button>
              </Link>
            )}

            <Dialog>
              <DialogTrigger
                type="button"
                className={buttonVariants({
                  variant: "destructive",
                })}
              >
                {election.complete ? "Delete Election" : "End Election"}
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    {election.complete
                      ? "This action cannot be undone. This will permanently delete the election and its data"
                      : "This action cannot be undone. This will permanently end the election. After this no one can vote"}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant="destructive"
                      onClick={() => mutate(election)}
                    >
                      {election.complete ? "Delete" : "End Election"}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default ElectionCards;
