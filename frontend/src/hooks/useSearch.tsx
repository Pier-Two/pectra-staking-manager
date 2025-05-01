import { useState } from "react";

import { ValidatorDetails } from "pec/types/validator";

interface IUseSearch<T> {
  data: T[];
  disabled?: boolean;
}

const filterValidator = <T extends ValidatorDetails>(
  validator: T,
  searchTerm: string,
): boolean => {
  const matchesSearch =
    searchTerm === "" ||
    validator.validatorIndex
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    validator.publicKey.toLowerCase().includes(searchTerm.toLowerCase());

  return matchesSearch;
};

export const useSearch = <T extends ValidatorDetails>({
  data,
  disabled,
}: IUseSearch<T>) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  const filteredData =
    !disabled && searchTerm
      ? data.filter((validator) => filterValidator(validator, searchTerm))
      : data;

  return {
    searchTerm,
    setSearchTerm: handleSearch,
    filteredData,
  };
};
