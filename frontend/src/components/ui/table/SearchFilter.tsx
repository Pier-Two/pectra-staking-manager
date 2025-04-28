import { SecondaryButton } from "../custom/SecondaryButton";
import { Input } from "../input";

interface SearchFilterProps extends React.HTMLAttributes<HTMLInputElement> {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const SearchFilter = (props: SearchFilterProps) => {
  const { searchTerm, setSearchTerm, ...rest } = props;

  return (
    <div className="flex items-center gap-2">
      <Input
        {...rest}
        placeholder="Search validators..."
        className="w-full rounded-full border-indigo-200 bg-white text-gray-500 dark:border-gray-800 dark:bg-black dark:text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <SecondaryButton onClick={() => setSearchTerm("")} label="Clear" />
      )}
    </div>
  );
};
