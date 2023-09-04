"use client";

import InputClassSectionFilters from "@/components/create/election/StandardSectionFilters/InputClassSectionFilters";
import useElection, {
  ElectionProvider,
} from "@/components/create/election/ElectionContext";
import { useState } from "react";
import { Metadata } from "next";
import HouseNameForm from "@/components/create/election/CategoryHouseName/HouseNameForm";
import FindCandidatesForm from "@/components/create/election/FindCandidates/FindCandidatesForm";
import CandidatesDataForm from "@/components/create/election/CandidatesData/CandidatesDataForm";
import { Student } from "@prisma/client";

export const metadata: Metadata = {
  title: "Create election",
  description: "Create a new election for your students and teachers",
};

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [candidates, setCandidates] = useState<Student[] | []>([]);

  return (
    <ElectionProvider>
      <div className="min-h-[100dvh] w-full flex items-center justify-center py-8">
        {currentPage === 1 ? (
          <InputClassSectionFilters setCurrentPage={setCurrentPage} />
        ) : null}
        {currentPage === 2 ? (
          <HouseNameForm setCurrentPage={setCurrentPage} />
        ) : null}
        {currentPage === 3 ? (
          <FindCandidatesForm
            candidates={candidates}
            setCandidates={setCandidates}
            setCurrentPage={setCurrentPage}
          />
        ) : null}
        {currentPage === 4 ? (
          <CandidatesDataForm
            candidates={candidates}
            setCurrentPage={setCurrentPage}
          />
        ) : null}
      </div>
    </ElectionProvider>
  );
};
export default Page;
