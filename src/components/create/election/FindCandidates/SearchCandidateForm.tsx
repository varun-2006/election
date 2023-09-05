"use client";

import SectionSelect from "@/components/SectionSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  searchStudentSchema,
  searchStudentType,
} from "@/lib/validators/searchStudent";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";

type SearchCandidatesFormProps = {
  setCandidate: Dispatch<SetStateAction<searchStudentType | undefined>>;
  title: string;
  candidate: searchStudentType | undefined;
  className?: string;
  setIsLoading?: Dispatch<SetStateAction<boolean>>;
};

const SearchCandidatesForm = ({
  setCandidate,
  title,
  candidate,
  setIsLoading,
  className = "",
}: SearchCandidatesFormProps) => {
  const {
    register,
    handleSubmit,
    control,

    formState: { errors },
  } = useForm<searchStudentType>({
    resolver: zodResolver(searchStudentSchema),
  });

  const submitHandler = (data: searchStudentType) => {
    setCandidate(data);
    if (!setIsLoading)
      return toast({
        title: `${title} added`,
      });
    setIsLoading(true);
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className={cn("text-left", className)}
    >
      <h3 className="font-bold text-xl">{title}</h3>
      <div className="my-6">
        <Label htmlFor="std" className="block text-sm font-medium leading-6">
          Standard
        </Label>
        <div className="mt-2">
          <Input
            id="std"
            type="number"
            autoComplete="std"
            {...register("std", { valueAsNumber: true })}
            placeholder="Eg: 10"
          />
        </div>
        {errors.std && (
          <p className=" font-semibold text-sm text-red-500 ">
            {errors.std.message}
          </p>
        )}
      </div>

      <SectionSelect control={control} error={errors.section?.message} />

      <div className="my-6">
        <Label htmlFor="rollNo" className="block text-sm font-medium leading-6">
          Roll No
        </Label>
        <div className="mt-2">
          <Input
            id="rollNo"
            {...register("rollNo", { valueAsNumber: true })}
            type="number"
            autoComplete="current-rollNo"
            placeholder="Eg: 10"
          />
        </div>
        {errors.rollNo && (
          <p className=" font-semibold text-sm text-red-500 ">
            {errors.rollNo.message}
          </p>
        )}
      </div>
      <Button>Add {candidate ? "new details" : title}</Button>
      {candidate && !setIsLoading && (
        <p>
          {title} has been added. If you want any changes just make it and click
          the above button
        </p>
      )}
    </form>
  );
};
export default SearchCandidatesForm;
