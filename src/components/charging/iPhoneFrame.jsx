import React from "react";

export default function iPhoneFrame({ children }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-neutral-100 to-neutral-300 flex items-center justify-center sm:p-4">
      {/* Mobile: full screen. Desktop: iPhone device frame */}
      <div className="w-full sm:w-[390px] sm:h-[min(844px,90vh)] sm:rounded-[3.2rem] sm:bg-neutral-900 sm:p-[12px] sm:shadow-[0_30px_90px_rgba(0,0,0,0.4)] relative">
        {/* Side buttons (desktop only) */}
        <div className="hidden sm:block absolute -left-[3px] top-32 w-[3px] h-8 rounded-l bg-neutral-800" />
        <div className="hidden sm:block absolute -left-[3px] top-44 w-[3px] h-12 rounded-l bg-neutral-800" />
        <div className="hidden sm:block absolute -left-[3px] top-60 w-[3px] h-12 rounded-l bg-neutral-800" />
        <div className="hidden sm:block absolute -right-[3px] top-48 w-[3px] h-16 rounded-r bg-neutral-800" />

        {/* Screen */}
        <div className="relative w-full h-screen sm:h-full sm:rounded-[2.6rem] overflow-hidden bg-neutral-50">
          {/* Dynamic Island (desktop only) */}
          <div className="hidden sm:flex absolute top-2.5 left-1/2 -translate-x-1/2 w-[118px] h-[34px] bg-black rounded-full z-50 items-center justify-end pr-3">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 ring-1 ring-neutral-700" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}