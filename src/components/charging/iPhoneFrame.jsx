import React from "react";

export default function iPhoneFrame({ children }) {
  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-neutral-950 flex items-center justify-center p-4 sm:p-8">
      {/* iPhone 17 Pro device frame */}
      <div className="relative w-[min(360px,86vw)] h-[min(780px,86dvh)] rounded-[3.8rem] p-[5px] bg-gradient-to-b from-neutral-600 via-neutral-800 to-neutral-950 shadow-[0_30px_90px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.08)]">
        {/* Titanium edge highlight */}
        <div className="absolute inset-0 rounded-[3.8rem] ring-1 ring-white/15 pointer-events-none" />

        {/* Inner black bezel */}
        <div className="absolute inset-[5px] rounded-[3.5rem] bg-black p-[11px]">
          {/* Screen */}
          <div className="relative w-full h-full rounded-[2.7rem] overflow-hidden bg-white">
            {/* Dynamic Island with camera */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black rounded-full z-[60] flex items-center justify-between px-3.5 shadow-md">
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
        <div className="absolute -left-[5px] top-[88px] w-[5px] h-7 rounded-l bg-gradient-to-b from-neutral-500 to-neutral-800 shadow-sm" />
        <div className="absolute -left-[5px] top-[150px] w-[5px] h-12 rounded-l bg-gradient-to-b from-neutral-500 to-neutral-800 shadow-sm" />
        <div className="absolute -left-[5px] top-[210px] w-[5px] h-12 rounded-l bg-gradient-to-b from-neutral-500 to-neutral-800 shadow-sm" />

        {/* Right side — Camera Control + Power */}
        <div className="absolute -right-[5px] top-[160px] w-[5px] h-9 rounded-r bg-gradient-to-b from-neutral-500 to-neutral-800 shadow-sm" />
        <div className="absolute -right-[5px] top-[230px] w-[5px] h-16 rounded-r bg-gradient-to-b from-neutral-500 to-neutral-800 shadow-sm" />
      </div>
    </div>
  );
}