import type { Metadata } from "next";

import { title } from "pec/constants/metadata";

import ConsolidationWorkflow from "./_components/consolidation-workflow";

export const metadata: Metadata = {
  title: title("Consolidation"),
};

export default function ConsolidationPage() {
  return <ConsolidationWorkflow />;
}
