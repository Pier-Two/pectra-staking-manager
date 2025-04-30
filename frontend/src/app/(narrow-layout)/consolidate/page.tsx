import { title } from "pec/constants/metadata";
import { Consolidate } from "./_components/consolidate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: title("Consolidate"),
};

const ConsolidatePage = () => <Consolidate />;

export default ConsolidatePage;
