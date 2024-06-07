import { categoryType } from "@/lib/validators/election";
import {
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
  Dispatch,
} from "react";

type CategoryContextType = {
  category: categoryType;
  setCategory: Dispatch<SetStateAction<categoryType>>;
};

const CategoryContext = createContext<CategoryContextType>({
  category: {
    candidates: [],
    name: "",
    electionId: "",
  },
  setCategory: () => {},
});

const useCategory = (): CategoryContextType => {
  const context = useContext(CategoryContext);

  return context;
};

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [category, setCategory] = useState<categoryType>({
    candidates: [],
    name: "",
    electionId: "",
  });

  return (
    <CategoryContext.Provider value={{ category, setCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export default useCategory;
