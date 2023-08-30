import Signup from "@/components/auth/Signup";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Register admin account",
  description:
    "The can be only one admin th one who creates account first is the admin",
};

const page = () => {
  return (
    <div className="flex w-2/3 px-6 py-12 lg:px-8">
      <div className="flex w-full shadow-md shadow-black">
        <div className="w-1/2 relative rounded-l flex justify-center items-center bg-lightest">
          <div className="relative h-72 w-2/3">
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

        <Signup />
      </div>
    </div>
  );
};

export default page;
