import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create election",
  description: "Create a new election for your students and teachers",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
