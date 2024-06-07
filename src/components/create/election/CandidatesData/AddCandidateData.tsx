"use client";

import "@uploadthing/react/styles.css";
import { toast } from "@/components/ui/use-toast";
import { UploadDropzone } from "@/lib/uploadhing";
import { Student } from "@prisma/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { SetStateAction, Dispatch } from "react";
import useCategory from "../CategoryContext";
import Image from "next/image";

type AddCandidateData = {
  candidateImage: string | null;
  candidate: Student;
  setCandidateImage: Dispatch<SetStateAction<string | null>>;
};

const AddCandidateData = ({
  candidate,
  candidateImage,
  setCandidateImage,
}: AddCandidateData) => {
  const { category } = useCategory();

  return (
    <div className="py-3">
      {!candidateImage ? (
        <UploadDropzone
          appearance={{
            label: buttonVariants({ variant: "link", className: "my-1" }),
          }}
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            console.log(candidateImage, res);
            if (res) {
              setCandidateImage(res[0].url);
              toast({
                title: "Image uploaded successfully",
              });
            }
          }}
          onUploadError={(err: Error) => {
            console.log(err);
            toast({
              title: "Could not upload image",
              description: "Something went wrong! Try again",
              variant: "destructive",
            });
          }}
        />
      ) : (
        <>
          <Image
            src={candidateImage}
            className="w-auto h-40"
            height={16}
            width={10}
            alt={`${candidate.name} image`}
          />
        </>
      )}

      <h2>{candidate.name}</h2>
      <h2>{`${candidate.std} ${candidate.section}`}</h2>
    </div>
  );
};

export default AddCandidateData;
