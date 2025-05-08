import { PectraSpinner } from "pec/components/ui/custom/pectraSpinner";

const Loading = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <PectraSpinner className="size-12" />
    </div>
  );
};

export default Loading;
