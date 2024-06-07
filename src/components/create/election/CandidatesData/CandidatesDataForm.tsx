"use client";

import { categoryType } from "@/lib/validators/election";
import { Dispatch, SetStateAction, useState } from "react";
import AddCandidateData from "./AddCandidateData";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Student } from "@prisma/client";
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
import useCategory from "../CategoryContext";

const CandidatesDataForm = ({
  setCurrentPage,
  candidates,
  id,
}: {
  id: string;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  candidates: Student[] | [];
}) => {
  console.log(candidates);
  const { mutate, isLoading } = useMutation({
    mutationFn: async (payload: categoryType) => {
      console.log(payload);
      const { data } = await axios.post("/api/create/category", payload);
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
        description: `Category created successfully`,
      });
      // router.push(`/dashboard/${category.name}`);
      setCurrentPage(1);
    },
  });
  const [candidate1Image, setCandidate1Image] = useState<string | null>(null);
  const [candidate2Image, setCandidate2Image] = useState<string | null>(null);
  const { category, setCategory } = useCategory();

  console.log(category);

  if (candidates[0].image && !candidate1Image)
    setCandidate1Image((prev) => candidates[0].image);
  if (candidates[1].image && !candidate2Image)
    setCandidate2Image((prev) => candidates[1].image);

  const addCandidates = () => {
    console.log(id);
    if (!(candidate1Image && candidate2Image))
      return toast({
        title: "Images not added",
        description:
          "Add the images of the candidates to submit. Images are not optional",
        variant: "destructive",
      });
    // @ts-ignore
    setCategory((prev) => ({
      ...prev,
      electionId: id,
      candidates: [
        {
          id: candidates[0].id,
          image: candidate1Image ? candidate1Image : candidates[0].image,
        },
        {
          id: candidates[1].id,
          image: candidate2Image ? candidate2Image : candidates[1].image,
        },
      ],
    }));
  };
  return (
    <div className="max-w-fit text-center">
      {!isLoading ? (
        <>
          <h2 className="font-bold text-lg">Upload Image</h2>
          <div className="w-[40vw] flex justify-around items-center border-border py-6 my-4 rounded border-2">
            <AddCandidateData
              candidateImage={candidate1Image}
              candidate={candidates[0]}
              setCandidateImage={setCandidate1Image}
            />

            <AddCandidateData
              candidateImage={candidate2Image}
              candidate={candidates[1]}
              setCandidateImage={setCandidate2Image}
            />
          </div>
          <div className="flex justify-around items-center w-full">
            <Button
              type="button"
              className="w-52"
              variant="outline"
              onClick={() => setCurrentPage(2)}
            >
              <ChevronLeft className="h-6 w-6" />
              Change candidates
            </Button>
            <Dialog>
              <DialogTrigger
                type="button"
                className={buttonVariants({
                  variant: "default",
                  className: "w-52",
                })}
                onClick={() => {
                  if (!(candidate1Image && candidate2Image)) {
                    return toast({
                      title:
                        "To add more candidates add images for the current ministry first",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Add Ministry/Category
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will create the category
                    and all the students you have selected can vote.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    type="button"
                    onClick={() => {
                      addCandidates();
                      mutate(category);
                    }}
                  >
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default CandidatesDataForm;
