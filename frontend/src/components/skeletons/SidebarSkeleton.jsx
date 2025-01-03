import { User } from "lucide-react";
import React from "react";

const SidebarSkeleton = () => {
  const skeletonsContacts = Array(8).fill(null);
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <User className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>
      {/* skeleton contacts */}
      <div className="overflow-y-auto w-full py-3">
        {skeletonsContacts.map((_, index) => (
          <div key={index} className="w-full p-3 flex items-center gap-3">
            {/* avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 rounded-full" />
            </div>
            {/* user info skeleton - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-32 mb-2"></div>
              <div className="skeleton h-3 w-1/6"></div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
