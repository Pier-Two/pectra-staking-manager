import type { Metadata } from "next";

import { title } from "pec/constants/metadata";

import ValidatorsFound from "./_components/validators-found";

export const metadata: Metadata = {
  title: title("My Validators"),
};

const ValidatorsFoundPage = () => <ValidatorsFound />;

export default ValidatorsFoundPage;
