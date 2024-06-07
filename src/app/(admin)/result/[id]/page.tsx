import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";

const page = async ({ params: { id } }: { params: { id: string } }) => {
  const election = await db.election.findUnique({
    where: {
      id,
    },
    include: {
      category: {
        include: {
          candidates: {
            include: {
              _count: {
                select: {
                  votes: {
                    where: {
                      electionId: id,
                    },
                  },
                  teacherVotes: {
                    where: {
                      electionId: id,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Sl No</TableHead>
            <TableHead>Ministry</TableHead>
            <TableHead>Candidate 1</TableHead>
            <TableHead>Candidate 1 votes</TableHead>
            <TableHead>Candidate 1 teacher votes</TableHead>
            <TableHead>Candidate 2</TableHead>
            <TableHead>Candidate 2 votes</TableHead>
            <TableHead className="text-right">
              Candidate 2 teacher votes
            </TableHead>
            {/* <TableHead className="text-right">Total votes</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {election?.category.map((category, i) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{i + 1}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.candidates[0].name}</TableCell>
              <TableCell>{category.candidates[0]._count.votes}</TableCell>
              <TableCell>
                {category.candidates[0]._count.teacherVotes}
              </TableCell>
              <TableCell>{category.candidates[0].name}</TableCell>
              <TableCell>{category.candidates[0]._count.votes}</TableCell>
              <TableCell className="text-right">
                {category.candidates[0]._count.teacherVotes}
              </TableCell>
              {/* <TableCell className="text-right">
                {invoice.totalAmount}
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default page;
