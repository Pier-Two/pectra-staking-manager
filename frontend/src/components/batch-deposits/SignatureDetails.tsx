import { KeyRound } from "lucide-react";

export interface ISignatureDetails {
  title: string;
  text: string;
}

export const SignatureDetails = ({ title, text }: ISignatureDetails) => {
  return (
    <div className="flex w-full items-center justify-between gap-x-4 rounded-xl border border-indigo-300 bg-indigo-100 px-4 py-3 dark:border-indigo-900 dark:bg-gray-900">
      <div className="flex gap-x-4">
        <KeyRound className="h-8 w-8 fill-indigo-500 text-white" />
        <div className="flex flex-col gap-y-2">
          <div className="text-sm text-indigo-700">{title}</div>
          <div className="text-xs">{text}</div>
        </div>
      </div>
    </div>
  );
};
