"use client";

import { useConsolidation } from "pec/hooks/useConsolidation";
import type { FC } from "react";

const TestingPage: FC = () => {
  const fee = useConsolidation();

  return (
    <div>
      <h1>Consolidation Fee {fee.consolidationFee}</h1>
    </div>
  );
};

export default TestingPage;
