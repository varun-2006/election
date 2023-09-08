"use client";

import axios, { AxiosError } from "axios";
import SearchCandidatesForm from "./SearchCandidateForm";
import { toast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { searchStudentType } from "@/lib/validators/searchStudent";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Loading from "@/app/loading";
import { Student } from "@prisma/client";

const FindCandidatesForm = ({
  setCurrentPage,
  candidates,
  setCandidates,
}: {
  candidates: Student[] | [];
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setCandidates: Dispatch<SetStateAction<Student[] | []>>;
}) => {
  const [candidate1, setCandidate1] = useState<searchStudentType | undefined>();
  const [candidate2, setCandidate2] = useState<searchStudentType | undefined>();
  const { mutate, isLoading } = useMutation({
    mutationFn: async (payload: searchStudentType[]) => {
      const { data } = await axios.post(
        "/api/create/election/getStudents",
        payload
      );
      return data;
    },
    onError: (err) => {
      console.log(err);
      setCandidate1(undefined);
      setCandidate2(undefined);
      if (err instanceof AxiosError) {
        if (err.response?.status === 400)
          return toast({
            title: err.response?.data,
            description:
              "The format of the data was corrupt. Make sure you follow the pattern recommended",
            variant: "destructive",
          });
        else if (err.response?.status === 422)
          return toast({
            title: err.response?.data,
            description:
              "Enter the correct details of candidates or create a new students with that details and reference it",
            variant: "destructive",
          });
      }
      return toast({
        title: "Internal error",
        description: "Something went wrong please try again later",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      if (data.length === 0)
        return toast({
          title: "Candidates not found",
          description:
            "Enter the correct details of candidates or create a new students with that details and reference it",
          variant: "destructive",
        });
      const checkIfFirstCandidateIsEqualToFirstElementOfData = () => {
        if (data[0].std === candidate1?.std) {
          if (data[0].section === candidate1?.section) {
            if (data[0].rollNo === candidate1?.rollNo) return true;
          }
        }
        return false;
      };

      const valueOfAboveFunction =
        checkIfFirstCandidateIsEqualToFirstElementOfData();
      if (data.length < 2) {
        if (valueOfAboveFunction) {
          setCandidate2(undefined);
          return toast({
            title: "Candidate 2 not found",
            description:
              "Enter the correct details of candidate 2 or create a new student with that details and reference it",
            variant: "destructive",
          });
        }
        setCandidate1(undefined);
        return toast({
          title: "Candidate 1 not found",
          description:
            "Enter the correct details of candidate 1 or create a new student with that details and reference it",
          variant: "destructive",
        });
      }
      if (valueOfAboveFunction) setCandidates(data);
      else setCandidates([{ ...data[1] }, { ...data[0] }]);

      setCurrentPage(3);
      toast({
        title: "Candidates added successfully",
      });
    },
  });

  useEffect(() => {
    if (!!candidate1 && !!candidate2) mutate([candidate1, candidate2]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidate1, candidate2]);

  return (
    <div className="rounded w-1/2 border-border text-center border px-4 py-8">
      <div className="flex justify-between items-center w-full text-left">
        {(!!!candidate1 || !!!candidate2) && (
          <>
            <SearchCandidatesForm
              className="w-64"
              candidate={candidate1}
              setCandidate={setCandidate1}
              title="Candidate 1"
            />
            <SearchCandidatesForm
              className="w-64"
              candidate={candidate2}
              setCandidate={setCandidate2}
              title="Candidate 2"
            />
          </>
        )}
      </div>
      {!isLoading && (
        <p className="font-medium text-base mt-2">
          Note: If any data you have provided is wrong you can change it in the
          next step or now by changing and adding the cadidate data
        </p>
      )}
      {isLoading && (
        <>
          <Loading />
          <p>Fetching students</p>
        </>
      )}
    </div>
  );
};

export default FindCandidatesForm;
