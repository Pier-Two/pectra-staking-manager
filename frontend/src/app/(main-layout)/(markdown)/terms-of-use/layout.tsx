import "../markdown.css";
import type { Metadata } from "next";
import { title } from "pec/constants/metadata";

export const metadata: Metadata = {
  title: title("Terms of Use"),
};

export default function TermsOfUseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto flex flex-col gap-4">{children}</div>
  );
}
