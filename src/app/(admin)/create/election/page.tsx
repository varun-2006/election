"use client";

import { Metadata } from "next";
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
import { MouseEvent, useState } from "react";
import { sections, standards } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { electionSchema, electionType } from "@/lib/validators/election";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Loading from "@/app/loading";

export const metadata: Metadata = {
  title: "Create election",
  description: "Create a new election for your students and teachers",
};

let selectedSections: string[] | "ALL" = "ALL";

const FiltersNameForm = () => {
  const { mutate, isLoading } = useMutation({
    mutationFn: async (payload: electionType) => {
      const { data } = await axios.post("/api/create/election", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 400)
          return toast({
            title: err.response?.data,
            description:
              "The format of the data was corrupt. Make sure you follow the pattern recommended",
            variant: "destructive",
          });
      }
      return toast({
        title: "Internal error",
        description: "Something went wrong please try again later",
        variant: "destructive",
      });
    },
    onSuccess: (id) => {
      toast({
        title: "Successful",
        description: "Election is created successfully",
      });
      router.push(`category/${id}`);
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<electionType>({
    resolver: zodResolver(electionSchema.pick({ name: true })),
  });
  const router = useRouter();
  const [selectedStandard, setSelectedStandard] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [electionData, setElectionData] = useState<electionType>({
    name: "",
    complete: false,
    filters: "ALL",
  });

  const submitHandler = (data: electionType) => {
    mutate({ ...electionData, name: data.name });
  };

  const add = (e: MouseEvent) => {
    e.stopPropagation();
    if (!selectedStandard) return setShowErrors(true);
    setElectionData((prev) => {
      if (typeof prev.filters === "string") {
        return {
          ...prev,
          filters: {
            [selectedStandard]: selectedSections,
          },
        };
      } else {
        return {
          ...prev,
          filters: {
            ...prev.filters,
            [selectedStandard]: selectedSections,
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
    <div className="min-h-[100dvh] w-full flex items-center justify-center py-8">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="rounded max-w-md mx-auto border border-border py-8 px-4"
      >
        {!isLoading ? (
          <>
            <h2 className="text-lg mx-auto font-bold mb-3">Create Election</h2>
            <div>
              <Label
                htmlFor="name"
                className="block text-sm font-medium leading-6"
              >
                Name of election
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
              <Label
                htmlFor="std"
                className="block text-sm font-medium leading-6"
              >
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
                Note: If no standard is selected and added then all the Students
                you have added will be eligible to vote
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
                  Note: If no section is selected and added then all the
                  Students of class {selectedStandard} you have added/created
                  will be eligible to vote
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
          </>
        ) : (
          <Loading />
        )}
      </form>
    </div>
  );
};

export default FiltersNameForm;
