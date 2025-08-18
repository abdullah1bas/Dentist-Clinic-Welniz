import { useDentalStore } from "@/stores/dental-store";
import React, { memo } from "react";

const UserFooter = () => {
  const {iamHere} = useDentalStore();
  return (
    <div className="sm:fixed bottom-2 left-1/2 transform sm:-translate-x-1/2 bg-background text-white px-3 sm:px-6 py-3 mt-5 rounded-xl border border-primary flex flex-col-reverse sm:flex-row items-center gap-2 sm:gap-2 z-40">
      {/* النص */}
      <div className="border border-primary rounded-md px-3 py-1 text-primary font-medium text-sm">
        Account Username
      </div>
      <p>{iamHere ? 'here': 'not here'}</p>

      {/* الاسم */}
      <div className="text-sm sm:text-lg font-semibold text-gray-300">
        MohSadq
      </div>

      {/* الصورة */}
      <img
        src="https://randomuser.me/api/portraits/men/75.jpg"
        alt="User Avatar"
        className="w-12 h-12 rounded-md border border-primary"
      />
    </div>
  );
};

export default memo(UserFooter);
