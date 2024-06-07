import Providers from "@/components/Providers";
import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Cambridge School Election",
  description: "A ecetion website made formth Cambridge School K R Puram",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-[100dvh] w-[100dvw] overflow-x-hidden">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
