"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { teacherSchema, teacherType } from "@/lib/validators/teacher";
import { cn } from "@/lib/utils";

const CreateTeacher = ({ className }: { className: string }) => {
  const { toast } = useToast();

  const { mutate, isLoading } = useMutation({
    mutationFn: async (payload: teacherType) => {
      const { data } = await axios.post("/api/create/teacher", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 422)
          return toast({
            title: err.response?.data,
            description:
              "There is a exists teacher with the email you provided",
            variant: "destructive",
          });
        else if (err.response?.status === 400)
          return toast({
            title: err.response?.data,
            description: "The data was not as the way expected",
            variant: "destructive",
          });
      }
      return toast({
        title: "Internal error",
        description: "Something went wrong please try again later",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Successful",
        description: "Teacher has been created successfully",
      });
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<teacherType>({
    resolver: zodResolver(teacherSchema),
  });

  const submitHandler = (data: teacherType) => mutate(data);

  return (
    <form
      className={cn("space-y-6 rounded bg-mid p-6 w-1/2 h-fit", className)}
      onSubmit={handleSubmit(submitHandler)}
    >
      <h2 className="text-xl font-bold leading-6 tracking-tight text-darkest">
        Create teacher
      </h2>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-6 text-darkest"
        >
          Email
        </label>
        <div className="mt-2">
          <Input
            disabled={isLoading}
            id="email"
            type="email"
            autoComplete="email"
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
          htmlFor="class"
          className="block text-sm font-medium leading-6 text-darkest"
        >
          Name
        </label>
        <div className="mt-2">
          <Input
            disabled={isLoading}
            id="name"
            type="text"
            autoComplete="name"
            {...register("name")}
          />
        </div>
        {errors.name && (
          <p className=" font-semibold text-sm text-red-500 ">
            {errors.name.message}
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
            type="text"
            autoComplete="current-password"
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
          Create teacher
        </Button>
      </div>
    </form>
  );
};
export default CreateTeacher;
