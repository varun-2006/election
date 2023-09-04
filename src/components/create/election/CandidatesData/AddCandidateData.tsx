"use client";

import "@uploadthing/react/styles.css";
import { toast } from "@/components/ui/use-toast";
import { UploadDropzone } from "@/lib/uploadhing";
import { Student } from "@prisma/client";
import { buttonVariants } from "@/components/ui/button";
import { SetStateAction, Dispatch } from "react";
import useElection from "../ElectionContext";

type AddCandidateData = {
  candidate: Student;
  setCandidateImage: Dispatch<SetStateAction<string | undefined>>;
};

const AddCandidateData = ({
  candidate,
  setCandidateImage,
}: AddCandidateData) => {
  const { electionData } = useElection();

  return (
    <div className="py-3">
      <UploadDropzone
        appearance={{
          label: buttonVariants({ variant: "link", className: "my-1" }),
        }}
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          console.log(electionData);
          setCandidateImage(res?.toString());
          toast({
            title: "Image uploaded successfully",
          });
        }}
        onUploadError={(err: Error) => {
          toast({
            title: "Could not upload image",
            description: err.message,
            variant: "destructive",
          });
        }}
      />
      <h2>{candidate.name}</h2>
      <h2>{`${candidate.std} ${candidate.section}`}</h2>
    </div>
  );
};

export default AddCandidateData;
