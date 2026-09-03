import React from "react";

export default function iPhoneFrame({ children }) {
  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-gradient-to-b from-neutral-900 to-black flex items-center justify-center p-6">
      {/* iPhone 17 Pro device frame — always visible, scales to fit */}
      <div className="w-[min(360px,82vw)] h-[min(780px,82dvh)] rounded-[3.4rem] p-[4px] bg-gradient-to-b from-neutral-300 via-neutral-400 to-neutral-600 relative shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
        {/* Titanium inner ring */}
        <div className="absolute inset-[3px] rounded-[3.2rem] bg-neutral-800 p-[10px]">
          <div className="relative w-full h-full rounded-[2.7rem] overflow-hidden bg-neutral-50">
            {/* Dynamic Island */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[125px] h-[37px] bg-black rounded-full z-50 flex items-center justify-between px-3">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
              <div className="w-3 h-3 rounded-full bg-neutral-800 ring-1 ring-neutral-700" />
            </div>
            {children}
          </div>
        </div>

        {/* Side buttons — titanium */}
        <div className="absolute -left-[3px] top-28 w-[4px] h-7 rounded-l-sm bg-gradient-to-b from-neutral-300 to-neutral-500" />
        <div className="absolute -left-[3px] top-40 w-[4px] h-12 rounded-l-sm bg-gradient-to-b from-neutral-300 to-neutral-500" />
        <div className="absolute -left-[3px] top-56 w-[4px] h-12 rounded-l-sm bg-gradient-to-b from-neutral-300 to-neutral-500" />
        {/* Camera Control (right) — new on iPhone 17 Pro */}
        <div className="absolute -right-[3px] top-44 w-[4px] h-10 rounded-r-sm bg-gradient-to-b from-neutral-300 to-neutral-500 shadow-inner" />
        <div className="absolute -right-[3px] top-60 w-[4px] h-16 rounded-r-sm bg-gradient-to-b from-neutral-300 to-neutral-500" />
      </div>
    </div>
  );
}