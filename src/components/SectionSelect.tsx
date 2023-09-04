"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { sections } from "@/lib/utils";

type SectionSelectProps = {
  control: Control<any> | undefined;
  error?: string;
};

const SectionSelect = ({ control, error }: SectionSelectProps) => {
  return (
    <div className="my-6">
      <Label htmlFor="section" className="block text-sm font-medium leading-6">
        Section
      </Label>
      <div className="mt-2">
        <Controller
          control={control}
          name="section"
          render={({ field }) => (
            <Select onValueChange={field.onChange} {...field}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Section</SelectLabel>
                  {sections.map((section) => (
                    <SelectItem key={section} value={section}>
                      {section}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      {!!error && (
        <p className=" font-semibold text-sm text-red-500 ">{error}</p>
      )}
    </div>
  );
};

export default SectionSelect;
