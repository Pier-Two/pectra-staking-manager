"use client";

import { Button } from "pec/components/ui/button";
import { useConsolidation } from "pec/hooks/useConsolidation";
import type { FC } from "react";

const TestingPage: FC = () => {
  const fee = useConsolidation();

  return (
    <div>
      <Button onClick={fee?.getConsolidationFee}>Get Consolidation Fee</Button>
    </div>
  );
};

export default TestingPage;
