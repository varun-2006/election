"use client";

import { useState } from "react";
import HouseNameForm from "@/components/create/election/CategoryHouseName/HouseNameForm";
import FindCandidatesForm from "@/components/create/election/FindCandidates/FindCandidatesForm";
import CandidatesDataForm from "@/components/create/election/CandidatesData/CandidatesDataForm";
import { Student } from "@prisma/client";
import { CategoryProvider } from "@/components/create/election/CategoryContext";

const Page = ({ params: { id } }: { params: { id: string } }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [candidates, setCandidates] = useState<Student[] | []>([]);

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center py-8">
      <CategoryProvider>
        {currentPage === 1 ? (
          <HouseNameForm setCurrentPage={setCurrentPage} />
        ) : null}
        {currentPage === 2 ? (
          <FindCandidatesForm
            candidates={candidates}
            setCandidates={setCandidates}
            setCurrentPage={setCurrentPage}
          />
        ) : null}
        {currentPage === 3 ? (
          <CandidatesDataForm
            candidates={candidates}
            setCurrentPage={setCurrentPage}
            id={id}
          />
        ) : null}
      </CategoryProvider>
    </div>
  );
};
export default Page;
