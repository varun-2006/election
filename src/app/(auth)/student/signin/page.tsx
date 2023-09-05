"use client";

import Loading from "@/app/loading";
import SearchCandidatesForm from "@/components/create/election/FindCandidates/SearchCandidateForm";
import { toast } from "@/components/ui/use-toast";
import { searchStudentType } from "@/lib/validators/searchStudent";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const [candidate, setCandidate] = useState<searchStudentType | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fn = async () => {
      if (!!candidate) {
        const nextauthSignin = await signIn("students", {
          redirect: false,
          ...candidate,
        });
        setIsLoading(false);

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
        toast({
          title: "Logged in successfully",
        });
        router.push("/");
      }
    };
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidate]);

  return (
    <div className="w-full h-[100dvh] flex justify-center items-center">
      <div className="w-1/4 px-4 py-6 border border-border rounded text-center">
        {!isLoading ? (
          <SearchCandidatesForm
            className="mx-auto"
            setIsLoading={setIsLoading}
            candidate={candidate}
            setCandidate={setCandidate}
            title="Credentials"
          />
        ) : (
          <>
            <Loading />
          </>
        )}
      </div>
    </div>
  );
};
export default Page;
