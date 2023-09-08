"use client";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { studentSchema, studentType } from "@/lib/validators/student";
import { cn, houses } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const CreateStudent = ({ className }: { className: string }) => {
  const { toast } = useToast();

  const { mutate, isLoading } = useMutation({
    mutationFn: async (payload: studentType) => {
      const { data } = await axios.post("/api/create/student", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 422)
          return toast({
            title: err.response?.data,
            description:
              "There is a exists student with the information you provided",
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
        description: "Student has been created successfully",
      });
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<studentType>({
    resolver: zodResolver(studentSchema),
  });

  const submitHandler = (data: studentType) => mutate(data);

  return (
    <form
      className={cn("space-y-6 rounded bg-mid p-6 w-1/2", className)}
      onSubmit={handleSubmit(submitHandler)}
    >
      <h2 className="text-xl font-bold leading-6 tracking-tight text-darkest">
        Create Student
      </h2>
      <div>
        <Label
          htmlFor="name"
          className="block text-sm font-medium leading-6 text-darkest"
        >
          Name
        </Label>
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
        <Label
          htmlFor="std"
          className="block text-sm font-medium leading-6 text-darkest"
        >
          Std
        </Label>
        <div className="mt-2">
          <Input
            disabled={isLoading}
            id="std"
            type="number"
            autoComplete="std"
            {...register("std", { valueAsNumber: true })}
          />
        </div>
        {errors.std && (
          <p className=" font-semibold text-sm text-red-500 ">
            {errors.std.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label
            htmlFor="section"
            className="block text-sm font-medium leading-6 text-darkest"
          >
            Section
          </Label>
        </div>
        <div className="mt-2">
          <Input
            disabled={isLoading}
            id="section"
            {...register("section")}
            type="text"
            autoComplete="current-section"
          />
        </div>
        {errors.section && (
          <p className=" font-semibold text-sm text-red-500 ">
            {errors.section.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label
            htmlFor="rollNo"
            className="block text-sm font-medium leading-6 text-darkest"
          >
            Roll No
          </Label>
        </div>
        <div className="mt-2">
          <Input
            disabled={isLoading}
            id="rollNo"
            {...register("rollNo", { valueAsNumber: true })}
            type="number"
            autoComplete="current-rollNo"
          />
        </div>
        {errors.rollNo && (
          <p className=" font-semibold text-sm text-red-500 ">
            {errors.rollNo.message}
          </p>
        )}
      </div>

      <div>
        <Controller
          control={control}
          name="house"
          render={({ field }) => (
            <Select onValueChange={field.onChange} {...field}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your House" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Houses</SelectLabel>
                  {houses.map((house) => (
                    <SelectItem key={house} value={house}>
                      {house}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        ></Controller>
        {errors.house && (
          <p className=" font-semibold text-sm text-red-500 ">
            {errors.house.message}
          </p>
        )}
      </div>

      <div>
        <Button
          disabled={isLoading}
          type="submit"
          className="flex w-full justify-center rounded-md bg-brand px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-ring focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-darkest"
        >
          Create student
        </Button>
      </div>
    </form>
  );
};
export default CreateStudent;
