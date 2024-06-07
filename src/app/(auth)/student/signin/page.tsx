"use client";

import Loading from "@/app/loading";
import SearchCandidatesForm from "@/components/create/election/FindCandidates/SearchCandidateForm";
import { toast } from "@/components/ui/use-toast";
import { searchStudentType } from "@/lib/validators/searchStudent";
import { getSession, signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [candidate, setCandidate] = useState<searchStudentType | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [studentData, setstudentData] = useState<User | null>(null);
  const router = useRouter();
  const dialogRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const fn = async () => {
      if (!!candidate) {
        const nextauthSignin = await signIn("students", {
          redirect: false,
          ...candidate,
        });
        const session = await getSession();
        if (!session) return;
        setstudentData(session.user);
        setIsLoading(false);
        setCandidate(undefined);
        dialogRef.current?.click();

        if (nextauthSignin?.error) {
          if (nextauthSignin.error === "400")
            return toast({
              title: "Bad request",
              description: "Format of data is wrong",
              variant: "destructive",
            });
          else if (nextauthSignin.error === "401")
            return toast({
              title: "Wrong credentials",
              description:
                "Could not find any student with the detials you provided",
              variant: "destructive",
            });
          return toast({
            title: "Internal error",
            description: "Something went wrong! Please try again later",
            variant: "destructive",
          });
        }
      }
    };
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidate]);

  return (
    <div className="flex h-[100dvh] flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
      <div className="flex w-7/12 shadow-md shadow-black">
        <div className="w-1/2 relative flex rounded-l justify-center items-center bg-lightest">
          <div className="relative h-72 w-5/6 mb-5">
            <Image
              className="mx-auto h-72 object-contain w-auto"
              fill
              src="/logo.png"
              alt="Your Company"
            />
          </div>
          <h3 className="p-1 absolute bottom-6 font-semibold w-full text-lightest text-center bg-brand">
            Bridge to the future
          </h3>
        </div>

        <div className="w-1/2 px-4 py-6 border border-border rounded-r text-center">
          {!isLoading ? (
            <>
              <SearchCandidatesForm
                className="mx-auto"
                setIsLoading={setIsLoading}
                candidate={candidate}
                setCandidate={setCandidate}
                title="Credentials"
              />
            </>
          ) : (
            <div className="h-full flex justify-center items-center">
              <Loading />
            </div>
          )}
          <Dialog>
            <DialogTrigger className="hidden" ref={dialogRef}>
              Open
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Do you confirm?</DialogTitle>
                <DialogDescription>
                  Are you {studentData?.name} of class {studentData?.std}{" "}
                  {studentData?.section} and of {studentData?.house} house
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  onClick={() => {
                    toast({
                      title: "Logged in successfully",
                    });
                    router.push("/");
                  }}
                >
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
export default Page;
