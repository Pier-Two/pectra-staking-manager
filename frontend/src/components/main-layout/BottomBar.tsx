import type { FC } from "react";
import Image from "next/image";

export const BottomBar: FC = () => {
  return (
    <footer className="flex h-[5vh] w-full items-center justify-between border-t bg-white px-6 shadow-sm">
      <div className="text-gray-600">
        Built with 🤍 by and for the Ethereum community
      </div>

      <div className="flex items-center space-x-3 text-gray-600">
        <div>Powered by: </div>

        <div className="group relative">
          <Image
            src="/logos/light/PierTwo.svg"
            alt="Pier Two"
            className="h-30 w-30 transition-opacity duration-200 group-hover:opacity-0"
            width={100}
            height={100}
          />
          
          <Image
            src="/logos/light/PierTwoHover.svg"
            alt="Pier Two Hover"
            className="h-30 w-30 absolute left-0 top-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            width={100}
            height={100}
          />
        </div>

        <div className="group relative">
          <Image
            src="/logos/light/Labrys.svg"
            alt="Labrys"
            className="h-30 w-30 transition-opacity duration-200 group-hover:opacity-0"
            width={100}
            height={100}
          />

          <Image
            src="/logos/light/LabrysHover.svg"
            alt="Labrys Hover"
            className="h-30 w-30 absolute left-0 top-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            width={100}
            height={100}
          />
        </div>

        <div className="group relative">
          <Image
            src="/logos/light/Hashlock.svg"
            alt="Hashlock"
            className="h-30 w-30 transition-opacity duration-200 group-hover:opacity-0"
            width={100}
            height={100}
          />

          <Image
            src="/logos/light/HashlockHover.svg"
            alt="Hashlock Hover"
            className="h-30 w-30 absolute left-0 top-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            width={100}
            height={100}
          />
        </div>
      </div>
    </footer>
  );
};
