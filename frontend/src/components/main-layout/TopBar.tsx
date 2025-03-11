import type { FC } from "react";
import Image from "next/image";
import { Button } from "pec/components/ui/button";
import { Moon } from "lucide-react";
import { User } from "lucide-react";
import { ChevronDown } from "lucide-react";

export const TopBar: FC = () => {
  return (
    <header className="flex h-[8vh] w-full items-center justify-between border-b bg-white px-6 shadow-sm">
      <div className="flex items-center space-x-3">
        <Image
          src="/logos/PectraStakingManager.svg"
          alt="Pectra Staking Manager"
          className="h-12 w-12"
          width={48}
          height={48}
        />
        <div>
          <h1 className="text-lg font-semibold">Pectra Staking</h1>
          <h1 className="text-lg font-semibold">Manager</h1>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="text-gray-700 hover:text-black">My Validators</div>
        <div className="flex items-center space-x-2">
          <div className="text-gray-700 hover:text-black">Tools</div>
          <ChevronDown />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button className="rounded-lg border bg-gray-100 p-3 hover:bg-gray-200">
          <Moon />
        </Button>

        <Button className="rounded-lg border bg-gray-100 p-4 hover:bg-gray-200 space-x-2">
          <User />
          <div className="text-sm">blinc.eth</div>
          <ChevronDown />
        </Button>
      </div>
    </header>
  );
};
