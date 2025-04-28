import { BiSolidKey } from "react-icons/bi";

export interface ISignatureDetails {
  title: string;
  text: string;
}

export const SignatureDetails = ({ title, text }: ISignatureDetails) => {
  return (
    <div className="flex w-full items-center justify-between gap-x-4 rounded-2xl border border-indigo-300 bg-indigo-100 px-4 py-3 dark:border-indigo-900 dark:bg-gray-900">
      <div className="flex gap-x-4">
        <BiSolidKey className="h-5 min-h-5 w-5 min-w-5 fill-primary" />
        <div className="flex flex-col gap-y-2">
          <div className="font-inter text-sm font-semibold text-primary">
            {title}
          </div>
          <div className="text-[13px] leading-4">{text}</div>
        </div>
      </div>
    </div>
  );
};
