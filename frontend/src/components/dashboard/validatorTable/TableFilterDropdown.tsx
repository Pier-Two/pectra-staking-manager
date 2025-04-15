import clsx from "clsx";
import { Search } from "lucide-react";
import { Button } from "pec/components/ui/button";
import { Checkbox } from "pec/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "pec/components/ui/dropdown-menu";
import { Input } from "pec/components/ui/input";
import { Separator } from "pec/components/ui/separator";
import type { FC, ReactNode } from "react";

interface TableFilterDropdownProps {
    trigger: ReactNode;
    showSearch?: boolean;
    items: Array<{
      label: string;
      value: string;
      count?: number;
      isSelected?: boolean;
      onClick: () => void;
    }>;
  }

  /**
   * @Description This is a reusable component to render filter dropdown menus for the table.
   * 
   * 
   * @param_trigger - The trigger element for the dropdown menu
   * 
   * @param_showSearch - Whether to show a search input
   * 
   * @param_items - The items to display in the dropdown menu
   *   -- label: The label of the item 
   *   -- value: The value of the item in its current state
   *   -- count: The count of the item
   *   -- isSelected: Whether the item is selected in its current state
   *   -- onClick: The function to call when the item is clicked
   * 
   * 
   * 
   * @returns A dropdown menu for filtering table data
   */
export const TableFilterDropdown: FC<TableFilterDropdownProps> = ({ trigger, showSearch, items }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
          {trigger}
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" className="bg-white dark:bg-black w-[200px] max-w-[90vw] border-indigo-200 dark:border-gray-800">
            {/* Dropdown Header */}
          {showSearch ? (
            <>
              <div className="w-full flex items-center px-2 bg-white dark:bg-black">
                <Search className="h-4 w-4 text-gray-400 dark:text-gray-400 rounded-full" />
                <Input
                  placeholder="Search"
                  className="border-none bg-white text-gray-500 pl-1 dark:text-white dark:bg-black placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  value=""
                  onChange={() => {}}
                />
              </div>
              
            </>
          ) : (
              <div className="text-sm font-medium px-4 py-2 dark:text-white">Table Columns</div>
          )}
          <Separator className="bg-indigo-100 dark:bg-gray-800" />

          {/* Dropdown Items */}
          {items.map((item) => (
            <DropdownMenuItem key={item.value}>
              <Button
                variant="default"
                className={clsx("cursor-pointer bg-white px-2 hover:bg-gray-50 font-normal justify-between items-center rounded-md w-full dark:bg-black",
                    {
                      "text-indigo-500 dark:text-indigo-200 hover:bg-gray-50 dark:hover:bg-gray-900": item.isSelected,
                      "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900": !item.isSelected,
                      "bg-[#F1F3FF] text-indigo-500 dark:bg-gray-900 dark:text-white": item.isSelected && !showSearch,
                      "bg-white dark:bg-black": !item.isSelected && !showSearch,
                    }
                )}
                onClick={item.onClick}
              >
                <div className="flex items-center">
                  {showSearch && (
                    <Checkbox
                      className="mr-4 dark:border-gray-800 dark:bg-black"
                      checked={item.isSelected}
                      onCheckedChange={item.onClick}
                    />
                  )}
                  {item.label}
                </div>
                {item.count !== undefined && (
                  <span className="text-sm font-normal">{item.count}</span>
                )}
              </Button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };