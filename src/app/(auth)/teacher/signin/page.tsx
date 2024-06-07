import Signin from "@/components/auth/Signin";
import Image from "next/image";

const page = () => {
  return (
    <div className="flex h-[100dvh] flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
      <div className="flex w-1/2 shadow-md shadow-black">
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

        <Signin title="Login" credName="teacher" redirectTo="/" />
      </div>
    </div>
  );
};

export default page;
