import React from "react";

export default function iPhoneFrame({ children }) {
  return (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center sm:p-6">
      {/* On mobile: full screen. On sm+: iPhone frame */}
      <div className="w-full sm:w-[390px] sm:h-[844px] sm:rounded-[3rem] sm:bg-neutral-900 sm:p-[14px] sm:shadow-[0_30px_80px_rgba(0,0,0,0.35)] relative">
        {/* Screen */}
        <div className="relative w-full h-screen sm:h-full sm:rounded-[2.4rem] overflow-hidden bg-neutral-50">
          {/* Dynamic Island (sm+ only) */}
          <div className="hidden sm:block absolute top-2.5 left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black rounded-full z-50" />
          {children}
        </div>
      </div>
    </div>
  );
}