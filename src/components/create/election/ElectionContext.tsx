import { electionType } from "@/lib/validators/election";
import {
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
  Dispatch,
} from "react";

type ElectionContextType = {
  electionData: electionType;
  setElectionData: Dispatch<SetStateAction<electionType>>;
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
