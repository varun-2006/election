"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  manyTeachersSchema,
  manyTeachersType,
} from "@/lib/validators/manyTeachers";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ChangeEvent, FormEvent, useState } from "react";

const CreateTeachers = () => {
  const [message, setMessage] = useState("");

  const { mutate, isLoading } = useMutation({
    mutationFn: async (payload: manyTeachersType) => {
      const { data } = await axios.post("/api/create/manyTeachers", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 422)
          return toast({
            title: err.response?.data,
            description:
              "In the data you have provided there is a chance that some of the data already exits in the database or there is repeating data",

            variant: "destructive",
          });
        if (err.response?.status === 400)
          return toast({
            title: err.response?.data,
            description:
              "The format of the data was corrupt. Make sure you follow the recommended pattern",
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
        description: "Teachers have been created successfully",
      });
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let data, manyTeachers: manyTeachersType;
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
      manyTeachers = manyTeachersSchema.parse(data);
    } catch (err) {
      return toast({
        title: "Corrupt data",
        description:
          "Make sure that the data you're sending has all the required fields as in the form beside. Eg: students with class above 10 and below 1 are not allowed",
        variant: "destructive",
      });
    }

    mutate(manyTeachers);
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
        className="mb-4 min-h-[80dvh] w-full"
        placeholder={`Enter an array of teachers in JSON format.
Eg: 
[
    {
        "email": "teacher1@example.com",
        "password": "password123",
        "name": "John Doe"
    },
    {
        "email": "teacher2@example.com",
        "password": "pass456",
        "name": "Jane Smith"
    },
    {
        "email": "teacher3@example.com",
        "password": "testpass",
        "name": "Bob Johnson"
    }
]
`}
      />
      <Button
        type="submit"
        disabled={isLoading}
        className="flex w-full justify-center rounded-md bg-brand px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-ring focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-darkest"
      >
        Create Teachers
      </Button>
    </form>
  );
};
export default CreateTeachers;
