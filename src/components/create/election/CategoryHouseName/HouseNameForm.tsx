"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categorySchema, categoryType } from "@/lib/validators/election";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { houses } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import useCategory from "../CategoryContext";

type HouseNameFormType = Omit<categoryType, "candidates" | "electionId">;

const HouseNameForm = ({
  setCurrentPage,
}: {
  setCurrentPage: Dispatch<SetStateAction<number>>;
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<HouseNameFormType>({
    resolver: zodResolver(
      categorySchema.omit({ candidates: true, electionId: true })
    ),
  });
  const { setCategory } = useCategory();

  const submitHandler = (data: HouseNameFormType) => {
    console.log(data);
    setCategory((prev) => ({
      ...prev,
      ...data,
    }));
    setCurrentPage(2);
  };
  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="border-border border rounded py-6 px-4"
    >
      <h2 className="text-lg mx-auto font-bold mb-3">
        Create Category/Ministry
      </h2>
      <div>
        <Label htmlFor="name" className="block text-sm font-medium leading-6">
          Name of ministry
        </Label>
        <div className="mt-2">
          <Input
            {...register("name")}
            type="text"
            placeholder="Eg: ETON HOUSE CAPTIAN OR CLASS ELECTION 9 A"
            autoComplete="name"
          />
        </div>
        {errors?.name && (
          <p className=" font-semibold text-sm text-red-500 ">
            {errors.name.message}
          </p>
        )}
      </div>
      <h3 className="text-md font-bold tracking-tight mt-8 mb-2">
        House filter(Useful for house elections)
      </h3>
      <div className="mb-6">
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
          <p className="font-semibold text-sm text-red-500">
            {errors.house.message}
          </p>
        )}
        <p className="font-semibold text-sm">
          Note: If northing is selected then anyone of any house can vote
        </p>
      </div>
      <Button type="submit">
        Next step: Find candidates <ChevronRight className="h-6 w-6" />
      </Button>
    </form>
  );
};
export default HouseNameForm;
