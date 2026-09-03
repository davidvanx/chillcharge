import React from "react";

export default function iPhoneFrame({ children }) {
  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-gradient-to-b from-neutral-900 to-black flex items-center justify-center p-6">
      {/* iPhone 17 Pro device frame */}
      <div className="w-[min(360px,82vw)] h-[min(780px,82dvh)] rounded-[3.6rem] p-[3px] bg-gradient-to-b from-neutral-700 via-neutral-900 to-black relative shadow-[0_40px_120px_rgba(0,0,0,0.65)]">
        {/* Titanium edge highlight */}
        <div className="absolute inset-0 rounded-[3.6rem] ring-1 ring-white/10 pointer-events-none" />

        {/* Inner bezel */}
        <div className="absolute inset-[3px] rounded-[3.45rem] bg-black p-[10px]">
          {/* Screen */}
          <div className="relative w-full h-full rounded-[2.85rem] overflow-hidden bg-neutral-50">
            {/* Dynamic Island with camera */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[122px] h-[36px] bg-black rounded-full z-50 flex items-center justify-between px-3.5">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 ring-1 ring-neutral-700" />
              <div className="relative w-3 h-3 rounded-full bg-neutral-950 ring-1 ring-neutral-800">
                <div className="absolute inset-[3px] rounded-full bg-[#0b1f2a]" />
                <div className="absolute top-[3px] left-[3px] w-[3px] h-[3px] rounded-full bg-sky-300/70" />
              </div>
            </div>
            {children}
          </div>
        </div>

        {/* Left side — Action button + Volume up + Volume down */}
        <div className="absolute -left-[3px] top-24 w-[4px] h-7 rounded-l-sm bg-gradient-to-b from-neutral-600 to-neutral-800" />
        <div className="absolute -left-[3px] top-36 w-[4px] h-11 rounded-l-sm bg-gradient-to-b from-neutral-600 to-neutral-800" />
        <div className="absolute -left-[3px] top-[200px] w-[4px] h-11 rounded-l-sm bg-gradient-to-b from-neutral-600 to-neutral-800" />

        {/* Right side — Camera Control + Power */}
        <div className="absolute -right-[3px] top-40 w-[4px] h-9 rounded-r-sm bg-gradient-to-b from-neutral-600 to-neutral-800 shadow-inner" />
        <div className="absolute -right-[3px] top-56 w-[4px] h-16 rounded-r-sm bg-gradient-to-b from-neutral-600 to-neutral-800" />
      </div>
    </div>
  );
}