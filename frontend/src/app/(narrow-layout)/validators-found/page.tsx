import ValidatorsFound from "./_components/validators-found";
import type { Metadata } from "next";
import { title } from "pec/constants/metadata";

export const metadata: Metadata = {
  title: title("My Validators"),
};

const ValidatorsFoundPage = () => <ValidatorsFound />;

export default ValidatorsFoundPage;
