"use client";

import Loading from "@/app/loading";
import SearchCandidatesForm from "@/components/create/election/FindCandidates/SearchCandidateForm";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { searchStudentType } from "@/lib/validators/searchStudent";
import { signIn } from "next-auth/react";
import Image from "next/image";
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
        setCandidate(undefined);

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
        </div>
      </div>
    </div>
  );
};
export default Page;
