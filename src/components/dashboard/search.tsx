import { Input } from "@/components/ui/input";

export function Search() {
  return (
    <div className="mr-2">
      <Input
        type="search"
        placeholder="Search..."
        className="md:w-[100px] lg:w-[300px]"
      />
    </div>
  );
}
