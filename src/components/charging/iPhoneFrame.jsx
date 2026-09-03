import React from "react";

export default function iPhoneFrame({ children }) {
  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-neutral-200 flex items-center justify-center p-4 sm:p-10">
      {/* iPhone 17 Pro device frame */}
      <div className="relative w-[min(370px,88vw)] h-[min(800px,88dvh)] rounded-[3.8rem] p-[6px] bg-gradient-to-b from-neutral-300 via-neutral-500 to-neutral-700 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
        {/* Titanium edge highlights */}
        <div className="absolute inset-0 rounded-[3.8rem] ring-2 ring-white/40 pointer-events-none" />
        <div className="absolute inset-0 rounded-[3.8rem] ring-1 ring-inset ring-black/20 pointer-events-none" />

        {/* Inner black bezel */}
        <div className="absolute inset-[6px] rounded-[3.4rem] bg-black p-[12px]">
          {/* Screen */}
          <div className="relative w-full h-full rounded-[2.6rem] overflow-hidden bg-white">
            {/* Dynamic Island with camera */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[122px] h-[35px] bg-black rounded-full z-[60] flex items-center justify-between px-3.5 shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 ring-1 ring-neutral-700" />
              <div className="relative w-3 h-3 rounded-full bg-neutral-950 ring-1 ring-neutral-800">
                <div className="absolute inset-[3px] rounded-full bg-[#0b1f2a]" />
                <div className="absolute top-[3px] left-[3px] w-[3px] h-[3px] rounded-full bg-sky-300/80" />
              </div>
            </div>
            {children}
          </div>
        </div>

        {/* Left side — Action button + Volume up + Volume down */}
        <div className="absolute -left-[6px] top-[90px] w-[6px] h-7 rounded-l-md bg-gradient-to-b from-neutral-400 to-neutral-600" />
        <div className="absolute -left-[6px] top-[155px] w-[6px] h-12 rounded-l-md bg-gradient-to-b from-neutral-400 to-neutral-600" />
        <div className="absolute -left-[6px] top-[218px] w-[6px] h-12 rounded-l-md bg-gradient-to-b from-neutral-400 to-neutral-600" />

        {/* Right side — Camera Control + Power */}
        <div className="absolute -right-[6px] top-[165px] w-[6px] h-9 rounded-r-md bg-gradient-to-b from-neutral-400 to-neutral-600" />
        <div className="absolute -right-[6px] top-[238px] w-[6px] h-16 rounded-r-md bg-gradient-to-b from-neutral-400 to-neutral-600" />
      </div>
    </div>
  );
}