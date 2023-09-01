"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { signupSchema, signupType } from "@/lib/validators/signup";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

const Signin = () => {
  const router = useRouter();
  const { toast } = useToast();

  const { mutate, isLoading } = useMutation({
    mutationFn: async (payload: signupType) => {
      const { data } = await axios.post("/api/register", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409)
          return toast({
            title: err.response.data,
            description: "There can only be one admin",
            variant: "destructive",
          });
      }
      toast({
        title: "Internal error",
        description: "Something went wrong! Please try again later",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Successful",
        description: "Congrats you are the admin now",
      });
      router.push("/dashboard");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signupType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const submitHandler = (data: signupType) => mutate(data);

  return (
    <form
      className="space-y-6 rounded-r bg-mid p-6 w-1/2"
      onSubmit={handleSubmit(submitHandler)}
    >
      <h2 className="text-xl font-bold leading-6 tracking-tight text-darkest">
        Register admin account
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
        <label
          htmlFor="username"
          className="block text-sm font-medium leading-6 text-darkest"
        >
          Username
        </label>
        <div className="mt-2">
          <Input
            disabled={isLoading}
            id="username"
            type="text"
            autoComplete="username"
            className="block w-full rounded-md border-0 py-1.5 text-darkest shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-darkest sm:text-sm sm:leading-6"
            {...register("username")}
          />
        </div>
        {errors.username && (
          <p className=" font-semibold text-sm text-red-500 ">
            {errors.username.message}
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
            disabled={isLoading}
            id="password"
            {...register("password")}
            type="password"
            autoComplete="current-password"
            className="block w-full rounded-md border-0 py-1.5 text-darkest shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-darkest sm:text-sm sm:leading-6"
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
          disabled={isLoading}
          type="submit"
          className="flex w-full justify-center rounded-md bg-brand px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-ring focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-darkest"
        >
          Sign up
        </Button>
      </div>
    </form>
  );
};
export default Signin;
