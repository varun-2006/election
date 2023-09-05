"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, signinType } from "@/lib/validators/signin";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { signIn } from "next-auth/react";
import { useState } from "react";

type SigninProps = {
  title: string;
  credName: string;
};

const Signin = ({ title, credName }: SigninProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signinType>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  const submitHandler = async (data: signinType) => {
    const nextauthSignin = await signIn(credName, {
      redirect: false,
      ...data,
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
            "Either the password or the email is invalid. Please recheck, validate and try again",
          variant: "destructive",
        });
      return toast({
        title: "Internal error",
        description: "Something went wrong! Please try again later",
        variant: "destructive",
      });
    }
    toast({
      title: "Successful",
      description: "Congrats have been loggedin successful",
    });

    router.push("/dashboard");
  };

  return (
    <form
      className="space-y-6 rounded-r bg-mid p-6 w-1/2"
      onSubmit={handleSubmit((data) => {
        setIsLoading(true);
        submitHandler(data);
      })}
    >
      <h2 className="text-xl font-bold leading-6 tracking-tight text-darkest">
        {title}
      </h2>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-darkest"
        >
          Email address
        </label>
        <div className="mt-2">
          <Input
            disabled={isLoading}
            id="email"
            type="email"
            autoComplete="email"
            className="block w-full rounded-md border-0 py-1.5 text-darkest shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-darkest sm:text-sm sm:leading-6"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className=" font-semibold text-sm text-red-500 ">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-darkest"
          >
            Password
          </label>
        </div>
        <div className="mt-2">
          <Input
            id="password"
            {...register("password")}
            type="password"
            autoComplete="current-password"
            className="block w-full rounded-md border-0 py-1.5 text-darkest shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-darkest sm:text-sm sm:leading-6"
            disabled={isLoading}
          />
        </div>
        {errors.password && (
          <p className=" font-semibold text-sm text-red-500 ">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center rounded-md bg-brand px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-ring focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-darkest"
        >
          Sign in
        </Button>
      </div>
    </form>
  );
};
export default Signin;
