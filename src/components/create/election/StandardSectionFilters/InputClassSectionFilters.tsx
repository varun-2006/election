"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import { sections, standards } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { electionSchema, electionType } from "@/lib/validators/election";
import { Input } from "@/components/ui/input";
import useElection from "../ElectionContext";
import { ChevronRight } from "lucide-react";

type omittedElectionType = Omit<electionType, "category" | "filters">;

let selectedSections: string[] | "ALL" = [];

const FiltersNameForm = ({
  setCurrentPage,
}: {
  setCurrentPage: Dispatch<SetStateAction<number>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<omittedElectionType>({
    resolver: zodResolver(electionSchema.pick({ name: true })),
  });
  const { setElectionData } = useElection();
  const [selectedStandard, setSelectedStandard] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const submitHandler = (data: omittedElectionType) => {
    setElectionData((prev) => ({
      ...prev,
      ...data,
    }));
    setCurrentPage(2);
  };

  const add = (e: MouseEvent) => {
    e.stopPropagation();
    if (!selectedStandard) return setShowErrors(true);
    setElectionData((prev) => {
      if (typeof prev.filters === "string") {
        return {
          ...prev,
          filters: {
            [selectedStandard]: !!selectedSections ? selectedSections : "ALL",
          },
        };
      } else {
        return {
          ...prev,
          filters: {
            ...prev.filters,
            [selectedStandard]: !!selectedSections ? selectedSections : "ALL",
          },
        };
      }
    });
    toast({
      title: `Students of class ${selectedStandard} ${selectedSections} added`,
    });
    setSelectedStandard("");
    selectedSections = [];
    setShowErrors(false);
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="rounded max-w-md mx-auto border border-border py-8 px-4"
      >
        <h2 className="text-lg mx-auto font-bold mb-3">Create Election</h2>
        <div>
          <Label htmlFor="name" className="block text-sm font-medium leading-6">
            Name of election(It must be unique for all elections)
          </Label>
          <div className="mt-2">
            <Input
              {...register("name")}
              type="text"
              placeholder="Eg: School election - 2023"
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
          Select the standards and sections that can vote for this election
        </h3>
        <div>
          <Label htmlFor="std" className="block text-sm font-medium leading-6">
            Standard
          </Label>
          <div className="mt-2">
            <Select onValueChange={setSelectedStandard}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Standard" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Standards</SelectLabel>
                  {standards.map((standard) => (
                    <SelectItem key={standard} value={standard}>
                      {standard}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <p className="font-semibold text-sm mt-1">
            Note: If no standard is selected and added then all the Students you
            have added will be eligible to vote
          </p>
          {showErrors && !selectedStandard && (
            <p className="font-semibold text-sm text-red-500 ">
              To add you have to select a standard
            </p>
          )}
        </div>
        {!!selectedStandard && (
          <div className="mt-2">
            <Label className="block text-sm font-medium leading-6">
              Sections
            </Label>
            <div className="mt-2">
              {sections.map((section) => (
                <div
                  key={section}
                  className="flex flex-row items-start space-x-3 space-y-0 my-1"
                >
                  <Checkbox
                    onCheckedChange={(checked: boolean) => {
                      if (checked) {
                        if (typeof selectedSections === "string")
                          return (selectedSections = [section]);
                        selectedSections.push(section);
                      } else {
                        if (typeof selectedSections !== "string")
                          selectedSections.splice(
                            selectedSections.indexOf(section),
                            1
                          );
                      }
                    }}
                  />
                  <Label className="font-normal">{section}</Label>
                </div>
              ))}
            </div>
            <p className="font-semibold text-sm mt-1">
              Note: If no section is selected and added then all the Students of
              class {selectedStandard} you have added/created will be eligible
              to vote
            </p>
          </div>
        )}

        <Button type="button" onClick={add} className="mt-2 mb-8">
          Add standard and sections
        </Button>

        <Button
          type="submit"
          className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-darkest"
        >
          Next: Add candidates <ChevronRight className="h-6 w-6" />
        </Button>
      </form>
    </>
  );
};

export default FiltersNameForm;
