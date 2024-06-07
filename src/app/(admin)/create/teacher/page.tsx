import CreateTeacher from "@/components/create/teacher/CreateTeacher";
import CreateManyTeachers from "@/components/create/teacher/CreateManyTeachers";
import { MainNav } from "@/components/dashboard/main-nav";
import { Search } from "@/components/dashboard/search";

const page = () => {
  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-around p-8 pt-6">
        <CreateTeacher className="w-[40%]" />
        <CreateManyTeachers />
      </div>
    </>
  );
};
export default page;
