import type { Metadata } from "next";
import ConsolidationWorkflow from "./_components/consolidation-workflow";
import { title } from "pec/constants/metadata";

export const metadata: Metadata = {
  title: title("Consolidation"),
};

export default function ConsolidationPage() {
  return <ConsolidationWorkflow />;
}
