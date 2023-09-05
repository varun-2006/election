"use client";

import { categoryType, electionType } from "@/lib/validators/election";
import { Dispatch, SetStateAction, useState } from "react";
import AddCandidateData from "./AddCandidateData";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Student } from "@prisma/client";
import useElection from "../ElectionContext";
import { toast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";

const CandidatesDataForm = ({
  setCurrentPage,
  candidates,
}: {
  setCurrentPage: Dispatch<SetStateAction<number>>;
  candidates: Student[] | [];
}) => {
  const router = useRouter();
  const { mutate, isLoading } = useMutation({
    mutationFn: async (payload: electionType) => {
      const { data } = await axios.post("/api/create/election", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 400)
          return toast({
            title: err.response?.data,
            description:
              "The format of the data was corrupt. Make sure you follow the pattern recommended",
            variant: "destructive",
          });
      }
      return toast({
        title: "Internal error",
        description: "Something went wrong please try again later",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Successful",
        description: "Election is created successfully",
      });
      router.push(`/dashboard/${electionData.name}`);
    },
  });
  const [candidate1Image, setCandidate1Image] = useState<string | undefined>(
    undefined
  );
  const [candidate2Image, setCandidate2Image] = useState<string | undefined>(
    undefined
  );
  const { setElectionData, electionData } = useElection();
  const setElection = () => {
    setElectionData((prev) => {
      const lastCategory = prev.category[prev.category.length - 1];
      prev.category.splice(prev.category.length - 1, 1);

      lastCategory.candidates[0] = {
        id: candidates[0].id,
        //@ts-expect-error
        image: candidate1Image,
      };
      lastCategory.candidates[1] = {
        id: candidates[1].id,
        //@ts-expect-error
        image: candidate2Image,
      };
      return {
        ...prev,
        category: [...prev.category, { ...lastCategory }],
      };
    });
  };
  return (
    <div className="max-w-fit text-center">
      {!isLoading ? (
        <>
          <h2 className="font-bold text-lg">Upload Image</h2>
          <div className="flex justify-between items-center border-border my-4 rounded border-2 w-full">
            <AddCandidateData
              candidate={candidates[0]}
              setCandidateImage={setCandidate1Image}
            />
            <AddCandidateData
              candidate={candidates[1]}
              setCandidateImage={setCandidate2Image}
            />
          </div>
          <div className="flex justify-around items-center w-full">
            <Button
              type="button"
              className="w-52"
              variant="outline"
              onClick={() => setCurrentPage(3)}
            >
              <ChevronLeft className="h-6 w-6" />
              Change candidates
            </Button>
            <Button
              type="button"
              className="w-52"
              onClick={() => {
                if (!candidate1Image && !candidate2Image)
                  return toast({
                    title:
                      "To add more candidates add images for the current ministry/category first",
                    variant: "destructive",
                  });
                setElection();

                setCurrentPage(2);
              }}
            >
              Add Ministry/Category
            </Button>
          </div>
          <Dialog>
            <DialogTrigger
              onClick={() => {
                if (!candidate1Image && !candidate2Image) {
                  return toast({
                    title: "To submit add images first",
                    variant: "destructive",
                  });
                }
              }}
              className={buttonVariants({
                variant: "default",
                className: "mt-3",
              })}
            >
              Submit and finish creating the election
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will create the election
                  and all the students you have selected can vote.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={() => {
                    setElection();
                    mutate(electionData);
                  }}
                >
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default CandidatesDataForm;
