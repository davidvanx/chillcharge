import React from "react";

export default function iPhoneFrame({ children }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-neutral-900 to-black flex items-center justify-center sm:p-4">
      {/* Mobile: full screen. Desktop: iPhone 17 Pro device frame */}
      <div className="w-full sm:w-[402px] sm:h-[min(874px,92vh)] sm:rounded-[3.4rem] sm:p-[3px] sm:bg-gradient-to-b sm:from-neutral-300 sm:via-neutral-400 sm:to-neutral-600 relative shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
        {/* Titanium inner ring (frame only on sm+) */}
        <div className="relative sm:absolute sm:inset-[3px] w-full h-screen sm:h-full sm:rounded-[3.2rem] sm:bg-neutral-800 sm:p-[10px]">
          <div className="relative w-full h-full sm:rounded-[2.7rem] overflow-hidden bg-neutral-50">
            {/* Dynamic Island (frame only on sm+) */}
            <div className="hidden sm:flex absolute top-2.5 left-1/2 -translate-x-1/2 w-[125px] h-[37px] bg-black rounded-full z-50 items-center justify-between px-3">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
              <div className="w-3 h-3 rounded-full bg-neutral-800 ring-1 ring-neutral-700" />
            </div>
            {children}
          </div>
        </div>

        {/* Side buttons — titanium */}
        {/* Action button (left, upper) */}
        <div className="hidden sm:block absolute -left-[3px] top-28 w-[4px] h-7 rounded-l-sm bg-gradient-to-b from-neutral-300 to-neutral-500" />
        {/* Volume up */}
        <div className="hidden sm:block absolute -left-[3px] top-40 w-[4px] h-12 rounded-l-sm bg-gradient-to-b from-neutral-300 to-neutral-500" />
        {/* Volume down */}
        <div className="hidden sm:block absolute -left-[3px] top-56 w-[4px] h-12 rounded-l-sm bg-gradient-to-b from-neutral-300 to-neutral-500" />
        {/* Camera Control (right) — new on iPhone 17 Pro */}
        <div className="hidden sm:block absolute -right-[3px] top-44 w-[4px] h-10 rounded-r-sm bg-gradient-to-b from-neutral-300 to-neutral-500 shadow-inner" />
        {/* Power button */}
        <div className="hidden sm:block absolute -right-[3px] top-60 w-[4px] h-16 rounded-r-sm bg-gradient-to-b from-neutral-300 to-neutral-500" />
      </div>
    </div>
  );
}