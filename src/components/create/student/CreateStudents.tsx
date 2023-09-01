"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { studentsSchema, studentsType } from "@/lib/validators/students";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ChangeEvent, FormEvent, useState } from "react";

const CreateStudents = () => {
  const [message, setMessage] = useState("");

  const { mutate, isLoading } = useMutation({
    mutationFn: async (payload: studentsType) => {
      const { data } = await axios.post("/api/create/students", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 422)
          return toast({
            title: err.response?.data,
            description:
              "In the data you have provided there is a chance that some data already exits in the database or there is repeating data",
            variant: "destructive",
          });
        else if (err.response?.status === 400)
          return toast({
            title: err.response?.data,
            description:
              "The format of the data was corrupt. Make sure you follow the recommended pattern and there should be no overlapping data",
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
        description: "Students have been created successfully",
      });
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let data, students: studentsType;
    try {
      data = JSON.parse(message);
    } catch (err) {
      return toast({
        title: "Invalid format",
        description:
          "The data should be of the JSON format. Any other format is not supported",
        variant: "destructive",
      });
    }

    try {
      students = studentsSchema.parse(data);
    } catch (err) {
      return toast({
        title: "Corrupt data",
        description:
          "Make sure that the data you're sending has all the required fields as in the form beside and no wrong data classes above 10 and below 1 are not allowed",
        variant: "destructive",
      });
    }

    mutate(students);
  };
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <form className="w-[40%] h-full" onSubmit={handleSubmit}>
      <Textarea
        name="message"
        value={message}
        onChange={handleChange}
        className="min-h-[80vh] mb-4"
        placeholder={`Enter an array of students in JSON format.
Eg: 
[
    {
      "std": 7,
      "section": "C",
      "rollNo": 7,
      "name": "John Doe",
      "house": "ETON"
    },
    {
      "std": 10,
      "section": "B",
      "rollNo": 12,
      "name": "Jane Smith",
      "house": "HARROW"
    },
    {
      "std": 9,
      "section": "A",
      "rollNo": 20,
      "name": "Bob Johnson",
      "house": "LEEDS"
    }
]`}
      />

      <Button
        type="submit"
        disabled={isLoading}
        className="flex w-full justify-center rounded-md bg-brand px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-ring focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-darkest"
      >
        Create Students
      </Button>
    </form>
  );
};
export default CreateStudents;
