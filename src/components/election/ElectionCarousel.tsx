"use client";

import { Category, Election, Student } from "@prisma/client";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useRef, useState } from "react";
import { User } from "next-auth";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "../ui/use-toast";
import { studentVoteType, teacherVoteType } from "@/lib/validators/vote";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

interface CategoryWithStudents extends Category {
  candidates: Student[];
}

interface ElectionWithCategory extends Election {
  category: CategoryWithStudents[];
}

const cardClasses =
  "w-44 h-fit my-8 mx-16 cursor-pointer shadow-brand block shadow-lg rounded";

let votes: studentVoteType = [];
let teacherVotes: teacherVoteType = [];

const ElectionCarousel = ({
  election,
  voter,
}: {
  election: ElectionWithCategory;
  voter: User;
}) => {
  const [vote, setVote] = useState<string | undefined>(undefined);
  const [currSlide, setCurrSlide] = useState<number>(1);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      await axios.post("/api/election", votes.length ? votes : teacherVotes);
      return;
    },
    onError: (err) => {
      votes = [];
      setCurrSlide(1);
      if (err instanceof AxiosError) {
        if (err.response?.status === 422)
          return toast({
            title: err.response?.data,
            description:
              "There is a exists student with the information you provided",
            variant: "destructive",
          });
        else if (err.response?.status === 400)
          return toast({
            title: "Bad request",
            description: err.response?.data,
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
        description: `The votes have been casted`,
      });
      signOut();
      if (voter.email) redirect("/teacher/signin");
      else redirect("/student/signin");
    },
  });

  return (
    <>
      <Carousel className="pb-4">
        <CarouselContent className=" w-[50vw] rounded">
          {election.category.map((category, i) => {
            return (
              <CarouselItem key={category.id} className="bg-mid pt-3 pb-6">
                <div className="p-1 bg-brand w-full h-8 mx-auto text-center font-semibold  text-light ">
                  {category?.name}
                </div>
                <div className="flex justify-around text-black">
                  {category.candidates.map((candidate, i) => (
                    <div
                      key={candidate.id}
                      className={
                        vote !== candidate.id
                          ? cardClasses + "bg-lightest hover:scale-110"
                          : cardClasses +
                            "bg-light border-solid border-4 border-brand scale-105"
                      }
                      onClick={() => {
                        setVote((prev) => candidate.id);
                      }}
                    >
                      <div className="bg-light rounded pb-1">
                        <Image
                          className="mx-auto object-cover h-44 w-full"
                          // @ts-ignore There will always be an image
                          src={candidate.image}
                          width={125}
                          height={50}
                          alt="Could not load the image"
                        />

                        <h3 className="text-center text-sm text-gray-900 font-medium ">
                          {candidate.name}
                        </h3>
                        <div className="text-center text-gray-500 text-sm font-semibold">
                          {candidate.std}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => {
                    if (vote && voter.id) {
                      nextButtonRef.current?.click();
                      if (voter.email) {
                        teacherVotes.push({
                          voterEmail: voter?.email,
                          candidateId: vote,
                          electionId: election.id,
                        });
                      } else {
                        votes.push({
                          voterId: voter?.id,
                          candidateId: vote,
                          electionId: election.id,
                        });
                      }
                      if (currSlide === election.category.length) {
                        mutate();
                      }
                      console.log(votes);
                      setCurrSlide((prev) => prev + 1);
                      setVote((prev) => undefined);
                    }
                  }}
                  disabled={!vote}
                  className="w-1/3 text-center rounded-md bg-brand px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm disabled:cursor-not-allowed"
                >
                  {currSlide === election.category.length ? "Submit" : "Next"}
                </Button>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselNext ref={nextButtonRef} className="hidden" />
      </Carousel>
    </>
  );
};
export default ElectionCarousel;
