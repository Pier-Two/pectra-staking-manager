import type { FC } from "react";
import { MyValidatorsCard } from "./MyValidatorsCard";

export const TotalDailyIncome: FC = () => {
  return (
    <MyValidatorsCard
      title="Total Daily Income"
      body={<p>Ξ XXX</p>}
      subtext="Earning XXX per day"
    />
  );
};
