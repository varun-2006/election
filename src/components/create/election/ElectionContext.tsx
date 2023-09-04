import { toast } from "@/components/ui/use-toast";
import { electionType } from "@/lib/validators/election";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ReactNode, createContext, useContext, useState } from "react";

type ElectionContextType = {
  electionData: electionType;
  setElectionData: React.Dispatch<React.SetStateAction<electionType>>;
};

const ElectionContext = createContext<ElectionContextType>({
  electionData: {
    name: "",
    complete: false,
    category: [
      {
        candidates: [],
        name: "",
      },
    ],
    filters: "ALL",
  },
  setElectionData: () => {},
});

const useElection = (): ElectionContextType => {
  const context = useContext(ElectionContext);

  if (!context) {
    throw new Error();
  }

  return context;
};

export const ElectionProvider = ({ children }: { children: ReactNode }) => {
  const [electionData, setElectionData] = useState<electionType>({
    name: "",
    category: [
      {
        candidates: [],
        name: "",
      },
    ],
    filters: "ALL",
    complete: false,
  });

  return (
    <ElectionContext.Provider value={{ electionData, setElectionData }}>
      {children}
    </ElectionContext.Provider>
  );
};

export default useElection;
